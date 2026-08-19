import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  RENFE_VEHICLE_POSITIONS_CERCANIAS,
  RENFE_VEHICLE_POSITIONS_LONG_DISTANCE,
  RENFE_TRIP_UPDATES_CERCANIAS,
  RENFE_TRIP_UPDATES_LONG_DISTANCE,
} from "../src/lib/spainRenfeFeeds.js";
import {
  mergeSpainTrainFeeds,
  type SpainTrainPosition,
  type SpainTrainKind,
  type SpainTrainsManifest,
} from "../src/lib/spainTrainPositions.js";

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

// ---------------------------------------------------------------------------
// Lightweight trip-update parsing inlined here to avoid importing
// src/lib/spainTripUpdates (which pulls in the full stop-ID catalog and
// breaks the Vercel serverless function bundler).
// ---------------------------------------------------------------------------

const CERCANIAS_TRIP_RE = /M(\d{4,6})(C\d[\dA-Z]*)?$/i;
const ISO_DATE_SUFFIX_RE = /(\d{4}-\d{2}-\d{2})$/;

type TripDelay = {
  tripId: string;
  kind: SpainTrainKind;
  delayMinutes: number;
  serviceType: string;
};

function serviceTypeFromTrip(tripId: string, kind: SpainTrainKind): string {
  if (kind === "cercanias") {
    const m = tripId.match(CERCANIAS_TRIP_RE);
    const line = m?.[2]?.toUpperCase();
    return line ? `Cercanías ${line}` : "Cercanías";
  }
  return "Long distance";
}

function parseTripDelays(feed: unknown, kind: SpainTrainKind): TripDelay[] {
  if (!feed || typeof feed !== "object") return [];
  const entities = (feed as { entity?: unknown[] }).entity;
  if (!Array.isArray(entities)) return [];

  const out: TripDelay[] = [];
  for (const entity of entities) {
    const tu = (entity as Record<string, unknown>).tripUpdate as
      | Record<string, unknown>
      | undefined;
    if (!tu) continue;
    const trip = tu.trip as Record<string, unknown> | undefined;
    if (trip?.scheduleRelationship === "CANCELED") continue;
    const tripId = (trip?.tripId as string)?.trim();
    if (!tripId) continue;

    let delaySec: number | null = null;
    if (typeof tu.delay === "number" && Number.isFinite(tu.delay)) {
      delaySec = tu.delay as number;
    } else {
      const stops = tu.stopTimeUpdate as unknown[] | undefined;
      const s = stops?.[0] as Record<string, unknown> | undefined;
      const arr = s?.arrival as Record<string, unknown> | undefined;
      const dep = s?.departure as Record<string, unknown> | undefined;
      const d = arr?.delay ?? dep?.delay;
      if (typeof d === "number" && Number.isFinite(d)) delaySec = d;
    }
    if (delaySec == null) continue;

    out.push({
      tripId,
      kind,
      delayMinutes: Math.max(0, Math.round(delaySec / 60)),
      serviceType: serviceTypeFromTrip(tripId, kind),
    });
  }
  return out;
}

function enrichTrains(
  trains: SpainTrainPosition[],
  tripCercanias: unknown,
  tripLongDistance: unknown,
) {
  const delays = [
    ...parseTripDelays(tripCercanias, "cercanias"),
    ...parseTripDelays(tripLongDistance, "longDistance"),
  ];
  const byTrip = new Map(delays.map((d) => [`${d.kind}:${d.tripId}`, d]));

  for (const train of trains) {
    if (!train.tripId) continue;
    const d = byTrip.get(`${train.kind}:${train.tripId}`);
    if (d) {
      train.delayMinutes = d.delayMinutes;
      train.serviceType = d.serviceType;
    } else {
      train.serviceType = serviceTypeFromTrip(train.tripId, train.kind);
    }
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
  enrichTrains(trains, tripCercanias, tripLongDistance);

  const body: SpainTrainsManifest = {
    fetchedAt: new Date().toISOString(),
    trainCount: trains.length,
    trains,
  };

  res.setHeader("Cache-Control", "s-maxage=20, stale-while-revalidate=40");
  return res.status(200).json(body);
}
