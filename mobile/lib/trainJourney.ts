import type { TrainJourneyStop } from '@/lib/api';

export type TrainJourney = {
  trainNumber: string;
  timetableDate: string;
  serviceType: string;
  stops: TrainJourneyStop[];
};

export function downstreamStopsFrom(
  journey: TrainJourney,
  originStationCode: string,
  originFallback?: Pick<TrainJourneyStop, 'stationName' | 'departureTime' | 'platform'>,
): TrainJourneyStop[] {
  const index = journey.stops.findIndex((stop) => stop.stationCode === originStationCode);
  const fromOrigin = index >= 0 ? journey.stops.slice(index) : journey.stops;
  if (fromOrigin[0]?.stationCode === originStationCode) {
    return fromOrigin;
  }

  if (!originFallback) {
    return fromOrigin;
  }

  const originStop: TrainJourneyStop = {
    stationCode: originStationCode,
    stationName: originFallback.stationName,
    departureTime: originFallback.departureTime,
    arrivalTime: originFallback.departureTime,
    platform: originFallback.platform,
  };

  return [originStop, ...fromOrigin.filter((stop) => stop.stationCode !== originStationCode)];
}
