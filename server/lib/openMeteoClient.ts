export type OpenMeteoCurrentTemperature = {
  latitude: number;
  longitude: number;
  observedAt: string;
  tempC: number;
};

type OpenMeteoCurrentBlock = {
  time?: string;
  temperature_2m?: number;
};

type OpenMeteoForecastResponse = {
  latitude?: number;
  longitude?: number;
  current?: OpenMeteoCurrentBlock;
  error?: boolean;
  reason?: string;
};

const API_BASE = "https://api.open-meteo.com/v1/forecast";

/** Open-Meteo allows comma-separated coords; keep batches modest for fair use. */
export const OPEN_METEO_BATCH_SIZE = 50;

function asResponseList(
  body: OpenMeteoForecastResponse | OpenMeteoForecastResponse[],
): OpenMeteoForecastResponse[] {
  return Array.isArray(body) ? body : [body];
}

export function parseOpenMeteoCurrentTemperatures(
  body: OpenMeteoForecastResponse | OpenMeteoForecastResponse[],
): OpenMeteoCurrentTemperature[] {
  const readings: OpenMeteoCurrentTemperature[] = [];
  for (const entry of asResponseList(body)) {
    if (entry.error) {
      throw new Error(entry.reason ?? "open_meteo_error");
    }
    const tempC = entry.current?.temperature_2m;
    const observedAt = entry.current?.time;
    if (
      typeof tempC !== "number" ||
      !Number.isFinite(tempC) ||
      typeof observedAt !== "string" ||
      !observedAt
    ) {
      continue;
    }
    readings.push({
      latitude: Number(entry.latitude),
      longitude: Number(entry.longitude),
      observedAt,
      tempC,
    });
  }
  return readings;
}

/**
 * Fetch current 2 m temperatures for coordinate pairs (WGS84).
 * Returns readings in the same order as successful API cells (may be fewer if a cell is incomplete).
 */
export async function fetchCurrentTemperatures(
  points: { lat: number; lng: number }[],
): Promise<OpenMeteoCurrentTemperature[]> {
  if (!points.length) return [];

  const url = new URL(API_BASE);
  url.searchParams.set("latitude", points.map((p) => p.lat).join(","));
  url.searchParams.set("longitude", points.map((p) => p.lng).join(","));
  url.searchParams.set("current", "temperature_2m");
  url.searchParams.set("timezone", "UTC");

  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": "VeryStays-StationWeather/1.0 (+https://www.verystays.com)",
    },
    signal: AbortSignal.timeout(60_000),
  });
  const body = (await res.json()) as
    | OpenMeteoForecastResponse
    | OpenMeteoForecastResponse[];
  if (!res.ok) {
    const reason = Array.isArray(body)
      ? body[0]?.reason
      : (body as OpenMeteoForecastResponse).reason;
    throw new Error(reason ?? `open_meteo_http_${res.status}`);
  }
  return parseOpenMeteoCurrentTemperatures(body);
}

export async function fetchCurrentTemperaturesBatched(
  points: { lat: number; lng: number }[],
  options: { batchSize?: number; delayMs?: number } = {},
): Promise<OpenMeteoCurrentTemperature[]> {
  const batchSize = options.batchSize ?? OPEN_METEO_BATCH_SIZE;
  const delayMs = options.delayMs ?? 200;
  const out: OpenMeteoCurrentTemperature[] = [];

  for (let i = 0; i < points.length; i += batchSize) {
    const chunk = points.slice(i, i + batchSize);
    const readings = await fetchCurrentTemperatures(chunk);
    // Open-Meteo returns one cell per requested point (same order).
    if (readings.length === chunk.length) {
      out.push(...readings);
    } else {
      // Fall back to nearest-by-index when lengths diverge.
      for (let j = 0; j < Math.min(readings.length, chunk.length); j += 1) {
        out.push(readings[j]);
      }
    }
    if (delayMs > 0 && i + batchSize < points.length) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  return out;
}
