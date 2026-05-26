import {
  getTopDownvoted as rankTopDown,
  getTopUpvoted as rankTopUp,
} from "@/lib/rankVotes";
import { distanceKm } from "@/lib/geo";
import type { GlobalRatings } from "@/lib/voteTypes";
import type { Station } from "@/data/stations";

export type DistanceOrigin = { lat: number; lng: number };

export type RankedStation = {
  name: string;
  up: number;
  down: number;
};

export function getTopUpvoted(ratings: GlobalRatings, limit = 3): RankedStation[] {
  return rankTopUp(ratings, limit).map(({ id, up, down }) => ({ name: id, up, down }));
}

export function getTopDownvoted(ratings: GlobalRatings, limit = 3): RankedStation[] {
  return rankTopDown(ratings, limit).map(({ id, up, down }) => ({ name: id, up, down }));
}

/** Nearest first from a WGS84 origin. Stable for ties (original list order, then name). */
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

/** Put community upvoted stations first (most upvotes, then best net score). Preserves list order for ties / no votes. */
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
