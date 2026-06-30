import {
  parseTimeToMinutes,
  type CpStationStop,
  type CpTimetableResponse,
} from "./cpDeparturesParse.js";
import { fetchCpStationTimetable } from "./cpDeparturesServer.js";
import {
  findCpStationByFuzzyName,
  getCpStationByCode,
  getCpStationIndex,
  type CpStationIndexEntry,
} from "./cpStationIndex.js";
import type { TrainJourney, TrainJourneyStop } from "./cpTrainJourney.js";

const MAX_CANDIDATE_STATIONS = 12;
const TIMETABLE_CONCURRENCY = 4;

export type FetchTrainJourneyFallbackParams = {
  trainNumber: string;
  timetableDate: string;
  originStationCode: string;
  departureTime: string;
  destinationName?: string;
};

export function normalizeStationName(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function normalizeClock(value: string | null | undefined): string | null {
  if (!value || typeof value !== "string") return null;
  const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!match) return null;
  return `${match[1].padStart(2, "0")}:${match[2]}`;
}

function stopClockMinutes(stop: CpStationStop): number | null {
  const clock = normalizeClock(stop.arrivalTime) ?? normalizeClock(stop.departureTime);
  return clock ? parseTimeToMinutes(clock) : null;
}

export function haversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export type FindTrainStopOptions = {
  /** Station being queried — skips destination-name filter when it is the train's terminus. */
  atStationCode?: string;
  /** Resolved destination CP code, when known. */
  destinationStationCode?: string;
  requireDestinationMatch?: boolean;
};

function destinationMatches(
  stopDestination: string | undefined,
  stopDestinationCode: string | undefined,
  expectedDestination: string | undefined,
  destinationStationCode?: string,
): boolean {
  if (
    destinationStationCode &&
    stopDestinationCode?.trim() === destinationStationCode
  ) {
    return true;
  }
  if (!expectedDestination?.trim()) return true;
  if (!stopDestination?.trim()) return true;
  const expected = normalizeStationName(expectedDestination);
  const actual = normalizeStationName(stopDestination);
  return actual.includes(expected) || expected.includes(actual);
}

export function findTrainStopInTimetable(
  response: CpTimetableResponse,
  trainNumber: string,
  afterMinutes: number | null,
  destinationName?: string,
  options: FindTrainStopOptions = {},
): CpStationStop | null {
  const normalizedTrain = trainNumber.trim();
  const requireDestinationMatch = options.requireDestinationMatch ?? true;
  const skipDestinationFilter =
    !requireDestinationMatch ||
    Boolean(
      options.atStationCode &&
        options.destinationStationCode &&
        options.atStationCode === options.destinationStationCode,
    );

  let best: CpStationStop | null = null;
  let bestMinutes = Number.POSITIVE_INFINITY;

  for (const stop of response.stationStops ?? []) {
    if (String(stop.trainNumber) !== normalizedTrain) continue;
    if (
      !skipDestinationFilter &&
      !destinationMatches(
        stop.trainDestination?.designation,
        stop.trainDestination?.code,
        destinationName,
        options.destinationStationCode,
      )
    ) {
      continue;
    }

    const minutes = stopClockMinutes(stop);
    if (minutes === null) continue;
    if (afterMinutes !== null && minutes < afterMinutes) continue;

    if (minutes < bestMinutes) {
      best = stop;
      bestMinutes = minutes;
    }
  }

  return best;
}

export function rankCandidateStationCodes(
  origin: CpStationIndexEntry,
  stations: CpStationIndexEntry[],
  destinationName?: string,
  limit = MAX_CANDIDATE_STATIONS,
): string[] {
  const originLines = new Set(origin.lines);
  const destination = destinationName ? findCpStationByFuzzyName(destinationName) : undefined;

  const scored = stations
    .filter((station) => station.code !== origin.code)
    .map((station) => {
      const sharedLines = station.lines.filter((line) => originLines.has(line)).length;
      const distance = haversineKm(origin.lat, origin.lng, station.lat, station.lng);
      const lineScore = sharedLines * 100;
      const distanceScore = sharedLines > 0 ? Math.max(0, 60 - distance) : 0;
      return {
        code: station.code,
        score: lineScore + distanceScore,
        distance,
        sharedLines,
      };
    })
    .filter((entry) => entry.sharedLines > 0 || destination?.code === entry.code)
    .sort((a, b) => b.score - a.score || a.distance - b.distance);

  const codes: string[] = [];
  if (destination && destination.code !== origin.code) {
    codes.push(destination.code);
  }

  for (const entry of scored) {
    if (codes.length >= limit) break;
    if (!codes.includes(entry.code)) {
      codes.push(entry.code);
    }
  }

  return codes;
}

export function cpStopToJourneyStop(
  stationCode: string,
  stationName: string,
  stop: CpStationStop,
  preferredDepartureTime?: string | null,
): TrainJourneyStop {
  const arrival = normalizeClock(stop.arrivalTime);
  const departure =
    normalizeClock(preferredDepartureTime) ??
    normalizeClock(stop.departureTime) ??
    arrival;

  return {
    stationCode,
    stationName,
    arrivalTime: arrival ?? departure,
    departureTime: departure ?? arrival,
    platform: stop.platform ?? null,
  };
}

type TimedStop = {
  stop: TrainJourneyStop;
  sortMinutes: number;
};

export function buildJourneyFromTimedStops(
  trainNumber: string,
  timetableDate: string,
  serviceType: string,
  timedStops: TimedStop[],
  originStationCode?: string,
): TrainJourney {
  const sorted = [...timedStops].sort((a, b) => a.sortMinutes - b.sortMinutes);
  const seen = new Set<string>();
  const ordered: TrainJourneyStop[] = [];

  const pinnedOrigin = originStationCode
    ? sorted.find((entry) => entry.stop.stationCode === originStationCode)
    : undefined;
  if (pinnedOrigin) {
    seen.add(pinnedOrigin.stop.stationCode);
    ordered.push(pinnedOrigin.stop);
  }

  for (const entry of sorted) {
    if (seen.has(entry.stop.stationCode)) continue;
    seen.add(entry.stop.stationCode);
    ordered.push(entry.stop);
  }

  return {
    trainNumber,
    timetableDate,
    serviceType,
    stops: ordered,
  };
}

async function mapWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  worker: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let index = 0;

  async function run(): Promise<void> {
    while (index < items.length) {
      const current = index++;
      results[current] = await worker(items[current]);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, () => run()),
  );
  return results;
}

async function tryFetchStationTimetable(
  stationCode: string,
  timetableDate: string,
  startTime: string,
): Promise<CpTimetableResponse | null> {
  try {
    const timetable = await fetchCpStationTimetable(stationCode, timetableDate, startTime);
    return timetable.response;
  } catch {
    return null;
  }
}

function resolveDestinationStation(
  destinationName: string | undefined,
  originCpStop: CpStationStop | null,
): CpStationIndexEntry | undefined {
  const fromName = destinationName ? findCpStationByFuzzyName(destinationName) : undefined;
  if (fromName) return fromName;

  const destinationCode = originCpStop?.trainDestination?.code?.trim();
  if (destinationCode) {
    return getCpStationByCode(destinationCode);
  }

  return undefined;
}

async function pollStationForTrain(
  stationCode: string,
  trainNumber: string,
  timetableDate: string,
  startTime: string,
  originDepartureMinutes: number,
  destinationName: string | undefined,
  destinationStationCode: string | undefined,
  requireDestinationMatch: boolean,
): Promise<{ sortMinutes: number; stop: TrainJourneyStop; serviceType?: string } | null> {
  const station = getCpStationByCode(stationCode);
  if (!station) return null;

  const response = await tryFetchStationTimetable(stationCode, timetableDate, startTime);
  if (!response) return null;

  const cpStop = findTrainStopInTimetable(
    response,
    trainNumber,
    originDepartureMinutes + 1,
    destinationName,
    {
      atStationCode: stationCode,
      destinationStationCode,
      requireDestinationMatch,
    },
  );
  if (!cpStop) return null;

  const minutes = stopClockMinutes(cpStop);
  if (minutes === null || minutes <= originDepartureMinutes) return null;

  return {
    sortMinutes: minutes,
    stop: cpStopToJourneyStop(station.code, station.name, cpStop),
    serviceType: cpStop.trainService?.designation?.trim(),
  };
}

export async function fetchCpTrainJourneyFallback(
  params: FetchTrainJourneyFallbackParams,
): Promise<TrainJourney> {
  const trainNumber = params.trainNumber.trim();
  const timetableDate = params.timetableDate.trim();
  const originStationCode = params.originStationCode.trim();
  const departureTime = normalizeClock(params.departureTime);

  if (!/^\d+$/.test(trainNumber)) {
    throw new Error("invalid_train_number");
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(timetableDate)) {
    throw new Error("invalid_timetable_date");
  }
  if (!/^94-\d+$/.test(originStationCode)) {
    throw new Error("invalid_origin_station");
  }
  if (!departureTime) {
    throw new Error("invalid_departure_time");
  }

  const origin = getCpStationByCode(originStationCode);
  if (!origin) {
    throw new Error("unknown_origin_station");
  }

  const originDepartureMinutes = parseTimeToMinutes(departureTime);
  const candidateCodes = rankCandidateStationCodes(
    origin,
    getCpStationIndex(),
    params.destinationName,
  );

  const originResponse = await tryFetchStationTimetable(
    originStationCode,
    timetableDate,
    departureTime,
  );
  const originCpStop = originResponse
    ? findTrainStopInTimetable(
        originResponse,
        trainNumber,
        originDepartureMinutes,
        params.destinationName,
      )
    : null;

  const destinationStation = resolveDestinationStation(
    params.destinationName,
    originCpStop,
  );
  const destinationStationCode = destinationStation?.code;

  const serviceType = originCpStop?.trainService?.designation?.trim() || "—";

  const timedStops: TimedStop[] = [
    {
      sortMinutes: originDepartureMinutes,
      stop: cpStopToJourneyStop(
        origin.code,
        origin.name,
        originCpStop ?? {
          trainNumber,
          departureTime,
          arrivalTime: null,
          trainOrigin: { code: origin.code, designation: origin.name },
          trainDestination: {
            code: destinationStationCode ?? "",
            designation: params.destinationName ?? "",
          },
          trainService: { code: "", designation: serviceType },
        },
        departureTime,
      ),
    },
  ];

  const pollStation = (stationCode: string, requireDestinationMatch: boolean) =>
    pollStationForTrain(
      stationCode,
      trainNumber,
      timetableDate,
      departureTime,
      originDepartureMinutes,
      params.destinationName,
      destinationStationCode,
      requireDestinationMatch,
    );

  const timetableResults = await mapWithConcurrency(
    candidateCodes,
    TIMETABLE_CONCURRENCY,
    (stationCode) => pollStation(stationCode, true),
  );

  let resolvedServiceType = serviceType;
  for (const hit of timetableResults) {
    if (!hit) continue;
    if (resolvedServiceType === "—" && hit.serviceType) {
      resolvedServiceType = hit.serviceType;
    }
    timedStops.push({ sortMinutes: hit.sortMinutes, stop: hit.stop });
  }

  const hasDownstreamStop = timedStops.some(
    (entry) => entry.stop.stationCode !== originStationCode,
  );
  if (
    !hasDownstreamStop &&
    destinationStationCode &&
    destinationStationCode !== originStationCode
  ) {
    const destinationHit = await pollStation(destinationStationCode, false);
    if (destinationHit) {
      if (resolvedServiceType === "—" && destinationHit.serviceType) {
        resolvedServiceType = destinationHit.serviceType;
      }
      timedStops.push({
        sortMinutes: destinationHit.sortMinutes,
        stop: destinationHit.stop,
      });
    }
  }

  const journey = buildJourneyFromTimedStops(
    trainNumber,
    timetableDate,
    resolvedServiceType,
    timedStops,
    originStationCode,
  );

  if (journey.stops.length === 0) {
    throw new Error("cp_fallback_empty_journey");
  }

  return journey;
}
