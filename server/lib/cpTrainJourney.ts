import { lisbonDateAndTime } from "./cpDeparturesParse.js";
import {
  fetchCpTrainJourneyFallback,
  type FetchTrainJourneyFallbackParams,
} from "./cpTrainJourneyFallback.js";

const CP_OAUTH_URL = "https://api.cp.pt/cp-api/oauth/token";
const CP_SIV_BASE = "https://api.cp.pt/cp-api/siv";
const OAUTH_BASIC = "Y3AtbW9iaWxlOnBhc3M="; // cp-mobile:pass
const TOKEN_TTL_MS = 50 * 60 * 1000;

export type TrainJourneyStop = {
  stationCode: string;
  stationName: string;
  arrivalTime: string | null;
  departureTime: string | null;
  platform: string | null;
};

export type TrainJourney = {
  trainNumber: string;
  timetableDate: string;
  serviceType: string;
  stops: TrainJourneyStop[];
};

export type FetchTrainJourneyParams = {
  trainNumber: string;
  timetableDate?: string;
  originStationCode?: string;
  departureTime?: string;
  destinationName?: string;
};

type SivStationRef = {
  code?: string;
  designation?: string;
};

type SivTrainStop = {
  station?: SivStationRef;
  arrival?: string | null;
  departure?: string | null;
  platform?: string | number | null;
};

type SivTrainResponse = {
  trainNumber?: number | string;
  serviceCode?: { designation?: string };
  trainStops?: SivTrainStop[];
};

let tokenCache: { token: string; fetchedAt: number } | null = null;

async function getSivAccessToken(): Promise<string> {
  if (tokenCache && Date.now() - tokenCache.fetchedAt < TOKEN_TTL_MS) {
    return tokenCache.token;
  }

  const body = new URLSearchParams({ grant_type: "client_credentials" });
  const res = await fetch(CP_OAUTH_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${OAUTH_BASIC}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`cp_oauth_http_${res.status}`);
  }

  const data = (await res.json()) as { access_token?: string };
  if (!data.access_token) {
    throw new Error("cp_oauth_missing_token");
  }

  tokenCache = { token: data.access_token, fetchedAt: Date.now() };
  return data.access_token;
}

function normalizeClock(value: string | null | undefined): string | null {
  if (!value || typeof value !== "string") return null;
  const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!match) return null;
  return `${match[1].padStart(2, "0")}:${match[2]}`;
}

export function parseSivTrainJourney(
  response: SivTrainResponse,
  trainNumber: string,
  timetableDate: string,
): TrainJourney {
  const stops: TrainJourneyStop[] = [];

  for (const stop of response.trainStops ?? []) {
    const stationCode = stop.station?.code?.trim() ?? "";
    const stationName = stop.station?.designation?.trim() ?? stationCode;
    if (!stationCode) continue;

    const arrivalTime = normalizeClock(stop.arrival);
    const departureTime = normalizeClock(stop.departure);
    if (!arrivalTime && !departureTime) continue;

    stops.push({
      stationCode,
      stationName,
      arrivalTime: arrivalTime ?? departureTime,
      departureTime: departureTime ?? arrivalTime,
      platform: stop.platform != null ? String(stop.platform) : null,
    });
  }

  return {
    trainNumber,
    timetableDate,
    serviceType: response.serviceCode?.designation?.trim() || "—",
    stops,
  };
}

export async function fetchCpTrainJourney(
  trainNumber: string,
  timetableDate = lisbonDateAndTime().date,
): Promise<TrainJourney> {
  const normalizedTrain = trainNumber.trim();
  if (!/^\d+$/.test(normalizedTrain)) {
    throw new Error("invalid_train_number");
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(timetableDate)) {
    throw new Error("invalid_timetable_date");
  }

  const token = await getSivAccessToken();
  const url = `${CP_SIV_BASE}/trains/${encodeURIComponent(normalizedTrain)}/timetable/${timetableDate}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`cp_siv_http_${res.status}`);
  }

  const response = (await res.json()) as SivTrainResponse;
  const journey = parseSivTrainJourney(response, normalizedTrain, timetableDate);
  if (journey.stops.length === 0) {
    throw new Error("cp_siv_empty_journey");
  }
  return journey;
}

export async function fetchCpTrainJourneyWithFallback(
  params: FetchTrainJourneyParams,
): Promise<TrainJourney> {
  const timetableDate = params.timetableDate ?? lisbonDateAndTime().date;
  const canFallback = Boolean(params.originStationCode && params.departureTime);

  try {
    return await fetchCpTrainJourney(params.trainNumber, timetableDate);
  } catch (error) {
    if (!canFallback) throw error;
    const fallbackParams: FetchTrainJourneyFallbackParams = {
      trainNumber: params.trainNumber,
      timetableDate,
      originStationCode: params.originStationCode!,
      departureTime: params.departureTime!,
      destinationName: params.destinationName,
    };
    return fetchCpTrainJourneyFallback(fallbackParams);
  }
}

/** Stops from the boarding station onward (inclusive). */
export function downstreamStopsFrom(
  journey: TrainJourney,
  originStationCode: string,
): TrainJourneyStop[] {
  const index = journey.stops.findIndex((stop) => stop.stationCode === originStationCode);
  if (index < 0) return journey.stops;
  return journey.stops.slice(index);
}
