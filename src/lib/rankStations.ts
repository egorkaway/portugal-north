import {
  getTopDownvoted as rankTopDown,
  getTopUpvoted as rankTopUp,
} from "@/lib/rankVotes";
import type { GlobalRatings } from "@/lib/voteTypes";

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
