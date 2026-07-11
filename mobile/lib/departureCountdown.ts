import { lisbonDateAndTime } from "@/lib/lisbonTime";

function parseClockToMinutes(time: string): number | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(time.trim());
  if (!match) return null;
  return Number(match[1]) * 60 + Number(match[2]);
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

export function getMinutesUntilTime(
  clockTime: string,
  delayMinutes: number | null,
  now: Date = new Date(),
): number | null {
  return getMinutesUntilDeparture(clockTime, delayMinutes, now);
}

export function getMinutesSinceDeparture(
  departureTime: string,
  delayMinutes: number | null,
  now: Date = new Date(),
): number | null {
  const minutesUntil = getMinutesUntilDeparture(departureTime, delayMinutes, now);
  if (minutesUntil === null || minutesUntil > 0) return null;
  return -minutesUntil;
}

export function formatDepartureCountdown(minutes: number): string {
  if (minutes <= 0) return 'Leaving now';
  if (minutes < 60) return `Leaves in ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  if (remainder === 0) return `Leaves in ${hours}h`;
  return `Leaves in ${hours}h ${remainder}m`;
}

export function formatArrivalCountdown(minutes: number): string {
  if (minutes <= 0) return 'Arriving now';
  if (minutes < 60) return `Arrives in ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  if (remainder === 0) return `Arrives in ${hours}h`;
  return `Arrives in ${hours}h ${remainder}m`;
}

export function formatDepartureTimeAgo(minutesAgo: number): string {
  if (minutesAgo < 60) return `${minutesAgo} min ago`;
  const hours = Math.floor(minutesAgo / 60);
  const minutes = minutesAgo % 60;
  if (minutes === 0) return `${hours}h ago`;
  return `${hours}h ${minutes}m ago`;
}
