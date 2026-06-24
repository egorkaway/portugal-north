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

  it("includes Vigo-Guixar as the first Spanish station", () => {
    expect(spainStations.map((station) => station.name)).toEqual(["Vigo-Guixar"]);
    expect(getStationBySlug("vigo-guixar")?.country).toBe("es");
  });

  it("builds unique slugs across countries", () => {
    const slugs = allStations.map((station) => stationToSlug(station.name));
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});
