import { afterEach, describe, expect, it, vi } from "vitest";
import {
  buildRatingsFromDeviceVotes,
  hasDeviceVotes,
  VOTE_COOKIE_NAMES,
} from "@/lib/deviceVoteStorage";
import { loadOfflineRatingsCache, saveOfflineRatingsCache } from "@/lib/offlineRatingsCache";
import {
  enqueueVoteSync,
  flushVoteSyncQueue,
  getPendingVoteSyncCount,
} from "@/lib/voteSyncQueue";
import { fetchGlobalRatings } from "@/lib/votesApi";

describe("offline vote storage", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
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

  it("loadOfflineRatingsCache returns null when empty", () => {
    expect(loadOfflineRatingsCache()).toBeNull();
  });
});
