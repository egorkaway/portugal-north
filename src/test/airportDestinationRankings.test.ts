import { describe, expect, it } from "vitest";
import { portugalAirports } from "@/data/portugal/airports";
import { spainAirports } from "@/data/spain/airports";
import {
  buildAirportDestinationRankingsByCountry,
  getAirportDestinationCount,
  pickBusiest,
} from "@/lib/airportDestinationRankings";
import type { AirportConnectionsManifest } from "../../server/lib/airportConnections";

function manifestFor(
  airports: AirportConnectionsManifest["airports"],
): AirportConnectionsManifest {
  return {
    generatedAt: "2026-08-22T00:00:00.000Z",
    runCount: 1,
    airportCount: Object.keys(airports).length,
    airports,
  };
}

describe("airportDestinationRankings", () => {
  it("counts unique destination rows, not sampled flights", () => {
    const manifest = manifestFor({
      LIS: {
        stationName: "Lisbon Airport (LIS)",
        slug: "lisbon-airport-lis",
        iata: "LIS",
        origin: { lat: 38.7813, lng: -9.1359 },
        sampledFlights: 500,
        connections: [
          { iata: "MAD", name: "Madrid", country: "Spain", lat: 40, lng: -3, flightCount: 20, flights: [], lineColor: "#000", lineWeight: 1 },
          { iata: "OPO", name: "Porto", country: "Portugal", lat: 41, lng: -8, flightCount: 5, flights: [], lineColor: "#000", lineWeight: 1 },
        ],
        topDestinations: [],
        mapImage: "/maps/airports/lisbon-airport-lis-connections.png",
      },
    });

    const lisbon = portugalAirports.find((airport) => airport.name.includes("LIS"))!;
    expect(getAirportDestinationCount(manifest, lisbon)).toBe(2);
  });

  it("picks the busiest hub per country", () => {
    const manifest = manifestFor({
      LIS: {
        stationName: "Lisbon Airport (LIS)",
        slug: "lisbon-airport-lis",
        iata: "LIS",
        origin: { lat: 38.7813, lng: -9.1359 },
        sampledFlights: 100,
        connections: [{ iata: "MAD", name: "Madrid", country: "Spain", lat: 40, lng: -3, flightCount: 1, flights: [], lineColor: "#000", lineWeight: 1 }],
        topDestinations: [],
        mapImage: "/maps/airports/lisbon-airport-lis-connections.png",
      },
      OPO: {
        stationName: "Porto Airport (OPO)",
        slug: "porto-airport-opo",
        iata: "OPO",
        origin: { lat: 41.2481, lng: -8.6814 },
        sampledFlights: 100,
        connections: [
          { iata: "MAD", name: "Madrid", country: "Spain", lat: 40, lng: -3, flightCount: 1, flights: [], lineColor: "#000", lineWeight: 1 },
          { iata: "LHR", name: "London", country: "United Kingdom", lat: 51, lng: 0, flightCount: 1, flights: [], lineColor: "#000", lineWeight: 1 },
          { iata: "CDG", name: "Paris", country: "France", lat: 49, lng: 2, flightCount: 1, flights: [], lineColor: "#000", lineWeight: 1 },
        ],
        topDestinations: [],
        mapImage: "/maps/airports/porto-airport-opo-connections.png",
      },
      MAD: {
        stationName: "Madrid-Barajas Airport (MAD)",
        slug: "madrid-barajas-airport-mad",
        iata: "MAD",
        origin: { lat: 40.4936, lng: -3.5664 },
        sampledFlights: 100,
        connections: [
          { iata: "BCN", name: "Barcelona", country: "Spain", lat: 41, lng: 2, flightCount: 1, flights: [], lineColor: "#000", lineWeight: 1 },
          { iata: "LIS", name: "Lisbon", country: "Portugal", lat: 38, lng: -9, flightCount: 1, flights: [], lineColor: "#000", lineWeight: 1 },
        ],
        topDestinations: [],
        mapImage: "/maps/airports/madrid-barajas-airport-mad-connections.png",
      },
      VLL: {
        stationName: "Valladolid Airport (VLL)",
        slug: "valladolid-airport-vll",
        iata: "VLL",
        origin: { lat: 41.7061, lng: -4.8519 },
        sampledFlights: 10,
        connections: [
          { iata: "BCN", name: "Barcelona", country: "Spain", lat: 41, lng: 2, flightCount: 1, flights: [], lineColor: "#000", lineWeight: 1 },
        ],
        topDestinations: [],
        mapImage: "/maps/airports/valladolid-airport-vll-connections.png",
      },
    });

    const rankings = buildAirportDestinationRankingsByCountry(manifest);
    expect(rankings.pt?.iata).toBe("OPO");
    expect(rankings.pt?.mapImage).toBe(
      "/maps/airports/porto-airport-opo-connections.png",
    );
    expect(rankings.es?.iata).toBe("MAD");
    expect(rankings.es?.mapImage).toBe(
      "/maps/airports/madrid-barajas-airport-mad-connections.png",
    );
  });

  it("returns nulls when no hubs have destinations", () => {
    expect(pickBusiest([])).toBeNull();
    expect(buildAirportDestinationRankingsByCountry(manifestFor({}))).toEqual({
      pt: null,
      es: null,
    });
    expect(spainAirports.length).toBeGreaterThan(0);
  });
});
