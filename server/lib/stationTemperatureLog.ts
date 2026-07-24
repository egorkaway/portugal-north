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
 * Callers should pass only stations that already have a successful departure sample.
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
