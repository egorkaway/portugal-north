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

export function downstreamStopsFrom(
  journey: TrainJourney,
  originStationCode: string,
): TrainJourneyStop[] {
  const index = journey.stops.findIndex((stop) => stop.stationCode === originStationCode);
  if (index < 0) return journey.stops;
  return journey.stops.slice(index);
}
