import { afterEach, describe, expect, it, vi } from "vitest";
import {
  buildRatingsFromDeviceVotes,
  hasDeviceVotes,
  VOTE_COOKIE_NAMES,
} from "@/lib/deviceVoteStorage";
import { APP_UPDATE_CHECK_INTERVAL_MS } from "@/lib/appUpdate";
import { loadOfflineRatingsCache, saveOfflineRatingsCache } from "@/lib/offlineRatingsCache";
import {
  enqueueVoteSync,
  flushVoteSyncQueue,
  getPendingVoteSyncCount,
  resetVoteSyncFlushState,
  scheduleVoteSyncFlush,
  subscribeVoteSyncEnqueue,
} from "@/lib/voteSyncQueue";
import {
  fetchGlobalRatings,
  postVotePayload,
  shouldRequeueVoteFailure,
} from "@/lib/votesApi";

describe("offline vote storage", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
    resetVoteSyncFlushState();
    localStorage.clear();
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
  });

  it("builds ratings from device vote cookies", () => {
    document.cookie = `${VOTE_COOKIE_NAMES.station}=${encodeURIComponent(JSON.stringify({ Aveiro: "up" }))}; path=/`;
    const result = buildRatingsFromDeviceVotes();
    expect(hasDeviceVotes(result)).toBe(true);
    expect(result.ratings.Aveiro).toEqual({ up: 1, down: 0 });
    expect(result.source).toBe("device");
  });

  it("returns cached ratings when fetch fails", async () => {
    saveOfflineRatingsCache({
      ratings: { Braga: { up: 2, down: 0 } },
      hotelRatings: {},
      imageRatings: {},
      configured: true,
    });

    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));

    const result = await fetchGlobalRatings();
    expect(result.source).toBe("cache");
    expect(result.ratings.Braga).toEqual({ up: 2, down: 0 });
  });

  it("queues and flushes vote sync payloads", async () => {
    enqueueVoteSync({ station: "Aveiro", previous: null, next: "up" });
    expect(getPendingVoteSyncCount()).toBe(1);

    const post = vi.fn().mockResolvedValue(true);
    await flushVoteSyncQueue(post);
    expect(post).toHaveBeenCalledTimes(1);
    expect(getPendingVoteSyncCount()).toBe(0);
  });

  it("subscribeVoteSyncEnqueue fires on enqueue but not after flush", async () => {
    const onEnqueue = vi.fn();
    subscribeVoteSyncEnqueue(onEnqueue);

    enqueueVoteSync({ station: "Aveiro", previous: null, next: "up" });
    expect(onEnqueue).toHaveBeenCalledTimes(1);

    await flushVoteSyncQueue(vi.fn().mockResolvedValue(true));
    expect(onEnqueue).toHaveBeenCalledTimes(1);
  });

  it("scheduleVoteSyncFlush debounces multiple enqueue notifications", async () => {
    vi.useFakeTimers();
    const flush = vi.fn().mockResolvedValue(undefined);

    scheduleVoteSyncFlush(flush);
    enqueueVoteSync({ station: "A", previous: null, next: "up" });
    scheduleVoteSyncFlush(flush);
    enqueueVoteSync({ station: "B", previous: null, next: "up" });
    scheduleVoteSyncFlush(flush);

    expect(flush).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(100);
    expect(flush).toHaveBeenCalledTimes(1);
  });

  it("flush drops non-retryable failures without re-enqueue churn", async () => {
    enqueueVoteSync({ station: "Aveiro", previous: null, next: "up" });
    expect(getPendingVoteSyncCount()).toBe(1);

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        clone: () => ({
          json: async () => ({ ok: false, reason: "invalid_payload" }),
        }),
      }),
    );

    await flushVoteSyncQueue((payload) =>
      postVotePayload(payload, { requeueOnFailure: false }),
    );

    expect(getPendingVoteSyncCount()).toBe(0);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("postVotePayload does not enqueue on 400", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        clone: () => ({
          json: async () => ({ ok: false, reason: "invalid_payload" }),
        }),
      }),
    );

    const ok = await postVotePayload({ station: "Aveiro", previous: null, next: "up" });
    expect(ok).toBe(false);
    expect(getPendingVoteSyncCount()).toBe(0);
  });

  it("postVotePayload does not enqueue on storage_not_configured", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 503,
        clone: () => ({
          json: async () => ({ ok: false, reason: "storage_not_configured" }),
        }),
      }),
    );

    const ok = await postVotePayload({ station: "Aveiro", previous: null, next: "up" });
    expect(ok).toBe(false);
    expect(getPendingVoteSyncCount()).toBe(0);
  });

  it("shouldRequeueVoteFailure returns false for 400 and storage_not_configured", async () => {
    expect(
      await shouldRequeueVoteFailure({
        status: 400,
        clone: () => ({ json: async () => ({}) }),
      } as Response),
    ).toBe(false);

    expect(
      await shouldRequeueVoteFailure({
        status: 503,
        clone: () => ({
          json: async () => ({ reason: "storage_not_configured" }),
        }),
      } as Response),
    ).toBe(false);

    expect(
      await shouldRequeueVoteFailure({
        status: 503,
        clone: () => ({
          json: async () => ({ reason: "storage_read_failed" }),
        }),
      } as Response),
    ).toBe(true);
  });

  it("loadOfflineRatingsCache returns null when empty", () => {
    expect(loadOfflineRatingsCache()).toBeNull();
  });

  it("drops offline ratings cache older than one week", () => {
    saveOfflineRatingsCache({
      ratings: { Braga: { up: 2, down: 0 } },
      hotelRatings: {},
      imageRatings: {},
      configured: true,
    });
    const raw = localStorage.getItem("pn_global_ratings_v1");
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw!) as { savedAt: number };
    parsed.savedAt = Date.now() - APP_UPDATE_CHECK_INTERVAL_MS - 1;
    localStorage.setItem("pn_global_ratings_v1", JSON.stringify(parsed));

    expect(loadOfflineRatingsCache()).toBeNull();
  });
});
