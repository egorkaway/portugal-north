import { allStations } from "../data/stationRegistry";
import type { Station } from "../data/stationTypes";
import type { CountryCode } from "./countries";
import { sortTrainTypes } from "./trainTypes";

/**
 * The `lines[]` field on stations is hand-maintained and has a few quirks:
 * some stations use a short alias for a line, and one entry uses a service
 * type ("Urban") where a line name should be. We normalize those here so the
 * line pages derive cleanly from the same station data used everywhere else.
 */
const LINE_ALIASES: Record<string, string> = {
  Minho: "Linha do Minho",
  Douro: "Linha do Douro",
  Braga: "Linha de Braga",
  "Linha do Sul (historic terminus)": "Linha do Sul",
};

/** Tokens that appear in `lines[]` but are not real line names. */
const NON_LINE_TOKENS = new Set(["Urban"]);

export type LineCategory = "rail" | "metro";

export interface TrainLine {
  /** Canonical display name, e.g. "Linha do Minho". */
  name: string;
  slug: string;
  category: LineCategory;
  /** Country most stations on the line belong to (for footer/grouping). */
  country: CountryCode;
  historic: boolean;
  /** Stations ordered in approximate geographic order along the line. */
  stations: Station[];
  /** All service types recorded across the line's stations, canonically sorted. */
  serviceTypes: string[];
}

export function lineToSlug(name: string): string {
  return name
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[()]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function normalizeLineName(raw: string): string | null {
  const trimmed = raw.trim();
  if (NON_LINE_TOKENS.has(trimmed)) return null;
  return LINE_ALIASES[trimmed] ?? trimmed;
}

function isAirportStation(station: Station): boolean {
  return station.types.includes("Airport");
}

function categoryFor(name: string): LineCategory {
  return /^metro\b/i.test(name) ? "metro" : "rail";
}

/**
 * Order stations along the dominant geographic axis of the line. We don't have
 * the official stopping sequence in static data, so this is a best-effort
 * approximation (and is surfaced as such in the UI copy).
 *
 * For predominantly north–south lines we list northern stations first (top of
 * the page) and southern stations last, matching how these lines read on a map.
 * For predominantly east–west lines we keep a west→east order.
 */
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
    // North-first for N–S lines (descending latitude); west→east for E–W lines.
    const primary = byLat ? b.lat - a.lat : a.lng - b.lng;
    if (Math.abs(primary) > 1e-9) return primary;
    return byLat ? a.lng - b.lng : b.lat - a.lat;
  });
}

function dominantCountry(stations: Station[]): CountryCode {
  const counts = new Map<CountryCode, number>();
  for (const station of stations) {
    counts.set(station.country, (counts.get(station.country) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0];
}

function buildTrainLines(): TrainLine[] {
  const groups = new Map<string, Station[]>();

  for (const station of allStations) {
    // Airport "lines" are IATA codes (LIS, OPO, MAD…); they are not rail lines.
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
    if (a.category !== b.category) return a.category === "rail" ? -1 : 1;
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

/** Lines shown on /lines and in sitemap: active rail with 2+ stations. */
export function isListedRailLine(line: TrainLine): boolean {
  return (
    line.category === "rail" &&
    !line.historic &&
    line.stations.length > 1
  );
}

export function getRailLines(): TrainLine[] {
  return getTrainLines().filter(isListedRailLine);
}

export function getMetroLines(): TrainLine[] {
  return getTrainLines().filter((line) => line.category === "metro");
}

export function getTrainLineBySlug(slug: string): TrainLine | undefined {
  if (!cachedBySlug) {
    cachedBySlug = new Map(getTrainLines().map((line) => [line.slug, line]));
  }
  return cachedBySlug.get(slug);
}

export function getLinePath(line: Pick<TrainLine, "slug">): string {
  return `/lines/${line.slug}`;
}

/** The lines (with their own page) a station belongs to, deduped by slug. */
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

/** Listed lines for a station (excludes metro, historic, and single-station lines). */
export function getListedLinesForStation(station: Station): TrainLine[] {
  return getLinesForStation(station).filter(isListedRailLine);
}

export type StationLineLink = {
  /** Canonical display name. */
  name: string;
  /** `/lines/...` when this line has its own page; otherwise null (show as plain text). */
  path: string | null;
};

/**
 * Station line names in data order, with paths only for listed rail line pages
 * (excludes metro, historic, and single-station lines).
 */
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
      path: line ? getLinePath(line) : null,
    });
  }

  return items;
}
