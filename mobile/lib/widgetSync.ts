import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { fetchStationDepartures, matchLiveDeparture } from "@/lib/api";
import {
  formatDepartureCountdown,
  getMinutesUntilDeparture,
} from "@/lib/departureCountdown";
import {
  readActiveTrip,
  readLastCoords,
  readTripHistory,
  writeLastCoords,
} from "@/lib/tripStorage";
import { buildWidgetPropsWithLocation } from "@/lib/widgetSnapshot";
import type { TripWidgetProps } from "@/lib/types";

const LIVE_ACTIVITY_ID_KEY = "pn_live_activity_id_v1";

type TripWidgetModule = {
  default: {
    updateTimeline: (entries: { date: Date; props: TripWidgetProps }[]) => void;
    reload: () => void;
  };
};

type LiveActivityModule = {
  default: {
    start: (props: TripWidgetProps, url?: string) => { update: (p: TripWidgetProps) => void; end: () => Promise<void> };
    getInstances: () => Array<{ update: (p: TripWidgetProps) => void; end: () => Promise<void> }>;
  };
};

function getTripWidget(): TripWidgetModule["default"] | null {
  if (Platform.OS !== "ios") return null;
  try {
    return (require("@/widgets/TripWidget").default as TripWidgetModule["default"]);
  } catch {
    return null;
  }
}

function getLiveActivityFactory(): LiveActivityModule["default"] | null {
  if (Platform.OS !== "ios") return null;
  try {
    return (require("@/widgets/TrainTripLiveActivity").default as LiveActivityModule["default"]);
  } catch {
    return null;
  }
}

async function resolveCoords(): Promise<{ lat: number; lng: number } | null> {
  const cached = await readLastCoords();
  if (cached) return { lat: cached.lat, lng: cached.lng };

  const { status } = await Location.getForegroundPermissionsAsync();
  if (status !== "granted") return null;

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
  if (props.mode !== "active" || props.countdownMinutes === null) {
    return [{ date: now, props }];
  }

  const entries: { date: Date; props: TripWidgetProps }[] = [];
  const minutes = Math.max(0, props.countdownMinutes);

  for (let offset = 0; offset <= minutes && offset <= 180; offset += 1) {
    const date = new Date(now.getTime() + offset * 60_000);
    const remaining = minutes - offset;
    entries.push({
      date,
      props: {
        ...props,
        countdownMinutes: remaining,
        headline: remaining <= 0 ? "Now" : formatDepartureCountdown(remaining),
      },
    });
  }

  return entries.length > 0 ? entries : [{ date: now, props }];
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

async function syncLiveActivity(props: TripWidgetProps): Promise<void> {
  const factory = getLiveActivityFactory();
  if (!factory) return;

  if (props.mode !== "active") {
    const instances = factory.getInstances();
    await Promise.all(instances.map((instance) => instance.end()));
    await AsyncStorage.removeItem(LIVE_ACTIVITY_ID_KEY);
    return;
  }

  const instances = factory.getInstances();
  if (instances.length > 0) {
    instances[0].update(props);
    return;
  }

  factory.start(props, "verystays://trip");
}

/** Push the latest trip state to the iOS home-screen widget and Live Activity. */
export async function syncTripWidgets(now = new Date()): Promise<TripWidgetProps> {
  const activeTrip = await enrichActiveTripDelay();
  const history = await readTripHistory();
  const coords = await resolveCoords();

  const props = buildWidgetPropsWithLocation({
    activeTrip,
    lastTaken: history[0] ?? null,
    coords,
    now,
  });

  const widget = getTripWidget();
  if (widget) {
    widget.updateTimeline(buildTimeline(props, now));
    widget.reload();
  }

  await syncLiveActivity(props);
  return props;
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
  if (minutes === null || minutes > 0) return;

  const { recordTakenTrip, writeActiveTrip } = await import("@/lib/tripStorage");
  await recordTakenTrip(trip);
  await writeActiveTrip(null);
  await syncTripWidgets();
}
