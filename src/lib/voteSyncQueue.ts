import type {
  HotelClosedReportSyncPayload,
  HotelVoteSyncPayload,
  StationImageVoteSyncPayload,
  StationVoteSyncPayload,
} from "./voteTypes";

const QUEUE_KEY = "pn_vote_sync_queue_v1";
const FLUSH_DEBOUNCE_MS = 100;

export type QueuedVotePayload =
  | StationVoteSyncPayload
  | HotelVoteSyncPayload
  | StationImageVoteSyncPayload
  | HotelClosedReportSyncPayload;

const queueListeners = new Set<() => void>();
const enqueueListeners = new Set<() => void>();

function emitQueueChange() {
  queueListeners.forEach((l) => l());
}

function emitEnqueue() {
  enqueueListeners.forEach((l) => l());
}

/** Notifies when the queue changes (enqueue or flush). */
export function subscribeVoteSyncQueue(cb: () => void) {
  queueListeners.add(cb);
  return () => queueListeners.delete(cb);
}

/** Notifies only when a new item is enqueued (for scheduling flush). */
export function subscribeVoteSyncEnqueue(cb: () => void) {
  enqueueListeners.add(cb);
  return () => enqueueListeners.delete(cb);
}

let flushTimer: ReturnType<typeof setTimeout> | null = null;
let flushInProgress = false;
let scheduledFlush: (() => Promise<void>) | null = null;

export function scheduleVoteSyncFlush(flush: () => Promise<void>): void {
  scheduledFlush = flush;
  if (flushInProgress) return;
  if (flushTimer !== null) return;
  flushTimer = setTimeout(() => {
    flushTimer = null;
    void runScheduledFlush();
  }, FLUSH_DEBOUNCE_MS);
}

async function runScheduledFlush(): Promise<void> {
  const flush = scheduledFlush;
  if (!flush || flushInProgress) return;
  if (typeof navigator !== "undefined" && !navigator.onLine) return;

  flushInProgress = true;
  try {
    await flush();
  } finally {
    flushInProgress = false;
    if (scheduledFlush && getPendingVoteSyncCount() > 0) {
      scheduleVoteSyncFlush(scheduledFlush);
    }
  }
}

/** Test helper: reset debounce/flush state between tests. */
export function resetVoteSyncFlushState(): void {
  if (flushTimer !== null) {
    clearTimeout(flushTimer);
    flushTimer = null;
  }
  flushInProgress = false;
  scheduledFlush = null;
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
  emitQueueChange();
}

export function getPendingVoteSyncCount(): number {
  return readQueue().length;
}

export function enqueueVoteSync(payload: QueuedVotePayload): void {
  const queue = readQueue();
  queue.push(payload);
  writeQueue(queue);
  emitEnqueue();
}

export async function flushVoteSyncQueue(
  post: (payload: QueuedVotePayload) => Promise<boolean>,
): Promise<void> {
  if (typeof navigator !== "undefined" && !navigator.onLine) return;

  const queue = readQueue();
  if (queue.length === 0) return;

  const remaining: QueuedVotePayload[] = [];
  for (const payload of queue) {
    const remove = await post(payload);
    if (!remove) remaining.push(payload);
  }
  writeQueue(remaining);
}
