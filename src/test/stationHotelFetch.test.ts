import { describe, expect, it } from "vitest";
import { radiusStepsForStation } from "../../scripts/lib/stationHotelFetch.mjs";

describe("radiusStepsForStation", () => {
  it("uses the same capped radii when a station has no curated hotels", () => {
    expect(radiusStepsForStation(0)).toEqual([2000, 3500, 5000]);
  });

  it("uses default radii when topping up from 1 or 2 hotels", () => {
    expect(radiusStepsForStation(1)).toEqual([2000, 3500, 5000]);
    expect(radiusStepsForStation(2)).toEqual([2000, 3500, 5000]);
  });

  it("returns no steps when already at target", () => {
    expect(radiusStepsForStation(3)).toEqual([]);
  });
});
