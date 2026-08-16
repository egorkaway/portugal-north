import {
  lisbonDateAndTime,
  parseUpcomingArrivals,
  parseUpcomingDepartures,
  type CpTimetableResponse,
  type StationArrival,
  type StationDeparture,
} from "./cpDeparturesParse.js";
import { cpAuthHeaders, getCpTravelConfig } from "./cpConfig.js";

const STATION_CODE_RE = /^94-\d+$/;

export type CpStationTimetable = {
  stationCode: string;
  timetableDate: string;
  response: CpTimetableResponse;
};

export type CpStationBoard = {
  departures: StationDeparture[];
  arrivals: StationArrival[];
};

async function fetchCpStationTimetableResponse(
  stationCode: string,
  timetableDate?: string,
  startTime?: string,
): Promise<CpStationTimetable> {
  if (!STATION_CODE_RE.test(stationCode)) {
    throw new Error("invalid_station_code");
  }

  const config = await getCpTravelConfig();
  const { date: today, time: nowTime } = lisbonDateAndTime();
  const date = timetableDate ?? today;
  const start = startTime ?? (date === today ? nowTime : "00:00");
  const base = config.travelApiUrl.replace(/\/$/, "");
  const url = `${base}/stations/${encodeURIComponent(stationCode)}/timetable/${date}?start=${encodeURIComponent(start)}`;

  const res = await fetch(url, {
    headers: cpAuthHeaders(config),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`cp_api_http_${res.status}`);
  }

  const response = (await res.json()) as CpTimetableResponse;
  return { stationCode, timetableDate: date, response };
}

export async function fetchCpStationTimetable(
  stationCode: string,
  timetableDate?: string,
  startTime?: string,
): Promise<CpStationTimetable> {
  return fetchCpStationTimetableResponse(stationCode, timetableDate, startTime);
}

export async function fetchCpStationBoard(
  stationCode: string,
  limit = 3,
): Promise<CpStationBoard> {
  const { response } = await fetchCpStationTimetableResponse(stationCode);
  return {
    departures: parseUpcomingDepartures(response, limit),
    arrivals: parseUpcomingArrivals(response, limit),
  };
}

export async function fetchCpStationDepartures(
  stationCode: string,
  limit = 3,
): Promise<StationDeparture[]> {
  const board = await fetchCpStationBoard(stationCode, limit);
  return board.departures;
}

export async function fetchCpStationArrivals(
  stationCode: string,
  limit = 3,
): Promise<StationArrival[]> {
  const board = await fetchCpStationBoard(stationCode, limit);
  return board.arrivals;
}
