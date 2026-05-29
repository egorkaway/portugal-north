import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isVoteStorageConfigured } from "./lib/blobVotes.js";
import {
  applyHotelClosedReportDelta,
  applyHotelVoteDelta,
  applyStationImageVoteDelta,
  applyStationVoteDelta,
  isValidClosedReportChange,
  isValidDirection,
  isValidHotelKey,
  isValidName,
  isValidReportedFlag,
  isValidVoteChange,
  readAllCommunityVotes,
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

    res.setHeader("Cache-Control", "no-cache, must-revalidate");

    if (!isVoteStorageConfigured()) {
      return res.status(200).json({
        ratings: {},
        hotelRatings: {},
        imageRatings: {},
        hotelClosedReports: {},
        configured: false,
      });
    }

    try {
      const { ratings, hotelRatings, imageRatings, hotelClosedReports } =
        await readAllCommunityVotes();
      return res
        .status(200)
        .json({ ratings, hotelRatings, imageRatings, hotelClosedReports, configured: true });
    } catch {
      return res.status(503).json({
        ratings: {},
        hotelRatings: {},
        imageRatings: {},
        hotelClosedReports: {},
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
      stationImage?: string;
      hotelKey?: string;
      hotelClosed?: string;
      previous?: "up" | "down" | boolean | null;
      next?: "up" | "down" | boolean | null;
    };

    const { station, stationImage, hotelKey, hotelClosed, previous, next } = body;

    const voteTargets = [station, stationImage, hotelKey, hotelClosed].filter(
      (v) => v !== undefined,
    );
    if (voteTargets.length !== 1) {
      return res.status(400).json({ ok: false, reason: "invalid_payload" });
    }

    try {
      if (hotelClosed !== undefined) {
        if (
          !isValidHotelKey(hotelClosed) ||
          !isValidReportedFlag(previous) ||
          !isValidReportedFlag(next) ||
          !isValidClosedReportChange(previous, next)
        ) {
          return res.status(400).json({ ok: false, reason: "invalid_payload" });
        }
        const stored = await applyHotelClosedReportDelta(hotelClosed, previous, next);
        return res.status(200).json({ ok: stored });
      }

      if (
        !isValidDirection(previous ?? null) ||
        !isValidDirection(next ?? null) ||
        !isValidVoteChange(previous ?? null, next ?? null)
      ) {
        return res.status(400).json({ ok: false, reason: "invalid_payload" });
      }

      if (hotelKey !== undefined) {
        if (!isValidHotelKey(hotelKey)) {
          return res.status(400).json({ ok: false, reason: "invalid_payload" });
        }
        const stored = await applyHotelVoteDelta(hotelKey, previous ?? null, next ?? null);
        return res.status(200).json({ ok: stored });
      }

      if (stationImage !== undefined) {
        if (!isValidName(stationImage)) {
          return res.status(400).json({ ok: false, reason: "invalid_payload" });
        }
        const stored = await applyStationImageVoteDelta(
          stationImage,
          previous ?? null,
          next ?? null,
        );
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
