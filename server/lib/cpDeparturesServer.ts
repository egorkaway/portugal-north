import {
  lisbonDateAndTime,
  parseUpcomingDepartures,
  type CpTimetableResponse,
  type StationDeparture,
} from "./cpDeparturesParse.js";
import { cpAuthHeaders, getCpTravelConfig } from "./cpConfig.js";

const STATION_CODE_RE = /^94-\d+$/;

export async function fetchCpStationDepartures(
  stationCode: string,
  limit = 3,
): Promise<StationDeparture[]> {
  if (!STATION_CODE_RE.test(stationCode)) {
    throw new Error("invalid_station_code");
  }

  const config = await getCpTravelConfig();
  const { date, time } = lisbonDateAndTime();
  const base = config.travelApiUrl.replace(/\/$/, "");
  const url = `${base}/stations/${encodeURIComponent(stationCode)}/timetable/${date}?start=${encodeURIComponent(time)}`;

  const res = await fetch(url, {
    headers: cpAuthHeaders(config),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`cp_api_http_${res.status}`);
  }

  const data = (await res.json()) as CpTimetableResponse;
  return parseUpcomingDepartures(data, limit);
}
