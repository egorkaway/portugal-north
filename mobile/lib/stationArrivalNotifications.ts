import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { createTranslator, resolveAppLocale } from '@/i18n';
import { ensureTripNotificationPermission } from '@/lib/tripNotifications';

export const STATION_ARRIVAL_NOTIFICATION_TYPE = 'station-arrival';

export type ArrivalStationRef = {
  name: string;
  slug: string;
  kind?: 'station' | 'airport';
};

export function isStationArrivalNotification(
  notification: Notifications.Notification,
): boolean {
  const data = notification.request.content.data as
    | { type?: string }
    | undefined;
  return data?.type === STATION_ARRIVAL_NOTIFICATION_TYPE;
}

export function getStationSlugFromArrivalNotification(
  notification: Notifications.Notification,
): string | null {
  if (!isStationArrivalNotification(notification)) return null;
  const data = notification.request.content.data as
    | { slug?: string; stationName?: string }
    | undefined;
  return data?.slug ?? null;
}

export async function notifyStationArrival(
  station: ArrivalStationRef,
): Promise<void> {
  if (Platform.OS === 'web') return;

  const granted = await ensureTripNotificationPermission();
  if (!granted) return;

  const locale = await resolveAppLocale();
  const { t } = createTranslator(locale);
  const isAirport = station.kind === 'airport';

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('station-arrivals', {
      name: t('arrivalNotify.channelName'),
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: isAirport ? t('arrivalNotify.airportTitle') : t('arrivalNotify.title'),
        body: isAirport
          ? t('arrivalNotify.airportBody', { station: station.name })
          : t('arrivalNotify.body', { station: station.name }),
        sound: true,
        data: {
          type: STATION_ARRIVAL_NOTIFICATION_TYPE,
          slug: station.slug,
          stationName: station.name,
          kind: station.kind ?? 'station',
        },
        ...(Platform.OS === 'android' ? { channelId: 'station-arrivals' } : {}),
      },
      trigger: null,
    });
  } catch (error) {
    console.warn('[geofence] failed to present arrival notification', error);
  }
}
