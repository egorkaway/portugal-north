import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { createTranslator, resolveAppLocale, type Locale } from '@/i18n';

export const ENGAGEMENT_DAY_OFFSETS = [3, 5, 7, 9, 11] as const;

const STORAGE_KEY = '@verystays/engagement_reminder_message_ids';
const ANDROID_CHANNEL_ID = 'engagement-reminders';

export type EngagementMessage = {
  id: string;
  title: string;
  body: string;
};

const ENGAGEMENT_MESSAGE_DEFS = [
  {
    id: 'map-wander',
    titleKey: 'engagement.mapWanderTitle',
    bodyKey: 'engagement.mapWanderBody',
  },
  {
    id: 'live-countdown',
    titleKey: 'engagement.liveCountdownTitle',
    bodyKey: 'engagement.liveCountdownBody',
  },
  {
    id: 'budget-stays',
    titleKey: 'engagement.budgetStaysTitle',
    bodyKey: 'engagement.budgetStaysBody',
  },
  {
    id: 'reliability',
    titleKey: 'engagement.reliabilityTitle',
    bodyKey: 'engagement.reliabilityBody',
  },
  {
    id: 'visited',
    titleKey: 'engagement.visitedTitle',
    bodyKey: 'engagement.visitedBody',
  },
  {
    id: 'nearest',
    titleKey: 'engagement.nearestTitle',
    bodyKey: 'engagement.nearestBody',
  },
  {
    id: 'airport-links',
    titleKey: 'engagement.airportTitle',
    bodyKey: 'engagement.airportBody',
  },
  {
    id: 'widget-glance',
    titleKey: 'engagement.widgetTitle',
    bodyKey: 'engagement.widgetBody',
  },
] as const;

/** Build localized benefit / exploration nudges for the given locale. */
export function buildEngagementMessages(locale: Locale): EngagementMessage[] {
  const { t } = createTranslator(locale);
  return ENGAGEMENT_MESSAGE_DEFS.map((def) => ({
    id: def.id,
    title: t(def.titleKey),
    body: t(def.bodyKey),
  }));
}

/** @deprecated Prefer buildEngagementMessages(locale). English fallback for callers. */
export const ENGAGEMENT_MESSAGES: readonly EngagementMessage[] =
  buildEngagementMessages('en');

export function engagementReminderId(dayOffset: number): string {
  return `engagement-reminder-day-${dayOffset}`;
}

export function shuffleInPlace<T>(items: T[], random: () => number = Math.random): T[] {
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    const tmp = items[i]!;
    items[i] = items[j]!;
    items[j] = tmp;
  }
  return items;
}

/**
 * Prefer messages not used in the previous cycle, then shuffle within each group
 * so every open that starts a new cycle gets a different order.
 */
export function orderMessagesForSchedule(
  messages: readonly EngagementMessage[],
  previousIds: readonly string[],
  count: number,
  random: () => number = Math.random,
): EngagementMessage[] {
  const previous = new Set(previousIds);
  const fresh = messages.filter((message) => !previous.has(message.id));
  const used = messages.filter((message) => previous.has(message.id));
  shuffleInPlace(fresh, random);
  shuffleInPlace(used, random);
  return [...fresh, ...used].slice(0, count);
}

export function buildEngagementSchedule(
  messages: readonly EngagementMessage[],
  dayOffsets: readonly number[],
  previousIds: readonly string[],
  now: Date = new Date(),
  random: () => number = Math.random,
): Array<EngagementMessage & { dayOffset: number; fireAt: Date }> {
  const ordered = orderMessagesForSchedule(messages, previousIds, dayOffsets.length, random);
  return dayOffsets.map((dayOffset, index) => {
    const message = ordered[index]!;
    const fireAt = new Date(now.getTime() + dayOffset * 24 * 60 * 60 * 1000);
    return { ...message, dayOffset, fireAt };
  });
}

async function readPreviousMessageIds(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((value): value is string => typeof value === 'string');
  } catch {
    return [];
  }
}

async function writePreviousMessageIds(ids: string[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

async function hasNotificationPermission(): Promise<boolean> {
  const permissions = await Notifications.getPermissionsAsync();
  return (
    permissions.granted ||
    permissions.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
  );
}

export async function cancelEngagementReminders(): Promise<void> {
  if (Platform.OS === 'web') return;

  await Promise.all(
    ENGAGEMENT_DAY_OFFSETS.map(async (dayOffset) => {
      try {
        await Notifications.cancelScheduledNotificationAsync(engagementReminderId(dayOffset));
      } catch {
        // Already cancelled or never scheduled.
      }
    }),
  );
}

async function hasPendingEngagementReminder(): Promise<boolean> {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  const ids = new Set(ENGAGEMENT_DAY_OFFSETS.map((dayOffset) => engagementReminderId(dayOffset)));
  return scheduled.some((entry) => ids.has(entry.identifier));
}

/**
 * On app open: if no future engagement reminders remain, schedule a fresh
 * shuffled set at +3 / +5 / +7 / +9 / +11 days from now.
 */
export async function scheduleEngagementReminders(
  now = new Date(),
  locale?: Locale,
): Promise<void> {
  if (Platform.OS === 'web') return;

  try {
    const granted = await hasNotificationPermission();
    if (!granted) return;

    if (await hasPendingEngagementReminder()) {
      return;
    }

    const resolvedLocale = await resolveAppLocale(locale);
    const { t } = createTranslator(resolvedLocale);
    const messages = buildEngagementMessages(resolvedLocale);
    const previousIds = await readPreviousMessageIds();
    const schedule = buildEngagementSchedule(
      messages,
      ENGAGEMENT_DAY_OFFSETS,
      previousIds,
      now,
    );

    await cancelEngagementReminders();

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync(ANDROID_CHANNEL_ID, {
        name: t('engagement.channelName'),
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }

    for (const item of schedule) {
      await Notifications.scheduleNotificationAsync({
        identifier: engagementReminderId(item.dayOffset),
        content: {
          title: item.title,
          body: item.body,
          sound: true,
          data: {
            type: 'engagement-reminder',
            messageId: item.id,
            dayOffset: item.dayOffset,
          },
          ...(Platform.OS === 'android' ? { channelId: ANDROID_CHANNEL_ID } : {}),
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: item.fireAt,
        },
      });
    }

    await writePreviousMessageIds(schedule.map((item) => item.id));
  } catch (error) {
    console.warn('[engagement] failed to schedule reminders', error);
  }
}
