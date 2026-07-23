import { sortTrainTypes } from '@/constants/theme';
import { allStations, stationToSlug, type CountryCode, type Station } from '@/lib/stationData';

/**
 * The `lines[]` field on stations is hand-maintained and has a few quirks.
 * Keep in sync with `src/lib/trainLines.ts`.
 */
const LINE_ALIASES: Record<string, string> = {
  Minho: 'Linha do Minho',
  Douro: 'Linha do Douro',
  Braga: 'Linha de Braga',
  'Linha do Sul (historic terminus)': 'Linha do Sul',
};

const NON_LINE_TOKENS = new Set(['Urban']);

export type LineCategory = 'rail' | 'metro';

export type TrainLine = {
  name: string;
  slug: string;
  category: LineCategory;
  country: CountryCode;
  historic: boolean;
  stations: Station[];
  serviceTypes: string[];
};

export type StationLineLink = {
  name: string;
  slug: string | null;
};

export function lineToSlug(name: string): string {
  return name
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[()]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function normalizeLineName(raw: string): string | null {
  const trimmed = raw.trim();
  if (NON_LINE_TOKENS.has(trimmed)) return null;
  return LINE_ALIASES[trimmed] ?? trimmed;
}

function isAirportStation(station: Station): boolean {
  return (
    station.types.includes('Airport') || station.types.includes('Airport Destination')
  );
}

function categoryFor(name: string): LineCategory {
  return /^metro\b/i.test(name) ? 'metro' : 'rail';
}

function orderStationsAlongLine(stations: Station[]): Station[] {
  if (stations.length <= 2) return [...stations];
  const lats = stations.map((s) => s.lat);
  const lngs = stations.map((s) => s.lng);
  const meanLat = lats.reduce((sum, v) => sum + v, 0) / lats.length;
  const spanLat = Math.max(...lats) - Math.min(...lats);
  const spanLng =
    (Math.max(...lngs) - Math.min(...lngs)) * Math.cos((meanLat * Math.PI) / 180);
  const byLat = spanLat >= spanLng;
  return [...stations].sort((a, b) => {
    const primary = byLat ? b.lat - a.lat : a.lng - b.lng;
    if (Math.abs(primary) > 1e-9) return primary;
    return byLat ? a.lng - b.lng : b.lat - a.lat;
  });
}

function dominantCountry(stations: Station[]): CountryCode {
  const counts = new Map<CountryCode, number>();
  for (const station of stations) {
    if (station.country !== 'pt' && station.country !== 'es') continue;
    counts.set(station.country, (counts.get(station.country) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'pt';
}

function buildTrainLines(): TrainLine[] {
  const groups = new Map<string, Station[]>();

  for (const station of allStations) {
    if (isAirportStation(station)) continue;
    const seen = new Set<string>();
    for (const raw of station.lines) {
      const name = normalizeLineName(raw);
      if (!name || seen.has(name)) continue;
      seen.add(name);
      const list = groups.get(name);
      if (list) list.push(station);
      else groups.set(name, [station]);
    }
  }

  const lines: TrainLine[] = [];
  for (const [name, stationList] of groups) {
    if (stationList.every(isAirportStation)) continue;
    const typeSet = new Set<string>();
    for (const station of stationList) {
      for (const type of station.types) typeSet.add(type);
    }
    lines.push({
      name,
      slug: lineToSlug(name),
      category: categoryFor(name),
      country: dominantCountry(stationList),
      historic: /historic/i.test(name),
      stations: orderStationsAlongLine(stationList),
      serviceTypes: sortTrainTypes([...typeSet]),
    });
  }

  lines.sort((a, b) => {
    if (a.category !== b.category) return a.category === 'rail' ? -1 : 1;
    if (b.stations.length !== a.stations.length) {
      return b.stations.length - a.stations.length;
    }
    return a.name.localeCompare(b.name);
  });

  return lines;
}

let cachedLines: TrainLine[] | null = null;
let cachedBySlug: Map<string, TrainLine> | null = null;

export function getTrainLines(): TrainLine[] {
  if (!cachedLines) cachedLines = buildTrainLines();
  return cachedLines;
}

export function isListedRailLine(line: TrainLine): boolean {
  return line.category === 'rail' && !line.historic && line.stations.length > 1;
}

export function getRailLines(): TrainLine[] {
  return getTrainLines().filter(isListedRailLine);
}

export function getTrainLineBySlug(slug: string): TrainLine | undefined {
  if (!cachedBySlug) {
    cachedBySlug = new Map(getTrainLines().map((line) => [line.slug, line]));
  }
  return cachedBySlug.get(slug);
}

export function getLinesForStation(station: Station): TrainLine[] {
  const seen = new Set<string>();
  const result: TrainLine[] = [];
  for (const raw of station.lines) {
    const name = normalizeLineName(raw);
    if (!name) continue;
    const line = getTrainLineBySlug(lineToSlug(name));
    if (line && !seen.has(line.slug)) {
      seen.add(line.slug);
      result.push(line);
    }
  }
  return result;
}

export function getListedLinesForStation(station: Station): TrainLine[] {
  return getLinesForStation(station).filter(isListedRailLine);
}

/** Line names for a station, with slugs only for listed rail line pages. */
export function getStationLineLinks(station: Station): StationLineLink[] {
  const listed = new Map(
    getListedLinesForStation(station).map((line) => [line.slug, line]),
  );
  const items: StationLineLink[] = [];
  const seen = new Set<string>();

  for (const raw of station.lines) {
    const name = normalizeLineName(raw);
    if (!name || seen.has(name)) continue;
    seen.add(name);
    const slug = lineToSlug(name);
    const line = listed.get(slug);
    items.push({
      name: line?.name ?? name,
      slug: line?.slug ?? null,
    });
  }

  return items;
}

export function getStationPathFromName(name: string): string {
  return `/station/${stationToSlug(name)}`;
}
