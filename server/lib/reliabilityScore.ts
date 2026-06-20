import type { DepartureStatsStore } from "./departureStats.js";

export type ReliabilityScoresManifest = {
  generatedAt: string;
  runCount: number;
  stationCount: number;
  scores: Record<string, number>;
};

export const RELIABILITY_SCORE_MIN = 1;
export const RELIABILITY_SCORE_MAX = 10;

/** Average delay minutes per train movement (departure or arrival). Lower is better. */
export function stationDelayRate(
  delayMinutes: number,
  departures: number,
  arrivals: number,
): number | null {
  const movements = departures + arrivals;
  if (movements <= 0) return null;
  return delayMinutes / movements;
}

export function scaleReliabilityScore(
  delayRate: number,
  minRate: number,
  maxRate: number,
): number {
  if (maxRate === minRate) return RELIABILITY_SCORE_MAX;
  const normalized = (delayRate - minRate) / (maxRate - minRate);
  const raw = RELIABILITY_SCORE_MAX - normalized * (RELIABILITY_SCORE_MAX - RELIABILITY_SCORE_MIN);
  return Math.max(
    RELIABILITY_SCORE_MIN,
    Math.min(RELIABILITY_SCORE_MAX, Math.round(raw)),
  );
}

export function computeReliabilityScores(
  store: DepartureStatsStore,
): Record<string, number> {
  const rates: { name: string; rate: number }[] = [];

  for (const [name, stats] of Object.entries(store.stations)) {
    if (stats.successfulSamples <= 0) continue;
    const rate = stationDelayRate(
      stats.totals.delayMinutes,
      stats.totals.departuresNextHour,
      stats.totals.arrivalsNextHour,
    );
    if (rate === null) continue;
    rates.push({ name, rate });
  }

  if (rates.length === 0) return {};
  if (rates.length === 1) return { [rates[0].name]: RELIABILITY_SCORE_MAX };

  const minRate = Math.min(...rates.map((entry) => entry.rate));
  const maxRate = Math.max(...rates.map((entry) => entry.rate));

  const scores: Record<string, number> = {};
  for (const { name, rate } of rates) {
    scores[name] = scaleReliabilityScore(rate, minRate, maxRate);
  }
  return scores;
}

export function buildReliabilityScoresManifest(
  store: DepartureStatsStore,
): ReliabilityScoresManifest {
  const scores = computeReliabilityScores(store);
  return {
    generatedAt: new Date().toISOString(),
    runCount: store.runCount,
    stationCount: Object.keys(scores).length,
    scores,
  };
}
