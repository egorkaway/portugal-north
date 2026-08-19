import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  RENFE_VEHICLE_POSITIONS_CERCANIAS,
  RENFE_VEHICLE_POSITIONS_LONG_DISTANCE,
  RENFE_TRIP_UPDATES_CERCANIAS,
  RENFE_TRIP_UPDATES_LONG_DISTANCE,
} from "../src/lib/spainRenfeFeeds.js";
import {
  mergeSpainTrainFeeds,
  type SpainTrainsManifest,
} from "../src/lib/spainTrainPositions.js";
import { mergeSpainTripUpdateFeeds } from "../src/lib/spainTripUpdates.js";
import { parseSpainTrainIdentity } from "../src/lib/spainTripUpdates.js";

const FETCH_TIMEOUT_MS = 4_000;

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

  const [cercanias, longDistance, tripCercanias, tripLongDistance] =
    await Promise.all([
      fetchFeedOrNull(RENFE_VEHICLE_POSITIONS_CERCANIAS),
      fetchFeedOrNull(RENFE_VEHICLE_POSITIONS_LONG_DISTANCE),
      fetchFeedOrNull(RENFE_TRIP_UPDATES_CERCANIAS),
      fetchFeedOrNull(RENFE_TRIP_UPDATES_LONG_DISTANCE),
    ]);

  if (!cercanias && !longDistance) {
    res.setHeader("Cache-Control", "s-maxage=15, stale-while-revalidate=30");
    return res.status(200).json({
      fetchedAt: new Date().toISOString(),
      trainCount: 0,
      trains: [],
    });
  }

  const trains = mergeSpainTrainFeeds({ cercanias, longDistance });

  const delays = mergeSpainTripUpdateFeeds({
    cercanias: tripCercanias,
    longDistance: tripLongDistance,
  });
  const delayByTrip = new Map(
    delays.map((d) => [`${d.kind}:${d.tripId}`, d]),
  );

  for (const train of trains) {
    if (!train.tripId) continue;
    const obs = delayByTrip.get(`${train.kind}:${train.tripId}`);
    if (!obs) {
      const identity = parseSpainTrainIdentity(train.tripId, train.kind);
      train.serviceType = identity.serviceType;
      continue;
    }
    train.delayMinutes = obs.delayMinutes;
    train.nextStation = obs.station;
    train.serviceType = obs.serviceType;
  }

  const body: SpainTrainsManifest = {
    fetchedAt: new Date().toISOString(),
    trainCount: trains.length,
    trains,
  };

  res.setHeader("Cache-Control", "s-maxage=20, stale-while-revalidate=40");
  return res.status(200).json(body);
}
