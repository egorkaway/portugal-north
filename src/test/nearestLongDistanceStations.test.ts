import { describe, expect, it } from "vitest";
import { stations } from "@/data/stations";
import {
  getLongDistanceTypes,
  getNearestLongDistanceStations,
  hasLongDistanceService,
  shouldShowNearestLongDistance,
} from "@/lib/nearestLongDistanceStations";

describe("nearestLongDistanceStations", () => {
  it("detects AP/IC service", () => {
    expect(hasLongDistanceService(stations.find((s) => s.name === "Aveiro")!)).toBe(
      true,
    );
    expect(hasLongDistanceService(stations.find((s) => s.name === "Mealhada")!)).toBe(
      false,
    );
  });

  it("shows alternatives for regional-only stops", () => {
    const mealhada = stations.find((s) => s.name === "Mealhada")!;
    expect(shouldShowNearestLongDistance(mealhada)).toBe(true);
  });

  it("hides for AP/IC stops and historic-only entries", () => {
    expect(
      shouldShowNearestLongDistance(stations.find((s) => s.name === "Porto-Campanhã")!),
    ).toBe(false);
    expect(
      shouldShowNearestLongDistance(stations.find((s) => s.name === "Amarante")!),
    ).toBe(false);
  });

  it("returns the two nearest AP/IC stations for Mealhada", () => {
    const mealhada = stations.find((s) => s.name === "Mealhada")!;
    const nearest = getNearestLongDistanceStations(mealhada);

    expect(nearest).toHaveLength(2);
    expect(nearest[0].station.name).toBe("Pampilhosa");
    expect(nearest[1].station.name).toBe("Coimbra-B");
    expect(nearest[0].distanceKm).toBeLessThan(nearest[1].distanceKm);
  });

  it("lists only long-distance types on a candidate", () => {
    const porto = stations.find((s) => s.name === "Porto-Campanhã")!;
    expect(getLongDistanceTypes(porto)).toEqual(["Alfa Pendular", "Intercidades"]);
  });
});
