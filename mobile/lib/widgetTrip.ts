import type { CompletedTripRecord } from '@/lib/types';

export const STALE_LAST_TRIP_HOURS = 8;

export function isLastTripStale(lastTaken: CompletedTripRecord, now = new Date()): boolean {
  const completedAt = Date.parse(lastTaken.completedAt);
  if (Number.isNaN(completedAt)) return true;
  return now.getTime() - completedAt >= STALE_LAST_TRIP_HOURS * 60 * 60 * 1000;
}

export function formatWidgetCompactCountdown(countdownMinutes: number | null): string {
  if (countdownMinutes === null) return '';
  if (countdownMinutes <= 0) return 'Now';
  if (countdownMinutes < 60) return `${countdownMinutes} min`;
  const hours = Math.floor(countdownMinutes / 60);
  const remainder = countdownMinutes % 60;
  return remainder === 0 ? `${hours}h` : `${hours}h ${remainder}m`;
}
