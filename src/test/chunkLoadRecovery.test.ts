import { describe, expect, it } from "vitest";
import {
  CHUNK_CACHE_CLEARED_GUARD_KEY,
  CHUNK_RELOAD_GUARD_KEY,
  isChunkLoadError,
  planChunkLoadReload,
} from "@/lib/chunkLoadRecovery";

function mockStorage() {
  const store = new Map<string, string>();
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
  };
}

describe("chunkLoadRecovery", () => {
  it("recognises failed dynamic imports and HTML-as-module MIME errors", () => {
    expect(
      isChunkLoadError(
        new TypeError(
          "Failed to fetch dynamically imported module: https://www.verystays.com/assets/Rankings-abc.js",
        ),
      ),
    ).toBe(true);
    expect(
      isChunkLoadError(
        new Error(
          'Failed to load module script: Expected a JavaScript module script but the server responded with a MIME type of "text/html"',
        ),
      ),
    ).toBe(true);
    expect(isChunkLoadError(new Error("Importing a module script failed."))).toBe(true);
    expect(isChunkLoadError(new Error("Cannot read properties of undefined"))).toBe(false);
  });

  it("reloads once, then clears caches, then shows the error", () => {
    const session = mockStorage();

    expect(planChunkLoadReload(session)).toEqual({ action: "reload", clearCaches: false });

    session.setItem(CHUNK_RELOAD_GUARD_KEY, "1");
    expect(planChunkLoadReload(session)).toEqual({ action: "reload", clearCaches: true });

    session.setItem(CHUNK_CACHE_CLEARED_GUARD_KEY, "1");
    expect(planChunkLoadReload(session)).toEqual({ action: "show" });
  });
});
