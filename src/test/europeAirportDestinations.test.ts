import { describe, expect, it } from "vitest";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import {
  destinationAirportDisplayName,
  isEuropeDestinationCandidate,
  isEuropeIsoCountry,
  isNonMainlandIberiaAirport,
} from "@/lib/europeAirportDestinations";
import { loadAirportCatalog } from "../../scripts/lib/airportCatalog.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");

describe("europeAirportDestinations", () => {
  const hubs = new Set(
    loadAirportCatalog(root).map((airport: { iata: string }) => airport.iata),
  );

  it("treats major EU/UK countries as Europe", () => {
    expect(isEuropeIsoCountry("DE")).toBe(true);
    expect(isEuropeIsoCountry("gb")).toBe(true);
    expect(isEuropeIsoCountry("FR")).toBe(true);
    expect(isEuropeIsoCountry("US")).toBe(false);
    expect(isEuropeIsoCountry("MA")).toBe(false);
  });

  it("flags Canaries, Azores, Madeira, Balearics, Ceuta/Melilla as non-mainland", () => {
    expect(isNonMainlandIberiaAirport("ES", 28.9455, -13.6052)).toBe(true); // ACE
    expect(isNonMainlandIberiaAirport("ES", 39.5517, 2.7388)).toBe(true); // PMI
    expect(isNonMainlandIberiaAirport("PT", 32.6978, -16.7746)).toBe(true); // FNC
    expect(isNonMainlandIberiaAirport("PT", 37.7412, -25.6979)).toBe(true); // PDL
    expect(isNonMainlandIberiaAirport("ES", 35.2803, -2.9563)).toBe(true); // MLN
    expect(isNonMainlandIberiaAirport("ES", 40.4719, -3.5626)).toBe(false); // MAD mainland
    expect(isNonMainlandIberiaAirport("PT", 38.7813, -9.1359)).toBe(false); // LIS mainland
  });

  it("accepts European destinations outside the Iberian hub catalog", () => {
    expect(
      isEuropeDestinationCandidate(
        "FRA",
        { name: "Frankfurt", country: "DE", lat: 50.03, lng: 8.54 },
        hubs,
      ),
    ).toBe(true);
    expect(
      isEuropeDestinationCandidate(
        "LHR",
        { name: "Heathrow", country: "GB", lat: 51.47, lng: -0.46 },
        hubs,
      ),
    ).toBe(true);
    expect(
      isEuropeDestinationCandidate(
        "PMI",
        { name: "Palma", country: "ES", lat: 39.5517, lng: 2.7388 },
        hubs,
      ),
    ).toBe(true);
  });

  it("rejects hubs, non-Europe, and mainland Iberia not in catalog", () => {
    expect(hubs.has("LIS")).toBe(true);
    expect(
      isEuropeDestinationCandidate(
        "LIS",
        { name: "Lisbon", country: "PT", lat: 38.78, lng: -9.13 },
        hubs,
      ),
    ).toBe(false);
    expect(
      isEuropeDestinationCandidate(
        "JFK",
        { name: "JFK", country: "US", lat: 40.64, lng: -73.78 },
        hubs,
      ),
    ).toBe(false);
    expect(
      isEuropeDestinationCandidate(
        "BYJ",
        { name: "Beja", country: "PT", lat: 38.0789, lng: -7.9324 },
        hubs,
      ),
    ).toBe(false);
  });

  it("formats destination display names with IATA", () => {
    expect(destinationAirportDisplayName("FRA", "Frankfurt Main Airport")).toBe(
      "Frankfurt Main Airport (FRA)",
    );
    expect(destinationAirportDisplayName("FRA", "Frankfurt Main Airport (FRA)")).toBe(
      "Frankfurt Main Airport (FRA)",
    );
  });
});

describe("loadAirportCatalog hub exclusion", () => {
  it("only loads Portugal and Spain hub airports", () => {
    const catalog = loadAirportCatalog(root);
    expect(catalog.every((a: { countryCode: string }) => a.countryCode === "pt" || a.countryCode === "es")).toBe(
      true,
    );
    expect(catalog.some((a: { iata: string }) => a.iata === "LIS")).toBe(true);
    expect(catalog.some((a: { iata: string }) => a.iata === "MAD")).toBe(true);
    // Europe destinations must never appear in the collection catalog.
    expect(catalog.some((a: { iata: string }) => a.iata === "FRA")).toBe(false);
    expect(catalog.some((a: { iata: string }) => a.iata === "LHR")).toBe(false);
  });
});
