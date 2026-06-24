import { describe, expect, it } from "vitest";
import {
  buildMapActivityHexData,
  getMapLowActivityInternationalStations,
} from "@/lib/mapActivityStations";

describe("mapActivityStations", () => {
  it("includes Vigo-Guixar as a low-activity international station", () => {
    expect(getMapLowActivityInternationalStations().map((station) => station.name)).toEqual([
      "Vigo-Guixar",
    ]);
  });

  it("renders Vigo-Guixar as a quiet H3 res. 9 hex on the Portugal map", () => {
    const { cells } = buildMapActivityHexData({
      "Porto-Campanhã": 247,
      "Aveiro": 120,
    });

    const vigo = cells.find((cell) => cell.stationName === "Vigo-Guixar");
    expect(vigo).toBeDefined();
    expect(vigo?.resolution).toBe(9);
  });
});
