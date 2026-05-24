import { get, list, put } from "@vercel/blob";
import type { GlobalRatings } from "./voteLogic.js";

export const STATION_VOTES_PATH = "station-votes.json";
export const HOTEL_VOTES_PATH = "hotel-votes.json";

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

async function readJsonFromBlob(pathname: string): Promise<unknown> {
  const opts = blobClientOptions();

  const { blobs } = await list({ prefix: pathname, limit: 1, ...opts });
  if (!blobs.some((blob) => blob.pathname === pathname)) {
    return null;
  }

  const result = await get(pathname, opts);
  if (!result?.stream) return null;

  const text = await new Response(result.stream).text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

async function writeJsonToBlob(pathname: string, ratings: GlobalRatings): Promise<void> {
  await put(pathname, JSON.stringify(ratings), {
    ...blobClientOptions(),
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}

export async function readRatingsFromBlob(pathname: string): Promise<GlobalRatings> {
  return normalizeRatings(await readJsonFromBlob(pathname));
}

export async function writeRatingsToBlob(
  pathname: string,
  ratings: GlobalRatings,
): Promise<void> {
  await writeJsonToBlob(pathname, ratings);
}
