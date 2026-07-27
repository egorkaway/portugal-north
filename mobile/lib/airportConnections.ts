import airportConnections from '@/data/airport-connections.json';
import { allStations, stationToSlug, type Station } from '@/lib/stationData';

const SITE_BASE = 'https://www.verystays.com';
const IATA_IN_NAME_RE = /\(([A-Z]{3})\)\s*$/;

export type AirportConnection = {
  iata: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  flightCount: number;
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

export const bakedAirportConnections = airportConnections as AirportConnectionsManifest;

const airportSlugByIata = new Map<string, string>();

for (const station of allStations) {
  // Iberian hubs only — destination airports have no public station pages.
  if (!station.types.includes('Airport') || station.types.includes('Airport Destination')) {
    continue;
  }
  const fromLine = station.lines[0]?.trim().toUpperCase();
  const iata =
    (fromLine && /^[A-Z]{3}$/.test(fromLine) ? fromLine : null) ??
    station.name.match(IATA_IN_NAME_RE)?.[1] ??
    null;
  if (iata) airportSlugByIata.set(iata, stationToSlug(station.name));
}

export function getFlightLineColor(flightCount: number): string {
  if (flightCount >= 5) return '#b91c1c';
  if (flightCount >= 3) return '#7c3aed';
  return '#2563eb';
}

export function getFlightLineWeight(flightCount: number): number {
  if (flightCount >= 5) return 4;
  if (flightCount >= 3) return 3;
  return 2;
}

export function formatFlightCount(count: number): string {
  return count === 1 ? '1 flight' : `${count} flights`;
}

export function getAirportStationSlugByIata(iata: string): string | undefined {
  return airportSlugByIata.get(iata.trim().toUpperCase());
}

export function getAirportConnectionsMapImageUrl(slug: string): string {
  return `${SITE_BASE}/maps/airports/${slug}-connections.png`;
}

export function getAirportConnectionsEntry(station: Station): AirportConnectionsEntry | null {
  const iata = station.lines[0]?.trim().toUpperCase();
  if (iata && bakedAirportConnections.airports[iata]) {
    return bakedAirportConnections.airports[iata];
  }

  const slug = stationToSlug(station.name);
  return (
    Object.values(bakedAirportConnections.airports).find(
      (entry) => entry.slug === slug || entry.stationName === station.name,
    ) ?? null
  );
}

export type IberianHubFlyingToDestination = {
  iata: string;
  stationName: string;
  slug: string;
  flightCount: number;
};

/**
 * Iberian hubs with sampled flights to a destination airport.
 * Derived from hub→destination lists in airport-connections.json.
 */
export function getIberianHubsFlyingTo(
  destinationIata: string,
  manifest: AirportConnectionsManifest = bakedAirportConnections,
): IberianHubFlyingToDestination[] {
  const dest = destinationIata.trim().toUpperCase();
  if (!/^[A-Z]{3}$/.test(dest)) return [];

  const hubs: IberianHubFlyingToDestination[] = [];
  for (const hub of Object.values(manifest.airports ?? {})) {
    const connection = hub.connections?.find(
      (entry) => entry.iata.trim().toUpperCase() === dest,
    );
    if (!connection) continue;
    hubs.push({
      iata: hub.iata,
      stationName: hub.stationName,
      slug: hub.slug || getAirportStationSlugByIata(hub.iata) || stationToSlug(hub.stationName),
      flightCount: connection.flightCount,
    });
  }

  return hubs.sort(
    (a, b) => b.flightCount - a.flightCount || a.stationName.localeCompare(b.stationName),
  );
}

export function destinationIataFromStation(station: Station): string | null {
  const fromLine = station.lines[0]?.trim().toUpperCase();
  if (fromLine && /^[A-Z]{3}$/.test(fromLine)) return fromLine;
  return station.name.match(IATA_IN_NAME_RE)?.[1] ?? null;
}
