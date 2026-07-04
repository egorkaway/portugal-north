import type { PlannedDeparture } from "@/lib/plannedDepartures";
import { useSyncExternalStore } from "react";

const STORAGE_KEY = "pn_trip_history_v1";

export type CompletedTripRecord = PlannedDeparture & {
  completedAt: string;
  finalStationName: string;
};

const listeners = new Set<() => void>();
let cache: CompletedTripRecord[] | undefined;

function emit(): void {
  cache = undefined;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function readHistory(): CompletedTripRecord[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is CompletedTripRecord =>
        Boolean(item) &&
        typeof item === "object" &&
        typeof (item as CompletedTripRecord).completedAt === "string" &&
        typeof (item as CompletedTripRecord).id === "string",
    );
  } catch {
    return [];
  }
}

function writeHistory(records: CompletedTripRecord[]): void {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch {
    // best-effort, hidden from UI
  }
}

function getSnapshot(): CompletedTripRecord[] {
  if (cache === undefined) cache = readHistory();
  return cache;
}

/** Persist a taken or completed trip locally (most recent first). */
export function recordTakenTrip(
  trip: PlannedDeparture,
  finalStationName: string = trip.destination,
): void {
  const records = readHistory();
  const existing = records.find((record) => record.id === trip.id);
  const completedAt = existing?.completedAt ?? new Date().toISOString();
  const next: CompletedTripRecord = { ...trip, completedAt, finalStationName };
  const withoutDuplicate = records.filter((record) => record.id !== trip.id);
  writeHistory([next, ...withoutDuplicate].slice(0, 100));
  emit();
}

/** @deprecated Prefer recordTakenTrip */
export function recordCompletedTrip(
  trip: PlannedDeparture,
  finalStationName: string,
): void {
  recordTakenTrip(trip, finalStationName);
}

export function readTripHistory(): CompletedTripRecord[] {
  return readHistory();
}

export function deleteTripHistoryRecord(tripId: string): void {
  const records = readHistory();
  const next = records.filter((record) => record.id !== tripId);
  writeHistory(next);
  emit();
}

export function useTripHistory(): CompletedTripRecord[] {
  return useSyncExternalStore(subscribe, getSnapshot, () => []);
}
