import type { GlobalRatings } from "@/lib/voteTypes";

export type RankedStation = {
  name: string;
  up: number;
  down: number;
};

export function getTopUpvoted(ratings: GlobalRatings, limit = 3): RankedStation[] {
  return Object.entries(ratings)
    .filter(([, counts]) => counts.up > 0)
    .sort(
      (a, b) =>
        b[1].up - a[1].up ||
        b[1].up - b[1].down - (a[1].up - a[1].down) ||
        a[0].localeCompare(b[0]),
    )
    .slice(0, limit)
    .map(([name, counts]) => ({ name, ...counts }));
}

export function getTopDownvoted(ratings: GlobalRatings, limit = 3): RankedStation[] {
  return Object.entries(ratings)
    .filter(([, counts]) => counts.down > 0)
    .sort(
      (a, b) =>
        b[1].down - a[1].down ||
        a[1].up - a[1].down - (b[1].up - b[1].down) ||
        a[0].localeCompare(b[0]),
    )
    .slice(0, limit)
    .map(([name, counts]) => ({ name, ...counts }));
}
