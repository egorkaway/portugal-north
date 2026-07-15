import { describe, expect, it } from "vitest";
import { metroLisboaStations } from "@/data/metroLisboaStations";
import { metroPortoStations } from "@/data/metroPortoStations";
import { portugalAirports } from "@/data/portugal/airports";
import { spainAirports } from "@/data/spain/airports";
import { stations } from "@/data/stations";
import { isAirportStation, getAirportStationPathByIata, showsTravelEsimPromo } from "@/lib/airportStation";

describe("isAirportStation", () => {
  it("matches Porto and Lisboa metro airport termini", () => {
    expect(isAirportStation(metroPortoStations.find((s) => s.name.includes("Aeroporto"))!)).toBe(
      true,
    );
    expect(isAirportStation(metroLisboaStations.find((s) => s.name.includes("Aeroporto"))!)).toBe(
      true,
    );
  });

  it("matches all continental airport listings", () => {
    for (const airport of [...portugalAirports, ...spainAirports]) {
      expect(isAirportStation(airport)).toBe(true);
      expect(showsTravelEsimPromo(airport)).toBe(true);
    }
  });

  it("does not match regular train or metro stops", () => {
    expect(isAirportStation(stations.find((s) => s.name === "Porto-Campanhã")!)).toBe(false);
    expect(isAirportStation(stations.find((s) => s.name === "Lisboa Oriente")!)).toBe(false);
    expect(isAirportStation(stations.find((s) => s.name === "Cais do Sodré (Metro)")!)).toBe(
      false,
    );
  });
});

describe("getAirportStationPathByIata", () => {
  it("returns station paths for catalog airports", () => {
    expect(getAirportStationPathByIata("MAD")).toBe("/stations/madrid-barajas-airport-mad");
    expect(getAirportStationPathByIata("lis")).toBe("/stations/lisbon-airport-lis");
  });

  it("returns undefined for airports outside the catalog", () => {
    expect(getAirportStationPathByIata("JFK")).toBeUndefined();
  });
});
