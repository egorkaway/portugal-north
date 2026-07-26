import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { createTranslator, resolveAppLocale, type Locale } from '@/i18n';
import { ensureTripNotificationPermission } from '@/lib/tripNotifications';
import type { PlannedDeparture } from '@/lib/types';

/** Local notification that fires at effective departure to dismiss the Live Activity. */
export const LIVE_ACTIVITY_END_NOTIFICATION_ID = 'trip-live-activity-end';

export const LIVE_ACTIVITY_END_DATA_TYPE = 'live-activity-end';

/** Small delay so the native countdown can reach 0:00 before we dismiss. */
const END_AFTER_DEPARTURE_MS = 1_500;

export function isLiveActivityEndNotification(
  notification: Notifications.Notification | Notifications.NotificationResponse['notification'],
): boolean {
  const id = notification.request.identifier;
  if (id === LIVE_ACTIVITY_END_NOTIFICATION_ID) return true;
  const data = notification.request.content.data;
  return Boolean(data && typeof data === 'object' && data.type === LIVE_ACTIVITY_END_DATA_TYPE);
}

export async function cancelLiveActivityEndNotification(): Promise<void> {
  if (Platform.OS === 'web') return;
  try {
    await Notifications.cancelScheduledNotificationAsync(LIVE_ACTIVITY_END_NOTIFICATION_ID);
  } catch (error) {
    console.warn('[live-activity] failed to cancel end notification', error);
  }
}

/**
 * Schedule a local notification at departure so we can end the Live Activity even
 * when the app is backgrounded (JS timers are suspended).
 */
export async function scheduleLiveActivityEndNotification(
  trip: PlannedDeparture,
  departureAtMs: number,
  now = new Date(),
  locale?: Locale,
): Promise<void> {
  if (Platform.OS !== 'ios') return;

  await cancelLiveActivityEndNotification();

  const fireAt = departureAtMs + END_AFTER_DEPARTURE_MS;
  if (fireAt <= now.getTime()) {
    return;
  }

  const granted = await ensureTripNotificationPermission();
  if (!granted) {
    console.warn('[live-activity] notification permission missing; cannot schedule end');
    return;
  }

  const resolvedLocale = await resolveAppLocale(locale);
  const { t } = createTranslator(resolvedLocale);

  try {
    await Notifications.scheduleNotificationAsync({
      identifier: LIVE_ACTIVITY_END_NOTIFICATION_ID,
      content: {
        title: t('tripNotify.departedTitle'),
        body: t('tripNotify.departedBody', {
          origin: trip.stationName,
          destination: trip.destination,
        }),
        sound: false,
        data: {
          type: LIVE_ACTIVITY_END_DATA_TYPE,
          tripId: trip.id,
        },
        ...(Platform.OS === 'ios'
          ? {
              // Prefer a quiet delivery so the main job (ending the LA) is not noisy.
              interruptionLevel: 'passive' as const,
            }
          : {}),
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: new Date(fireAt),
      },
    });
    console.log('[live-activity] scheduled end notification', {
      fireAt: new Date(fireAt).toISOString(),
      tripId: trip.id,
    });
  } catch (error) {
    console.warn('[live-activity] failed to schedule end notification', error);
  }
}
