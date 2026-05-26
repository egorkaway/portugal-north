import type {
  HotelClosedReportSyncPayload,
  HotelVoteSyncPayload,
  StationImageVoteSyncPayload,
  StationVoteSyncPayload,
} from "./voteTypes";

const QUEUE_KEY = "pn_vote_sync_queue_v1";

export type QueuedVotePayload =
  | StationVoteSyncPayload
  | HotelVoteSyncPayload
  | StationImageVoteSyncPayload
  | HotelClosedReportSyncPayload;

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export function subscribeVoteSyncQueue(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function readQueue(): QueuedVotePayload[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as QueuedVotePayload[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeQueue(queue: QueuedVotePayload[]) {
  if (typeof localStorage === "undefined") return;
  try {
    if (queue.length === 0) {
      localStorage.removeItem(QUEUE_KEY);
    } else {
      localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    }
  } catch {
    // Best-effort queue persistence.
  }
  emit();
}

export function getPendingVoteSyncCount(): number {
  return readQueue().length;
}

export function enqueueVoteSync(payload: QueuedVotePayload): void {
  const queue = readQueue();
  queue.push(payload);
  writeQueue(queue);
}

export async function flushVoteSyncQueue(
  post: (payload: QueuedVotePayload) => Promise<boolean>,
): Promise<void> {
  if (typeof navigator !== "undefined" && !navigator.onLine) return;

  const queue = readQueue();
  if (queue.length === 0) return;

  const remaining: QueuedVotePayload[] = [];
  for (const payload of queue) {
    const ok = await post(payload);
    if (!ok) remaining.push(payload);
  }
  writeQueue(remaining);
}
