import {
  formatWidgetCountdown,
  getEffectiveDepartureClock,
  getDepartureTimestampMs,
  getMinutesUntilDeparture,
  hasEffectiveDeparturePassed,
} from "@/lib/departureCountdown";
import { findNearestStation, stationHasLiveDepartures } from "@/lib/nearestStation";
import { isLastTripStale } from "@/lib/widgetTrip";
import { DEFAULT_WIDGET_PROPS, normalizeWidgetProps } from "@/lib/widgetDefaults";
import type { CompletedTripRecord, PlannedDeparture, TripWidgetProps } from "@/lib/types";

/** Busiest CP hub — sensible default when location is unavailable. */
const FEATURED_STATION = "Porto-Campanhã";

/** Only name a station in widget copy when it has live departures. */
function departureStationName(name: string | null | undefined): string | null {
  if (!name?.trim()) return null;
  return stationHasLiveDepartures(name) ? name.trim() : null;
}

function buildPromptNextTrainProps(nearestStationName: string | null): TripWidgetProps {
  const named = departureStationName(nearestStationName);
  return normalizeWidgetProps({
    mode: "browse",
    headline: "Take your next train",
    subline: named
      ? `Open departures at ${named}`
      : "Open VeryStays and tap Take on a departure",
    stationName: named ?? FEATURED_STATION,
    countdownMinutes: null,
    trainNumber: "",
    departureTime: "",
    destination: "",
    delayMinutes: null,
    platform: null,
    departureAtMs: null,
  });
}

function asCompletedTrip(
  trip: PlannedDeparture,
  now: Date,
): CompletedTripRecord {
  return {
    ...trip,
    completedAt: now.toISOString(),
    finalStationName: trip.destination,
  };
}

/**
 * Widget/Live Activity props after a planned departure has left.
 * Never keeps `mode: "active"` — that was leaving countdown stuck on "Now".
 */
export function buildPostDepartureWidgetProps(input: {
  departedTrip: PlannedDeparture;
  lastTaken: CompletedTripRecord | null;
  nearestStationName: string | null;
  now?: Date;
}): TripWidgetProps {
  const now = input.now ?? new Date();
  return buildWidgetProps({
    activeTrip: null,
    lastTaken: input.lastTaken ?? asCompletedTrip(input.departedTrip, now),
    nearestStationName: input.nearestStationName,
    now,
  });
}

export function buildWidgetProps(input: {
  activeTrip: PlannedDeparture | null;
  lastTaken: CompletedTripRecord | null;
  nearestStationName: string | null;
  now?: Date;
}): TripWidgetProps {
  const now = input.now ?? new Date();

  if (input.activeTrip) {
    const departed = hasEffectiveDeparturePassed(
      input.activeTrip.departureTime,
      input.activeTrip.delayMinutes,
      now,
      input.activeTrip.timetableDate,
    );

    // Once the train has left, drop the active countdown immediately so the
    // home-screen widget / Live Activity do not linger on "Now".
    if (departed) {
      return buildPostDepartureWidgetProps({
        departedTrip: input.activeTrip,
        lastTaken: input.lastTaken,
        nearestStationName: input.nearestStationName,
        now,
      });
    }

    const minutes = getMinutesUntilDeparture(
      input.activeTrip.departureTime,
      input.activeTrip.delayMinutes,
      now,
      input.activeTrip.timetableDate,
    );
    const effective = getEffectiveDepartureClock(
      input.activeTrip.departureTime,
      input.activeTrip.delayMinutes,
    );
    const countdown = minutes === null ? null : Math.max(0, minutes);

    return {
      mode: "active",
      headline:
        countdown === null
          ? input.activeTrip.departureTime
          : formatWidgetCountdown(countdown),
      subline: `${input.activeTrip.trainNumber} → ${input.activeTrip.destination}`,
      countdownMinutes: countdown,
      stationName: input.activeTrip.stationName,
      trainNumber: input.activeTrip.trainNumber,
      departureTime: effective ?? input.activeTrip.departureTime,
      destination: input.activeTrip.destination,
      delayMinutes: input.activeTrip.delayMinutes,
      platform: input.activeTrip.platform,
      departureAtMs: getDepartureTimestampMs(
        input.activeTrip.departureTime,
        input.activeTrip.delayMinutes,
        now,
        input.activeTrip.timetableDate,
      ),
    };
  }

  if (input.lastTaken) {
    if (isLastTripStale(input.lastTaken, now)) {
      return buildPromptNextTrainProps(input.nearestStationName);
    }

    return {
      mode: "lastTaken",
      headline: input.lastTaken.stationName,
      subline: `${input.lastTaken.trainNumber} → ${input.lastTaken.finalStationName}`,
      countdownMinutes: null,
      stationName: input.lastTaken.stationName,
      trainNumber: input.lastTaken.trainNumber,
      departureTime: input.lastTaken.departureTime,
      destination: input.lastTaken.finalStationName,
      delayMinutes: input.lastTaken.delayMinutes,
      platform: input.lastTaken.platform,
      departureAtMs: null,
    };
  }

  if (input.nearestStationName) {
    const named = departureStationName(input.nearestStationName);
    if (!named) {
      return normalizeWidgetProps({
        ...DEFAULT_WIDGET_PROPS,
        mode: "browse",
        headline: FEATURED_STATION,
        subline: "VeryStays · browse 426 stations",
        stationName: FEATURED_STATION,
      });
    }

    return {
      mode: "nearest",
      headline: named,
      subline: "Nearest station",
      countdownMinutes: null,
      stationName: named,
      trainNumber: "",
      departureTime: "",
      destination: "",
      delayMinutes: null,
      platform: null,
      departureAtMs: null,
    };
  }

  return normalizeWidgetProps({
    ...DEFAULT_WIDGET_PROPS,
    mode: "browse",
    headline: FEATURED_STATION,
    subline: "VeryStays · browse 426 stations",
    stationName: FEATURED_STATION,
  });
}

export function buildWidgetPropsWithLocation(input: {
  activeTrip: PlannedDeparture | null;
  lastTaken: CompletedTripRecord | null;
  coords: { lat: number; lng: number } | null;
  now?: Date;
}): TripWidgetProps {
  const nearest = input.coords ? findNearestStation(input.coords) : null;
  return buildWidgetProps({
    activeTrip: input.activeTrip,
    lastTaken: input.lastTaken,
    nearestStationName: nearest?.name ?? null,
    now: input.now,
  });
}
