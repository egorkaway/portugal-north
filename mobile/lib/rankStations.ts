import { distanceKm } from '@/lib/geo';
import type { GlobalRatings } from '@/lib/rankVotes';
import type { Station } from '@/lib/stationData';

export type DistanceOrigin = { lat: number; lng: number };

export function sortStationsByDistance(
  items: Station[],
  origin: DistanceOrigin,
): Station[] {
  return [...items]
    .map((station, index) => ({
      station,
      index,
      distance: distanceKm(origin.lat, origin.lng, station.lat, station.lng),
    }))
    .sort(
      (a, b) =>
        a.distance - b.distance ||
        a.index - b.index ||
        a.station.name.localeCompare(b.station.name),
    )
    .map(({ station }) => station);
}

export function stationDistancesKm(
  items: Station[],
  origin: DistanceOrigin,
): Record<string, number> {
  return Object.fromEntries(
    items.map((station) => [
      station.name,
      distanceKm(origin.lat, origin.lng, station.lat, station.lng),
    ]),
  );
}

export function orderStationsForHome(
  matches: Station[],
  options: {
    distanceSortOn: boolean;
    coords: DistanceOrigin | null;
    globalRatings: GlobalRatings | undefined;
    votesConfigured: boolean;
  },
): Station[] {
  const { distanceSortOn, coords, globalRatings, votesConfigured } = options;

  if (distanceSortOn && coords) {
    return sortStationsByDistance(matches, coords);
  }

  if (distanceSortOn) {
    return matches;
  }

  if (votesConfigured && globalRatings) {
    return sortStationsByCommunityUpvotes(matches, globalRatings);
  }

  return matches;
}

export function sortStationsByCommunityUpvotes(
  items: Station[],
  ratings: GlobalRatings,
): Station[] {
  const hasAnyUpvotes = Object.values(ratings).some((r) => r.up > 0);
  if (!hasAnyUpvotes) return items;

  return [...items]
    .map((station, index) => {
      const counts = ratings[station.name] ?? { up: 0, down: 0 };
      return { station, index, up: counts.up, net: counts.up - counts.down };
    })
    .sort((a, b) => {
      const aRanked = a.up > 0;
      const bRanked = b.up > 0;
      if (aRanked && bRanked) {
        return b.up - a.up || b.net - a.net || a.index - b.index;
      }
      if (aRanked !== bRanked) return aRanked ? -1 : 1;
      return a.index - b.index;
    })
    .map(({ station }) => station);
}
