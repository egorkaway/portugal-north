import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  mergeSpainTrainFeeds,
  type SpainTrainsManifest,
} from "../src/lib/spainTrainPositions.js";

const CERCANIAS_URL = "https://gtfsrt.renfe.com/vehicle_positions.json";
const LONG_DISTANCE_URL = "https://gtfsrt.renfe.com/vehicle_positions_LD.json";
const FETCH_TIMEOUT_MS = 8_000;

async function fetchJson(url: string): Promise<unknown> {
  const res = await fetch(url, {
    cache: "no-store",
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`renfe_http_${res.status}`);
  }
  return res.json();
}

async function fetchFeedOrNull(url: string): Promise<unknown> {
  try {
    return await fetchJson(url);
  } catch {
    return null;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "method_not_allowed", trains: [] });
  }

  const [cercanias, longDistance] = await Promise.all([
    fetchFeedOrNull(CERCANIAS_URL),
    fetchFeedOrNull(LONG_DISTANCE_URL),
  ]);

  if (!cercanias && !longDistance) {
    res.setHeader("Cache-Control", "s-maxage=15, stale-while-revalidate=30");
    return res.status(502).json({
      error: "renfe_unavailable",
      fetchedAt: new Date().toISOString(),
      trainCount: 0,
      trains: [],
    });
  }

  const trains = mergeSpainTrainFeeds({ cercanias, longDistance });
  const body: SpainTrainsManifest = {
    fetchedAt: new Date().toISOString(),
    trainCount: trains.length,
    trains,
  };

  res.setHeader("Cache-Control", "s-maxage=20, stale-while-revalidate=40");
  return res.status(200).json(body);
}
