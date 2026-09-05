/** Skip airport destination re-sampling when airport collection ran this recently. */
export const AIRPORT_RECHECK_MIN_INTERVAL_MS = 5 * 60 * 60 * 1000;

/**
 * Airport hub sampling and outbound flight-API maps are expensive; on frequent
 * train-stat runs, skip those unless the last *airport* check (not the last
 * train-stat run) is old enough.
 * Iberian-inbound external maps do not use flight APIs and are filled on every
 * departures run regardless of this interval.
 * @param {string | null | undefined} lastAirportConnectionsAt
 * @param {Date} [now]
 */
export function shouldRecheckAirportDestinations(lastAirportConnectionsAt, now = new Date()) {
  if (!lastAirportConnectionsAt) return true;
  const then = Date.parse(lastAirportConnectionsAt);
  if (!Number.isFinite(then)) return true;
  return now.getTime() - then >= AIRPORT_RECHECK_MIN_INTERVAL_MS;
}
