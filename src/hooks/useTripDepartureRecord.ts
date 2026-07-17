import { useEffect, useRef } from "react";
import { getMinutesSinceDeparture } from "@/lib/departureCountdown";
import type { PlannedDeparture } from "@/lib/plannedDepartures";
import { recordTakenTrip } from "@/lib/trainTripHistory";

/** Add the active trip to Taken trains once its effective departure time has passed. */
export function useTripDepartureRecord(
  trip: PlannedDeparture | null,
  delayMinutes: number | null,
  now: Date,
): void {
  const recordedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!trip) {
      recordedRef.current = null;
      return;
    }

    const minutesSinceDeparture = getMinutesSinceDeparture(
      trip.departureTime,
      delayMinutes,
      now,
      trip.timetableDate,
    );
    if (minutesSinceDeparture === null) return;
    if (recordedRef.current === trip.id) return;

    recordedRef.current = trip.id;
    recordTakenTrip(trip);
  }, [trip, delayMinutes, now]);
}
