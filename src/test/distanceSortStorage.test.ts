import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  DISTANCE_SORT_STORAGE_KEY,
  LAST_COORDS_STORAGE_KEY,
  clearLastCoords,
  readDistanceSortEnabled,
  readLastCoords,
  writeDistanceSortEnabled,
  writeLastCoords,
} from "@/lib/distanceSortStorage";

function mockLocalStorage() {
  const store = new Map<string, string>();
  vi.stubGlobal("localStorage", {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
  });
  return store;
}

describe("distanceSortStorage", () => {
  beforeEach(() => {
    mockLocalStorage();
  });

  it("defaults to disabled", () => {
    expect(readDistanceSortEnabled()).toBe(false);
  });

  it("persists enabled preference", () => {
    writeDistanceSortEnabled(true);
    expect(localStorage.getItem(DISTANCE_SORT_STORAGE_KEY)).toBe("1");
    expect(readDistanceSortEnabled()).toBe(true);
  });

  it("clears preference when disabled", () => {
    writeDistanceSortEnabled(true);
    writeDistanceSortEnabled(false);
    expect(localStorage.getItem(DISTANCE_SORT_STORAGE_KEY)).toBeNull();
    expect(readDistanceSortEnabled()).toBe(false);
  });

  it("returns false when localStorage is unavailable", () => {
    vi.stubGlobal("localStorage", undefined);
    expect(readDistanceSortEnabled()).toBe(false);
    expect(() => writeDistanceSortEnabled(true)).not.toThrow();
    vi.unstubAllGlobals();
  });

  it("stores and reads recent coordinates", () => {
    writeLastCoords({ lat: 40.21, lng: -8.43 });
    expect(readLastCoords()).toEqual(
      expect.objectContaining({ lat: 40.21, lng: -8.43, at: expect.any(Number) }),
    );
    clearLastCoords();
    expect(localStorage.getItem(LAST_COORDS_STORAGE_KEY)).toBeNull();
    expect(readLastCoords()).toBeNull();
  });
});
