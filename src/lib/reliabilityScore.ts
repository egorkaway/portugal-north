export type ReliabilityScoresManifest = {
  generatedAt: string;
  runCount: number;
  stationCount: number;
  scores: Record<string, number>;
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

export function getTopReliabilityStations(
  scores: Record<string, number>,
  limit = 10,
): RankedReliabilityStation[] {
  return Object.entries(scores)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([name, score]) => ({ name, score }));
}

export function getBottomReliabilityStations(
  scores: Record<string, number>,
  limit = 10,
): RankedReliabilityStation[] {
  return Object.entries(scores)
    .sort((a, b) => a[1] - b[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([name, score]) => ({ name, score }));
}
