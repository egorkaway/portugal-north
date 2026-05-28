const STORAGE_KEY = "pn_planned_departures_v1";

type PlannedMap = Record<string, string[]>;

function readMap(): PlannedMap {
  if (typeof localStorage === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return {};
    return parsed as PlannedMap;
  } catch {
    return {};
  }
}

function writeMap(map: PlannedMap): void {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    // best-effort
  }
}

export function getPlannedDepartureIds(stationName: string): Set<string> {
  const map = readMap();
  return new Set(map[stationName] ?? []);
}

export function togglePlannedDepartureId(
  stationName: string,
  departureId: string,
): Set<string> {
  const map = readMap();
  const current = new Set(map[stationName] ?? []);
  if (current.has(departureId)) current.delete(departureId);
  else current.add(departureId);
  map[stationName] = [...current];
  writeMap(map);
  return current;
}

