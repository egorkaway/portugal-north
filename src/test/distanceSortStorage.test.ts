import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  DISTANCE_SORT_STORAGE_KEY,
  DISTANCE_SORT_SESSION_OFF_KEY,
  LAST_COORDS_STORAGE_KEY,
  clearLastCoords,
  readDistanceSortEnabled,
  readDistanceSortSessionOptOut,
  readLastCoords,
  writeDistanceSortEnabled,
  writeDistanceSortSessionOptOut,
  writeLastCoords,
} from "@/lib/distanceSortStorage";

function mockStorage() {
  const local = new Map<string, string>();
  const session = new Map<string, string>();
  vi.stubGlobal("localStorage", {
    getItem: (key: string) => local.get(key) ?? null,
    setItem: (key: string, value: string) => {
      local.set(key, value);
    },
    removeItem: (key: string) => {
      local.delete(key);
    },
  });
  vi.stubGlobal("sessionStorage", {
    getItem: (key: string) => session.get(key) ?? null,
    setItem: (key: string, value: string) => {
      session.set(key, value);
    },
    removeItem: (key: string) => {
      session.delete(key);
    },
  });
}

describe("distanceSortStorage", () => {
  beforeEach(() => {
    mockStorage();
  });

  it("defaults to disabled", () => {
    expect(readDistanceSortEnabled()).toBe(false);
  });

  it("persists enabled preference", () => {
    writeDistanceSortEnabled(true);
    expect(localStorage.getItem(DISTANCE_SORT_STORAGE_KEY)).toBe("1");
    expect(readDistanceSortEnabled()).toBe(true);
  });

  it("clears sticky on when disabled (no cross-session opt-out)", () => {
    writeDistanceSortEnabled(true);
    writeDistanceSortEnabled(false);
    expect(localStorage.getItem(DISTANCE_SORT_STORAGE_KEY)).toBeNull();
    expect(readDistanceSortEnabled()).toBe(false);
  });

  it("stores session opt-out separately from sticky preference", () => {
    writeDistanceSortSessionOptOut(true);
    expect(sessionStorage.getItem(DISTANCE_SORT_SESSION_OFF_KEY)).toBe("1");
    expect(readDistanceSortSessionOptOut()).toBe(true);
    writeDistanceSortSessionOptOut(false);
    expect(readDistanceSortSessionOptOut()).toBe(false);
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
