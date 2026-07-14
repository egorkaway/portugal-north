import { useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { getMinutesUntilDeparture } from '@/lib/departureCountdown';
import { scheduleTripDepartureReminder } from '@/lib/tripNotifications';
import { readActiveTrip } from '@/lib/tripStorage';
import { onTripDeparted, seedWidgetTimeline, syncTripWidgets } from '@/lib/widgetSync';

/** Keeps widget + Live Activity in sync while the app is open. */
export function WidgetSyncBootstrap() {
  const [, setTick] = useState(0);
  const departureTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;

    const clearDepartureTimer = () => {
      if (departureTimerRef.current) {
        clearTimeout(departureTimerRef.current);
        departureTimerRef.current = null;
      }
    };

    const scheduleDepartureSync = async () => {
      clearDepartureTimer();
      const trip = await readActiveTrip();
      if (!trip) return;

      const minutesUntil = getMinutesUntilDeparture(
        trip.departureTime,
        trip.delayMinutes,
      );
      if (minutesUntil === null) return;

      if (minutesUntil <= 0) {
        await syncTripWidgets();
        return;
      }

      departureTimerRef.current = setTimeout(() => {
        void syncTripWidgets();
      }, minutesUntil * 60_000 + 500);
    };

    const syncWidgets = async () => {
      try {
        await seedWidgetTimeline();
        await syncTripWidgets();
        await onTripDeparted();
        await scheduleDepartureSync();
      } catch (error) {
        console.warn('[widget] sync failed', error);
      }
      if (!cancelled) setTick((value) => value + 1);
    };

    const bootstrap = async () => {
      await syncWidgets();
      try {
        const trip = await readActiveTrip();
        if (trip) {
          await scheduleTripDepartureReminder(trip);
        }
      } catch (error) {
        console.warn('[trip] reminder bootstrap failed', error);
      }
    };

    void bootstrap();
    const interval = setInterval(() => {
      void syncWidgets();
    }, 60_000);

    const appStateSubscription = AppState.addEventListener('change', (state) => {
      if (state === 'active' || state === 'background') {
        void syncWidgets();
      }
    });

    return () => {
      cancelled = true;
      clearInterval(interval);
      clearDepartureTimer();
      appStateSubscription.remove();
    };
  }, []);

  return null;
}
