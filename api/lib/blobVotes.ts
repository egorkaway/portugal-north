import { head, put } from "@vercel/blob";
import type { GlobalRatings } from "./voteLogic.js";

const PATHNAME = "station-votes.json";

export function isVoteStorageConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
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
  if (!isVoteStorageConfigured()) return {};

  try {
    const meta = await head(PATHNAME);
    const res = await fetch(meta.url);
    if (!res.ok) return {};
    return normalizeRatings(await res.json());
  } catch {
    return {};
  }
}

export async function writeRatingsToBlob(ratings: GlobalRatings): Promise<void> {
  await put(PATHNAME, JSON.stringify(ratings), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}
