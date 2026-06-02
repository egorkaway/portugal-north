import { describe, expect, it } from "vitest";
import { metroLisboaStations } from "@/data/metroLisboaStations";
import { metroPortoStations } from "@/data/metroPortoStations";
import { stations } from "@/data/stations";
import { isAirportStation } from "@/lib/airportStation";

describe("isAirportStation", () => {
  it("matches Porto and Lisboa metro airport termini", () => {
    expect(isAirportStation(metroPortoStations.find((s) => s.name.includes("Aeroporto"))!)).toBe(
      true,
    );
    expect(isAirportStation(metroLisboaStations.find((s) => s.name.includes("Aeroporto"))!)).toBe(
      true,
    );
  });

  it("does not match regular train or metro stops", () => {
    expect(isAirportStation(stations.find((s) => s.name === "Porto-Campanhã")!)).toBe(false);
    expect(isAirportStation(stations.find((s) => s.name === "Lisboa Oriente")!)).toBe(false);
    expect(isAirportStation(stations.find((s) => s.name === "Cais do Sodré (Metro)")!)).toBe(
      false,
    );
  });
});
