import { useEffect, useRef } from 'react';
import { getMinutesSinceDeparture } from '@/lib/departureCountdown';
import type { PlannedDeparture } from '@/lib/types';
import { recordTakenTrip } from '@/lib/tripStorage';

export function useTripDepartureRecord(
  trip: PlannedDeparture | null,
  delayMinutes: number | null,
  now: Date,
  onRecorded: () => void,
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
    );
    if (minutesSinceDeparture === null) return;
    if (recordedRef.current === trip.id) return;

    recordedRef.current = trip.id;
    void recordTakenTrip(trip).then(onRecorded);
  }, [trip, delayMinutes, now, onRecorded]);
}
