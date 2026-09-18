import type { Station } from "@/data/stationTypes";
import { SPAIN_RELIABILITY_MIN_MOVEMENTS } from "@/lib/reliabilityScore";
import { stationHasAirportType } from "@/lib/airportTypes";
import { hasStationSummary } from "@/lib/stationSummary";

export type StationHighlightScoreSource = "pt" | "es";

export type StationHighlightScores = {
  portugalScores?: Record<string, number>;
  portugalMovements?: Record<string, number>;
  spainScores?: Record<string, number>;
  spainMovements?: Record<string, number>;
};

export function stationHighlightScore(
  station: Station,
  scores: StationHighlightScores = {},
): { score: number; movements: number; source: StationHighlightScoreSource } | null {
  if (station.country === "es") {
    const movements = scores.spainMovements?.[station.name] ?? 0;
    const score = scores.spainScores?.[station.name];
    if (score == null || movements < SPAIN_RELIABILITY_MIN_MOVEMENTS) return null;
    return { score, movements, source: "es" };
  }
  const score = scores.portugalScores?.[station.name];
  if (score == null) return null;
  return {
    score,
    movements: scores.portugalMovements?.[station.name] ?? 0,
    source: "pt",
  };
}

export function listStationHighlightCandidates(
  stations: Station[],
  scores: StationHighlightScores = {},
): Station[] {
  const withSummary = stations.filter(
    (station) =>
      !stationHasAirportType(station) &&
      (station.country === "pt" || station.country === "es") &&
      hasStationSummary(station.name),
  );
  const withScore = withSummary.filter((station) => stationHighlightScore(station, scores));
  return withScore.length > 0 ? withScore : withSummary;
}

/** Deterministic index for tests; production passes Math.random. */
export function pickRandomStationHighlight(
  stations: Station[],
  scores: StationHighlightScores = {},
  random: () => number = Math.random,
): Station | null {
  const candidates = listStationHighlightCandidates(stations, scores);
  if (!candidates.length) return null;
  const index = Math.floor(random() * candidates.length);
  return candidates[Math.min(index, candidates.length - 1)] ?? null;
}
