import AsyncStorage from "@react-native-async-storage/async-storage";
import type { CompletedTripRecord, PlannedDeparture } from "@/lib/types";
import { lisbonDateAndTime } from "@/lib/lisbonTime";
import { notifyTripChanged } from "@/lib/tripEvents";
import { cancelTripDepartureReminder, scheduleTripDepartureReminder } from "@/lib/tripNotifications";

const ACTIVE_TRIP_KEY = "pn_active_trip_v2";
const TRIP_HISTORY_KEY = "pn_trip_history_v1";
const LAST_COORDS_KEY = "portugal-by-train-last-coords";

export type StoredCoords = { lat: number; lng: number; at: number };

export async function readActiveTrip(): Promise<PlannedDeparture | null> {
  const raw = await AsyncStorage.getItem(ACTIVE_TRIP_KEY);
  if (!raw) return null;
  try {
    const trip = JSON.parse(raw) as PlannedDeparture;
    if (!trip?.id || !trip.stationName || !trip.departureTime) return null;
    return trip;
  } catch {
    return null;
  }
}

export async function writeActiveTrip(trip: PlannedDeparture | null): Promise<void> {
  if (trip) {
    await AsyncStorage.setItem(ACTIVE_TRIP_KEY, JSON.stringify(trip));
  } else {
    await AsyncStorage.removeItem(ACTIVE_TRIP_KEY);
    try {
      await cancelTripDepartureReminder();
    } catch (error) {
      console.warn("[trip] failed to cancel departure reminder", error);
    }
  }
  notifyTripChanged();
}

export async function readTripHistory(): Promise<CompletedTripRecord[]> {
  const raw = await AsyncStorage.getItem(TRIP_HISTORY_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is CompletedTripRecord =>
        Boolean(item) &&
        typeof item === "object" &&
        typeof (item as CompletedTripRecord).completedAt === "string",
    );
  } catch {
    return [];
  }
}

export async function recordTakenTrip(
  trip: PlannedDeparture,
  finalStationName = trip.destination,
): Promise<void> {
  const records = await readTripHistory();
  const existing = records.find((record) => record.id === trip.id);
  const completedAt = existing?.completedAt ?? new Date().toISOString();
  const next: CompletedTripRecord = { ...trip, completedAt, finalStationName };
  const withoutDuplicate = records.filter((record) => record.id !== trip.id);
  await AsyncStorage.setItem(
    TRIP_HISTORY_KEY,
    JSON.stringify([next, ...withoutDuplicate].slice(0, 100)),
  );
  notifyTripChanged();
}

export async function deleteTripHistoryRecord(tripId: string): Promise<void> {
  const records = await readTripHistory();
  await AsyncStorage.setItem(
    TRIP_HISTORY_KEY,
    JSON.stringify(records.filter((record) => record.id !== tripId)),
  );
  notifyTripChanged();
}

export async function readLastCoords(): Promise<StoredCoords | null> {
  const raw = await AsyncStorage.getItem(LAST_COORDS_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as StoredCoords;
    if (typeof parsed.lat !== "number" || typeof parsed.lng !== "number") return null;
    if (Date.now() - parsed.at > 7 * 24 * 60 * 60 * 1000) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function writeLastCoords(coords: { lat: number; lng: number }): Promise<void> {
  const stored: StoredCoords = { ...coords, at: Date.now() };
  await AsyncStorage.setItem(LAST_COORDS_KEY, JSON.stringify(stored));
}

export function buildPlannedDepartureId(
  stationName: string,
  trainNumber: string,
  time: string,
  destination: string,
): string {
  return `${stationName}|${trainNumber}|${time}|${destination}`;
}

export async function setActiveTripFromDeparture(input: {
  stationName: string;
  trainNumber: string;
  departureTime: string;
  destination: string;
  serviceType: string;
  platform: string | null;
  delayMinutes: number | null;
}): Promise<PlannedDeparture> {
  const { date } = lisbonDateAndTime();
  const trip: PlannedDeparture = {
    id: buildPlannedDepartureId(
      input.stationName,
      input.trainNumber,
      input.departureTime,
      input.destination,
    ),
    stationName: input.stationName,
    trainNumber: input.trainNumber,
    departureTime: input.departureTime,
    destination: input.destination,
    serviceType: input.serviceType,
    platform: input.platform,
    delayMinutes: input.delayMinutes,
    timetableDate: date,
    selectedAt: new Date().toISOString(),
  };
  await writeActiveTrip(trip);
  return trip;
}

/** Set active trip and refresh widgets immediately. History is recorded after departure. */
export async function takeActiveTrip(input: {
  stationName: string;
  trainNumber: string;
  departureTime: string;
  destination: string;
  serviceType: string;
  platform: string | null;
  delayMinutes: number | null;
}): Promise<PlannedDeparture> {
  const trip = await setActiveTripFromDeparture(input);
  try {
    await scheduleTripDepartureReminder(trip);
  } catch (error) {
    console.warn("[trip] departure reminder scheduling failed", error);
  }
  try {
    const { syncTripWidgets } = await import("@/lib/widgetSync");
    await syncTripWidgets();
  } catch (error) {
    console.warn("[trip] widget sync failed after take", error);
  }
  return trip;
}

/** Clear active tracking and refresh widgets. */
export async function clearActiveTrip(): Promise<void> {
  await writeActiveTrip(null);
  try {
    const { syncTripWidgets } = await import("@/lib/widgetSync");
    await syncTripWidgets();
  } catch (error) {
    console.warn("[trip] widget sync failed after clear", error);
  }
}
