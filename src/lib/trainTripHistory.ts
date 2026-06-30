import type { PlannedDeparture } from "@/lib/plannedDepartures";

const STORAGE_KEY = "pn_trip_history_v1";

export type CompletedTripRecord = PlannedDeparture & {
  completedAt: string;
  finalStationName: string;
};

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

/** Persist a completed trip locally. Not surfaced in the UI yet. */
export function recordCompletedTrip(
  trip: PlannedDeparture,
  finalStationName: string,
): void {
  const records = readHistory();
  const completedAt = new Date().toISOString();
  const next: CompletedTripRecord = { ...trip, completedAt, finalStationName };
  const withoutDuplicate = records.filter((record) => record.id !== trip.id);
  writeHistory([next, ...withoutDuplicate].slice(0, 100));
}

export function readTripHistory(): CompletedTripRecord[] {
  return readHistory();
}
