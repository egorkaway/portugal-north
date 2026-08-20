import { describe, expect, it } from "vitest";
import { spainStations } from "@/data/spain/stations";
import {
  buildMapActivityHexData,
  getMapLowActivityInternationalStations,
} from "@/lib/mapActivityStations";

describe("mapActivityStations", () => {
  it("includes all Spanish stations as low-activity international stations", () => {
    expect(getMapLowActivityInternationalStations()).toEqual(
      expect.arrayContaining(spainStations),
    );
  });

  it("still draws Spanish hexes when Portugal movement data is missing", () => {
    const { cells } = buildMapActivityHexData({});
    expect(cells.length).toBeGreaterThan(0);
    expect(cells.some((cell) => cell.stationName === spainStations[0]?.name)).toBe(true);
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

  it("renders quiet Spanish stations with enough reliability samples as dots", () => {
    const station = spainStations[0]!;
    const result = buildMapActivityHexData(
      {
        "Porto-Campanhã": 247,
        Aveiro: 120,
      },
      {
        spainScores: { [station.name]: 8.6 },
        spainMovements: { [station.name]: 7 },
      },
    );

    expect(result.dots.some((dot) => dot.stationName === station.name)).toBe(true);
    expect(result.cells.some((cell) => cell.stationName === station.name)).toBe(false);
  });

  it("keeps quiet Portuguese stations with enough reliability samples as dots", () => {
    const result = buildMapActivityHexData(
      {
        "Porto-Campanhã": 247,
        Aveiro: 120,
        Pombal: 1,
      },
      {
        portugalScores: { Pombal: 8.2 },
        portugalMovements: { Pombal: 7 },
      },
    );

    expect(result.dots.some((dot) => dot.stationName === "Pombal")).toBe(true);
    expect(result.cells.some((cell) => cell.stationName === "Pombal")).toBe(false);
  });
});
