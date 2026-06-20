import {
  buildRatingsFromDeviceVotes,
  hasDeviceVotes,
} from "@/lib/deviceVoteStorage";
import { loadOfflineRatingsCache, saveOfflineRatingsCache } from "@/lib/offlineRatingsCache";
import {
  enqueueVoteSync,
  type QueuedVotePayload,
} from "@/lib/voteSyncQueue";
import type {
  GlobalRatings,
  GlobalRatingsResult,
  HotelClosedReportSyncPayload,
  HotelVoteSyncPayload,
  RatingsSource,
  StationImageVoteSyncPayload,
  StationVoteSyncPayload,
  VoteDirection,
} from "@/lib/voteTypes";

export type { GlobalRatingsResult, RatingsSource };

const API_BASE = "/api/votes";

export type RatingsFetchErrorCode =
  | "network"
  | "http"
  | "storage_not_configured"
  | "invalid_response";

export class RatingsFetchError extends Error {
  readonly code: RatingsFetchErrorCode;
  readonly status?: number;

  constructor(message: string, code: RatingsFetchErrorCode, status?: number) {
    super(message);
    this.name = "RatingsFetchError";
    this.code = code;
    this.status = status;
  }
}

export function ratingsErrorMessage(error: unknown): string {
  if (error instanceof RatingsFetchError) return error.message;
  if (error instanceof Error) return error.message;
  return "Could not load community ratings.";
}

export type PostVotePayloadOptions = {
  /** When false (flush path), do not re-enqueue on failure. Default true. */
  requeueOnFailure?: boolean;
};

export async function shouldRequeueVoteFailure(res: Response): Promise<boolean> {
  if (res.status === 400) return false;
  if (res.status === 503) {
    try {
      const data = (await res.clone().json()) as { reason?: string };
      if (data.reason === "storage_not_configured") return false;
    } catch {
      // Fall through to default retry behavior.
    }
  }
  return true;
}

export async function postVotePayload(
  body: QueuedVotePayload,
  options?: PostVotePayloadOptions,
): Promise<boolean> {
  const requeueOnFailure = options?.requeueOnFailure ?? true;

  if (typeof navigator !== "undefined" && !navigator.onLine) {
    if (requeueOnFailure) enqueueVoteSync(body);
    return false;
  }

  try {
    const res = await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      keepalive: true,
    });
    if (!res.ok) {
      const canRequeue = await shouldRequeueVoteFailure(res);
      if (requeueOnFailure) {
        if (canRequeue) enqueueVoteSync(body);
        return false;
      }
      return !canRequeue;
    }
    return true;
  } catch {
    if (requeueOnFailure) enqueueVoteSync(body);
    return false;
  }
}

async function postVote(body: QueuedVotePayload): Promise<boolean> {
  return postVotePayload(body);
}

export async function syncVoteToServer(
  station: string,
  previous: VoteDirection | null,
  next: VoteDirection | null,
): Promise<boolean> {
  return postVote({ station, previous, next });
}

export async function syncHotelVoteToServer(
  hotelKey: string,
  previous: VoteDirection | null,
  next: VoteDirection | null,
): Promise<boolean> {
  return postVote({ hotelKey, previous, next });
}

export async function syncStationImageVoteToServer(
  station: string,
  previous: VoteDirection | null,
  next: VoteDirection | null,
): Promise<boolean> {
  return postVote({ stationImage: station, previous, next });
}

export async function syncHotelClosedReportToServer(
  hotelKey: string,
  wasReported: boolean,
  isReported: boolean,
): Promise<boolean> {
  return postVote({ hotelClosed: hotelKey, previous: wasReported, next: isReported });
}

function offlineRatingsFallback(): GlobalRatingsResult | null {
  const cached = loadOfflineRatingsCache();
  if (cached) return cached;

  const device = buildRatingsFromDeviceVotes();
  if (hasDeviceVotes(device)) return device;

  return null;
}

export async function fetchGlobalRatings(): Promise<GlobalRatingsResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12_000);

  let res: Response;
  try {
    res = await fetch(API_BASE, { cache: "no-store", signal: controller.signal });
  } catch (error) {
    clearTimeout(timeout);
    const fallback = offlineRatingsFallback();
    if (fallback) return fallback;

    if (error instanceof Error && error.name === "AbortError") {
      throw new RatingsFetchError(
        "Ratings API timed out. Vote storage may be slow or misconfigured.",
        "network",
      );
    }
    throw new RatingsFetchError(
      "Could not reach the ratings API. Check your connection or try again later.",
      "network",
    );
  } finally {
    clearTimeout(timeout);
  }

  if (!res.ok) {
    if (res.status >= 500) {
      const fallback = offlineRatingsFallback();
      if (fallback) return fallback;
    }
    throw new RatingsFetchError(
      `Ratings API returned ${res.status}. Community totals may be unavailable on this deployment.`,
      "http",
      res.status,
    );
  }

  let data: {
    ratings?: GlobalRatings;
    hotelRatings?: GlobalRatings;
    imageRatings?: GlobalRatings;
    configured?: boolean;
  };
  try {
    data = (await res.json()) as typeof data;
  } catch {
    throw new RatingsFetchError(
      "Ratings API returned an invalid response.",
      "invalid_response",
    );
  }

  if (data.configured === false) {
    throw new RatingsFetchError(
      "Global vote storage is not configured. Add BLOB_READ_WRITE_TOKEN from your Vercel Blob store to this project, then redeploy.",
      "storage_not_configured",
    );
  }

  const result: GlobalRatingsResult = {
    ratings: data.ratings ?? {},
    hotelRatings: data.hotelRatings ?? {},
    imageRatings: data.imageRatings ?? {},
    configured: true,
    source: "network",
  };
  saveOfflineRatingsCache(result);
  return result;
}
