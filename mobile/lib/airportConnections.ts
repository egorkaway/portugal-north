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
  if (
    !station.types.includes('Airport') &&
    !station.types.includes('Airport Destination')
  ) {
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
