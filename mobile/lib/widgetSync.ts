import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { fetchStationDepartures, matchLiveDeparture } from '@/lib/api';
import {
  formatWidgetCountdown,
  getMinutesUntilDeparture,
} from '@/lib/departureCountdown';
import { DEFAULT_WIDGET_PROPS, normalizeWidgetProps } from '@/lib/widgetDefaults';
import {
  readActiveTrip,
  readLastCoords,
  readTripHistory,
  writeLastCoords,
} from '@/lib/tripStorage';
import { buildWidgetPropsWithLocation } from '@/lib/widgetSnapshot';
import type { TripWidgetProps } from '@/lib/types';
import tripWidget from '@/widgets/TripWidget';
import trainTripLiveActivity from '@/widgets/TrainTripLiveActivity';

const LIVE_ACTIVITY_ID_KEY = 'pn_live_activity_id_v1';

type LiveActivityFactory = {
  start: (props: TripWidgetProps, url?: string) => { update: (p: TripWidgetProps) => void; end: () => Promise<void> };
  getInstances: () => Array<{ update: (p: TripWidgetProps) => void; end: () => Promise<void> }>;
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

function buildTimeline(props: TripWidgetProps, now = new Date()) {
  const normalized = normalizeWidgetProps(props);

  if (normalized.mode !== 'active' || normalized.countdownMinutes === null || normalized.countdownMinutes < 0) {
    return [{ date: now, props: normalized }];
  }

  const entries: { date: Date; props: TripWidgetProps }[] = [];
  const minutes = Math.max(0, normalized.countdownMinutes);

  for (let offset = 0; offset <= minutes && offset <= 180; offset += 1) {
    const date = new Date(now.getTime() + offset * 60_000);
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

  return entries.length > 0 ? entries : [{ date: now, props: normalized }];
}

function pushWidgetState(widget: NonNullable<ReturnType<typeof getTripWidget>>, props: TripWidgetProps, now = new Date()) {
  const normalized = propsForWidgetBridge(normalizeWidgetProps(props));
  const timeline = buildTimeline(normalized, now).map((entry) => ({
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
    });
  } catch (error) {
    console.warn('[widget] updateTimeline failed', error);
  }
}

async function enrichActiveTripDelay() {
  const trip = await readActiveTrip();
  if (!trip) return null;

  const departures = await fetchStationDepartures(trip.stationName, 10);
  const live = matchLiveDeparture(trip, departures);
  if (!live) return trip;

  return {
    ...trip,
    delayMinutes: live.delayMinutes,
    platform: live.platform ?? trip.platform,
  };
}

async function endAllLiveActivities(): Promise<void> {
  const factory = getLiveActivityFactory();
  if (!factory) return;

  const instances = factory.getInstances();
  if (instances.length === 0) return;

  await Promise.all(instances.map((instance) => instance.end('immediate')));
  await AsyncStorage.removeItem(LIVE_ACTIVITY_ID_KEY);
}

async function syncLiveActivity(
  props: TripWidgetProps,
  activeTrip: Awaited<ReturnType<typeof enrichActiveTripDelay>>,
  now: Date,
): Promise<void> {
  const factory = getLiveActivityFactory();
  if (!factory) return;

  const normalized = normalizeWidgetProps(props);

  const minutesUntil =
    activeTrip &&
    getMinutesUntilDeparture(activeTrip.departureTime, activeTrip.delayMinutes, now);

  const hasDeparted =
    normalized.mode !== 'active' ||
    !activeTrip ||
    minutesUntil === null ||
    minutesUntil <= 0 ||
    (normalized.countdownMinutes !== null && normalized.countdownMinutes <= 0);

  if (hasDeparted) {
    await endAllLiveActivities();
    return;
  }

  const instances = factory.getInstances();
  if (instances.length > 0) {
    await instances[0].update(normalized);
    return;
  }

  factory.start(normalized, 'verystays://trip');
}

/** Push the latest trip state to the iOS home-screen widget and Live Activity. */
export async function syncTripWidgets(now = new Date()): Promise<TripWidgetProps> {
  const activeTrip = await enrichActiveTripDelay();
  const history = await readTripHistory();
  const coords = await resolveCoords();

  const props = normalizeWidgetProps(
    buildWidgetPropsWithLocation({
      activeTrip,
      lastTaken: history[0] ?? null,
      coords,
      now,
    }),
  );

  const widget = getTripWidget();
  if (widget) {
    pushWidgetState(widget, props, now);
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
  await syncTripWidgets();
}

/** Record departure passed, then refresh surfaces. */
export async function onTripDeparted(): Promise<void> {
  const trip = await readActiveTrip();
  if (!trip) return;

  const minutes = getMinutesUntilDeparture(trip.departureTime, trip.delayMinutes);
  if (minutes === null || minutes >= 0) return;

  // End Live Activity as soon as departure passes (handled in syncLiveActivity).
  // Keep the active trip in-app for a few minutes so Past trips can update.
  const CLEAR_ACTIVE_TRIP_AFTER_MINUTES = 3;
  if (minutes > -CLEAR_ACTIVE_TRIP_AFTER_MINUTES) return;

  const { recordTakenTrip, writeActiveTrip } = await import('@/lib/tripStorage');
  await recordTakenTrip(trip);
  await writeActiveTrip(null);
  await syncTripWidgets();
}
