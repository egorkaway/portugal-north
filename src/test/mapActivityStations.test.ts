import { describe, expect, it } from "vitest";
import { spainStations } from "@/data/spain/stations";
import {
  buildMapActivityHexData,
  getMapLowActivityInternationalStations,
} from "@/lib/mapActivityStations";

describe("mapActivityStations", () => {
  it("includes all Spanish stations as low-activity international stations", () => {
    expect(getMapLowActivityInternationalStations()).toEqual(spainStations);
  });

  it("renders Spanish stations as quiet H3 res. 9 hexes on the Portugal map", () => {
    const { cells } = buildMapActivityHexData({
      "Porto-Campanhã": 247,
      "Aveiro": 120,
    });

    for (const station of spainStations) {
      const cell = cells.find((c) => c.stationName === station.name);
      expect(cell, station.name).toBeDefined();
      expect(cell?.resolution).toBe(9);
    }
  });
});
