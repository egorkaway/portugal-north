import { describe, expect, it } from "vitest";
import {
  buildAirportConnections,
  groupFlightsByDestination,
  mergeCatalogIntoCoordinates,
} from "../../server/lib/airportConnections";
import { getFlightLineColor } from "../../server/lib/airportIata";

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
    expect(entry?.topDestinations).toHaveLength(2);
    expect(entry?.mapImage).toBe("/maps/airports/lisbon-airport-lis-connections.png");
  });
});
