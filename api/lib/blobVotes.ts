import { get, list, put } from "@vercel/blob";
import type { GlobalRatings } from "./voteLogic.js";

const PATHNAME = "station-votes.json";
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

function normalizeRatings(raw: unknown): GlobalRatings {
  if (!raw || typeof raw !== "object") return {};
  const ratings: GlobalRatings = {};

  for (const [station, value] of Object.entries(raw as Record<string, unknown>)) {
    if (!value || typeof value !== "object") continue;
    const entry = value as { up?: unknown; down?: unknown };
    const up = Math.max(0, Math.floor(Number(entry.up) || 0));
    const down = Math.max(0, Math.floor(Number(entry.down) || 0));
    if (up > 0 || down > 0) ratings[station] = { up, down };
  }

  return ratings;
}

export async function readRatingsFromBlob(): Promise<GlobalRatings> {
  const opts = blobClientOptions();

  const { blobs } = await list({ prefix: PATHNAME, limit: 1, ...opts });
  if (!blobs.some((blob) => blob.pathname === PATHNAME)) {
    return {};
  }

  const result = await get(PATHNAME, opts);
  if (!result?.stream) return {};

  const text = await new Response(result.stream).text();
  if (!text) return {};

  try {
    return normalizeRatings(JSON.parse(text));
  } catch {
    return {};
  }
}

export async function writeRatingsToBlob(ratings: GlobalRatings): Promise<void> {
  await put(PATHNAME, JSON.stringify(ratings), {
    ...blobClientOptions(),
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}
