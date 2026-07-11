import { useEffect, useState } from 'react';
import { onTripDeparted, seedWidgetTimeline, syncTripWidgets } from '@/lib/widgetSync';

/** Keeps widget + Live Activity in sync while the app is open. */
export function WidgetSyncBootstrap() {
  const [, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        await seedWidgetTimeline();
        await syncTripWidgets();
        await onTripDeparted();
      } catch (error) {
        console.warn('[widget] sync failed', error);
      }
      if (!cancelled) setTick((value) => value + 1);
    };

    void run();
    const interval = setInterval(() => {
      void run();
    }, 60_000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return null;
}
