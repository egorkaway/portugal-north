import { describe, expect, it, beforeEach, vi } from "vitest";
import {
  STATION_VISITED_STORAGE_KEY,
  isStationVisited,
  readVisitedMap,
  toggleStationVisited,
  writeVisitedMap,
} from "@/lib/stationVisitedStorage";

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

describe("stationVisitedStorage", () => {
  beforeEach(() => {
    mockLocalStorage();
  });

  it("uses a dedicated storage key namespace", () => {
    writeVisitedMap({ Braga: true });
    expect(localStorage.getItem(STATION_VISITED_STORAGE_KEY)).toContain("Braga");
  });

  it("reads and writes visited stations", () => {
    writeVisitedMap({ "Porto Campanhã": true });
    expect(readVisitedMap()).toEqual({ "Porto Campanhã": true });
    expect(isStationVisited(readVisitedMap(), "Porto Campanhã")).toBe(true);
    expect(isStationVisited(readVisitedMap(), "Lisboa")).toBe(false);
  });

  it("toggles visited on and off", () => {
    let map = readVisitedMap();
    ({ next: map } = toggleStationVisited(map, "Aveiro"));
    expect(isStationVisited(map, "Aveiro")).toBe(true);
    ({ next: map } = toggleStationVisited(map, "Aveiro"));
    expect(isStationVisited(map, "Aveiro")).toBe(false);
  });

  it("ignores invalid stored JSON", () => {
    localStorage.setItem(STATION_VISITED_STORAGE_KEY, "not-json");
    expect(readVisitedMap()).toEqual({});
    localStorage.setItem(STATION_VISITED_STORAGE_KEY, '{"Aveiro":"yes"}');
    expect(readVisitedMap()).toEqual({});
  });
});
