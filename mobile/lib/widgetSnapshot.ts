import {
  formatWidgetCountdown,
  getEffectiveDepartureClock,
  getMinutesUntilDeparture,
} from "@/lib/departureCountdown";
import { findNearestStation } from "@/lib/nearestStation";
import { DEFAULT_WIDGET_PROPS, normalizeWidgetProps } from "@/lib/widgetDefaults";
import type { CompletedTripRecord, PlannedDeparture, TripWidgetProps } from "@/lib/types";

/** Busiest CP hub — sensible default when location is unavailable. */
const FEATURED_STATION = "Porto-Campanhã";

export function buildWidgetProps(input: {
  activeTrip: PlannedDeparture | null;
  lastTaken: CompletedTripRecord | null;
  nearestStationName: string | null;
  now?: Date;
}): TripWidgetProps {
  const now = input.now ?? new Date();

  if (input.activeTrip) {
    const minutes = getMinutesUntilDeparture(
      input.activeTrip.departureTime,
      input.activeTrip.delayMinutes,
      now,
    );
    const effective = getEffectiveDepartureClock(
      input.activeTrip.departureTime,
      input.activeTrip.delayMinutes,
    );
    const countdown =
      minutes === null ? null : minutes <= 0 ? 0 : minutes;

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
    };
  }

  if (input.lastTaken) {
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
    };
  }

  if (input.nearestStationName) {
    return {
      mode: "nearest",
      headline: input.nearestStationName,
      subline: "Nearest station",
      countdownMinutes: null,
      stationName: input.nearestStationName,
      trainNumber: "",
      departureTime: "",
      destination: "",
      delayMinutes: null,
      platform: null,
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
