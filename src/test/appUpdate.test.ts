import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  APP_BUILD_NUMBER,
  APP_UPDATE_CHECK_INTERVAL_MS,
  CACHE_CLEARED_GUARD_KEY,
  ensureLatestBuild,
  getLastServiceWorkerCheckAt,
  markServiceWorkerChecked,
  planBuildReload,
  RELOAD_GUARD_KEY,
  shouldCheckForServiceWorkerUpdate,
} from "@/lib/appUpdate";

function mockStorage() {
  const store = new Map<string, string>();
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
    clear: () => {
      store.clear();
    },
  };
}

describe("appUpdate", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", mockStorage());
    vi.stubGlobal("sessionStorage", mockStorage());
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it("requires an hour before the next service worker check", () => {
    expect(shouldCheckForServiceWorkerUpdate()).toBe(true);

    markServiceWorkerChecked(1_000);
    vi.setSystemTime(1_000 + APP_UPDATE_CHECK_INTERVAL_MS - 1);
    expect(shouldCheckForServiceWorkerUpdate()).toBe(false);

    vi.setSystemTime(1_000 + APP_UPDATE_CHECK_INTERVAL_MS);
    expect(shouldCheckForServiceWorkerUpdate()).toBe(true);
  });

  it("persists last check timestamp", () => {
    markServiceWorkerChecked(42);
    expect(getLastServiceWorkerCheckAt()).toBe(42);
  });

  describe("planBuildReload", () => {
    it("renders when build numbers match and clears guards", () => {
      const session = mockStorage();
      session.setItem(RELOAD_GUARD_KEY, "99");
      session.setItem(CACHE_CLEARED_GUARD_KEY, "99");

      expect(planBuildReload(APP_BUILD_NUMBER, APP_BUILD_NUMBER, session)).toEqual({
        action: "render",
      });
      expect(session.getItem(RELOAD_GUARD_KEY)).toBeNull();
      expect(session.getItem(CACHE_CLEARED_GUARD_KEY)).toBeNull();
    });

    it("reloads once for a newer remote build", () => {
      const session = mockStorage();
      const remote = String(Number(APP_BUILD_NUMBER) + 1);

      expect(planBuildReload(remote, APP_BUILD_NUMBER, session)).toEqual({
        action: "reload",
        markReloadGuard: remote,
      });
    });

    it("clears caches after the first reload attempt", () => {
      const session = mockStorage();
      const remote = String(Number(APP_BUILD_NUMBER) + 1);
      session.setItem(RELOAD_GUARD_KEY, remote);

      expect(planBuildReload(remote, APP_BUILD_NUMBER, session)).toEqual({
        action: "reload",
        markCacheClearedGuard: remote,
      });
    });

    it("renders after reload and cache clear still leave a stale bundle", () => {
      const session = mockStorage();
      const remote = String(Number(APP_BUILD_NUMBER) + 1);
      session.setItem(RELOAD_GUARD_KEY, remote);
      session.setItem(CACHE_CLEARED_GUARD_KEY, remote);

      expect(planBuildReload(remote, APP_BUILD_NUMBER, session)).toEqual({
        action: "render",
      });
    });
  });

  it("does not reload in dev even when version.json is newer", async () => {
    const reload = vi.fn();
    vi.stubGlobal("location", { reload });
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ buildNumber: String(Number(APP_BUILD_NUMBER) + 1) }),
      }),
    );

    await ensureLatestBuild();

    expect(reload).not.toHaveBeenCalled();
  });
});
