import { describe, expect, it } from "vitest";
import { stations } from "@/data/stations";
import { spainAirports } from "@/data/spain/airports";
import { getNearestStations } from "@/lib/nearestStations";
import { shouldShowNearestLongDistance } from "@/lib/nearestLongDistanceStations";

describe("nearestStations", () => {
  it("returns the two closest stations regardless of country", () => {
    const porto = stations.find((s) => s.name === "Porto-Campanhã")!;
    const nearest = getNearestStations(porto);

    expect(nearest).toHaveLength(2);
    expect(nearest[0].distanceKm).toBeLessThan(nearest[1].distanceKm);
    expect(nearest.every((entry) => entry.station.name !== porto.name)).toBe(true);
  });

  it("covers stations that skip the long-distance block", () => {
    const porto = stations.find((s) => s.name === "Porto-Campanhã")!;
    const madrid = spainAirports.find((s) => s.name === "Madrid-Barajas Airport (MAD)")!;

    expect(shouldShowNearestLongDistance(porto)).toBe(false);
    expect(shouldShowNearestLongDistance(madrid)).toBe(false);
    expect(getNearestStations(porto)).toHaveLength(2);
    expect(getNearestStations(madrid)).toHaveLength(2);
  });
});
