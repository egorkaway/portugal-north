export type {
  CpStationRef,
  CpTrainService,
  CpStationStop,
  CpTimetableResponse,
  StationDeparture,
} from "@/lib/cpDeparturesParse";

export { lisbonDateAndTime, parseUpcomingDepartures } from "@/lib/cpDeparturesParse";

const DEPARTURES_API = "/api/departures";

/** True when this station has a CP code (proxy fetches credentials server-side). */
export function isCpTravelApiConfigured(): boolean {
  return true;
}

export async function fetchStationDepartures(
  stationCode: string,
  limit = 3,
): Promise<import("@/lib/cpDeparturesParse").StationDeparture[]> {
  const url = `${DEPARTURES_API}?code=${encodeURIComponent(stationCode)}&limit=${limit}`;
  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    throw new Error(`departures_http_${res.status}`);
  }

  const data = (await res.json()) as {
    departures?: import("@/lib/cpDeparturesParse").StationDeparture[];
    error?: string;
  };

  if (data.error) {
    throw new Error(data.error);
  }

  return data.departures ?? [];
}
