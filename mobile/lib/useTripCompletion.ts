import { useEffect, useRef } from 'react';
import { getMinutesUntilTime } from '@/lib/departureCountdown';
import type { TrainJourneyStop } from '@/lib/api';
import type { PlannedDeparture } from '@/lib/types';
import { recordTakenTrip, writeActiveTrip } from '@/lib/tripStorage';
import { clearTripWidgets, syncTripWidgets } from '@/lib/widgetSync';

export function useTripCompletion(
  trip: PlannedDeparture | null,
  downstreamStops: TrainJourneyStop[],
  delayMinutes: number | null,
  now: Date,
  onCompleted: () => void,
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
    void (async () => {
      await recordTakenTrip(trip, finalStop.stationName);
      await writeActiveTrip(null);
      await syncTripWidgets();
      onCompleted();
    })();
  }, [trip, downstreamStops, delayMinutes, now, onCompleted]);
}
