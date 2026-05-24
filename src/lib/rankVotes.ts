import type { GlobalRatings } from "@/lib/voteTypes";

export type RankedItem = {
  id: string;
  name: string;
  up: number;
  down: number;
};

export function getTopUpvoted(ratings: GlobalRatings, limit = 3): RankedItem[] {
  return Object.entries(ratings)
    .filter(([, counts]) => counts.up > 0)
    .sort(
      (a, b) =>
        b[1].up - a[1].up ||
        b[1].up - b[1].down - (a[1].up - a[1].down) ||
        a[0].localeCompare(b[0]),
    )
    .slice(0, limit)
    .map(([id, counts]) => ({ id, name: id, ...counts }));
}

export function getTopDownvoted(ratings: GlobalRatings, limit = 3): RankedItem[] {
  return Object.entries(ratings)
    .filter(([, counts]) => counts.down > 0)
    .sort(
      (a, b) =>
        b[1].down - a[1].down ||
        a[1].up - a[1].down - (b[1].up - b[1].down) ||
        a[0].localeCompare(b[0]),
    )
    .slice(0, limit)
    .map(([id, counts]) => ({ id, name: id, ...counts }));
}
