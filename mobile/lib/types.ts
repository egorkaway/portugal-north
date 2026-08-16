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
  /** "meet" = countdown/live only; do not add to trip history. */
  purpose?: "take" | "meet";
};

export type CompletedTripRecord = PlannedDeparture & {
  completedAt: string;
  finalStationName: string;
  /** Effective leave clock (HH:mm) when different from scheduled `departureTime`. */
  actualDepartureTime?: string | null;
};

export type StationLite = {
  name: string;
  lat: number;
  lng: number;
};

export type TripWidgetMode = "active" | "lastTaken" | "nearest" | "browse";

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
  /** Unix ms for effective departure — powers Live Activity native countdown timer. */
  departureAtMs: number | null;
};

export type StationDeparture = {
  trainNumber: string;
  time: string;
  destination: string;
  serviceType: string;
  platform: string | null;
  delayMinutes: number | null;
};

export type StationArrival = {
  trainNumber: string;
  time: string;
  origin: string;
  destination: string;
  serviceType: string;
  platform: string | null;
  delayMinutes: number | null;
  terminatesHere: boolean;
  departureTime: string | null;
};
