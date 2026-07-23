import { describe, expect, it } from "vitest";
import { portugalStations } from "@/data/stations";
import { portugalAirports } from "@/data/portugal/airports";
import { spainStations } from "@/data/spain/stations";
import { spainAirports } from "@/data/spain/airports";
import { europeDestinationAirports } from "@/data/europe/airports";
import { allStations, getStationsForCountry, getStationsForHomeScope } from "@/data/stationRegistry";
import { getStationBySlug, stationToSlug } from "@/lib/stationSlug";
import { AIRPORT_DESTINATION_TYPE } from "@/lib/airportTypes";

describe("stationRegistry", () => {
  it("keeps Portugal and Spain station lists separate", () => {
    expect(getStationsForCountry("pt").every((station) => station.country === "pt")).toBe(true);
    expect(getStationsForCountry("es").every((station) => station.country === "es")).toBe(true);
    expect(portugalStations).not.toEqual(expect.arrayContaining(spainStations));
  });

  it("includes Vigo-area and Eje Atlántico Spanish stations", () => {
    const names = spainStations.map((station) => station.name);
    expect(names).toContain("Vigo-Guixar");
    expect(names).toContain("Vigo-Urzáiz");
    expect(names).toContain("Santiago de Compostela");
    expect(names).toContain("Madrid-Chamartín");
    expect(names).toContain("Tui");
    expect(getStationBySlug("vigo-guixar")?.country).toBe("es");
    expect(getStationBySlug("santiago-de-compostela")?.country).toBe("es");
    expect(getStationBySlug("tui")?.types).toEqual(["Inactive / Historic"]);
  });

  it("includes continental airports in country lists", () => {
    const ptNames = getStationsForCountry("pt").map((station) => station.name);
    const esNames = getStationsForCountry("es").map((station) => station.name);
    expect(ptNames).toContain("Lisbon Airport (LIS)");
    expect(ptNames).toContain("Porto Airport (OPO)");
    expect(ptNames).toContain("Faro Airport (FAO)");
    expect(ptNames).not.toContain("Beja Airport (BYJ)");
    expect(portugalAirports).toHaveLength(3);
    expect(esNames).toContain("Madrid-Barajas Airport (MAD)");
    expect(esNames).toContain("Barcelona-El Prat Airport (BCN)");
    expect(portugalAirports.every((a) => a.types.includes("Airport"))).toBe(true);
    expect(spainAirports.every((a) => a.types.includes("Airport"))).toBe(true);
    expect(getStationBySlug("lisbon-airport-lis")?.types).toEqual(["Airport"]);
  });

  it("builds unique slugs across countries", () => {
    const slugs = allStations.map((station) => stationToSlug(station.name));
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("keeps Europe destination airports out of PT/ES country lists", () => {
    const ptIatas = new Set(
      getStationsForCountry("pt")
        .filter((s) => s.types.includes("Airport"))
        .map((s) => s.lines[0]),
    );
    const esIatas = new Set(
      getStationsForCountry("es")
        .filter((s) => s.types.includes("Airport"))
        .map((s) => s.lines[0]),
    );
    for (const airport of europeDestinationAirports) {
      expect(airport.types).toEqual([AIRPORT_DESTINATION_TYPE]);
      expect(ptIatas.has(airport.lines[0])).toBe(false);
      expect(esIatas.has(airport.lines[0])).toBe(false);
    }
    expect(getStationsForHomeScope("pt")).not.toEqual(
      expect.arrayContaining(europeDestinationAirports),
    );
    if (europeDestinationAirports.length > 0) {
      expect(getStationsForHomeScope("all")).toEqual(
        expect.arrayContaining(europeDestinationAirports),
      );
    }
  });
});
