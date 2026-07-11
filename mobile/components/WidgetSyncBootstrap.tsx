import { useEffect, useState } from 'react';
import { scheduleTripDepartureReminder } from '@/lib/tripNotifications';
import { readActiveTrip } from '@/lib/tripStorage';
import { onTripDeparted, seedWidgetTimeline, syncTripWidgets } from '@/lib/widgetSync';

/** Keeps widget + Live Activity in sync while the app is open. */
export function WidgetSyncBootstrap() {
  const [, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const syncWidgets = async () => {
      try {
        await seedWidgetTimeline();
        await syncTripWidgets();
        await onTripDeparted();
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

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return null;
}
