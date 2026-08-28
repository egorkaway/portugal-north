import { distanceKm } from '@/lib/geo';
import { sortStationsByDistance } from '@/lib/rankStations';
import { isAirportDestinationStation, isAirportHubStation } from '@/lib/airportTypes';
import { pageStations, type Station } from '@/lib/stationData';

/** CP Alfa/IC plus Spanish long-distance (catalogued as Intercidades, shown as InterCity). */
const LONG_DISTANCE_TYPES = new Set(['Alfa Pendular', 'Intercidades']);

export function hasLongDistanceService(station: Station): boolean {
  return station.types.some((type) => LONG_DISTANCE_TYPES.has(type));
}

/** True when the stop has no AP/IC and is not a historic-only entry. */
export function shouldShowNearestLongDistance(station: Station): boolean {
  if (isAirportDestinationStation(station)) return false;
  if (isAirportHubStation(station)) {
    return station.country === 'pt';
  }
  if (hasLongDistanceService(station)) return false;
  return !station.types.every((type) => type === 'Inactive / Historic');
}

export type NearestLongDistanceStation = {
  station: Station;
  distanceKm: number;
};

export function getNearestLongDistanceStations(
  station: Station,
  limit = 2,
): NearestLongDistanceStation[] {
  const candidates = pageStations.filter(
    (candidate) =>
      candidate.name !== station.name &&
      hasLongDistanceService(candidate) &&
      !isAirportHubStation(candidate) &&
      !isAirportDestinationStation(candidate),
  );

  return sortStationsByDistance(candidates, station)
    .slice(0, limit)
    .map((candidate) => ({
      station: candidate,
      distanceKm: distanceKm(
        station.lat,
        station.lng,
        candidate.lat,
        candidate.lng,
      ),
    }));
}

export function getLongDistanceTypes(station: Station): string[] {
  return station.types.filter((type) => LONG_DISTANCE_TYPES.has(type));
}
