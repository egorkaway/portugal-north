import type { PlannedDeparture } from "@/lib/plannedDepartures";
import { useSyncExternalStore } from "react";
import { getEffectiveDepartureClock } from "@/lib/departureCountdown";

const STORAGE_KEY = "pn_trip_history_v1";

export type CompletedTripRecord = PlannedDeparture & {
  completedAt: string;
  finalStationName: string;
  /** Effective leave clock (HH:mm) when different from scheduled `departureTime`. */
  actualDepartureTime?: string | null;
};

export type RecordTakenTripLive = {
  delayMinutes?: number | null;
  platform?: string | null;
};

/** Derive history fields from scheduled time + latest live delay/platform. */
export function resolveTakenTripHistoryFields(
  trip: Pick<PlannedDeparture, "departureTime" | "platform" | "delayMinutes">,
  live?: RecordTakenTripLive,
): Pick<CompletedTripRecord, "actualDepartureTime" | "platform" | "delayMinutes"> {
  const delayMinutes =
    live?.delayMinutes !== undefined ? live.delayMinutes : trip.delayMinutes;
  const platform = live?.platform !== undefined ? live.platform : trip.platform;
  const effective = getEffectiveDepartureClock(trip.departureTime, delayMinutes ?? null);
  const actualDepartureTime =
    effective && effective !== trip.departureTime ? effective : null;
  return { actualDepartureTime, platform: platform ?? null, delayMinutes: delayMinutes ?? null };
}

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
  live?: RecordTakenTripLive,
): void {
  const records = readHistory();
  const existing = records.find((record) => record.id === trip.id);
  const completedAt = existing?.completedAt ?? new Date().toISOString();
  const fields = resolveTakenTripHistoryFields(trip, live);
  const next: CompletedTripRecord = {
    ...trip,
    completedAt,
    finalStationName,
    platform: fields.platform ?? existing?.platform ?? trip.platform,
    delayMinutes: fields.delayMinutes ?? existing?.delayMinutes ?? trip.delayMinutes,
    actualDepartureTime:
      fields.actualDepartureTime ?? existing?.actualDepartureTime ?? null,
  };
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
