import stations from "@/data/stations.json";
import cpStationCodes from "@/data/cpStationCodes.json";
import type { StationLite } from "@/lib/types";

const allStations = stations as StationLite[];
const codes = cpStationCodes as Record<string, string>;

function distanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** True when the station has a CP code and can show live departures in-app. */
export function stationHasLiveDepartures(stationName: string): boolean {
  return Boolean(codes[stationName]);
}

/**
 * Nearest station to the user.
 * Defaults to CP stations only — widgets deep-link into departures, which metro /
 * airport / unmapped stops do not have.
 */
export function findNearestStation(
  origin: { lat: number; lng: number },
  options?: { requireLiveDepartures?: boolean },
): StationLite | null {
  const requireLiveDepartures = options?.requireLiveDepartures !== false;
  const candidates = requireLiveDepartures
    ? allStations.filter((station) => stationHasLiveDepartures(station.name))
    : allStations;

  if (candidates.length === 0) return null;

  let nearest = candidates[0];
  let best = distanceKm(origin.lat, origin.lng, nearest.lat, nearest.lng);

  for (const station of candidates.slice(1)) {
    const d = distanceKm(origin.lat, origin.lng, station.lat, station.lng);
    if (d < best) {
      best = d;
      nearest = station;
    }
  }

  return nearest;
}
