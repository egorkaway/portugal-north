import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isVoteStorageConfigured } from "./lib/blobVotes.js";
import {
  applyHotelVoteDelta,
  applyStationVoteDelta,
  isValidDirection,
  isValidHotelKey,
  isValidName,
  isValidVoteChange,
  readGlobalHotelRatings,
  readGlobalStationRatings,
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
      return res.status(200).json({
        ratings: {},
        hotelRatings: {},
        configured: false,
      });
    }

    try {
      const [ratings, hotelRatings] = await Promise.all([
        readGlobalStationRatings(),
        readGlobalHotelRatings(),
      ]);
      return res.status(200).json({ ratings, hotelRatings, configured: true });
    } catch {
      return res.status(503).json({
        ratings: {},
        hotelRatings: {},
        configured: true,
        error: "storage_read_failed",
      });
    }
  }

  if (req.method === "POST") {
    if (!isVoteStorageConfigured()) {
      return res.status(503).json({ ok: false, reason: "storage_not_configured" });
    }

    const body = req.body as {
      station?: string;
      hotelKey?: string;
      previous?: "up" | "down" | null;
      next?: "up" | "down" | null;
    };

    const { station, hotelKey, previous, next } = body;

    if (
      !isValidDirection(previous ?? null) ||
      !isValidDirection(next ?? null) ||
      !isValidVoteChange(previous ?? null, next ?? null)
    ) {
      return res.status(400).json({ ok: false, reason: "invalid_payload" });
    }

    try {
      if (hotelKey !== undefined) {
        if (!isValidHotelKey(hotelKey)) {
          return res.status(400).json({ ok: false, reason: "invalid_payload" });
        }
        const stored = await applyHotelVoteDelta(hotelKey, previous ?? null, next ?? null);
        return res.status(200).json({ ok: stored });
      }

      if (!isValidName(station)) {
        return res.status(400).json({ ok: false, reason: "invalid_payload" });
      }
      const stored = await applyStationVoteDelta(station, previous ?? null, next ?? null);
      return res.status(200).json({ ok: stored });
    } catch {
      return res.status(500).json({ ok: false, reason: "storage_error" });
    }
  }

  return res.status(405).json({ ok: false, reason: "method_not_allowed" });
}
