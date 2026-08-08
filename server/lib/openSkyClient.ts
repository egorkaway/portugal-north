import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { AirportDepartureFlight, AirportMeta } from "./airportDepartureFlight.js";
import { icaoToIata, iataToIcao } from "./airportIcaoMap.js";

/**
 * Anonymous OpenSky Network departures (no API key).
 * Short recent windows only; estArrivalAirport is often null until landing —
 * incomplete destination lists are expected. Prefer AviationStack / AirLabs when
 * quota remains. OpenSky ToS targets non-commercial research; used here only as
 * a last-resort bake fallback when paid quotas are exhausted.
 */
const API_BASE = "https://opensky-network.org/api";

/** Anonymous access rejects longer history; keep each query under ~2 hours. */
const WINDOW_SECONDS = 2 * 60 * 60;

type OpenSkyFlight = {
  icao24?: string;
  firstSeen?: number;
  lastSeen?: number;
  estDepartureAirport?: string | null;
  estArrivalAirport?: string | null;
  callsign?: string | null;
};

export function isOpenSkyQuotaError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return (
    /opensky_(http_)?429|rate\s*limit|credit/i.test(message) ||
    /cannot access historical flights/i.test(message)
  );
}

/** Treat rate / credit blocks as run-stopping exhaustion (no further paid fallback). */
export function isOpenSkyMonthlyLimitError(error: unknown): boolean {
  return isOpenSkyQuotaError(error);
}

function userAgent(): string {
  return "VeryStays-AirportConnections/1.0 (+https://www.verystays.com)";
}

async function fetchJson<T>(url: URL): Promise<T | null> {
  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": userAgent(),
    },
    signal: AbortSignal.timeout(30_000),
  });

  if (res.status === 404) {
    return null;
  }
  if (res.status === 429) {
    throw new Error("opensky_http_429: rate limit / credits exhausted");
  }
  if (!res.ok) {
    const text = (await res.text().catch(() => "")).trim();
    if (/cannot access historical flights/i.test(text)) {
      throw new Error(`opensky_http_${res.status}: cannot access historical flights`);
    }
    throw new Error(text || `opensky_http_${res.status}`);
  }

  const text = await res.text();
  if (!text.trim()) return null;
  return JSON.parse(text) as T;
}

export function mapOpenSkyFlightToDeparture(
  flight: OpenSkyFlight,
  originIata: string,
): AirportDepartureFlight | null {
  const arrivalIcao = flight.estArrivalAirport?.trim().toUpperCase() || "";
  const arrivalIata = arrivalIcao ? icaoToIata(arrivalIcao) : null;
  if (!arrivalIata || arrivalIata === originIata) return null;

  const callsign = flight.callsign?.trim() || "";
  const airlineToken = callsign.replace(/\d.*$/, "").trim() || null;
  const flightDate =
    typeof flight.firstSeen === "number"
      ? new Date(flight.firstSeen * 1000).toISOString().slice(0, 10)
      : undefined;

  return {
    flight_date: flightDate,
    flight_status: "unknown",
    departure: { iata: originIata },
    arrival: { iata: arrivalIata },
    airline: airlineToken ? { name: airlineToken, iata: null } : undefined,
    flight: callsign ? { number: callsign, iata: null } : undefined,
  };
}

export async function fetchDeparturesFromAirport(
  originIata: string,
  limit = 100,
): Promise<AirportDepartureFlight[]> {
  const icao = iataToIcao(originIata);
  if (!icao) {
    throw new Error(`opensky_unknown_iata:${originIata}`);
  }

  const end = Math.floor(Date.now() / 1000);
  const begin = end - WINDOW_SECONDS;
  const url = new URL(`${API_BASE}/flights/departure`);
  url.searchParams.set("airport", icao);
  url.searchParams.set("begin", String(begin));
  url.searchParams.set("end", String(end));

  const rows = (await fetchJson<OpenSkyFlight[]>(url)) ?? [];
  const mapped: AirportDepartureFlight[] = [];
  for (const row of rows) {
    const departure = mapOpenSkyFlightToDeparture(row, originIata.trim().toUpperCase());
    if (departure) mapped.push(departure);
    if (mapped.length >= limit) break;
  }
  return mapped;
}

function coordinatesCachePath(): string {
  const here = dirname(fileURLToPath(import.meta.url));
  return join(here, "../../data/airport-iata-coordinates.json");
}

/** Resolve airport meta from the local OurAirports-derived coordinate cache (no network). */
export async function fetchAirportByIata(iata: string): Promise<AirportMeta | null> {
  const code = iata.trim().toUpperCase();
  if (!code) return null;
  try {
    const cache = JSON.parse(readFileSync(coordinatesCachePath(), "utf8")) as Record<
      string,
      { name?: string; country?: string; lat?: number; lng?: number }
    >;
    const entry = cache[code];
    if (!entry) return null;
    return {
      iata_code: code,
      airport_name: entry.name ?? code,
      country_name: entry.country ?? "",
      latitude: entry.lat,
      longitude: entry.lng,
    };
  } catch {
    return null;
  }
}
