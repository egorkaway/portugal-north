import {
  getTopDownvoted as rankTopDown,
  getTopUpvoted as rankTopUp,
} from "@/lib/rankVotes";
import type { GlobalRatings } from "@/lib/voteTypes";
import type { Station } from "@/data/stations";

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
