import { allStations } from "@/data/stationRegistry";
import type { Station } from "@/data/stationTypes";
import { distanceKm } from "@/lib/geo";
import { sortStationsByDistance } from "@/lib/rankStations";

export type NearestStation = {
  station: Station;
  distanceKm: number;
};

export function getNearestStations(station: Station, limit = 2): NearestStation[] {
  const candidates = allStations.filter((candidate) => candidate.name !== station.name);

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
