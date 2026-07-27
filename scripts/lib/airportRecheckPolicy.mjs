/** Skip airport destination re-sampling when departure stats ran this recently. */
export const AIRPORT_RECHECK_MIN_INTERVAL_MS = 3 * 60 * 60 * 1000;

/**
 * Airport connection sampling is expensive; on frequent train-stat runs, skip it.
 * @param {string | null | undefined} lastRunAt
 * @param {Date} [now]
 */
export function shouldRecheckAirportDestinations(lastRunAt, now = new Date()) {
  if (!lastRunAt) return true;
  const then = Date.parse(lastRunAt);
  if (!Number.isFinite(then)) return true;
  return now.getTime() - then >= AIRPORT_RECHECK_MIN_INTERVAL_MS;
}
