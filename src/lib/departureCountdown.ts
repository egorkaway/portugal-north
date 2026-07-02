import { lisbonDateAndTime } from "@/lib/cpDeparturesParse";
import type { Translator } from "@/i18n";

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

/** Scheduled departure clock time after applying delay. */
export function getEffectiveDepartureClock(
  departureTime: string,
  delayMinutes: number | null,
): string | null {
  const depMinutes = parseClockToMinutes(departureTime);
  if (depMinutes === null) return null;
  return formatClockFromMinutes(depMinutes + (delayMinutes ?? 0));
}

/** Minutes since effective departure; null if the train has not departed yet. */
export function getMinutesSinceDeparture(
  departureTime: string,
  delayMinutes: number | null,
  now: Date = new Date(),
): number | null {
  const minutesUntil = getMinutesUntilDeparture(departureTime, delayMinutes, now);
  if (minutesUntil === null || minutesUntil > 0) return null;
  return -minutesUntil;
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

/** Minutes until departure (includes delay); null if time is unparseable. */
export function getMinutesUntilDeparture(
  departureTime: string,
  delayMinutes: number | null,
  now: Date = new Date(),
): number | null {
  const depMinutes = parseClockToMinutes(departureTime);
  if (depMinutes === null) return null;

  const effectiveDeparture = depMinutes + (delayMinutes ?? 0);
  const { time: nowTime } = lisbonDateAndTime(now);
  const nowMinutes = parseClockToMinutes(nowTime);
  if (nowMinutes === null) return null;

  return effectiveDeparture - nowMinutes;
}

/** Minutes until a scheduled clock time (includes delay); null if unparseable. */
export function getMinutesUntilTime(
  clockTime: string,
  delayMinutes: number | null,
  now: Date = new Date(),
): number | null {
  return getMinutesUntilDeparture(clockTime, delayMinutes, now);
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
