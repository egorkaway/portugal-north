import { useSyncExternalStore } from "react";
import { lisbonDateAndTime } from "@/lib/cpDeparturesParse";
import { shouldClearActiveTrip } from "@/lib/departureCountdown";

const LEGACY_STORAGE_KEY = "pn_planned_departures_v1";
const ACTIVE_TRIP_STORAGE_KEY = "pn_active_trip_v2";

export type PlannedDeparture = {
  id: string;
  stationName: string;
  trainNumber: string;
  departureTime: string;
  destination: string;
  serviceType: string;
  platform: string | null;
  delayMinutes: number | null;
  timetableDate: string;
  selectedAt: string;
};

const listeners = new Set<() => void>();
let cache: PlannedDeparture | null | undefined;

function emit(): void {
  cache = undefined;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function parseLegacyId(id: string, stationName: string): PlannedDeparture | null {
  const parts = id.split("|");
  if (parts.length < 4) return null;
  const [, trainNumber, departureTime, destination, maybeDate] = parts;
  if (!trainNumber || !departureTime || !destination) return null;
  const { date } = lisbonDateAndTime();
  const timetableDate =
    maybeDate && /^\d{4}-\d{2}-\d{2}$/.test(maybeDate) ? maybeDate : date;
  return {
    id:
      parts.length >= 5
        ? id
        : buildPlannedDepartureId(
            stationName,
            trainNumber,
            departureTime,
            destination,
            timetableDate,
          ),
    stationName,
    trainNumber,
    departureTime,
    destination,
    serviceType: "—",
    platform: null,
    delayMinutes: null,
    timetableDate,
    selectedAt: new Date().toISOString(),
  };
}

function migrateLegacyTrip(): PlannedDeparture | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Record<string, string[]>;
    for (const [stationName, ids] of Object.entries(parsed)) {
      const first = ids?.[0];
      if (typeof first === "string") {
        const trip = parseLegacyId(first, stationName);
        if (trip) return trip;
      }
    }
  } catch {
    // ignore
  }
  return null;
}

function readActiveTrip(): PlannedDeparture | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(ACTIVE_TRIP_STORAGE_KEY);
    if (!raw) return migrateLegacyTrip();
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return null;
    const trip = parsed as PlannedDeparture;
    if (
      typeof trip.id !== "string" ||
      typeof trip.stationName !== "string" ||
      typeof trip.trainNumber !== "string" ||
      typeof trip.departureTime !== "string"
    ) {
      return null;
    }
    if (shouldClearActiveTrip(trip)) {
      writeActiveTrip(null);
      return null;
    }
    return trip;
  } catch {
    return null;
  }
}

function writeActiveTrip(trip: PlannedDeparture | null): void {
  if (typeof localStorage === "undefined") return;
  try {
    if (trip) {
      localStorage.setItem(ACTIVE_TRIP_STORAGE_KEY, JSON.stringify(trip));
    } else {
      localStorage.removeItem(ACTIVE_TRIP_STORAGE_KEY);
    }
    localStorage.removeItem(LEGACY_STORAGE_KEY);
  } catch {
    // best-effort
  }
}

function getSnapshot(): PlannedDeparture | null {
  if (cache === undefined) cache = readActiveTrip();
  return cache;
}

export function buildPlannedDepartureId(
  stationName: string,
  trainNumber: string,
  time: string,
  destination: string,
  timetableDate: string,
): string {
  return `${stationName}|${trainNumber}|${time}|${destination}|${timetableDate}`;
}

export function useActiveTrip(): PlannedDeparture | null {
  return useSyncExternalStore(subscribe, getSnapshot, () => null);
}

export function setActiveTrip(trip: PlannedDeparture): void {
  writeActiveTrip(trip);
  emit();
}

export function clearActiveTrip(): void {
  writeActiveTrip(null);
  emit();
}

export function toggleActiveTrip(
  stationName: string,
  departure: Omit<PlannedDeparture, "id" | "stationName" | "selectedAt" | "timetableDate"> & {
    id?: string;
    timetableDate?: string;
    selectedAt?: string;
  },
): PlannedDeparture | null {
  const { date } = lisbonDateAndTime();
  const timetableDate = departure.timetableDate ?? date;
  const id =
    departure.id ??
    buildPlannedDepartureId(
      stationName,
      departure.trainNumber,
      departure.departureTime,
      departure.destination,
      timetableDate,
    );
  const current = readActiveTrip();
  if (current?.id === id) {
    clearActiveTrip();
    return null;
  }

  const trip: PlannedDeparture = {
    id,
    stationName,
    trainNumber: departure.trainNumber,
    departureTime: departure.departureTime,
    destination: departure.destination,
    serviceType: departure.serviceType,
    platform: departure.platform,
    delayMinutes: departure.delayMinutes,
    timetableDate,
    selectedAt: departure.selectedAt ?? new Date().toISOString(),
  };
  setActiveTrip(trip);
  return trip;
}

/** @deprecated Use useActiveTrip / toggleActiveTrip */
export function getPlannedDepartureIds(stationName: string): Set<string> {
  const trip = readActiveTrip();
  if (trip?.stationName === stationName) return new Set([trip.id]);
  return new Set();
}

/** @deprecated Use toggleActiveTrip */
export function togglePlannedDepartureId(
  stationName: string,
  departureId: string,
): Set<string> {
  const current = readActiveTrip();
  if (current?.id === departureId && current.stationName === stationName) {
    clearActiveTrip();
    return new Set();
  }
  return getPlannedDepartureIds(stationName);
}

export function isTakingDeparture(stationName: string, departureId: string): boolean {
  const trip = readActiveTrip();
  return trip?.stationName === stationName && trip.id === departureId;
}
