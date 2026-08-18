import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  resolveStationPhotoUrl,
  STATION_PHOTO_USER_AGENT,
} from "../server/lib/stationPhotoProxy.js";

const MAX_BYTES = 4_000_000;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).end();
  }

  const raw = typeof req.query.u === "string" ? req.query.u : "";
  const url = resolveStationPhotoUrl(raw);
  if (!url) {
    return res.status(400).json({ error: "invalid_photo_url" });
  }

  try {
    const upstream = await fetch(url, {
      headers: {
        "User-Agent": STATION_PHOTO_USER_AGENT,
        Accept: "image/*",
      },
      redirect: "follow",
    });
    if (!upstream.ok) {
      return res.status(upstream.status).end();
    }

    const contentType = upstream.headers.get("content-type") ?? "";
    if (!contentType.startsWith("image/")) {
      return res.status(502).json({ error: "not_an_image" });
    }

    const buffer = Buffer.from(await upstream.arrayBuffer());
    if (buffer.byteLength > MAX_BYTES) {
      return res.status(502).json({ error: "image_too_large" });
    }

    res.setHeader("Content-Type", contentType);
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=2592000, stale-while-revalidate=86400",
    );
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(200).send(buffer);
  } catch {
    return res.status(502).json({ error: "photo_fetch_failed" });
  }
}
