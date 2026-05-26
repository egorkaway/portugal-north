/** localStorage key for per-browser visited station tracking (separate from vote cookies). */
export const STATION_VISITED_STORAGE_KEY = "portugal-by-train-station-visited";

export type VisitedMap = Record<string, true>;

export function readVisitedMap(): VisitedMap {
  if (typeof localStorage === "undefined") return {};
  try {
    const raw = localStorage.getItem(STATION_VISITED_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return {};
    const map: VisitedMap = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (value === true) map[key] = true;
    }
    return map;
  } catch {
    return {};
  }
}

export function writeVisitedMap(map: VisitedMap): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(STATION_VISITED_STORAGE_KEY, JSON.stringify(map));
}

export function isStationVisited(map: VisitedMap, stationName: string): boolean {
  return Boolean(map[stationName]);
}

/** Toggle visited; returns the new visited state. */
export function toggleStationVisited(
  map: VisitedMap,
  stationName: string,
): { next: VisitedMap; visited: boolean } {
  const next = { ...map };
  if (next[stationName]) {
    delete next[stationName];
    return { next, visited: false };
  }
  next[stationName] = true;
  return { next, visited: true };
}
