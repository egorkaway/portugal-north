import { lisbonDateAndTime } from "@/lib/cpDeparturesParse";
import type { Translator } from "@/i18n";

/** Clear active trip this long after scheduled departure (covers long journeys). */
export const MAX_TRIP_TRACKING_MINUTES = 18 * 60;

function parseClockToMinutes(time: string): number | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(time.trim());
  if (!match) return null;
  return Number(match[1]) * 60 + Number(match[2]);
}

function formatClockFromMinutes(totalMinutes: number): string {
  const normalized = ((totalMinutes % (24 * 60)) + 24 * 60) % (24 * 60);
  const hours = Math.floor(normalized / 60);
  const minutes = normalized % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
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

/** Scheduled departure clock time after applying delay. */
export function getEffectiveDepartureClock(
  departureTime: string,
  delayMinutes: number | null,
): string | null {
  const depMinutes = parseClockToMinutes(departureTime);
  if (depMinutes === null) return null;
  return formatClockFromMinutes(depMinutes + (delayMinutes ?? 0));
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

/** Minutes until a scheduled clock time (includes delay); null if unparseable. */
export function getMinutesUntilTime(
  clockTime: string,
  delayMinutes: number | null,
  now: Date = new Date(),
  timetableDate?: string | null,
): number | null {
  return getMinutesUntilDeparture(clockTime, delayMinutes, now, timetableDate);
}

/** Minutes since effective departure; null if the train has not departed yet. */
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

export function formatDepartureCountdown(
  minutesUntil: number,
  tr: Pick<Translator, "t">,
): string {
  if (minutesUntil <= 0) return tr.t("departures.leavingNow");
  if (minutesUntil < 60) {
    return tr.t("departures.leavesIn", { minutes: minutesUntil });
  }

  const hours = Math.floor(minutesUntil / 60);
  const minutes = minutesUntil % 60;
  if (minutes === 0) {
    return tr.t("departures.leavesInHoursOnly", { hours });
  }
  return tr.t("departures.leavesInHours", { hours, minutes });
}

export function formatArrivalCountdown(
  minutesUntil: number,
  tr: Pick<Translator, "t">,
): string {
  if (minutesUntil <= 0) return tr.t("trip.arrivingNow");
  if (minutesUntil < 60) {
    return tr.t("trip.arrivesIn", { minutes: minutesUntil });
  }

  const hours = Math.floor(minutesUntil / 60);
  const minutes = minutesUntil % 60;
  if (minutes === 0) {
    return tr.t("trip.arrivesInHoursOnly", { hours });
  }
  return tr.t("trip.arrivesInHours", { hours, minutes });
}

export function formatDepartureTimeAgo(
  minutesAgo: number,
  tr: Pick<Translator, "t">,
): string {
  if (minutesAgo < 60) {
    return tr.t("trip.minutesAgo", { minutes: minutesAgo });
  }

  const hours = Math.floor(minutesAgo / 60);
  const minutes = minutesAgo % 60;
  if (minutes === 0) {
    return tr.t("trip.minutesAgoHoursOnly", { hours });
  }
  return tr.t("trip.minutesAgoHours", { hours, minutes });
}
