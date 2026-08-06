/**
 * Session-only opt-out of homepage distance sort.
 * Cleared on process restart (cold start); not persisted to AsyncStorage.
 */
let sessionDistanceSortOptOut = false;

export function readDistanceSortSessionOptOut(): boolean {
  return sessionDistanceSortOptOut;
}

export function writeDistanceSortSessionOptOut(optedOut: boolean): void {
  sessionDistanceSortOptOut = optedOut;
}
