export type ReliabilityScoresManifest = {
  generatedAt: string;
  runCount: number;
  stationCount: number;
  scores: Record<string, number>;
  movements: Record<string, number>;
};

export async function fetchReliabilityScores(): Promise<ReliabilityScoresManifest> {
  const res = await fetch("/data/reliability-scores.json", { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`reliability-scores.json returned ${res.status}`);
  }

  const data = (await res.json()) as Partial<ReliabilityScoresManifest>;
  if (!data.scores || typeof data.scores !== "object") {
    throw new Error("reliability-scores.json is missing scores");
  }

  return {
    generatedAt: typeof data.generatedAt === "string" ? data.generatedAt : "",
    runCount: typeof data.runCount === "number" ? data.runCount : 0,
    stationCount: typeof data.stationCount === "number" ? data.stationCount : 0,
    scores: data.scores,
    movements:
      data.movements && typeof data.movements === "object" ? data.movements : {},
  };
}

export function reliabilityScoreTone(score: number): string {
  if (score >= 8) return "text-emerald-600 dark:text-emerald-400";
  if (score >= 5) return "text-amber-600 dark:text-amber-400";
  return "text-destructive";
}

export function reliabilityScoreBarTone(score: number): string {
  if (score >= 8) return "bg-emerald-500";
  if (score >= 5) return "bg-amber-500";
  return "bg-destructive";
}

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
  scoreOrder: "asc" | "desc",
): number {
  const scoreDiff = scoreOrder === "desc" ? scoreB - scoreA : scoreA - scoreB;
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
      compareReliabilityRank(nameA, scoreA, nameB, scoreB, movements, "desc"),
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
      compareReliabilityRank(nameA, scoreA, nameB, scoreB, movements, "asc"),
    )
    .slice(0, limit)
    .map(([name, score]) => ({ name, score }));
}
