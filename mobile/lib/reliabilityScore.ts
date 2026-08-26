import type { ReliabilityScoresManifest } from '@/lib/stationData';

export type RankedReliabilityStation = {
  name: string;
  score: number;
};

export const SPAIN_RELIABILITY_RANKING_LIMIT = 5;
export const SPAIN_RELIABILITY_MIN_MOVEMENTS = 5;

function compareReliabilityRank(
  nameA: string,
  scoreA: number,
  nameB: string,
  scoreB: number,
  movements: Record<string, number>,
  scoreOrder: 'asc' | 'desc',
): number {
  const scoreDiff = scoreOrder === 'desc' ? scoreB - scoreA : scoreA - scoreB;
  if (scoreDiff !== 0) return scoreDiff;

  const movementDiff = (movements[nameB] ?? 0) - (movements[nameA] ?? 0);
  if (movementDiff !== 0) return movementDiff;

  return nameA.localeCompare(nameB);
}

export function getTopReliabilityStations(
  scores: Record<string, number>,
  movements: Record<string, number> = {},
  limit = 10,
): RankedReliabilityStation[] {
  return Object.entries(scores)
    .sort(([nameA, scoreA], [nameB, scoreB]) =>
      compareReliabilityRank(nameA, scoreA, nameB, scoreB, movements, 'desc'),
    )
    .slice(0, limit)
    .map(([name, score]) => ({ name, score }));
}

export function getBottomReliabilityStations(
  scores: Record<string, number>,
  movements: Record<string, number> = {},
  limit = 10,
): RankedReliabilityStation[] {
  return Object.entries(scores)
    .sort(([nameA, scoreA], [nameB, scoreB]) =>
      compareReliabilityRank(nameA, scoreA, nameB, scoreB, movements, 'asc'),
    )
    .slice(0, limit)
    .map(([name, score]) => ({ name, score }));
}

export function filterScoresByMinMovements(
  scores: Record<string, number>,
  movements: Record<string, number>,
  minMovements: number,
): Record<string, number> {
  const next: Record<string, number> = {};
  for (const [name, score] of Object.entries(scores)) {
    if ((movements[name] ?? 0) >= minMovements) next[name] = score;
  }
  return next;
}

export function buildSpainReliabilityRankings(
  scores: Record<string, number>,
  movements: Record<string, number> = {},
  limit = SPAIN_RELIABILITY_RANKING_LIMIT,
  minMovements = SPAIN_RELIABILITY_MIN_MOVEMENTS,
): { top: RankedReliabilityStation[]; bottom: RankedReliabilityStation[] } {
  const filtered = filterScoresByMinMovements(scores, movements, minMovements);
  return {
    top: getTopReliabilityStations(filtered, movements, limit),
    bottom: getBottomReliabilityStations(filtered, movements, limit),
  };
}

export function reliabilityScoreColor(score: number): string {
  if (score >= 8) return '#059669';
  if (score >= 5) return '#D97706';
  return '#DC2626';
}

/** Format a 0–10 reliability score with one decimal when needed (e.g. 9.1, 9, 10). */
export function formatReliabilityScore(score: number): string {
  const rounded = Math.round(score * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

export function getReliabilityForStation(
  manifest: ReliabilityScoresManifest,
  stationName: string,
): { score: number | null; movements: number } {
  return {
    score: manifest.scores[stationName] ?? null,
    movements: manifest.movements[stationName] ?? 0,
  };
}
