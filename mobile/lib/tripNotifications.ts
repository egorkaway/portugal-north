import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import {
  getEffectiveDepartureClock,
  getMinutesUntilDeparture,
} from '@/lib/departureCountdown';
import type { PlannedDeparture } from '@/lib/types';

export const TRIP_DEPARTURE_REMINDER_ID = 'trip-departure-reminder';

const MIN_MINUTES_BEFORE_NOTIFY = 5;
const NOTIFY_MINUTES_BEFORE_DEPARTURE = 3;

export function buildTripDepartureReminderMessage(trip: PlannedDeparture): string {
  const departureClock =
    getEffectiveDepartureClock(trip.departureTime, trip.delayMinutes) ??
    trip.departureTime;

  return `We hope you managed to get to the ${departureClock} train that is taking you from ${trip.stationName} to ${trip.destination}.`;
}

export async function ensureTripNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'web') return false;

  const permissions = await Notifications.getPermissionsAsync();
  if (permissions.granted) return true;

  const requested = await Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: false,
      allowSound: true,
    },
  });

  return (
    requested.granted ||
    requested.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
  );
}

export async function cancelTripDepartureReminder(): Promise<void> {
  if (Platform.OS === 'web') return;

  try {
    await Notifications.cancelScheduledNotificationAsync(TRIP_DEPARTURE_REMINDER_ID);
  } catch (error) {
    console.warn('[trip] failed to cancel departure reminder', error);
  }
}

export async function scheduleTripDepartureReminder(
  trip: PlannedDeparture,
  now = new Date(),
): Promise<void> {
  if (Platform.OS === 'web') return;

  await cancelTripDepartureReminder();

  const minutesUntil = getMinutesUntilDeparture(
    trip.departureTime,
    trip.delayMinutes,
    now,
    trip.timetableDate,
  );

  if (minutesUntil === null || minutesUntil <= MIN_MINUTES_BEFORE_NOTIFY) {
    return;
  }

  const notifyInMinutes = minutesUntil - NOTIFY_MINUTES_BEFORE_DEPARTURE;
  if (notifyInMinutes <= 0) {
    return;
  }

  const granted = await ensureTripNotificationPermission();
  if (!granted) {
    return;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('trip-reminders', {
      name: 'Trip reminders',
      importance: Notifications.AndroidImportance.HIGH,
    });
  }

  const fireDate = new Date(now.getTime() + notifyInMinutes * 60_000);

  try {
    await Notifications.scheduleNotificationAsync({
      identifier: TRIP_DEPARTURE_REMINDER_ID,
      content: {
        title: 'Train departing soon',
        body: buildTripDepartureReminderMessage(trip),
        sound: true,
        ...(Platform.OS === 'android'
          ? { channelId: 'trip-reminders' }
          : {}),
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: fireDate,
      },
    });
  } catch (error) {
    console.warn('[trip] failed to schedule departure reminder', error);
  }
}
