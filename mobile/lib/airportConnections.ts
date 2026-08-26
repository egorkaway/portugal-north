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
  periodId?: string;
  airports: Record<string, AirportConnectionsEntry>;
  fallbackPeriodId?: string | null;
  fallbackAirports?: Record<string, AirportConnectionsEntry>;
};

export const bakedAirportConnections = airportConnections as AirportConnectionsManifest;

let airportSlugByIata: Map<string, string> | null = null;

function getAirportSlugByIataMap(): Map<string, string> {
  if (airportSlugByIata) return airportSlugByIata;
  const next = new Map<string, string>();
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
    if (iata) next.set(iata, stationToSlug(station.name));
  }
  airportSlugByIata = next;
  return next;
}

export function invalidateAirportSlugIndex(): void {
  airportSlugByIata = null;
}

function findAirportEntry(
  airports: Record<string, AirportConnectionsEntry> | undefined,
  {
    iata,
    slug,
    stationName,
  }: {
    iata?: string;
    slug?: string;
    stationName?: string;
  },
): AirportConnectionsEntry | null {
  if (!airports) return null;
  const code = iata?.trim().toUpperCase();
  if (code && airports[code]?.connections?.length) return airports[code];
  return (
    Object.values(airports).find(
      (airport) =>
        Boolean(airport.connections?.length) &&
        ((slug && airport.slug === slug) ||
          (stationName && airport.stationName === stationName)),
    ) ?? null
  );
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
  return getAirportSlugByIataMap().get(iata.trim().toUpperCase());
}

export function getAirportConnectionsMapImageUrl(
  entryOrSlug: AirportConnectionsEntry | string,
): string {
  if (typeof entryOrSlug === 'string') {
    return `${SITE_BASE}/maps/airports/${entryOrSlug}-connections.png`;
  }
  if (entryOrSlug.mapImage?.startsWith('http')) return entryOrSlug.mapImage;
  if (entryOrSlug.mapImage?.startsWith('/')) return `${SITE_BASE}${entryOrSlug.mapImage}`;
  return `${SITE_BASE}/maps/airports/${entryOrSlug.slug}-connections.png`;
}

export function getAirportConnectionsEntry(station: Station): AirportConnectionsEntry | null {
  const iata = station.lines[0]?.trim().toUpperCase();
  const slug = stationToSlug(station.name);
  return (
    findAirportEntry(bakedAirportConnections.airports, {
      iata,
      slug,
      stationName: station.name,
    }) ??
    findAirportEntry(bakedAirportConnections.fallbackAirports, {
      iata,
      slug,
      stationName: station.name,
    })
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

  const hubsByIata = new Map<string, IberianHubFlyingToDestination>();
  const sources = [manifest.airports ?? {}, manifest.fallbackAirports ?? {}];
  for (const airports of sources) {
    for (const hub of Object.values(airports)) {
      if (hubsByIata.has(hub.iata)) continue;
      const connection = hub.connections?.find(
        (entry) => entry.iata.trim().toUpperCase() === dest,
      );
      if (!connection) continue;
      hubsByIata.set(hub.iata, {
        iata: hub.iata,
        stationName: hub.stationName,
        slug: hub.slug || getAirportStationSlugByIata(hub.iata) || stationToSlug(hub.stationName),
        flightCount: connection.flightCount,
      });
    }
  }

  return [...hubsByIata.values()].sort(
    (a, b) => b.flightCount - a.flightCount || a.stationName.localeCompare(b.stationName),
  );
}

export function destinationIataFromStation(station: Station): string | null {
  const fromLine = station.lines[0]?.trim().toUpperCase();
  if (fromLine && /^[A-Z]{3}$/.test(fromLine)) return fromLine;
  return station.name.match(IATA_IN_NAME_RE)?.[1] ?? null;
}
