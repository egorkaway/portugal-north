import { useEffect, useRef } from "react";
import { getMinutesUntilTime } from "@/lib/departureCountdown";
import { clearActiveTrip, type PlannedDeparture } from "@/lib/plannedDepartures";
import { recordCompletedTrip } from "@/lib/trainTripHistory";
import type { TrainJourneyStop } from "@/lib/trainJourney";

/** When the final downstream stop is reached, archive the trip locally and clear tracking. */
export function useTripCompletion(
  trip: PlannedDeparture | null,
  downstreamStops: TrainJourneyStop[],
  delayMinutes: number | null,
  now: Date,
): void {
  const recordedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!trip) {
      recordedRef.current = null;
      return;
    }

    const finalStop = downstreamStops[downstreamStops.length - 1];
    if (!finalStop) return;

    const arrivalTime = finalStop.arrivalTime ?? finalStop.departureTime;
    if (!arrivalTime) return;

    const minutesUntil = getMinutesUntilTime(arrivalTime, delayMinutes, now);
    if (minutesUntil === null || minutesUntil > 0) return;
    if (recordedRef.current === trip.id) return;

    recordedRef.current = trip.id;
    recordCompletedTrip(trip, finalStop.stationName);
    clearActiveTrip();
  }, [trip, downstreamStops, delayMinutes, now]);
}
