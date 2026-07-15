export type AviationStackFlight = {
  flight_date?: string;
  flight_status?: string;
  departure?: {
    iata?: string | null;
    airport?: string | null;
  };
  arrival?: {
    iata?: string | null;
    airport?: string | null;
  };
  airline?: {
    name?: string | null;
    iata?: string | null;
  };
  flight?: {
    number?: string | null;
    iata?: string | null;
  };
};

export type AviationStackAirport = {
  iata_code?: string | null;
  airport_name?: string | null;
  country_name?: string | null;
  latitude?: string | number | null;
  longitude?: string | number | null;
};

type AviationStackFlightsResponse = {
  data?: AviationStackFlight[];
  error?: { code?: string; message?: string };
};

type AviationStackAirportsResponse = {
  data?: AviationStackAirport[];
  error?: { code?: string; message?: string };
};

const API_BASE = "http://api.aviationstack.com/v1";

const MONTHLY_LIMIT_RE = /monthly\s+usage\s+limit/i;

export function isAviationStackMonthlyLimitError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return MONTHLY_LIMIT_RE.test(message);
}

function getApiKey(): string {
  const key = process.env.AVIATIONSTACK_API_KEY?.trim();
  if (!key) {
    throw new Error("AVIATIONSTACK_API_KEY is not set");
  }
  return key;
}

async function fetchJson<T>(url: URL): Promise<T> {
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(30_000),
  });
  const body = (await res.json()) as T & { error?: { message?: string } };
  if (!res.ok) {
    throw new Error(body.error?.message ?? `aviationstack_http_${res.status}`);
  }
  if (body.error?.message) {
    throw new Error(body.error.message);
  }
  return body;
}

export async function fetchDeparturesFromAirport(
  originIata: string,
  limit = 100,
): Promise<AviationStackFlight[]> {
  const url = new URL(`${API_BASE}/flights`);
  url.searchParams.set("access_key", getApiKey());
  url.searchParams.set("dep_iata", originIata);
  url.searchParams.set("limit", String(limit));

  const body = await fetchJson<AviationStackFlightsResponse>(url);
  return body.data ?? [];
}

export async function fetchAirportByIata(
  iata: string,
): Promise<AviationStackAirport | null> {
  const url = new URL(`${API_BASE}/airports`);
  url.searchParams.set("access_key", getApiKey());
  url.searchParams.set("iata_code", iata);

  const body = await fetchJson<AviationStackAirportsResponse>(url);
  return body.data?.[0] ?? null;
}
