import type { ReliabilityScoresManifest } from '@/lib/stationData';

export type RankedReliabilityStation = {
  name: string;
  score: number;
};

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

export function reliabilityScoreColor(score: number): string {
  if (score >= 8) return '#059669';
  if (score >= 5) return '#D97706';
  return '#DC2626';
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
