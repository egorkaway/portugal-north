import {
  applyVoteDelta,
  isValidDirection,
  isValidStationName,
  isValidVoteChange,
  readGlobalRatings,
} from "./lib/voteLogic.js";
import { isVoteStorageConfigured } from "./lib/blobVotes.js";

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}

async function handleGet(): Promise<Response> {
  if (!isVoteStorageConfigured()) {
    return json({ ratings: {}, configured: false });
  }
  const ratings = await readGlobalRatings();
  return json({ ratings, configured: true });
}

async function handlePost(request: Request): Promise<Response> {
  if (!isVoteStorageConfigured()) {
    return json({ ok: false, reason: "storage_not_configured" });
  }

  let body: {
    station: string;
    previous: "up" | "down" | null;
    next: "up" | "down" | null;
  };
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, reason: "invalid_json" }, 400);
  }

  const { station, previous, next } = body;
  if (
    !isValidStationName(station) ||
    !isValidDirection(previous) ||
    !isValidDirection(next) ||
    !isValidVoteChange(previous, next)
  ) {
    return json({ ok: false, reason: "invalid_payload" }, 400);
  }

  try {
    const stored = await applyVoteDelta(station, previous, next);
    return json({ ok: stored });
  } catch {
    return json({ ok: false, reason: "storage_error" }, 500);
  }
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method === "GET") return handleGet();
  if (request.method === "POST") return handlePost(request);
  return json({ ok: false, reason: "method_not_allowed" }, 405);
}
