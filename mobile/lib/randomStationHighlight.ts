import type { Station } from '@/lib/stationData';
import { SPAIN_RELIABILITY_MIN_MOVEMENTS } from '@/lib/reliabilityScore';

export type StationHighlightCountry = 'pt' | 'es';

export type StationHighlightScores = {
  portugalScores?: Record<string, number>;
  portugalMovements?: Record<string, number>;
  spainScores?: Record<string, number>;
  spainMovements?: Record<string, number>;
};

function isAirportStation(station: Station): boolean {
  return station.types.some(
    (type) => type === 'Airport' || type === 'Airport Destination',
  );
}

export function stationHighlightScore(
  station: Station,
  scores: StationHighlightScores = {},
): { score: number; movements: number; source: StationHighlightCountry } | null {
  if (station.country === 'es') {
    const movements = scores.spainMovements?.[station.name] ?? 0;
    const score = scores.spainScores?.[station.name];
    if (score == null || movements < SPAIN_RELIABILITY_MIN_MOVEMENTS) return null;
    return { score, movements, source: 'es' };
  }
  const score = scores.portugalScores?.[station.name];
  if (score == null) return null;
  return {
    score,
    movements: scores.portugalMovements?.[station.name] ?? 0,
    source: 'pt',
  };
}

export function listStationHighlightCandidates(
  stations: Station[],
  scores: StationHighlightScores = {},
  country?: StationHighlightCountry,
  hasSummary: (name: string) => boolean = () => true,
): Station[] {
  const withSummary = stations.filter((station) => {
    if (isAirportStation(station)) return false;
    if (country) {
      if (station.country !== country) return false;
    } else if (station.country !== 'pt' && station.country !== 'es') {
      return false;
    }
    return hasSummary(station.name);
  });
  const withScore = withSummary.filter((station) => stationHighlightScore(station, scores));
  return withScore.length > 0 ? withScore : withSummary;
}

export function pickRandomStationHighlight(
  stations: Station[],
  scores: StationHighlightScores = {},
  random: () => number = Math.random,
  country?: StationHighlightCountry,
  hasSummary: (name: string) => boolean = () => true,
): Station | null {
  const candidates = listStationHighlightCandidates(stations, scores, country, hasSummary);
  if (!candidates.length) return null;
  const index = Math.floor(random() * candidates.length);
  return candidates[Math.min(index, candidates.length - 1)] ?? null;
}

/** Map ticket-guide country labels (localized) to Iberian codes. */
export function ticketGuideCountryCode(
  countryLabel: string,
  index: number,
): StationHighlightCountry {
  const folded = countryLabel
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase();
  if (folded.startsWith('portug')) return 'pt';
  if (folded.startsWith('esp') || folded.startsWith('spain')) return 'es';
  return index === 0 ? 'pt' : 'es';
}
