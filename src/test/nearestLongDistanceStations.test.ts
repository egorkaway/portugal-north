import { describe, expect, it } from "vitest";
import { portugalAirports } from "@/data/portugal/airports";
import { spainAirports } from "@/data/spain/airports";
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
    expect(hasLongDistanceService(stations.find((s) => s.name === "Canelas")!)).toBe(
      false,
    );
  });

  it("shows alternatives for regional-only stops", () => {
    const canelas = stations.find((s) => s.name === "Canelas")!;
    expect(shouldShowNearestLongDistance(canelas)).toBe(true);
  });

  it("hides for AP/IC stops and historic-only entries", () => {
    expect(
      shouldShowNearestLongDistance(stations.find((s) => s.name === "Porto-Campanhã")!),
    ).toBe(false);
    expect(
      shouldShowNearestLongDistance(stations.find((s) => s.name === "Amarante")!),
    ).toBe(false);
  });

  it("shows nearest long-distance links on Portuguese airport pages only", () => {
    expect(shouldShowNearestLongDistance(portugalAirports[0])).toBe(true);
    expect(shouldShowNearestLongDistance(spainAirports[0])).toBe(false);
    const lisbon = portugalAirports.find((a) => a.name === "Lisbon Airport (LIS)")!;
    const nearest = getNearestLongDistanceStations(lisbon);
    expect(nearest.length).toBeGreaterThan(0);
    expect(nearest.every((entry) => hasLongDistanceService(entry.station))).toBe(true);
  });

  it("returns the two nearest AP/IC stations for Canelas", () => {
    const canelas = stations.find((s) => s.name === "Canelas")!;
    const nearest = getNearestLongDistanceStations(canelas);

    expect(nearest).toHaveLength(2);
    expect(nearest[0].station.name).toBe("Estarreja");
    expect(nearest[1].station.name).toBe("Aveiro");
    expect(nearest[0].distanceKm).toBeLessThan(nearest[1].distanceKm);
  });

  it("lists only long-distance types on a candidate", () => {
    const porto = stations.find((s) => s.name === "Porto-Campanhã")!;
    expect(getLongDistanceTypes(porto)).toEqual(["Alfa Pendular", "Intercidades"]);
  });
});
