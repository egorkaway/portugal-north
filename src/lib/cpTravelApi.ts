export type CpStationRef = {
  code: string;
  designation: string;
};

export type CpTrainService = {
  code: string;
  designation: string;
};

export type CpStationStop = {
  trainNumber: number | string;
  departureTime?: string | null;
  arrivalTime?: string | null;
  etd?: string | null;
  eta?: string | null;
  delay?: number | null;
  platform?: string | null;
  trainOrigin: CpStationRef;
  trainDestination: CpStationRef;
  trainService: CpTrainService;
};

export type CpTimetableResponse = {
  stationStops?: CpStationStop[];
};

export type StationDeparture = {
  trainNumber: string;
  time: string;
  destination: string;
  serviceType: string;
  platform: string | null;
  delayMinutes: number | null;
};

const DEFAULT_BASE_URL = "https://api-gateway.cp.pt/cp/services/travel-api";

function getConfig() {
  return {
    baseUrl: (import.meta.env.VITE_CP_TRAVEL_API_URL as string | undefined) || DEFAULT_BASE_URL,
    apiKey: import.meta.env.VITE_CP_API_KEY as string | undefined,
    connectId: import.meta.env.VITE_CP_CONNECT_ID as string | undefined,
    connectSecret: import.meta.env.VITE_CP_CONNECT_SECRET as string | undefined,
  };
}

export function isCpTravelApiConfigured(): boolean {
  const { apiKey, connectId, connectSecret } = getConfig();
  return Boolean(apiKey && connectId && connectSecret);
}

function authHeaders(): HeadersInit {
  const { apiKey, connectId, connectSecret } = getConfig();
  return {
    Accept: "application/json",
    "x-api-key": apiKey!,
    "x-cp-connect-id": connectId!,
    "x-cp-connect-secret": connectSecret!,
  };
}

export function lisbonDateAndTime(now = new Date()): { date: string; time: string } {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Lisbon",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? "";

  return {
    date: `${get("year")}-${get("month")}-${get("day")}`,
    time: `${get("hour")}:${get("minute")}`,
  };
}

function isUpcoming(stop: CpStationStop): boolean {
  return !stop.etd && !stop.eta;
}

function timeSortKey(stop: CpStationStop): string {
  return stop.departureTime ?? stop.arrivalTime ?? "99:99";
}

/** Next departures at a station (scheduled / not yet passed per CP board). */
export function parseUpcomingDepartures(
  response: CpTimetableResponse,
  limit = 3,
): StationDeparture[] {
  const stops = response.stationStops ?? [];

  return stops
    .filter(isUpcoming)
    .filter((stop) => stop.departureTime || stop.arrivalTime)
    .sort((a, b) => timeSortKey(a).localeCompare(timeSortKey(b)))
    .slice(0, limit)
    .map((stop) => ({
      trainNumber: String(stop.trainNumber),
      time: stop.departureTime ?? stop.arrivalTime ?? "—",
      destination: stop.trainDestination?.designation ?? "—",
      serviceType: stop.trainService?.designation ?? "—",
      platform: stop.platform ?? null,
      delayMinutes: typeof stop.delay === "number" && stop.delay > 0 ? stop.delay : null,
    }));
}

export async function fetchStationDepartures(
  stationCode: string,
  limit = 3,
): Promise<StationDeparture[]> {
  if (!isCpTravelApiConfigured()) {
    throw new Error("cp_api_not_configured");
  }

  const { baseUrl } = getConfig();
  const { date, time } = lisbonDateAndTime();
  const url = `${baseUrl.replace(/\/$/, "")}/stations/${encodeURIComponent(stationCode)}/timetable/${date}?start=${encodeURIComponent(time)}`;

  const res = await fetch(url, { headers: authHeaders(), cache: "no-store" });

  if (!res.ok) {
    throw new Error(`cp_api_http_${res.status}`);
  }

  const data = (await res.json()) as CpTimetableResponse;
  return parseUpcomingDepartures(data, limit);
}
