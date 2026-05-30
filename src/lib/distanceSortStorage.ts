/** localStorage key for homepage "Sort by distance" preference. */
export const DISTANCE_SORT_STORAGE_KEY = "portugal-by-train-distance-sort";

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
