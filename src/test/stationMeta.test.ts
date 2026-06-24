import { describe, expect, it } from "vitest";
import { createTranslator } from "@/i18n";
import {
  getStationMetaDescription,
  getStationOgDescription,
  getStationPageTitle,
} from "@/lib/stationMeta";
import type { Station } from "@/data/stations";

const tr = createTranslator("en");

const portoCampanha: Station = {
  name: "Porto-Campanhã",
  lines: ["Linha do Norte", "Minho", "Douro"],
  types: ["Alfa Pendular", "Intercidades", "Urban", "Regional"],
  lat: 41.1489,
  lng: -8.5856,
};

describe("stationMeta", () => {
  it("builds a unique title per station", () => {
    expect(getStationPageTitle(portoCampanha, tr)).toBe(
      "Porto-Campanhã Train Station — Hotels & Lines | Sustainable Iberian Travel",
    );
  });

  it("includes lines, services, and hotel pricing in the description", () => {
    const description = getStationMetaDescription(portoCampanha, [
      { name: "Hotel A", distanceKm: 0.5, priceFrom: 38, bookingUrl: "#" },
      { name: "Hotel B", distanceKm: 1, priceFrom: 42, bookingUrl: "#" },
    ], tr);
    expect(description).toContain("Porto-Campanhã");
    expect(description).toContain("Linha do Norte");
    expect(description).toContain("€38/night");
    expect(description.length).toBeLessThanOrEqual(158);
  });

  it("varies og description when hotel names differ", () => {
    const og = getStationOgDescription(portoCampanha, [
      { name: "Campanha Boutique", distanceKm: 0.1, priceFrom: 38, bookingUrl: "#" },
    ], tr);
    expect(og).toContain("Campanha Boutique");
    expect(og).not.toBe(getStationMetaDescription(portoCampanha, [], tr));
  });
});
