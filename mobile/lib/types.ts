export type PlannedDeparture = {
  id: string;
  stationName: string;
  trainNumber: string;
  departureTime: string;
  destination: string;
  serviceType: string;
  platform: string | null;
  delayMinutes: number | null;
  timetableDate: string;
  selectedAt: string;
};

export type CompletedTripRecord = PlannedDeparture & {
  completedAt: string;
  finalStationName: string;
};

export type StationLite = {
  name: string;
  lat: number;
  lng: number;
};

export type TripWidgetMode = "active" | "lastTaken" | "nearest" | "empty";

export type TripWidgetProps = {
  mode: TripWidgetMode;
  headline: string;
  subline: string;
  countdownMinutes: number | null;
  stationName: string;
  trainNumber: string;
  departureTime: string;
  destination: string;
  delayMinutes: number | null;
  platform: string | null;
};

export type StationDeparture = {
  trainNumber: string;
  time: string;
  destination: string;
  serviceType: string;
  platform: string | null;
  delayMinutes: number | null;
};
