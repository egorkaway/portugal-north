import { BlobNotFoundError, get, put } from "@vercel/blob";
import type { GlobalRatings, HotelClosedReports } from "./voteLogic.js";

/** Single blob for all community vote data (fewer reads than four separate files). */
export const COMMUNITY_VOTES_PATH = "community-votes.json";

/** Legacy paths — read only when migrating an older store. */
export const STATION_VOTES_PATH = "station-votes.json";
export const HOTEL_VOTES_PATH = "hotel-votes.json";
export const STATION_IMAGE_VOTES_PATH = "station-image-votes.json";
export const HOTEL_CLOSED_REPORTS_PATH = "hotel-closed-reports.json";

const LEGACY_PATHS = [
  STATION_VOTES_PATH,
  HOTEL_VOTES_PATH,
  STATION_IMAGE_VOTES_PATH,
  HOTEL_CLOSED_REPORTS_PATH,
] as const;

export type CommunityVotesBlob = {
  ratings: GlobalRatings;
  hotelRatings: GlobalRatings;
  imageRatings: GlobalRatings;
  hotelClosedReports: HotelClosedReports;
};

const EMPTY_COMMUNITY_VOTES: CommunityVotesBlob = {
  ratings: {},
  hotelRatings: {},
  imageRatings: {},
  hotelClosedReports: {},
};

const BLOB_ACCESS = "private" as const;
const OPERATION_TIMEOUT_MS = 6_000;

function getToken(): string | undefined {
  return process.env.BLOB_READ_WRITE_TOKEN;
}

export function isVoteStorageConfigured(): boolean {
  return Boolean(getToken());
}

function blobClientOptions() {
  const token = getToken();
  if (!token) {
    throw new Error("BLOB_READ_WRITE_TOKEN is not set");
  }
  return {
    access: BLOB_ACCESS,
    token,
    abortSignal: AbortSignal.timeout(OPERATION_TIMEOUT_MS),
  };
}

export function normalizeRatings(raw: unknown): GlobalRatings {
  if (!raw || typeof raw !== "object") return {};
  const ratings: GlobalRatings = {};

  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    if (!value || typeof value !== "object") continue;
    const entry = value as { up?: unknown; down?: unknown };
    const up = Math.max(0, Math.floor(Number(entry.up) || 0));
    const down = Math.max(0, Math.floor(Number(entry.down) || 0));
    if (up > 0 || down > 0) ratings[key] = { up, down };
  }

  return ratings;
}

export function normalizeClosedReports(raw: unknown): HotelClosedReports {
  if (!raw || typeof raw !== "object") return {};
  const reports: HotelClosedReports = {};

  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    if (!value || typeof value !== "object") continue;
    const entry = value as { reports?: unknown };
    const count = Math.max(0, Math.floor(Number(entry.reports) || 0));
    if (count > 0) reports[key] = { reports: count };
  }

  return reports;
}

function normalizeCommunityVotes(raw: unknown): CommunityVotesBlob {
  if (!raw || typeof raw !== "object") return { ...EMPTY_COMMUNITY_VOTES };
  const data = raw as Record<string, unknown>;
  return {
    ratings: normalizeRatings(data.ratings),
    hotelRatings: normalizeRatings(data.hotelRatings),
    imageRatings: normalizeRatings(data.imageRatings),
    hotelClosedReports: normalizeClosedReports(data.hotelClosedReports),
  };
}

/** Direct get by pathname — no list() (list counts as an Advanced Operation). */
async function readJsonFromBlob(pathname: string): Promise<unknown> {
  try {
    const result = await get(pathname, blobClientOptions());
    if (!result?.stream) return null;

    const text = await new Response(result.stream).text();
    if (!text) return null;

    try {
      return JSON.parse(text);
    } catch {
      return null;
    }
  } catch (error) {
    if (error instanceof BlobNotFoundError) return null;
    throw error;
  }
}

async function writeJsonToBlob(pathname: string, data: unknown): Promise<void> {
  await put(pathname, JSON.stringify(data), {
    ...blobClientOptions(),
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}

async function readLegacyCommunityVotes(): Promise<CommunityVotesBlob | null> {
  const [ratingsRaw, hotelRatingsRaw, imageRatingsRaw, closedRaw] = await Promise.all(
    LEGACY_PATHS.map((pathname) => readJsonFromBlob(pathname)),
  );

  const hasLegacy =
    ratingsRaw != null ||
    hotelRatingsRaw != null ||
    imageRatingsRaw != null ||
    closedRaw != null;

  if (!hasLegacy) return null;

  return {
    ratings: normalizeRatings(ratingsRaw),
    hotelRatings: normalizeRatings(hotelRatingsRaw),
    imageRatings: normalizeRatings(imageRatingsRaw),
    hotelClosedReports: normalizeClosedReports(closedRaw),
  };
}

export async function readCommunityVotesFromBlob(): Promise<CommunityVotesBlob> {
  const current = await readJsonFromBlob(COMMUNITY_VOTES_PATH);
  if (current != null) return normalizeCommunityVotes(current);

  const legacy = await readLegacyCommunityVotes();
  return legacy ?? { ...EMPTY_COMMUNITY_VOTES };
}

export async function writeCommunityVotesToBlob(data: CommunityVotesBlob): Promise<void> {
  await writeJsonToBlob(COMMUNITY_VOTES_PATH, data);
}
