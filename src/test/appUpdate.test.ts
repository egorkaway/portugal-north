import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  APP_BUILD_NUMBER,
  APP_UPDATE_CHECK_INTERVAL_MS,
  ensureLatestBuild,
  getLastServiceWorkerCheckAt,
  markServiceWorkerChecked,
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

  it("reloads when version.json is newer than the embedded build", async () => {
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

    expect(reload).toHaveBeenCalledTimes(1);
    expect(sessionStorage.getItem("pn_reloaded_for_build")).toBe(
      String(Number(APP_BUILD_NUMBER) + 1),
    );
  });

  it("does not reload when build numbers match", async () => {
    const reload = vi.fn();
    vi.stubGlobal("location", { reload });
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ buildNumber: APP_BUILD_NUMBER }),
      }),
    );

    await ensureLatestBuild();

    expect(reload).not.toHaveBeenCalled();
  });

  it("does not reload twice for the same remote build before clearing caches", async () => {
    const reload = vi.fn();
    vi.stubGlobal("location", { reload });
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ buildNumber: String(Number(APP_BUILD_NUMBER) + 1) }),
      }),
    );

    sessionStorage.setItem("pn_reloaded_for_build", String(Number(APP_BUILD_NUMBER) + 1));
    vi.stubGlobal("caches", { keys: async () => [], delete: async () => true });
    vi.stubGlobal("navigator", {
      serviceWorker: {
        getRegistration: async () => ({ unregister: vi.fn().mockResolvedValue(true) }),
      },
    });

    await ensureLatestBuild();

    expect(reload).toHaveBeenCalledTimes(1);
  });
});
