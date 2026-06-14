export type CpStationRef = {
  code: string;
  designation: string;
};

export type CpTrainService = {
  code: string;
  designation: string;
};

export type CpStationStop = {
  trainNumber: number | string;
  departureTime?: string | null;
  arrivalTime?: string | null;
  etd?: string | null;
  eta?: string | null;
  ETD?: string | null;
  ETA?: string | null;
  delay?: number | null;
  platform?: string | null;
  trainOrigin: CpStationRef;
  trainDestination: CpStationRef;
  trainService: CpTrainService;
};

export type CpTimetableResponse = {
  stationStops?: CpStationStop[];
};

export type StationDeparture = {
  trainNumber: string;
  time: string;
  destination: string;
  serviceType: string;
  platform: string | null;
  delayMinutes: number | null;
};

export function lisbonDateAndTime(now = new Date()): { date: string; time: string } {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Lisbon",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? "";

  return {
    date: `${get("year")}-${get("month")}-${get("day")}`,
    time: `${get("hour")}:${get("minute")}`,
  };
}

function timeSortKey(stop: CpStationStop): string {
  return stop.departureTime ?? "99:99";
}

/** Next departures at a station (trains leaving this stop). */
export function parseUpcomingDepartures(
  response: CpTimetableResponse,
  limit = 3,
): StationDeparture[] {
  const stops = response.stationStops ?? [];

  return stops
    .filter((stop) => Boolean(stop.departureTime))
    .sort((a, b) => timeSortKey(a).localeCompare(timeSortKey(b)))
    .slice(0, limit)
    .map((stop) => ({
      trainNumber: String(stop.trainNumber),
      time: stop.departureTime ?? "—",
      destination: stop.trainDestination?.designation ?? "—",
      serviceType: stop.trainService?.designation ?? "—",
      platform: stop.platform ?? null,
      delayMinutes: typeof stop.delay === "number" && stop.delay > 0 ? stop.delay : null,
    }));
}
