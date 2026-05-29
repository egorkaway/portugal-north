import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  APP_UPDATE_CHECK_INTERVAL_MS,
  getLastServiceWorkerCheckAt,
  markServiceWorkerChecked,
  shouldCheckForServiceWorkerUpdate,
} from "@/lib/appUpdate";

describe("appUpdate", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("requires a week before the next service worker check", () => {
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
});
