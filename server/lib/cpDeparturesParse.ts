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

export type TrainTypeHourCounts = {
  departures: number;
  arrivals: number;
  delayMinutes: number;
};

export type StationHourSnapshot = {
  byTrainType: Record<string, TrainTypeHourCounts>;
  totals: TrainTypeHourCounts;
  observedAt: string;
};

export function parseTimeToMinutes(hhmm: string): number {
  const [hours, minutes] = hhmm.split(":").map(Number);
  return hours * 60 + minutes;
}

/** Minutes from `now` (Lisbon) until `hhmm` on `timetableDate`, or null if in the past. */
export function minutesUntilLisbonTime(
  hhmm: string,
  now: Date,
  timetableDate: string,
): number | null {
  const { date, time } = lisbonDateAndTime(now);
  const nowMinutes = parseTimeToMinutes(time);
  const stopMinutes = parseTimeToMinutes(hhmm);

  if (timetableDate === date) {
    const delta = stopMinutes - nowMinutes;
    return delta >= 0 ? delta : null;
  }

  const nextDay = addCalendarDay(date);
  if (timetableDate === nextDay) {
    return 24 * 60 - nowMinutes + stopMinutes;
  }

  return null;
}

function addCalendarDay(ymd: string): string {
  const [year, month, day] = ymd.split("-").map(Number);
  const utc = new Date(Date.UTC(year, month - 1, day + 1));
  return utc.toISOString().slice(0, 10);
}

export function isWithinNextHour(
  hhmm: string,
  now: Date,
  timetableDate: string,
): boolean {
  const delta = minutesUntilLisbonTime(hhmm, now, timetableDate);
  return delta !== null && delta <= 60;
}

function serviceTypeFor(stop: CpStationStop): string {
  return stop.trainService?.designation?.trim() || "Unknown";
}

function delayMinutesFor(stop: CpStationStop): number {
  return typeof stop.delay === "number" && stop.delay > 0 ? stop.delay : 0;
}

/** Count departures, arrivals, and delay minutes in the next hour by train type. */
export function parseTrainsInNextHour(
  response: CpTimetableResponse,
  now = new Date(),
  timetableDate = lisbonDateAndTime(now).date,
): StationHourSnapshot {
  const byTrainType: Record<string, TrainTypeHourCounts> = {};

  const ensure = (type: string): TrainTypeHourCounts => {
    if (!byTrainType[type]) {
      byTrainType[type] = { departures: 0, arrivals: 0, delayMinutes: 0 };
    }
    return byTrainType[type];
  };

  for (const stop of response.stationStops ?? []) {
    const type = serviceTypeFor(stop);
    const delay = delayMinutesFor(stop);
    let departures = 0;
    let arrivals = 0;

    if (stop.departureTime && isWithinNextHour(stop.departureTime, now, timetableDate)) {
      departures = 1;
    }
    if (stop.arrivalTime && isWithinNextHour(stop.arrivalTime, now, timetableDate)) {
      arrivals = 1;
    }
    if (departures === 0 && arrivals === 0) continue;

    const bucket = ensure(type);
    bucket.departures += departures;
    bucket.arrivals += arrivals;
    if (delay > 0) {
      bucket.delayMinutes += delay;
    }
  }

  const totals: TrainTypeHourCounts = { departures: 0, arrivals: 0, delayMinutes: 0 };
  for (const bucket of Object.values(byTrainType)) {
    totals.departures += bucket.departures;
    totals.arrivals += bucket.arrivals;
    totals.delayMinutes += bucket.delayMinutes;
  }

  return { byTrainType, totals, observedAt: now.toISOString() };
}

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
