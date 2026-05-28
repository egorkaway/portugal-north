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
  // Backwards-compatible: older clients may have stored multiple ids.
  // New behavior is single-select (0 or 1 id).
  const ids = map[stationName] ?? [];
  const first = typeof ids[0] === "string" ? ids[0] : undefined;
  return first ? new Set([first]) : new Set();
}

export function togglePlannedDepartureId(
  stationName: string,
  departureId: string,
): Set<string> {
  const map = readMap();
  const current = map[stationName] ?? [];
  const selected = typeof current[0] === "string" ? current[0] : null;

  // Single-select: selecting a different train replaces the old one.
  // Tapping the selected train clears it.
  map[stationName] = selected === departureId ? [] : [departureId];
  writeMap(map);
  return new Set(map[stationName]);
}

