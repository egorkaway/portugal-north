import { appendFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import {
  fetchCurrentTemperaturesBatched,
  OPEN_METEO_BATCH_SIZE,
} from "./openMeteoClient.js";

export type StationTemperatureReading = {
  /** When this process wrote the reading (ISO). */
  recordedAt: string;
  /** Open-Meteo observation time (UTC, ISO-like). */
  observedAt: string;
  station: string;
  country?: string;
  lat: number;
  lng: number;
  tempC: number;
  source: "open-meteo";
};

export type StationTemperatureCollectResult = {
  ok: number;
  failed: number;
  path: string;
  recordedAt: string;
};

export type StationMonthlyTemperatureAverage = {
  station: string;
  /** Calendar month in Europe/Lisbon, `YYYY-MM`. */
  yearMonth: string;
  avgLowC: number;
  avgHighC: number;
  /** Distinct Lisbon calendar days with at least one sample. */
  dayCount: number;
  sampleCount: number;
};

const LISBON_TZ = "Europe/Lisbon";

/** Lisbon calendar `YYYY-MM-DD` / `YYYY-MM` from an Open-Meteo / ISO timestamp. */
export function lisbonCalendarParts(isoLike: string): { yearMonth: string; day: string } | null {
  const raw = isoLike.trim();
  if (!raw) return null;
  const parsed = new Date(/Z$|[+-]\d{2}:\d{2}$/.test(raw) ? raw : `${raw}Z`);
  if (Number.isNaN(parsed.getTime())) return null;
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: LISBON_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(parsed);
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;
  if (!year || !month || !day) return null;
  return { yearMonth: `${year}-${month}`, day: `${year}-${month}-${day}` };
}

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
 * Per station: mean of daily minima / daily maxima within `yearMonth` (Lisbon).
 * Sparse ops snapshots — not true meteorological daily extremes.
 */
export function computeStationMonthlyTemperatureAverages(options: {
  readings: StationTemperatureReading[];
  yearMonth: string;
  /** When set, only these station names (e.g. active train-sample stations). */
  stationNames?: Iterable<string>;
}): StationMonthlyTemperatureAverage[] {
  const yearMonth = options.yearMonth.trim();
  const allow =
    options.stationNames == null
      ? null
      : new Set([...options.stationNames].map((name) => name.trim()).filter(Boolean));

  /** station → day → temps */
  const byStationDay = new Map<string, Map<string, number[]>>();

  for (const reading of options.readings) {
    if (allow && !allow.has(reading.station)) continue;
    if (!Number.isFinite(reading.tempC)) continue;
    const parts = lisbonCalendarParts(reading.observedAt || reading.recordedAt);
    if (!parts || parts.yearMonth !== yearMonth) continue;

    let days = byStationDay.get(reading.station);
    if (!days) {
      days = new Map();
      byStationDay.set(reading.station, days);
    }
    const bucket = days.get(parts.day);
    if (bucket) bucket.push(reading.tempC);
    else days.set(parts.day, [reading.tempC]);
  }

  const rows: StationMonthlyTemperatureAverage[] = [];
  for (const [station, days] of byStationDay) {
    if (!days.size) continue;
    const dailyLows: number[] = [];
    const dailyHighs: number[] = [];
    let sampleCount = 0;
    for (const temps of days.values()) {
      sampleCount += temps.length;
      dailyLows.push(Math.min(...temps));
      dailyHighs.push(Math.max(...temps));
    }
    const avgLowC =
      Math.round((dailyLows.reduce((sum, value) => sum + value, 0) / dailyLows.length) * 10) / 10;
    const avgHighC =
      Math.round((dailyHighs.reduce((sum, value) => sum + value, 0) / dailyHighs.length) * 10) / 10;
    rows.push({
      station,
      yearMonth,
      avgLowC,
      avgHighC,
      dayCount: days.size,
      sampleCount,
    });
  }

  rows.sort((a, b) => a.station.localeCompare(b.station, "en"));
  return rows;
}

export function formatStationMonthlyTemperatureOkSuffix(
  average: StationMonthlyTemperatureAverage,
): string {
  return (
    `this month average low ${average.avgLowC}°C / high ${average.avgHighC}°C` +
    ` (${average.dayCount} day(s), ${average.sampleCount} sample(s))`
  );
}

export function formatStationMonthlyTemperatureLogLines(
  averages: StationMonthlyTemperatureAverage[],
): string[] {
  if (!averages.length) return [];
  const yearMonth = averages[0]?.yearMonth ?? "";
  const [year, month] = yearMonth.split("-");
  const monthLabel =
    year && month
      ? new Date(Date.UTC(Number(year), Number(month) - 1, 1)).toLocaleString("en", {
          month: "long",
          year: "numeric",
          timeZone: "UTC",
        })
      : yearMonth;

  const lines = [
    `${monthLabel} temperature averages (${averages.length} station(s) with samples; daily min/max from Open-Meteo snapshots):`,
  ];
  for (const row of averages) {
    lines.push(`  ${row.station}: ${formatStationMonthlyTemperatureOkSuffix(row)}`);
  }
  return lines;
}

/** Public web threshold: more than nine samples this month. */
export const STATION_MONTHLY_TEMP_MIN_SAMPLES = 10;

export type StationMonthlyTemperaturesManifest = {
  generatedAt: string;
  yearMonth: string;
  stations: Record<
    string,
    {
      avgLowC: number;
      avgHighC: number;
      dayCount: number;
      sampleCount: number;
    }
  >;
};

export function buildStationMonthlyTemperaturesManifest(options: {
  readings: StationTemperatureReading[];
  yearMonth: string;
  stationNames?: Iterable<string>;
  generatedAt?: string;
  minSamples?: number;
}): StationMonthlyTemperaturesManifest {
  const minSamples = options.minSamples ?? STATION_MONTHLY_TEMP_MIN_SAMPLES;
  const averages = computeStationMonthlyTemperatureAverages({
    readings: options.readings,
    yearMonth: options.yearMonth,
    stationNames: options.stationNames,
  });
  const stations: StationMonthlyTemperaturesManifest["stations"] = {};
  for (const row of averages) {
    if (row.sampleCount < minSamples) continue;
    stations[row.station] = {
      avgLowC: row.avgLowC,
      avgHighC: row.avgHighC,
      dayCount: row.dayCount,
      sampleCount: row.sampleCount,
    };
  }
  return {
    generatedAt: options.generatedAt ?? new Date().toISOString(),
    yearMonth: options.yearMonth,
    stations,
  };
}

export function writeStationMonthlyTemperaturesManifest(
  outPath: string,
  manifest: StationMonthlyTemperaturesManifest,
): void {
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
}

type StationLike = {
  name: string;
  lat: number;
  lng: number;
  country?: string;
};

/**
 * Append one NDJSON line per station reading.
 * Internal ops log only — not published to the website or mobile app.
 */
export function appendStationTemperatureReadings(
  logPath: string,
  readings: StationTemperatureReading[],
): void {
  if (!readings.length) return;
  mkdirSync(dirname(logPath), { recursive: true });
  const chunk = `${readings.map((reading) => JSON.stringify(reading)).join("\n")}\n`;
  appendFileSync(logPath, chunk, "utf8");
}

export function readStationTemperatureLog(logPath: string): StationTemperatureReading[] {
  try {
    const text = readFileSync(logPath, "utf8");
    return text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => JSON.parse(line) as StationTemperatureReading);
  } catch {
    return [];
  }
}

/** Rewrite the log (tests / compaction). */
export function writeStationTemperatureLog(
  logPath: string,
  readings: StationTemperatureReading[],
): void {
  mkdirSync(dirname(logPath), { recursive: true });
  if (!readings.length) {
    writeFileSync(logPath, "", "utf8");
    return;
  }
  writeFileSync(
    logPath,
    `${readings.map((reading) => JSON.stringify(reading)).join("\n")}\n`,
    "utf8",
  );
}

/**
 * Fetch current temperatures for stations and append to the NDJSON log.
 * Used for train stations (after a timetable sample attempt) and Iberian airport hubs.
 * Matches readings back to stations by request order (Open-Meteo multi-point).
 */
export async function collectAndAppendStationTemperatures(options: {
  stations: StationLike[];
  logPath: string;
  batchSize?: number;
  delayMs?: number;
  now?: Date;
}): Promise<StationTemperatureCollectResult> {
  const recordedAt = (options.now ?? new Date()).toISOString();
  const stations = options.stations.filter(
    (station) => Number.isFinite(station.lat) && Number.isFinite(station.lng),
  );

  if (!stations.length) {
    return { ok: 0, failed: 0, path: options.logPath, recordedAt };
  }

  const points = stations.map((station) => ({ lat: station.lat, lng: station.lng }));
  let apiReadings: Awaited<ReturnType<typeof fetchCurrentTemperaturesBatched>> = [];
  try {
    apiReadings = await fetchCurrentTemperaturesBatched(points, {
      batchSize: options.batchSize ?? OPEN_METEO_BATCH_SIZE,
      delayMs: options.delayMs ?? 200,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`station_temperature_collect_failed: ${message}`);
  }

  const readings: StationTemperatureReading[] = [];
  const count = Math.min(stations.length, apiReadings.length);
  for (let i = 0; i < count; i += 1) {
    const station = stations[i];
    const sample = apiReadings[i];
    if (!sample || !Number.isFinite(sample.tempC)) continue;
    readings.push({
      recordedAt,
      observedAt: sample.observedAt,
      station: station.name,
      country: station.country,
      lat: station.lat,
      lng: station.lng,
      tempC: sample.tempC,
      source: "open-meteo",
    });
  }

  appendStationTemperatureReadings(options.logPath, readings);

  return {
    ok: readings.length,
    failed: stations.length - readings.length,
    path: options.logPath,
    recordedAt,
  };
}
