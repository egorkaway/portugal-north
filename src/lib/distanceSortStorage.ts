/** localStorage key for homepage "Sort by distance" preference. */
export const DISTANCE_SORT_STORAGE_KEY = "portugal-by-train-distance-sort";

/** Cached WGS84 fix used to sort immediately while Safari resolves GPS. */
export const LAST_COORDS_STORAGE_KEY = "portugal-by-train-last-coords";

const COORDS_MAX_AGE_MS = 30 * 60 * 1000;

export type StoredCoords = { lat: number; lng: number; at: number };

export function readDistanceSortEnabled(): boolean {
  if (typeof localStorage === "undefined") return false;
  return localStorage.getItem(DISTANCE_SORT_STORAGE_KEY) === "1";
}

export function writeDistanceSortEnabled(enabled: boolean): void {
  if (typeof localStorage === "undefined") return;
  if (enabled) {
    localStorage.setItem(DISTANCE_SORT_STORAGE_KEY, "1");
  } else {
    localStorage.removeItem(DISTANCE_SORT_STORAGE_KEY);
  }
}

export function readLastCoords(): StoredCoords | null {
  if (typeof localStorage === "undefined") return null;
  const raw = localStorage.getItem(LAST_COORDS_STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as StoredCoords;
    if (
      typeof parsed.lat !== "number" ||
      typeof parsed.lng !== "number" ||
      typeof parsed.at !== "number"
    ) {
      return null;
    }
    if (Date.now() - parsed.at > COORDS_MAX_AGE_MS) {
      localStorage.removeItem(LAST_COORDS_STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function writeLastCoords(coords: { lat: number; lng: number }): void {
  if (typeof localStorage === "undefined") return;
  const stored: StoredCoords = { ...coords, at: Date.now() };
  localStorage.setItem(LAST_COORDS_STORAGE_KEY, JSON.stringify(stored));
}

export function clearLastCoords(): void {
  if (typeof localStorage === "undefined") return;
  localStorage.removeItem(LAST_COORDS_STORAGE_KEY);
}
