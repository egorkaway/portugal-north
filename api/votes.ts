import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isVoteStorageConfigured } from "./lib/blobVotes.js";
import {
  applyVoteDelta,
  isValidDirection,
  isValidStationName,
  isValidVoteChange,
  readGlobalRatings,
} from "./lib/voteLogic.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "GET") {
    if (req.query.ping === "1") {
      return res.status(200).json({
        ok: true,
        configured: isVoteStorageConfigured(),
        hasToken: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      });
    }

    if (!isVoteStorageConfigured()) {
      return res.status(200).json({ ratings: {}, configured: false });
    }

    try {
      const ratings = await readGlobalRatings();
      return res.status(200).json({ ratings, configured: true });
    } catch {
      return res
        .status(503)
        .json({ ratings: {}, configured: true, error: "storage_read_failed" });
    }
  }

  if (req.method === "POST") {
    if (!isVoteStorageConfigured()) {
      return res.status(503).json({ ok: false, reason: "storage_not_configured" });
    }

    const body = req.body as {
      station?: string;
      previous?: "up" | "down" | null;
      next?: "up" | "down" | null;
    };

    const { station, previous, next } = body;
    if (
      !isValidStationName(station) ||
      !isValidDirection(previous ?? null) ||
      !isValidDirection(next ?? null) ||
      !isValidVoteChange(previous ?? null, next ?? null)
    ) {
      return res.status(400).json({ ok: false, reason: "invalid_payload" });
    }

    try {
      const stored = await applyVoteDelta(station, previous ?? null, next ?? null);
      return res.status(200).json({ ok: stored });
    } catch {
      return res.status(500).json({ ok: false, reason: "storage_error" });
    }
  }

  return res.status(405).json({ ok: false, reason: "method_not_allowed" });
}
