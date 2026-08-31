import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { Platform } from 'react-native';
import geofenceCatalog from '@/data/geofence-stations.json';
import { getCurrentCoords } from '@/lib/currentLocation';
import { distanceKm } from '@/lib/geo';
import { notifyStationArrival } from '@/lib/stationArrivalNotifications';

export const STATION_ARRIVAL_GEOFENCE_TASK = 'station-arrival-geofence';

/** iOS monitors at most 20 regions app-wide; keep headroom. */
const MAX_MONITORED_REGIONS = 18;
/** Only pin an airport into the monitored set if the user is this close. */
const AIRPORT_PIN_MAX_KM = 100;
const COOLDOWN_STORAGE_KEY = 'station-arrival-cooldown-v1';
const COOLDOWN_MS = 6 * 60 * 60 * 1000;

export type GeofenceStation = {
  name: string;
  slug: string;
  lat: number;
  lng: number;
  country?: string;
  kind?: 'station' | 'airport';
  iata?: string | null;
  rank?: number | null;
  departuresNextHour?: number;
  radiusMeters?: number;
};

type GeofenceCatalog = {
  radiusMeters: number;
  airportRadiusMeters?: number;
  stations: GeofenceStation[];
};

const catalog = geofenceCatalog as GeofenceCatalog;

export function getArrivalGeofenceStations(): GeofenceStation[] {
  return catalog.stations ?? [];
}

export function getArrivalGeofenceRadiusMeters(station?: GeofenceStation): number {
  if (station?.kind === 'airport') {
    return station.radiusMeters ?? catalog.airportRadiusMeters ?? 450;
  }
  return catalog.radiusMeters ?? 180;
}

function findStationByRegionIdentifier(identifier: string): GeofenceStation | undefined {
  return getArrivalGeofenceStations().find(
    (station) => station.slug === identifier || station.name === identifier,
  );
}

async function readCooldownMap(): Promise<Record<string, number>> {
  try {
    const raw = await AsyncStorage.getItem(COOLDOWN_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, number>;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

async function writeCooldown(slug: string, atMs = Date.now()): Promise<void> {
  const map = await readCooldownMap();
  map[slug] = atMs;
  const cutoff = atMs - COOLDOWN_MS * 4;
  for (const [key, value] of Object.entries(map)) {
    if (typeof value !== 'number' || value < cutoff) delete map[key];
  }
  await AsyncStorage.setItem(COOLDOWN_STORAGE_KEY, JSON.stringify(map));
}

async function isInCooldown(slug: string, now = Date.now()): Promise<boolean> {
  const map = await readCooldownMap();
  const last = map[slug];
  return typeof last === 'number' && now - last < COOLDOWN_MS;
}

/**
 * Must be defined at module scope (imported early from root layout).
 * Fires a local notification when the device enters a monitored station region.
 */
try {
  TaskManager.defineTask(STATION_ARRIVAL_GEOFENCE_TASK, async ({ data, error }) => {
  if (error) {
    console.warn('[geofence] task error', error);
    return;
  }

  const payload = data as
    | {
        eventType?: Location.GeofencingEventType;
        region?: { identifier?: string };
      }
    | undefined;

  if (!payload || payload.eventType !== Location.GeofencingEventType.Enter) {
    return;
  }

  const identifier = payload.region?.identifier;
  if (!identifier) return;

  const station = findStationByRegionIdentifier(identifier);
  if (!station) return;

  if (await isInCooldown(station.slug)) {
    return;
  }

  await writeCooldown(station.slug);
  await notifyStationArrival(station);
  });
} catch (error) {
  console.warn('[geofence] defineTask failed', error);
}

export async function hasStationArrivalBackgroundPermission(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  const background = await Location.getBackgroundPermissionsAsync();
  return background.status === Location.PermissionStatus.GRANTED;
}

/** Foreground (When In Use) is enough to register fences; Always improves delivery. */
export async function hasStationArrivalGeofencePermission(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  const foreground = await Location.getForegroundPermissionsAsync();
  return foreground.status === Location.PermissionStatus.GRANTED;
}

/**
 * Request When-In-Use first, then Always (best for closed-app region events).
 * Returns true if at least When In Use is granted so we can still try geofencing.
 */
export async function ensureStationArrivalLocationPermission(): Promise<boolean> {
  if (Platform.OS === 'web') return false;

  const foreground = await Location.requestForegroundPermissionsAsync();
  if (foreground.status !== Location.PermissionStatus.GRANTED) {
    return false;
  }

  if (Platform.OS === 'ios') {
    // Prefer Always, but do not require it — When In Use may still fire enter
    // events while the app is foregrounded or briefly after.
    try {
      await Location.requestBackgroundPermissionsAsync();
    } catch (error) {
      console.warn('[geofence] Always permission request failed', error);
    }
  }

  return true;
}

/**
 * Prefer Portuguese airports within range, then fill remaining slots with the
 * nearest busy train stations (iOS region budget is limited).
 */
function pickNearestStations(
  coords: { lat: number; lng: number },
  limit = MAX_MONITORED_REGIONS,
): GeofenceStation[] {
  const scored = getArrivalGeofenceStations()
    .map((station) => ({
      station,
      distance: distanceKm(coords.lat, coords.lng, station.lat, station.lng),
    }))
    .sort((a, b) => a.distance - b.distance);

  const picked: GeofenceStation[] = [];
  const pickedSlugs = new Set<string>();

  for (const entry of scored) {
    if (picked.length >= limit) break;
    if (entry.station.kind !== 'airport') continue;
    if (entry.distance > AIRPORT_PIN_MAX_KM) continue;
    picked.push(entry.station);
    pickedSlugs.add(entry.station.slug);
  }

  for (const entry of scored) {
    if (picked.length >= limit) break;
    if (pickedSlugs.has(entry.station.slug)) continue;
    if (entry.station.kind === 'airport') continue;
    picked.push(entry.station);
    pickedSlugs.add(entry.station.slug);
  }

  return picked;
}

/**
 * Register up to 18 geofences around nearby PT airports + busy stations.
 * Safe to call repeatedly (e.g. on app foreground).
 */
export async function refreshStationArrivalGeofences(): Promise<void> {
  if (Platform.OS !== 'ios') return;

  const stations = getArrivalGeofenceStations();
  if (stations.length === 0) return;

  const allowed = await hasStationArrivalGeofencePermission();
  if (!allowed) return;

  const coords = await getCurrentCoords({ timeoutMs: 6_000 });
  if (!coords) return;

  const nearest = pickNearestStations(coords);
  if (nearest.length === 0) return;

  const regions: Location.LocationRegion[] = nearest.map((station) => ({
    identifier: station.slug,
    latitude: station.lat,
    longitude: station.lng,
    radius: getArrivalGeofenceRadiusMeters(station),
    notifyOnEnter: true,
    notifyOnExit: false,
  }));

  try {
    const started = await Location.hasStartedGeofencingAsync(
      STATION_ARRIVAL_GEOFENCE_TASK,
    );
    if (started) {
      await Location.stopGeofencingAsync(STATION_ARRIVAL_GEOFENCE_TASK);
    }
    await Location.startGeofencingAsync(STATION_ARRIVAL_GEOFENCE_TASK, regions);
  } catch (error) {
    console.warn('[geofence] failed to refresh regions', error);
  }
}

export async function stopStationArrivalGeofences(): Promise<void> {
  if (Platform.OS === 'web') return;
  try {
    const started = await Location.hasStartedGeofencingAsync(
      STATION_ARRIVAL_GEOFENCE_TASK,
    );
    if (started) {
      await Location.stopGeofencingAsync(STATION_ARRIVAL_GEOFENCE_TASK);
    }
  } catch (error) {
    console.warn('[geofence] failed to stop', error);
  }
}
