import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { AirportDepartureFlight, AirportMeta } from "./airportDepartureFlight.js";

/**
 * AeroDataBox via RapidAPI — free Basic plan (~600 units/mo, 1 req/s).
 * FIDS departures include arrival IATA; used as last-resort live fallback
 * when AirLabs / AviationStack quotas are exhausted.
 */
const API_HOST = "aerodatabox.p.rapidapi.com";
const API_BASE = `https://${API_HOST}`;

type AeroDataBoxAirportRef = {
  icao?: string | null;
  iata?: string | null;
  name?: string | null;
  countryCode?: string | null;
};

type AeroDataBoxFlight = {
  number?: string | null;
  callSign?: string | null;
  status?: string | null;
  isCargo?: boolean | null;
  departure?: {
    scheduledTime?: { utc?: string | null; local?: string | null } | null;
  } | null;
  arrival?: {
    airport?: AeroDataBoxAirportRef | null;
  } | null;
  airline?: {
    name?: string | null;
    iata?: string | null;
    icao?: string | null;
  } | null;
};

type AeroDataBoxFidsResponse = {
  departures?: AeroDataBoxFlight[] | null;
  message?: string;
};

type AeroDataBoxAirportResponse = {
  icao?: string | null;
  iata?: string | null;
  shortName?: string | null;
  fullName?: string | null;
  location?: { lat?: number | null; lon?: number | null } | null;
  country?: { code?: string | null; name?: string | null } | null;
  message?: string;
};

export function isAeroDataBoxQuotaError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return (
    /aerodatabox_(http_)?429|rate\s*limit|exceeded the rate limit/i.test(message) ||
    /quota|monthly|UNIT_LIMIT|exceeded.*plan|not subscribed/i.test(message)
  );
}

/** Monthly / plan unit exhaustion — stop this provider for the rest of the run. */
export function isAeroDataBoxMonthlyLimitError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return (
    /UNIT_LIMIT|monthly|quota.*(month|plan)|exceeded.*MONTHLY|you have exceeded your.*quota/i.test(
      message,
    ) || /not subscribed to this API/i.test(message)
  );
}

function getApiKey(): string {
  const key = process.env.AERODATABOX_RAPIDAPI_KEY?.trim();
  if (!key) {
    throw new Error("AERODATABOX_RAPIDAPI_KEY is not set");
  }
  return key;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchJson<T>(url: URL, { retries = 1 }: { retries?: number } = {}): Promise<T> {
  let attempt = 0;
  while (true) {
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        "x-rapidapi-host": API_HOST,
        "x-rapidapi-key": getApiKey(),
      },
      signal: AbortSignal.timeout(30_000),
    });

    const text = await res.text();
    let body: (T & { message?: string }) | null = null;
    if (text.trim()) {
      try {
        body = JSON.parse(text) as T & { message?: string };
      } catch {
        body = null;
      }
    }

    if (res.status === 429) {
      const message = body?.message || text || `aerodatabox_http_429`;
      // Free plan is 1 req/s — brief backoff, then retry once.
      if (retries > attempt && /rate limit per second/i.test(message)) {
        attempt += 1;
        await sleep(1100);
        continue;
      }
      throw new Error(message.startsWith("aerodatabox_") ? message : `aerodatabox_http_429: ${message}`);
    }

    if (!res.ok) {
      const message = body?.message || text.trim() || `aerodatabox_http_${res.status}`;
      throw new Error(message);
    }

    if (body?.message && !("departures" in (body as object)) && !("iata" in (body as object))) {
      throw new Error(body.message);
    }

    return (body ?? ({} as T)) as T;
  }
}

export function mapAeroDataBoxFlightToDeparture(
  flight: AeroDataBoxFlight,
  originIata: string,
): AirportDepartureFlight | null {
  const arrivalIata = flight.arrival?.airport?.iata?.trim().toUpperCase() || "";
  if (!arrivalIata || arrivalIata === originIata) return null;
  if (flight.isCargo) return null;

  const airlineIata = flight.airline?.iata?.trim() || null;
  const airlineName = flight.airline?.name?.trim() || airlineIata;
  const rawNumber = flight.number?.trim() || "";
  // "FR 7936" → number "7936", iata "FR7936"
  const digits = rawNumber.replace(/^[A-Z0-9]{2}\s*/i, "").trim() || rawNumber;
  const flightIata =
    airlineIata && digits ? `${airlineIata}${digits.replace(/\s+/g, "")}` : rawNumber || null;
  const scheduledUtc = flight.departure?.scheduledTime?.utc?.trim() || "";
  const flightDate = scheduledUtc ? scheduledUtc.slice(0, 10) : undefined;

  return {
    flight_date: flightDate,
    flight_status: flight.status?.trim() || undefined,
    departure: { iata: originIata },
    arrival: {
      iata: arrivalIata,
      airport: flight.arrival?.airport?.name?.trim() || null,
    },
    airline: {
      name: airlineName,
      iata: airlineIata,
    },
    flight: {
      number: digits || null,
      iata: flightIata,
    },
  };
}

export async function fetchDeparturesFromAirport(
  originIata: string,
  limit = 100,
): Promise<AirportDepartureFlight[]> {
  const code = originIata.trim().toUpperCase();
  const url = new URL(`${API_BASE}/flights/airports/iata/${encodeURIComponent(code)}`);
  // Relative window: last hour through next ~6 hours (defaults are similar).
  url.searchParams.set("offsetMinutes", "-60");
  url.searchParams.set("durationMinutes", "360");
  url.searchParams.set("withLeg", "true");
  url.searchParams.set("direction", "Departure");
  url.searchParams.set("withCancelled", "false");
  url.searchParams.set("withCodeshared", "true");
  url.searchParams.set("withCargo", "false");
  url.searchParams.set("withPrivate", "false");
  url.searchParams.set("withLocation", "false");

  const body = await fetchJson<AeroDataBoxFidsResponse>(url);
  const mapped: AirportDepartureFlight[] = [];
  for (const row of body.departures ?? []) {
    const departure = mapAeroDataBoxFlightToDeparture(row, code);
    if (departure) mapped.push(departure);
    if (mapped.length >= limit) break;
  }
  return mapped;
}

function coordinatesCachePath(): string {
  const here = dirname(fileURLToPath(import.meta.url));
  return join(here, "../../data/airport-iata-coordinates.json");
}

/** Prefer local OurAirports cache to save RapidAPI free-tier units. */
export async function fetchAirportByIata(iata: string): Promise<AirportMeta | null> {
  const code = iata.trim().toUpperCase();
  if (!code) return null;

  try {
    const cache = JSON.parse(readFileSync(coordinatesCachePath(), "utf8")) as Record<
      string,
      { name?: string; country?: string; lat?: number; lng?: number }
    >;
    const entry = cache[code];
    if (entry) {
      return {
        iata_code: code,
        airport_name: entry.name ?? code,
        country_name: entry.country ?? "",
        latitude: entry.lat,
        longitude: entry.lng,
      };
    }
  } catch {
    // fall through to API
  }

  const url = new URL(`${API_BASE}/airports/iata/${encodeURIComponent(code)}`);
  const body = await fetchJson<AeroDataBoxAirportResponse>(url);
  if (!body.iata && !body.icao) return null;
  return {
    iata_code: body.iata ?? code,
    airport_name: body.fullName ?? body.shortName ?? code,
    country_name: body.country?.name ?? body.country?.code ?? "",
    latitude: body.location?.lat,
    longitude: body.location?.lon,
  };
}
