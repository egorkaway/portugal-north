export type {
  CpStationRef,
  CpTrainService,
  CpStationStop,
  CpTimetableResponse,
  StationArrival,
  StationDeparture,
} from "@/lib/cpDeparturesParse";

export {
  lisbonDateAndTime,
  parseUpcomingArrivals,
  parseUpcomingDepartures,
} from "@/lib/cpDeparturesParse";

const DEPARTURES_API = "/api/departures";

export type StationBoard = {
  departures: import("@/lib/cpDeparturesParse").StationDeparture[];
  arrivals: import("@/lib/cpDeparturesParse").StationArrival[];
};

/** True when this station has a CP code (proxy fetches credentials server-side). */
export function isCpTravelApiConfigured(): boolean {
  return true;
}

export async function fetchStationBoard(
  stationCode: string,
  limit = 3,
): Promise<StationBoard> {
  const url = `${DEPARTURES_API}?code=${encodeURIComponent(stationCode)}&limit=${limit}`;
  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    throw new Error(`departures_http_${res.status}`);
  }

  const data = (await res.json()) as {
    departures?: import("@/lib/cpDeparturesParse").StationDeparture[];
    arrivals?: import("@/lib/cpDeparturesParse").StationArrival[];
    error?: string;
  };

  if (data.error) {
    throw new Error(data.error);
  }

  return {
    departures: data.departures ?? [],
    arrivals: data.arrivals ?? [],
  };
}

export async function fetchStationDepartures(
  stationCode: string,
  limit = 3,
): Promise<import("@/lib/cpDeparturesParse").StationDeparture[]> {
  const board = await fetchStationBoard(stationCode, limit);
  return board.departures;
}

export async function fetchStationArrivals(
  stationCode: string,
  limit = 3,
): Promise<import("@/lib/cpDeparturesParse").StationArrival[]> {
  const board = await fetchStationBoard(stationCode, limit);
  return board.arrivals;
}
