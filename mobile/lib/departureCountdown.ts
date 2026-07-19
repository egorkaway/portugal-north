import { lisbonDateAndTime } from "@/lib/lisbonTime";

/** Clear active trip this long after scheduled departure (covers long journeys). */
export const MAX_TRIP_TRACKING_MINUTES = 18 * 60;

function parseClockToMinutes(time: string): number | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(time.trim());
  if (!match) return null;
  return Number(match[1]) * 60 + Number(match[2]);
}

/** Calendar day difference `to - from` for YYYY-MM-DD (Lisbon civil dates). */
export function calendarDaysBetween(fromDate: string, toDate: string): number | null {
  const from = /^(\d{4})-(\d{2})-(\d{2})$/.exec(fromDate);
  const to = /^(\d{4})-(\d{2})-(\d{2})$/.exec(toDate);
  if (!from || !to) return null;
  const fromUtc = Date.UTC(Number(from[1]), Number(from[2]) - 1, Number(from[3]));
  const toUtc = Date.UTC(Number(to[1]), Number(to[2]) - 1, Number(to[3]));
  return Math.round((toUtc - fromUtc) / 86_400_000);
}

export function getEffectiveDepartureClock(
  departureTime: string,
  delayMinutes: number | null,
): string | null {
  const depMinutes = parseClockToMinutes(departureTime);
  if (depMinutes === null) return null;
  const total = depMinutes + (delayMinutes ?? 0);
  const normalized = ((total % (24 * 60)) + 24 * 60) % (24 * 60);
  const hours = Math.floor(normalized / 60);
  const minutes = normalized % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

/**
 * Minutes until departure (includes delay).
 * When `timetableDate` is set (YYYY-MM-DD), countdown is for that calendar day only —
 * it will not wrap to the same clock time on later days.
 */
export function getMinutesUntilDeparture(
  departureTime: string,
  delayMinutes: number | null,
  now: Date = new Date(),
  timetableDate?: string | null,
): number | null {
  const depMinutes = parseClockToMinutes(departureTime);
  if (depMinutes === null) return null;

  const effectiveDeparture = depMinutes + (delayMinutes ?? 0);
  const { date: today, time: nowTime } = lisbonDateAndTime(now);
  const nowMinutes = parseClockToMinutes(nowTime);
  if (nowMinutes === null) return null;

  if (!timetableDate) {
    return effectiveDeparture - nowMinutes;
  }

  const dayDiff = calendarDaysBetween(timetableDate, today);
  if (dayDiff === null) return effectiveDeparture - nowMinutes;

  const spillDays = Math.floor(effectiveDeparture / (24 * 60));
  const effectiveMinsOfDay = ((effectiveDeparture % (24 * 60)) + 24 * 60) % (24 * 60);
  return spillDays * 24 * 60 + effectiveMinsOfDay - (dayDiff * 24 * 60 + nowMinutes);
}

/** Absolute departure instant for native Live Activity timers. */
export function getDepartureTimestampMs(
  departureTime: string,
  delayMinutes: number | null,
  now: Date = new Date(),
  timetableDate?: string | null,
): number | null {
  const minutes = getMinutesUntilDeparture(departureTime, delayMinutes, now, timetableDate);
  if (minutes === null) return null;
  return now.getTime() + minutes * 60_000;
}

export function getMinutesUntilTime(
  clockTime: string,
  delayMinutes: number | null,
  now: Date = new Date(),
  timetableDate?: string | null,
): number | null {
  return getMinutesUntilDeparture(clockTime, delayMinutes, now, timetableDate);
}

export function getMinutesSinceDeparture(
  departureTime: string,
  delayMinutes: number | null,
  now: Date = new Date(),
  timetableDate?: string | null,
): number | null {
  const minutesUntil = getMinutesUntilDeparture(
    departureTime,
    delayMinutes,
    now,
    timetableDate,
  );
  if (minutesUntil === null || minutesUntil > 0) return null;
  return -minutesUntil;
}

/** True once effective departure (scheduled + delay) has been reached or passed. */
export function hasEffectiveDeparturePassed(
  departureTime: string,
  delayMinutes: number | null,
  now: Date = new Date(),
  timetableDate?: string | null,
): boolean {
  const minutesUntil = getMinutesUntilDeparture(
    departureTime,
    delayMinutes,
    now,
    timetableDate,
  );
  return minutesUntil !== null && minutesUntil <= 0;
}

/** True when this planned departure should no longer be tracked as active. */
export function isPlannedTripExpired(
  trip: { departureTime: string; delayMinutes: number | null; timetableDate?: string | null },
  now: Date = new Date(),
): boolean {
  const minutesUntil = getMinutesUntilDeparture(
    trip.departureTime,
    trip.delayMinutes,
    now,
    trip.timetableDate,
  );
  if (minutesUntil === null) return true;
  return minutesUntil < -MAX_TRIP_TRACKING_MINUTES;
}

const LEGACY_ACTIVE_TRIP_MAX_AGE_MS = 24 * 60 * 60 * 1000;

/**
 * Whether an active trip should be cleared on read.
 * Date-aware trips expire via `isPlannedTripExpired`.
 * Legacy trips (no date in id / missing timetableDate) also expire after 1 day of selectedAt.
 */
export function shouldClearActiveTrip(
  trip: {
    id?: string;
    departureTime: string;
    delayMinutes: number | null;
    timetableDate?: string | null;
    selectedAt?: string;
  },
  now: Date = new Date(),
): boolean {
  if (isPlannedTripExpired(trip, now)) return true;

  const segments = trip.id?.split("|") ?? [];
  const legacyId = segments.length < 5;
  const missingDate = !trip.timetableDate;
  if (!legacyId && !missingDate) return false;

  if (!trip.selectedAt) return false;
  const selectedMs = Date.parse(trip.selectedAt);
  if (Number.isNaN(selectedMs)) return false;
  return now.getTime() - selectedMs > LEGACY_ACTIVE_TRIP_MAX_AGE_MS;
}

type TranslateFn = (path: string, params?: Record<string, string | number>) => string;

export function formatDepartureCountdown(
  minutes: number,
  t?: TranslateFn,
): string {
  if (minutes <= 0) return t ? t('countdown.leavingNow') : 'Leaving now';
  if (minutes < 60) {
    return t
      ? t('countdown.leavesIn', { minutes })
      : `Leaves in ${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  if (remainder === 0) {
    return t ? t('countdown.leavesInHoursOnly', { hours }) : `Leaves in ${hours}h`;
  }
  return t
    ? t('countdown.leavesInHours', { hours, minutes: remainder })
    : `Leaves in ${hours}h ${remainder}m`;
}

/** Compact countdown for widgets, Live Activity, and Dynamic Island. */
export function formatWidgetCountdown(minutes: number): string {
  if (minutes <= 0) return 'Now';
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  if (remainder === 0) return `${hours}h`;
  return `${hours}h ${remainder}m`;
}

export function formatArrivalCountdown(
  minutes: number,
  t?: TranslateFn,
): string {
  if (minutes <= 0) return t ? t('countdown.arrivingNow') : 'Arriving now';
  if (minutes < 60) {
    return t
      ? t('countdown.arrivesIn', { minutes })
      : `Arrives in ${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  if (remainder === 0) {
    return t ? t('countdown.arrivesInHoursOnly', { hours }) : `Arrives in ${hours}h`;
  }
  return t
    ? t('countdown.arrivesInHours', { hours, minutes: remainder })
    : `Arrives in ${hours}h ${remainder}m`;
}

export function formatDepartureTimeAgo(
  minutesAgo: number,
  t?: TranslateFn,
): string {
  if (minutesAgo < 60) {
    return t
      ? t('countdown.minutesAgo', { minutes: minutesAgo })
      : `${minutesAgo} min ago`;
  }
  const hours = Math.floor(minutesAgo / 60);
  const minutes = minutesAgo % 60;
  if (minutes === 0) {
    return t ? t('countdown.minutesAgoHoursOnly', { hours }) : `${hours}h ago`;
  }
  return t
    ? t('countdown.minutesAgoHours', { hours, minutes })
    : `${hours}h ${minutes}m ago`;
}
