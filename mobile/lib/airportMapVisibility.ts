import airportMapVisibility from '@/data/airport-map-visibility.json';
import type { Station } from '@/lib/stationData';

type AirportMapVisibilityManifest = {
  hideAfterEmptyPeriods?: number;
  airports?: Record<string, { hiddenFromMap?: boolean }>;
};

const baked = airportMapVisibility as AirportMapVisibilityManifest;

const IATA_IN_NAME_RE = /\(([A-Z]{3})\)\s*$/;

function extractAirportIata(station: Pick<Station, 'name' | 'lines'>): string | null {
  const fromLine = station.lines[0]?.trim().toUpperCase();
  if (fromLine && /^[A-Z]{3}$/.test(fromLine)) return fromLine;
  return station.name.match(IATA_IN_NAME_RE)?.[1] ?? null;
}

function isAirportMarkerStation(station: { types: string[] }): boolean {
  return station.types.includes('Airport') || station.types.includes('Airport Destination');
}

/** Hubs with repeated empty connection periods are omitted from the map. */
export function isAirportHiddenFromMapMarkers(station: Station): boolean {
  if (!isAirportMarkerStation(station)) return false;
  const iata = extractAirportIata(station);
  if (!iata) return false;
  return Boolean(baked.airports?.[iata]?.hiddenFromMap);
}
