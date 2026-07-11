import stations from "@/data/stations.json";
import type { StationLite } from "@/lib/types";

const allStations = stations as StationLite[];

function distanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function findNearestStation(origin: { lat: number; lng: number }): StationLite | null {
  if (allStations.length === 0) return null;

  let nearest = allStations[0];
  let best = distanceKm(origin.lat, origin.lng, nearest.lat, nearest.lng);

  for (const station of allStations.slice(1)) {
    const d = distanceKm(origin.lat, origin.lng, station.lat, station.lng);
    if (d < best) {
      best = d;
      nearest = station;
    }
  }

  return nearest;
}
