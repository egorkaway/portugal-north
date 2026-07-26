import {
  extractIataFromAirportName,
  getFlightLineColor,
  getFlightLineWeight,
  isValidCoordinates,
  type AirportRecord,
} from "./airportIata.js";
import { formatCountryName } from "./countryName.js";
import type { AirportDepartureFlight } from "./airportDepartureFlight.js";

export type AirportFlightSample = {
  airline: string;
  number: string;
};

export type AirportConnection = {
  iata: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  flightCount: number;
  flights: AirportFlightSample[];
  lineColor: string;
  lineWeight: number;
};

export type AirportConnectionsEntry = {
  stationName: string;
  slug: string;
  iata: string;
  origin: { lat: number; lng: number };
  sampledFlights: number;
  connections: AirportConnection[];
  topDestinations: AirportConnection[];
  mapImage: string;
};

export type AirportConnectionsManifest = {
  generatedAt: string;
  runCount: number;
  airportCount: number;
  airports: Record<string, AirportConnectionsEntry>;
};

export type AirportCatalogEntry = AirportRecord & {
  stationName: string;
  slug: string;
  countryCode: "pt" | "es";
};

export type CoordinateLookup = Record<
  string,
  { name: string; country: string; lat: number; lng: number }
>;

export function groupFlightsByDestination(
  flights: AirportDepartureFlight[],
  originIata: string,
): Map<string, AirportDepartureFlight[]> {
  const grouped = new Map<string, AirportDepartureFlight[]>();

  for (const flight of flights) {
    const dest = flight.arrival?.iata?.trim().toUpperCase();
    if (!dest || dest === originIata) continue;
    const bucket = grouped.get(dest);
    if (bucket) bucket.push(flight);
    else grouped.set(dest, [flight]);
  }

  return grouped;
}

function sampleFlights(flights: AirportDepartureFlight[], limit = 3): AirportFlightSample[] {
  return flights.slice(0, limit).map((flight) => ({
    airline: flight.airline?.name?.trim() || "Unknown airline",
    number: flight.flight?.number?.trim() || flight.flight?.iata?.trim() || "—",
  }));
}

export function buildAirportConnections(
  airport: AirportCatalogEntry,
  flights: AirportDepartureFlight[],
  coordinates: CoordinateLookup,
): AirportConnectionsEntry | null {
  const grouped = groupFlightsByDestination(flights, airport.iata);
  const connections: AirportConnection[] = [];

  for (const [iata, bucket] of grouped.entries()) {
    const coords = coordinates[iata];
    if (!coords || !isValidCoordinates(coords.lat, coords.lng)) continue;

    const flightCount = bucket.length;
    connections.push({
      iata,
      name: coords.name || bucket[0]?.arrival?.airport?.trim() || iata,
      country: formatCountryName(coords.country || ""),
      lat: coords.lat,
      lng: coords.lng,
      flightCount,
      flights: sampleFlights(bucket),
      lineColor: getFlightLineColor(flightCount),
      lineWeight: getFlightLineWeight(flightCount),
    });
  }

  connections.sort(
    (a, b) => b.flightCount - a.flightCount || a.name.localeCompare(b.name),
  );

  if (connections.length === 0) return null;

  return {
    stationName: airport.stationName,
    slug: airport.slug,
    iata: airport.iata,
    origin: { lat: airport.lat, lng: airport.lng },
    sampledFlights: flights.length,
    connections,
    topDestinations: connections.slice(0, 10),
    mapImage: `/maps/airports/${airport.slug}-connections.png`,
  };
}

function mergeFlightSamples(
  previous: AirportFlightSample[],
  next: AirportFlightSample[],
  limit = 3,
): AirportFlightSample[] {
  const seen = new Set<string>();
  const merged: AirportFlightSample[] = [];
  for (const sample of [...previous, ...next]) {
    const key = `${sample.airline}|${sample.number}`;
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(sample);
    if (merged.length >= limit) break;
  }
  return merged;
}

/**
 * Union destinations across samples within the same open period.
 * Destinations are never dropped; flightCount keeps the peak observed count.
 * Callers start a fresh entry only after a period roll (empty previous).
 */
export function mergeAirportConnectionsEntries(
  previous: AirportConnectionsEntry | null | undefined,
  next: AirportConnectionsEntry,
): AirportConnectionsEntry {
  if (!previous || previous.iata !== next.iata) return next;

  const byIata = new Map<string, AirportConnection>();
  for (const connection of previous.connections) {
    byIata.set(connection.iata, connection);
  }

  for (const connection of next.connections) {
    const existing = byIata.get(connection.iata);
    if (!existing) {
      byIata.set(connection.iata, connection);
      continue;
    }

    const flightCount = Math.max(existing.flightCount, connection.flightCount);
    byIata.set(connection.iata, {
      ...existing,
      name: connection.name || existing.name,
      country: connection.country || existing.country,
      lat: connection.lat,
      lng: connection.lng,
      flightCount,
      flights: mergeFlightSamples(existing.flights, connection.flights),
      lineColor: getFlightLineColor(flightCount),
      lineWeight: getFlightLineWeight(flightCount),
    });
  }

  const connections = [...byIata.values()].sort(
    (a, b) => b.flightCount - a.flightCount || a.name.localeCompare(b.name),
  );

  return {
    ...next,
    origin: next.origin ?? previous.origin,
    sampledFlights: previous.sampledFlights + next.sampledFlights,
    connections,
    topDestinations: connections.slice(0, 10),
    mapImage: next.mapImage || previous.mapImage,
  };
}

export function mergeCatalogIntoCoordinates(
  catalog: AirportCatalogEntry[],
  coordinates: CoordinateLookup,
): CoordinateLookup {
  const merged = { ...coordinates };
  for (const airport of catalog) {
    merged[airport.iata] = {
      name: airport.name,
      country: airport.countryCode === "es" ? "Spain" : "Portugal",
      lat: airport.lat,
      lng: airport.lng,
    };
  }
  return merged;
}

export function extractIataFromStationName(name: string): string | null {
  return extractIataFromAirportName(name);
}
