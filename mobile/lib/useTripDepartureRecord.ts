import { useEffect, useRef } from 'react';
import { getMinutesSinceDeparture } from '@/lib/departureCountdown';
import type { PlannedDeparture } from '@/lib/types';
import { clearActiveTrip, recordTakenTrip } from '@/lib/tripStorage';

export function useTripDepartureRecord(
  trip: PlannedDeparture | null,
  delayMinutes: number | null,
  now: Date,
  onRecorded: () => void,
  platform: string | null = null,
): void {
  const recordedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!trip) {
      recordedRef.current = null;
      return;
    }

    const minutesSinceDeparture = getMinutesSinceDeparture(
      trip.departureTime,
      delayMinutes ?? trip.delayMinutes,
      now,
      trip.timetableDate,
    );
    if (minutesSinceDeparture === null) return;
    if (recordedRef.current === trip.id) return;

    recordedRef.current = trip.id;
    void (async () => {
      if (trip.purpose === "meet") {
        await clearActiveTrip();
        onRecorded();
        return;
      }
      await recordTakenTrip(trip, trip.destination, { delayMinutes, platform });
      // Defensive: refresh widget / end Live Activity as soon as the Trip
      // screen notices departure (bootstrap also schedules this).
      try {
        const { onTripDeparted } = await import('@/lib/widgetSync');
        await onTripDeparted();
      } catch (error) {
        console.warn('[trip] post-departure widget sync failed', error);
      }
      onRecorded();
    })();
  }, [trip, delayMinutes, platform, now, onRecorded]);
}
