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

export function formatDepartureCountdown(minutes: number): string {
  if (minutes <= 0) return "Now";
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  if (remainder === 0) return `${hours}h`;
  return `${hours}h ${remainder}m`;
}
