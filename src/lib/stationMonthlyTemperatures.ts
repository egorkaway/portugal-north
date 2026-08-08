/** More than nine samples this month required before showing averages publicly. */
export const STATION_MONTHLY_TEMP_MIN_SAMPLES = 10;

export type StationMonthlyTemperatureEntry = {
  avgLowC: number;
  avgHighC: number;
  dayCount: number;
  sampleCount: number;
};

export type StationMonthlyTemperaturesManifest = {
  generatedAt: string;
  /** Europe/Lisbon calendar month these averages belong to (`YYYY-MM`). */
  yearMonth: string;
  stations: Record<string, StationMonthlyTemperatureEntry>;
};

const LISBON_TZ = "Europe/Lisbon";

export function lisbonYearMonth(date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: LISBON_TZ,
    year: "numeric",
    month: "2-digit",
  }).formatToParts(date);
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  return `${year}-${month}`;
}

/**
 * Client gate: hide stale published months (e.g. August JSON still live in September)
 * and sparse stations (≤9 samples).
 */
export function shouldDisplayStationMonthlyTemperature(
  manifest: StationMonthlyTemperaturesManifest | null | undefined,
  stationName: string,
  now = new Date(),
): boolean {
  if (!manifest?.yearMonth) return false;
  if (manifest.yearMonth !== lisbonYearMonth(now)) return false;
  const entry = manifest.stations[stationName];
  if (!entry) return false;
  return entry.sampleCount >= STATION_MONTHLY_TEMP_MIN_SAMPLES;
}

export async function fetchStationMonthlyTemperatures(): Promise<StationMonthlyTemperaturesManifest> {
  const res = await fetch("/data/station-monthly-temperatures.json", { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`station-monthly-temperatures.json returned ${res.status}`);
  }
  const body = (await res.json()) as StationMonthlyTemperaturesManifest;
  if (!body || typeof body.yearMonth !== "string" || !body.stations) {
    throw new Error("station-monthly-temperatures.json is missing stations");
  }
  return body;
}
