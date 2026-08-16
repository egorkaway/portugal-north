import cpStationCodes from '@/data/cpStationCodes.json';
import type { PlannedDeparture, StationArrival, StationDeparture } from '@/lib/types';
import type { GlobalRatings } from '@/lib/rankVotes';
import { bakedReliabilityScores } from '@/lib/stationData';
import type { ReliabilityScoresManifest } from '@/lib/stationData';
import { INITIAL_DEPARTURES_LIMIT } from '@/lib/departureLimits';

const API_BASE = 'https://www.verystays.com';

const codes = cpStationCodes as Record<string, string>;

export type GlobalRatingsResult = {
  ratings: GlobalRatings;
  hotelRatings: GlobalRatings;
  imageRatings: GlobalRatings;
  configured: boolean;
};

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

export function getCpStationCode(stationName: string): string | null {
  return codes[stationName] ?? null;
}

export async function fetchStationBoard(
  stationName: string,
  limit = INITIAL_DEPARTURES_LIMIT,
): Promise<{ departures: StationDeparture[]; arrivals: StationArrival[] }> {
  const code = getCpStationCode(stationName);
  if (!code) return { departures: [], arrivals: [] };

  const url = `${API_BASE}/api/departures?code=${encodeURIComponent(code)}&limit=${limit}`;
  const res = await fetch(url);
  if (!res.ok) return { departures: [], arrivals: [] };

  const data = (await res.json()) as {
    departures?: StationDeparture[];
    arrivals?: StationArrival[];
  };
  return {
    departures: data.departures ?? [],
    arrivals: data.arrivals ?? [],
  };
}

export async function fetchStationDepartures(
  stationName: string,
  limit = INITIAL_DEPARTURES_LIMIT,
): Promise<StationDeparture[]> {
  const board = await fetchStationBoard(stationName, limit);
  return board.departures;
}

export async function fetchStationArrivals(
  stationName: string,
  limit = INITIAL_DEPARTURES_LIMIT,
): Promise<StationArrival[]> {
  const board = await fetchStationBoard(stationName, limit);
  return board.arrivals;
}

export async function fetchGlobalRatings(): Promise<GlobalRatingsResult> {
  const res = await fetch(`${API_BASE}/api/votes`);
  if (!res.ok) {
    return {
      ratings: {},
      hotelRatings: {},
      imageRatings: {},
      configured: false,
    };
  }

  const data = (await res.json()) as Partial<GlobalRatingsResult>;
  return {
    ratings: data.ratings ?? {},
    hotelRatings: data.hotelRatings ?? {},
    imageRatings: data.imageRatings ?? {},
    configured: Boolean(data.configured),
  };
}

export async function syncStationVoteToServer(
  stationName: string,
  previous: 'up' | 'down' | null,
  next: 'up' | 'down' | null,
): Promise<void> {
  await fetch(`${API_BASE}/api/votes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ station: stationName, previous, next }),
  });
}

export async function syncStationImageVoteToServer(
  stationName: string,
  previous: 'up' | 'down' | null,
  next: 'up' | 'down' | null,
): Promise<void> {
  await fetch(`${API_BASE}/api/votes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ stationImage: stationName, previous, next }),
  });
}

export async function fetchTrainJourney(input: {
  trainNumber: string;
  timetableDate: string;
  origin: string;
  departure: string;
  destination: string;
}): Promise<TrainJourney | null> {
  const params = new URLSearchParams({
    train: input.trainNumber,
    date: input.timetableDate,
    origin: input.origin,
    departure: input.departure,
    destination: input.destination,
  });

  const res = await fetch(`${API_BASE}/api/train-journey?${params.toString()}`);
  if (!res.ok) return null;

  const data = (await res.json()) as { journey?: TrainJourney | null };
  return data.journey ?? null;
}

export function getBakedReliabilityScores(): ReliabilityScoresManifest {
  return bakedReliabilityScores;
}

export function matchLiveDeparture(
  trip: PlannedDeparture,
  departures: StationDeparture[],
): StationDeparture | undefined {
  return departures.find(
    (dep) =>
      dep.trainNumber === trip.trainNumber &&
      dep.time === trip.departureTime &&
      dep.destination === trip.destination,
  );
}

export function matchLiveArrival(
  trip: PlannedDeparture,
  arrivals: StationArrival[],
): StationArrival | undefined {
  return arrivals.find(
    (arr) =>
      arr.trainNumber === trip.trainNumber &&
      (arr.time === trip.departureTime || arr.departureTime === trip.departureTime),
  );
}
