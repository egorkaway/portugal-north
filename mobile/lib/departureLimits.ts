export const INITIAL_DEPARTURES_LIMIT = 3;
export const DEPARTURES_LOAD_MORE_STEP = 3;
export const MAX_DEPARTURES_LIMIT = 10;

export function clampDeparturesLimit(limit: number): number {
  if (!Number.isFinite(limit)) return INITIAL_DEPARTURES_LIMIT;
  return Math.min(MAX_DEPARTURES_LIMIT, Math.max(1, Math.round(limit)));
}

export function nextDeparturesLimit(current: number): number {
  return clampDeparturesLimit(current + DEPARTURES_LOAD_MORE_STEP);
}

/** True when CP may have more departures than currently shown. */
export function canLoadMoreDepartures(currentLimit: number, resultCount: number): boolean {
  return resultCount >= currentLimit && currentLimit < MAX_DEPARTURES_LIMIT;
}
