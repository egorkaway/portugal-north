import type { DepartureStatsStore } from "./departureStats.js";

export type ReliabilityScoresManifest = {
  generatedAt: string;
  runCount: number;
  stationCount: number;
  scores: Record<string, number>;
  /** Cumulative departures + arrivals in sampled windows (tiebreaker for rankings). */
  movements: Record<string, number>;
  /** Snapshot calendar period (Europe/Lisbon open date). Archive-only for now. */
  periodId?: string;
  periodStart?: string;
  periodEndExclusive?: string;
};

export const RELIABILITY_SCORE_MIN = 1;
export const RELIABILITY_SCORE_MAX = 10;

/** Higher traffic reduces the effective delay rate used for scoring (0 = off, ~0.27 = moderate). */
export const RELIABILITY_VOLUME_TOLERANCE_EXP = 0.27;

/**
 * Scale max uses the Nth-worst adjusted delay rate instead of the absolute max so one
 * outlier does not compress almost every station to 10.
 */
export const RELIABILITY_SCALE_WORST_RANK = 5;

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

function medianMovements(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1]! + sorted[mid]!) / 2
    : sorted[mid]!;
}

/**
 * Delay rate adjusted for station traffic: busy hubs tolerate more aggregate delay
 * before their score is penalised as harshly as a quiet stop with the same average.
 */
export function adjustedStationDelayRate(
  delayMinutes: number,
  departures: number,
  arrivals: number,
  referenceMovements: number,
): number | null {
  const rawRate = stationDelayRate(delayMinutes, departures, arrivals);
  if (rawRate === null || referenceMovements <= 0) return null;
  const movements = departures + arrivals;
  const volumeFactor = (referenceMovements / movements) ** RELIABILITY_VOLUME_TOLERANCE_EXP;
  return rawRate * volumeFactor;
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
    Math.min(RELIABILITY_SCORE_MAX, Math.round(raw * 10) / 10),
  );
}

export function computeReliabilityScores(
  store: DepartureStatsStore,
): Record<string, number> {
  const entries: { name: string; movements: number }[] = [];

  for (const [name, stats] of Object.entries(store.stations)) {
    if (stats.successfulSamples <= 0) continue;
    const movements =
      stats.totals.departuresNextHour + stats.totals.arrivalsNextHour;
    if (movements <= 0) continue;
    entries.push({ name, movements });
  }

  if (entries.length === 0) return {};
  if (entries.length === 1) return { [entries[0]!.name]: RELIABILITY_SCORE_MAX };

  const referenceMovements = medianMovements(entries.map((entry) => entry.movements));

  const rates: { name: string; rate: number }[] = [];
  for (const entry of entries) {
    const stats = store.stations[entry.name]!;
    const rate = adjustedStationDelayRate(
      stats.totals.delayMinutes,
      stats.totals.departuresNextHour,
      stats.totals.arrivalsNextHour,
      referenceMovements,
    );
    if (rate === null) continue;
    rates.push({ name: entry.name, rate });
  }

  if (rates.length === 0) return {};
  if (rates.length === 1) return { [rates[0]!.name]: RELIABILITY_SCORE_MAX };

  const sortedByRate = [...rates].sort((a, b) => b.rate - a.rate);
  const minRate = Math.min(...rates.map((entry) => entry.rate));
  const maxRate =
    sortedByRate.length > RELIABILITY_SCALE_WORST_RANK
      ? sortedByRate[RELIABILITY_SCALE_WORST_RANK - 1]!.rate
      : Math.max(...rates.map((entry) => entry.rate));

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
  const movements: Record<string, number> = {};

  for (const [name, stats] of Object.entries(store.stations)) {
    if (!(name in scores)) continue;
    movements[name] =
      stats.totals.departuresNextHour + stats.totals.arrivalsNextHour;
  }

  return {
    generatedAt: new Date().toISOString(),
    runCount: store.runCount,
    stationCount: Object.keys(scores).length,
    scores,
    movements,
  };
}
