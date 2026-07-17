import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { fetchStationDepartures, matchLiveDeparture } from '@/lib/api';
import {
  formatWidgetCountdown,
  getDepartureTimestampMs,
  getMinutesUntilDeparture,
  hasEffectiveDeparturePassed,
} from '@/lib/departureCountdown';
import { DEFAULT_WIDGET_PROPS, normalizeWidgetProps } from '@/lib/widgetDefaults';
import {
  readActiveTrip,
  readLastCoords,
  readTripHistory,
  writeLastCoords,
} from '@/lib/tripStorage';
import {
  buildPostDepartureWidgetProps,
  buildWidgetPropsWithLocation,
} from '@/lib/widgetSnapshot';
import type { PlannedDeparture, TripWidgetProps } from '@/lib/types';
import { findNearestStation } from '@/lib/nearestStation';
import tripWidget from '@/widgets/TripWidget';
import trainTripLiveActivity from '@/widgets/TrainTripLiveActivity';

const LIVE_ACTIVITY_ID_KEY = 'pn_live_activity_id_v1';

/** Keep in-app active trip briefly after departure so Past trips can update. */
const CLEAR_ACTIVE_TRIP_AFTER_MINUTES = 3;

/** Max setTimeout delay (32-bit signed int). */
const MAX_TIMER_MS = 2_147_483_647;

type LiveActivityInstance = {
  update: (p: TripWidgetProps) => Promise<void> | void;
  end: (dismissalPolicy?: 'default' | 'immediate') => Promise<void>;
};

type LiveActivityFactory = {
  start: (props: TripWidgetProps, url?: string) => LiveActivityInstance;
  getInstances: () => LiveActivityInstance[];
};

function getTripWidget() {
  return Platform.OS === 'ios' ? tripWidget : null;
}

/** UserDefaults in the widget bridge does not reliably store null values. */
function propsForWidgetBridge(props: TripWidgetProps): TripWidgetProps {
  return {
    mode: props.mode,
    headline: props.headline,
    subline: props.subline,
    stationName: props.stationName,
    trainNumber: props.trainNumber,
    departureTime: props.departureTime,
    destination: props.destination,
    countdownMinutes: props.countdownMinutes ?? -1,
    delayMinutes: props.delayMinutes ?? -1,
    platform: props.platform ?? '',
    departureAtMs: props.departureAtMs ?? -1,
  };
}

function getLiveActivityFactory(): LiveActivityFactory | null {
  return Platform.OS === 'ios' ? trainTripLiveActivity : null;
}

async function resolveCoords(): Promise<{ lat: number; lng: number } | null> {
  const cached = await readLastCoords();
  if (cached) return { lat: cached.lat, lng: cached.lng };

  const { status } = await Location.getForegroundPermissionsAsync();
  if (status !== 'granted') return null;

  try {
    const fix = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    await writeLastCoords({ lat: fix.coords.latitude, lng: fix.coords.longitude });
    return { lat: fix.coords.latitude, lng: fix.coords.longitude };
  } catch {
    return null;
  }
}

/**
 * Build a WidgetKit timeline that counts down, then switches to post-departure
 * props so the home-screen widget does not stick on "Now" if JS never runs again.
 */
function buildTimeline(
  props: TripWidgetProps,
  now = new Date(),
  afterDepartureProps?: TripWidgetProps | null,
) {
  const normalized = normalizeWidgetProps(props);

  if (
    normalized.mode !== 'active' ||
    normalized.countdownMinutes === null ||
    normalized.countdownMinutes < 0
  ) {
    return [{ date: now, props: normalized }];
  }

  const entries: { date: Date; props: TripWidgetProps }[] = [];
  const minutes = Math.max(0, normalized.countdownMinutes);
  const departureAt =
    normalized.departureAtMs && normalized.departureAtMs > 0
      ? new Date(normalized.departureAtMs)
      : new Date(now.getTime() + minutes * 60_000);

  for (let offset = 0; offset <= minutes && offset <= 180; offset += 1) {
    const date = new Date(now.getTime() + offset * 60_000);
    if (date.getTime() > departureAt.getTime()) break;
    const remaining = minutes - offset;
    entries.push({
      date,
      props: normalizeWidgetProps({
        ...normalized,
        countdownMinutes: remaining,
        headline: remaining <= 0 ? 'Now' : formatWidgetCountdown(remaining),
      }),
    });
  }

  if (afterDepartureProps) {
    const switchAt = new Date(Math.max(departureAt.getTime(), now.getTime()) + 1_000);
    entries.push({
      date: switchAt,
      props: normalizeWidgetProps(afterDepartureProps),
    });
  }

  return entries.length > 0 ? entries : [{ date: now, props: normalized }];
}

function pushWidgetState(
  widget: NonNullable<ReturnType<typeof getTripWidget>>,
  props: TripWidgetProps,
  now = new Date(),
  afterDepartureProps?: TripWidgetProps | null,
) {
  const normalized = propsForWidgetBridge(normalizeWidgetProps(props));
  const afterNormalized = afterDepartureProps
    ? propsForWidgetBridge(normalizeWidgetProps(afterDepartureProps))
    : null;
  const timeline = buildTimeline(normalized, now, afterNormalized).map((entry) => ({
    date: entry.date,
    props: propsForWidgetBridge(normalizeWidgetProps(entry.props)),
  }));

  try {
    widget.updateTimeline(timeline);
    widget.reload();
    console.log('[widget] timeline updated', {
      entries: timeline.length,
      headline: normalized.headline,
      mode: normalized.mode,
      switchesAfterDeparture: Boolean(afterNormalized),
    });
  } catch (error) {
    console.warn('[widget] updateTimeline failed', error);
  }
}

async function enrichActiveTripDelay(): Promise<PlannedDeparture | null> {
  const trip = await readActiveTrip();
  if (!trip) return null;

  try {
    const departures = await fetchStationDepartures(trip.stationName, 10);
    const live = matchLiveDeparture(trip, departures);
    if (!live) return trip;

    return {
      ...trip,
      delayMinutes: live.delayMinutes,
      platform: live.platform ?? trip.platform,
    };
  } catch (error) {
    console.warn('[widget] delay enrich failed; using stored trip', error);
    return trip;
  }
}

export async function endAllLiveActivities(): Promise<void> {
  const factory = getLiveActivityFactory();
  if (!factory) return;

  const instances = factory.getInstances();
  if (instances.length === 0) {
    await AsyncStorage.removeItem(LIVE_ACTIVITY_ID_KEY);
    return;
  }

  await Promise.all(
    instances.map(async (instance) => {
      try {
        await instance.end('immediate');
      } catch (error) {
        console.warn('[live-activity] end failed', error);
      }
    }),
  );
  await AsyncStorage.removeItem(LIVE_ACTIVITY_ID_KEY);
}

async function syncLiveActivity(
  props: TripWidgetProps,
  activeTrip: PlannedDeparture | null,
  now: Date,
): Promise<void> {
  const factory = getLiveActivityFactory();
  if (!factory) return;

  const normalized = normalizeWidgetProps(props);

  const departed =
    !activeTrip ||
    normalized.mode !== 'active' ||
    hasEffectiveDeparturePassed(
      activeTrip.departureTime,
      activeTrip.delayMinutes,
      now,
      activeTrip.timetableDate,
    ) ||
    (normalized.countdownMinutes !== null && normalized.countdownMinutes <= 0);

  if (departed) {
    await endAllLiveActivities();
    return;
  }

  const instances = factory.getInstances();
  if (instances.length > 0) {
    try {
      await instances[0].update(normalized);
    } catch (error) {
      console.warn('[live-activity] update failed; restarting', error);
      await endAllLiveActivities();
      try {
        factory.start(normalized, 'verystays://trip');
      } catch (startError) {
        console.warn('[live-activity] restart failed', startError);
      }
    }
    return;
  }

  try {
    factory.start(normalized, 'verystays://trip');
  } catch (error) {
    console.warn('[live-activity] start failed', error);
  }
}

function buildAfterDepartureProps(
  activeTrip: PlannedDeparture,
  lastTaken: Awaited<ReturnType<typeof readTripHistory>>[number] | null,
  coords: { lat: number; lng: number } | null,
  now: Date,
): TripWidgetProps {
  const nearest = coords ? findNearestStation(coords) : null;
  return buildPostDepartureWidgetProps({
    departedTrip: activeTrip,
    lastTaken,
    nearestStationName: nearest?.name ?? null,
    now,
  });
}

/** Push the latest trip state to the iOS home-screen widget and Live Activity. */
export async function syncTripWidgets(now = new Date()): Promise<TripWidgetProps> {
  const activeTrip = await enrichActiveTripDelay();
  const history = await readTripHistory();
  const coords = await resolveCoords();
  const lastTaken = history[0] ?? null;

  const props = normalizeWidgetProps(
    buildWidgetPropsWithLocation({
      activeTrip,
      lastTaken,
      coords,
      now,
    }),
  );

  const afterDepartureProps =
    activeTrip && props.mode === 'active'
      ? buildAfterDepartureProps(activeTrip, lastTaken, coords, now)
      : null;

  const widget = getTripWidget();
  if (widget) {
    pushWidgetState(widget, props, now, afterDepartureProps);
  }

  await syncLiveActivity(props, activeTrip, now);
  return props;
}

/** Seed widget with defaults before trip data is available. */
export async function seedWidgetTimeline(): Promise<void> {
  const widget = getTripWidget();
  if (!widget) return;
  pushWidgetState(widget, DEFAULT_WIDGET_PROPS);
}

/** End Live Activity and refresh widget after clearing an active trip. */
export async function clearTripWidgets(): Promise<void> {
  await endAllLiveActivities();
  await syncTripWidgets();
}

/**
 * After effective departure: end Live Activity + hide countdown immediately.
 * Clear the in-app active trip after a short grace period.
 */
export async function onTripDeparted(): Promise<void> {
  const trip = await readActiveTrip();
  if (!trip) {
    await endAllLiveActivities();
    return;
  }

  const minutes = getMinutesUntilDeparture(
    trip.departureTime,
    trip.delayMinutes,
    new Date(),
    trip.timetableDate,
  );
  if (minutes === null || minutes > 0) return;

  // Hide countdown / end Live Activity right away (storage may still keep the trip).
  await syncTripWidgets();

  if (minutes > -CLEAR_ACTIVE_TRIP_AFTER_MINUTES) return;

  const { recordTakenTrip, writeActiveTrip } = await import('@/lib/tripStorage');
  await recordTakenTrip(trip);
  await writeActiveTrip(null);
  await syncTripWidgets();
}

/**
 * Milliseconds until effective departure for scheduling a one-shot sync.
 * Returns 0 when already departed; null when unknown.
 */
export function getMsUntilEffectiveDeparture(
  trip: PlannedDeparture,
  now = new Date(),
): number | null {
  const at = getDepartureTimestampMs(
    trip.departureTime,
    trip.delayMinutes,
    now,
    trip.timetableDate,
  );
  if (at === null) return null;
  return Math.max(0, at - now.getTime());
}

export { MAX_TIMER_MS };
