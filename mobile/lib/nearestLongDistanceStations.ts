import { distanceKm } from '@/lib/geo';
import { sortStationsByDistance } from '@/lib/rankStations';
import { isAirportDestinationStation, isAirportHubStation } from '@/lib/airportTypes';
import { pageStations, type Station } from '@/lib/stationData';

const LONG_DISTANCE_TYPES = new Set(['Alfa Pendular', 'Intercidades']);

/** CP and metro stops in Portugal — mirrors web `portugalStations`. */
const portugalRailStations = pageStations.filter((station) => station.country === 'pt');

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
  const candidates = portugalRailStations.filter(
    (candidate) =>
      candidate.name !== station.name && hasLongDistanceService(candidate),
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
