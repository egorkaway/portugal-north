import { useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useLocale } from '@/i18n/LocaleProvider';
import { scheduleEngagementReminders } from '@/lib/engagementNotifications';
import {
  isLiveActivityEndNotification,
} from '@/lib/liveActivityEndSchedule';
import { ensureStationsSpotlightIndex } from '@/lib/spotlightIndex';
import { subscribeTripChanges } from '@/lib/tripEvents';
import { scheduleTripDepartureReminder } from '@/lib/tripNotifications';
import { readActiveTrip } from '@/lib/tripStorage';
import {
  endAllLiveActivities,
  getMsUntilEffectiveDeparture,
  MAX_TIMER_MS,
  onTripDeparted,
  seedWidgetTimeline,
  syncTripWidgets,
} from '@/lib/widgetSync';

async function handleLiveActivityEndSignal(): Promise<void> {
  try {
    await endAllLiveActivities();
    await onTripDeparted();
    await syncTripWidgets();
  } catch (error) {
    console.warn('[live-activity] end-from-notification failed', error);
  }
}

/** Keeps widget + Live Activity in sync while the app is open. */
export function WidgetSyncBootstrap() {
  const { locale } = useLocale();
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
      if (!trip || cancelled) return;

      const msUntil = getMsUntilEffectiveDeparture(trip);
      if (msUntil === null) return;

      if (msUntil <= 0) {
        await syncTripWidgets();
        await onTripDeparted();
        return;
      }

      // Fire slightly after departure so the native countdown can reach 0:00.
      const delayMs = Math.min(msUntil + 1_500, MAX_TIMER_MS);
      departureTimerRef.current = setTimeout(() => {
        void (async () => {
          try {
            await syncTripWidgets();
            await onTripDeparted();
            // Delay may have increased after enrich — reschedule if still active.
            if (!cancelled) await scheduleDepartureSync();
          } catch (error) {
            console.warn('[widget] departure timer sync failed', error);
          }
        })();
      }, delayMs);
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

    const scheduleLocalReminders = async () => {
      try {
        const trip = await readActiveTrip();
        if (trip) {
          await scheduleTripDepartureReminder(trip, new Date(), locale);
        }
      } catch (error) {
        console.warn('[trip] reminder bootstrap failed', error);
      }
      try {
        await scheduleEngagementReminders(new Date(), locale);
      } catch (error) {
        console.warn('[engagement] reminder bootstrap failed', error);
      }
    };

    const bootstrap = async () => {
      await syncWidgets();
      await scheduleLocalReminders();
      try {
        const lastResponse = await Notifications.getLastNotificationResponseAsync();
        if (lastResponse && isLiveActivityEndNotification(lastResponse.notification)) {
          await handleLiveActivityEndSignal();
        }
      } catch (error) {
        console.warn('[live-activity] last-response check failed', error);
      }
      try {
        await ensureStationsSpotlightIndex();
      } catch (error) {
        console.warn('[spotlight] bootstrap failed', error);
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
      if (state === 'active') {
        void scheduleLocalReminders();
      }
    });

    const unsubscribeTripChanges = subscribeTripChanges(() => {
      void syncWidgets();
    });

    const receivedSub = Notifications.addNotificationReceivedListener((notification) => {
      if (!isLiveActivityEndNotification(notification)) return;
      void handleLiveActivityEndSignal();
    });

    const responseSub = Notifications.addNotificationResponseReceivedListener((response) => {
      if (!isLiveActivityEndNotification(response.notification)) return;
      void handleLiveActivityEndSignal();
    });

    return () => {
      cancelled = true;
      clearInterval(interval);
      clearDepartureTimer();
      appStateSubscription.remove();
      unsubscribeTripChanges();
      receivedSub.remove();
      responseSub.remove();
    };
  }, [locale]);

  return null;
}
