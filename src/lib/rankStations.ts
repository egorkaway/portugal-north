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

export type StationRankingRow = {
  rank: number;
  name: string;
  up: number;
  down: number;
  net: number;
};

export function getTopUpvoted(ratings: GlobalRatings, limit = 3): RankedStation[] {
  return rankTopUp(ratings, limit).map(({ id, up, down }) => ({ name: id, up, down }));
}

export function getTopDownvoted(ratings: GlobalRatings, limit = 3): RankedStation[] {
  return rankTopDown(ratings, limit).map(({ id, up, down }) => ({ name: id, up, down }));
}

/** All stations with votes, ranked by upvotes then net score (matches leaderboard sort). */
export function buildStationRankingRows(ratings: GlobalRatings): StationRankingRow[] {
  return Object.entries(ratings)
    .filter(([, counts]) => counts.up > 0 || counts.down > 0)
    .sort(
      ([nameA, a], [nameB, b]) =>
        b.up - a.up ||
        b.up - b.down - (a.up - a.down) ||
        nameA.localeCompare(nameB),
    )
    .map(([name, counts], index) => ({
      rank: index + 1,
      name,
      up: counts.up,
      down: counts.down,
      net: counts.up - counts.down,
    }));
}

function escapeCsvField(value: string | number): string {
  const text = String(value);
  if (/[",\n\r]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

export function stationRankingsToCsv(rows: StationRankingRow[]): string {
  const lines = ["rank,station,upvotes,downvotes,net"];
  for (const row of rows) {
    lines.push(
      [row.rank, escapeCsvField(row.name), row.up, row.down, row.net].join(","),
    );
  }
  return `${lines.join("\n")}\n`;
}

export function downloadStationRankingsCsv(
  rows: StationRankingRow[],
  filename = "station-rankings.csv",
): void {
  const blob = new Blob([stationRankingsToCsv(rows)], {
    type: "text/csv;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
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

/**
 * Home grid ordering: distance when enabled + located; otherwise community upvotes when available.
 * While distance sort is on but coords are not ready yet, keep filter order (no community bump).
 */
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
