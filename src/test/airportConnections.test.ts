import { describe, expect, it } from "vitest";
import {
  buildAirportConnections,
  groupFlightsByDestination,
  mergeAirportConnectionsEntries,
  mergeCatalogIntoCoordinates,
} from "../../server/lib/airportConnections";
import { getFlightLineColor } from "../../server/lib/airportIata";
import { formatCountryName } from "../../server/lib/countryName";

describe("groupFlightsByDestination", () => {
  it("groups by arrival IATA and ignores self-loops", () => {
    const grouped = groupFlightsByDestination(
      [
        { arrival: { iata: "MAD" }, airline: { name: "Iberia" }, flight: { number: "1" } },
        { arrival: { iata: "MAD" }, airline: { name: "TAP" }, flight: { number: "2" } },
        { arrival: { iata: "LIS" }, airline: { name: "TAP" }, flight: { number: "3" } },
      ],
      "LIS",
    );

    expect(grouped.get("MAD")).toHaveLength(2);
    expect(grouped.has("LIS")).toBe(false);
  });
});

describe("buildAirportConnections", () => {
  const airport = {
    stationName: "Lisbon Airport (LIS)",
    slug: "lisbon-airport-lis",
    iata: "LIS",
    name: "Lisbon Airport",
    lat: 38.7813,
    lng: -9.1359,
    countryCode: "pt" as const,
  };

  const coordinates = mergeCatalogIntoCoordinates([airport], {
    MAD: { name: "Madrid-Barajas", country: "Spain", lat: 40.4936, lng: -3.5664 },
    OPO: { name: "Porto", country: "Portugal", lat: 41.2481, lng: -8.6814 },
  });

  it("builds sorted connections and top 10 list", () => {
    const entry = buildAirportConnections(
      airport,
      [
        { arrival: { iata: "MAD", airport: "Madrid" }, airline: { name: "TAP" }, flight: { number: "100" } },
        { arrival: { iata: "MAD", airport: "Madrid" }, airline: { name: "Iberia" }, flight: { number: "200" } },
        { arrival: { iata: "MAD", airport: "Madrid" }, airline: { name: "Iberia" }, flight: { number: "201" } },
        { arrival: { iata: "OPO", airport: "Porto" }, airline: { name: "TAP" }, flight: { number: "300" } },
      ],
      coordinates,
    );

    expect(entry?.connections[0]?.iata).toBe("MAD");
    expect(entry?.connections[0]?.flightCount).toBe(3);
    expect(entry?.connections[0]?.lineColor).toBe(getFlightLineColor(3));
    expect(getFlightLineColor(5)).not.toBe(getFlightLineColor(3));
    expect(getFlightLineColor(3)).not.toBe(getFlightLineColor(1));
    expect(entry?.topDestinations).toHaveLength(2);
    expect(entry?.mapImage).toBe("/maps/airports/lisbon-airport-lis-connections.png");
  });

  it("expands ISO country codes to full names", () => {
    const entry = buildAirportConnections(
      airport,
      [
        { arrival: { iata: "FRA", airport: "Frankfurt" }, airline: { name: "Lufthansa" }, flight: { number: "1" } },
      ],
      {
        ...coordinates,
        FRA: { name: "Frankfurt Airport", country: "DE", lat: 50.0264, lng: 8.5431 },
      },
    );

    expect(entry?.connections[0]?.country).toBe(formatCountryName("DE"));
  });
});

describe("mergeAirportConnectionsEntries", () => {
  const airport = {
    stationName: "Lisbon Airport (LIS)",
    slug: "lisbon-airport-lis",
    iata: "LIS",
    name: "Lisbon Airport",
    lat: 38.7813,
    lng: -9.1359,
    countryCode: "pt" as const,
  };

  const coordinates = mergeCatalogIntoCoordinates([airport], {
    MAD: { name: "Madrid-Barajas", country: "Spain", lat: 40.4936, lng: -3.5664 },
    OPO: { name: "Porto", country: "Portugal", lat: 41.2481, lng: -8.6814 },
    BCN: { name: "Barcelona", country: "Spain", lat: 41.2971, lng: 2.0785 },
  });

  it("unions destinations within a period and keeps prior routes", () => {
    const first = buildAirportConnections(
      airport,
      [
        { arrival: { iata: "MAD" }, airline: { name: "TAP" }, flight: { number: "100" } },
        { arrival: { iata: "OPO" }, airline: { name: "TAP" }, flight: { number: "200" } },
      ],
      coordinates,
    );
    const second = buildAirportConnections(
      airport,
      [
        { arrival: { iata: "MAD" }, airline: { name: "Iberia" }, flight: { number: "300" } },
        { arrival: { iata: "MAD" }, airline: { name: "Iberia" }, flight: { number: "301" } },
        { arrival: { iata: "BCN" }, airline: { name: "Vueling" }, flight: { number: "400" } },
      ],
      coordinates,
    );

    const merged = mergeAirportConnectionsEntries(first, second!);
    expect(merged.connections.map((c) => c.iata).sort()).toEqual(["BCN", "MAD", "OPO"]);
    expect(merged.connections.find((c) => c.iata === "MAD")?.flightCount).toBe(2);
    expect(merged.connections.find((c) => c.iata === "OPO")?.flightCount).toBe(1);
    expect(merged.sampledFlights).toBe((first?.sampledFlights ?? 0) + (second?.sampledFlights ?? 0));
  });

  it("returns the next entry when there is no previous period data", () => {
    const next = buildAirportConnections(
      airport,
      [{ arrival: { iata: "MAD" }, airline: { name: "TAP" }, flight: { number: "1" } }],
      coordinates,
    );
    expect(mergeAirportConnectionsEntries(null, next!)).toEqual(next);
  });
});
