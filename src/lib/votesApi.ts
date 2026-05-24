import type {
  GlobalRatings,
  HotelClosedReportSyncPayload,
  HotelVoteSyncPayload,
  StationImageVoteSyncPayload,
  StationVoteSyncPayload,
  VoteDirection,
} from "@/lib/voteTypes";

const API_BASE = "/api/votes";

export type GlobalRatingsResult = {
  ratings: GlobalRatings;
  hotelRatings: GlobalRatings;
  imageRatings: GlobalRatings;
  configured: boolean;
};

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

async function postVote(
  body:
    | StationVoteSyncPayload
    | HotelVoteSyncPayload
    | StationImageVoteSyncPayload
    | HotelClosedReportSyncPayload,
): Promise<void> {
  try {
    await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      keepalive: true,
    });
  } catch {
    // Local cookie vote still works if the API is unreachable.
  }
}

export async function syncVoteToServer(
  station: string,
  previous: VoteDirection | null,
  next: VoteDirection | null,
): Promise<void> {
  await postVote({ station, previous, next });
}

export async function syncHotelVoteToServer(
  hotelKey: string,
  previous: VoteDirection | null,
  next: VoteDirection | null,
): Promise<void> {
  await postVote({ hotelKey, previous, next });
}

export async function syncStationImageVoteToServer(
  station: string,
  previous: VoteDirection | null,
  next: VoteDirection | null,
): Promise<void> {
  await postVote({ stationImage: station, previous, next });
}

export async function syncHotelClosedReportToServer(
  hotelKey: string,
  wasReported: boolean,
  isReported: boolean,
): Promise<void> {
  await postVote({ hotelClosed: hotelKey, previous: wasReported, next: isReported });
}

export async function fetchGlobalRatings(): Promise<GlobalRatingsResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12_000);

  let res: Response;
  try {
    res = await fetch(API_BASE, { cache: "no-store", signal: controller.signal });
  } catch (error) {
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

  return {
    ratings: data.ratings ?? {},
    hotelRatings: data.hotelRatings ?? {},
    imageRatings: data.imageRatings ?? {},
    configured: true,
  };
}
