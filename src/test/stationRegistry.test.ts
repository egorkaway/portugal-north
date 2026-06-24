import { describe, expect, it } from "vitest";
import { portugalStations } from "@/data/stations";
import { spainStations } from "@/data/spain/stations";
import { allStations, getStationsForCountry } from "@/data/stationRegistry";
import { getStationBySlug, stationToSlug } from "@/lib/stationSlug";

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

  it("builds unique slugs across countries", () => {
    const slugs = allStations.map((station) => stationToSlug(station.name));
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});
