import type { AirportDepartureFlight, AirportMeta } from "./airportDepartureFlight.js";

type AirLabsSchedule = {
  airline_iata?: string | null;
  airline_icao?: string | null;
  flight_iata?: string | null;
  flight_number?: string | null;
  dep_iata?: string | null;
  arr_iata?: string | null;
  dep_time?: string | null;
  status?: string | null;
};

type AirLabsAirport = {
  name?: string | null;
  iata_code?: string | null;
  country_code?: string | null;
  lat?: number | null;
  lng?: number | null;
};

type AirLabsResponse<T> = {
  response?: T;
  error?: { code?: string; message?: string };
};

const API_BASE = "https://airlabs.co/api/v9";

const QUOTA_CODES = new Set([
  "month_limit_exceeded",
  "hour_limit_exceeded",
  "minute_limit_exceeded",
]);

export function isAirLabsQuotaError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  if (/month_limit_exceeded|hour_limit_exceeded|minute_limit_exceeded/i.test(message)) {
    return true;
  }
  return /monthly\s+(usage\s+)?limit|quota|rate\s*limit/i.test(message);
}

export function isAirLabsMonthlyLimitError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return /month_limit_exceeded|monthly\s+(usage\s+)?limit/i.test(message);
}

function getApiKey(): string {
  const key = process.env.AIRLABS_API_KEY?.trim();
  if (!key) {
    throw new Error("AIRLABS_API_KEY is not set");
  }
  return key;
}

async function fetchJson<T>(url: URL): Promise<T> {
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(30_000),
  });
  const body = (await res.json()) as AirLabsResponse<T> & { error?: { message?: string; code?: string } };
  if (!res.ok) {
    throw new Error(
      body.error?.message ??
        (body.error?.code ? `airlabs_${body.error.code}` : `airlabs_http_${res.status}`),
    );
  }
  if (body.error?.message || body.error?.code) {
    const code = body.error.code ?? "";
    const message = body.error.message ?? code;
    if (QUOTA_CODES.has(code)) {
      throw new Error(`${code}: ${message}`);
    }
    throw new Error(message || `airlabs_${code || "error"}`);
  }
  return body.response as T;
}

export function mapAirLabsScheduleToDeparture(schedule: AirLabsSchedule): AirportDepartureFlight {
  const airlineIata = schedule.airline_iata?.trim() || null;
  const flightNumber = schedule.flight_number?.trim() || null;
  const flightIata = schedule.flight_iata?.trim() || null;
  const depDate = schedule.dep_time?.trim()?.slice(0, 10) || undefined;

  return {
    flight_date: depDate,
    flight_status: schedule.status?.trim() || undefined,
    departure: {
      iata: schedule.dep_iata?.trim() || null,
    },
    arrival: {
      iata: schedule.arr_iata?.trim() || null,
    },
    airline: {
      name: airlineIata,
      iata: airlineIata,
    },
    flight: {
      number: flightNumber,
      iata: flightIata,
    },
  };
}

export async function fetchDeparturesFromAirport(
  originIata: string,
  limit = 100,
): Promise<AirportDepartureFlight[]> {
  const url = new URL(`${API_BASE}/schedules`);
  url.searchParams.set("api_key", getApiKey());
  url.searchParams.set("dep_iata", originIata);
  // Free keys are capped at 50 by AirLabs; still request the caller's limit.
  url.searchParams.set("limit", String(Math.min(Math.max(limit, 1), 1000)));

  const schedules = await fetchJson<AirLabsSchedule[]>(url);
  return (schedules ?? []).map(mapAirLabsScheduleToDeparture);
}

export async function fetchAirportByIata(iata: string): Promise<AirportMeta | null> {
  const url = new URL(`${API_BASE}/airports`);
  url.searchParams.set("api_key", getApiKey());
  url.searchParams.set("iata_code", iata);

  const airports = await fetchJson<AirLabsAirport[]>(url);
  const airport = airports?.[0];
  if (!airport) return null;

  return {
    iata_code: airport.iata_code ?? iata,
    airport_name: airport.name ?? null,
    country_name: airport.country_code ?? null,
    latitude: airport.lat ?? null,
    longitude: airport.lng ?? null,
  };
}
