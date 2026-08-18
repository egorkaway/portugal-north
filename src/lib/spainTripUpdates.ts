import { catalogStationForSpainStopId } from "../data/spainAdifStopIds";
import type { SpainTrainKind } from "./spainTrainPositions";

export type SpainDelayObservation = {
  kind: SpainTrainKind;
  tripId: string;
  trainNumber: string;
  serviceType: string;
  line: string | null;
  stopId: string;
  station: string | null;
  delaySeconds: number;
  delayMinutes: number;
  estimatedArrivalAt: string | null;
  scheduleRelationship: string | null;
};

type GtfsRtStopTimeUpdate = {
  stopId?: string;
  arrival?: { delay?: number; time?: string | number };
  departure?: { delay?: number; time?: string | number };
};

type GtfsRtTripUpdateEntity = {
  id?: string;
  tripUpdate?: {
    delay?: number;
    trip?: { tripId?: string; scheduleRelationship?: string };
    stopTimeUpdate?: GtfsRtStopTimeUpdate[];
  };
};

type GtfsRtTripFeed = {
  entity?: GtfsRtTripUpdateEntity[];
};

const CERCANIAS_TRIP_RE = /M(\d{4,6})(C\d[\dA-Z]*)?$/i;
const ISO_DATE_SUFFIX_RE = /(\d{4}-\d{2}-\d{2})$/;

export function delaySecondsToMinutes(delaySeconds: number): number {
  if (!Number.isFinite(delaySeconds)) return 0;
  return Math.max(0, Math.round(delaySeconds / 60));
}

export function parseSpainTrainIdentity(
  tripId: string,
  kind: SpainTrainKind,
): { trainNumber: string; line: string | null; serviceType: string } {
  const trimmed = tripId.trim();

  if (kind === "cercanias") {
    const match = trimmed.match(CERCANIAS_TRIP_RE);
    const trainNumber = match?.[1] ?? trimmed;
    const line = match?.[2] ? match[2].toUpperCase() : null;
    return {
      trainNumber,
      line,
      serviceType: line ? `Cercanías ${line}` : "Cercanías",
    };
  }

  const withoutDate = trimmed.replace(ISO_DATE_SUFFIX_RE, "");
  const trainNumber = withoutDate || trimmed;
  return {
    trainNumber,
    line: null,
    serviceType: "Long distance",
  };
}

function unixSecondsToIso(value: string | number | undefined): string | null {
  if (value == null) return null;
  const seconds = typeof value === "number" ? value : Number.parseInt(value, 10);
  if (!Number.isFinite(seconds) || seconds <= 0) return null;
  return new Date(seconds * 1000).toISOString();
}

function firstStopUpdate(entity: GtfsRtTripUpdateEntity): GtfsRtStopTimeUpdate | null {
  const updates = entity.tripUpdate?.stopTimeUpdate;
  if (!Array.isArray(updates) || updates.length === 0) return null;
  return updates[0] ?? null;
}

function delaySecondsFromEntity(entity: GtfsRtTripUpdateEntity): number | null {
  const tripDelay = entity.tripUpdate?.delay;
  if (typeof tripDelay === "number" && Number.isFinite(tripDelay)) return tripDelay;
  const stop = firstStopUpdate(entity);
  const arrivalDelay = stop?.arrival?.delay;
  if (typeof arrivalDelay === "number" && Number.isFinite(arrivalDelay)) return arrivalDelay;
  const departureDelay = stop?.departure?.delay;
  if (typeof departureDelay === "number" && Number.isFinite(departureDelay)) return departureDelay;
  return null;
}

export function parseGtfsRtTripUpdates(
  feed: unknown,
  kind: SpainTrainKind,
): SpainDelayObservation[] {
  if (!feed || typeof feed !== "object") return [];
  const entities = (feed as GtfsRtTripFeed).entity;
  if (!Array.isArray(entities)) return [];

  const observations: SpainDelayObservation[] = [];
  for (const entity of entities) {
    const relationship = entity.tripUpdate?.trip?.scheduleRelationship ?? null;
    if (relationship === "CANCELED") continue;

    const tripId = entity.tripUpdate?.trip?.tripId?.trim();
    if (!tripId) continue;

    const delaySeconds = delaySecondsFromEntity(entity);
    if (delaySeconds == null) continue;

    const stop = firstStopUpdate(entity);
    const stopId = stop?.stopId?.trim();
    if (!stopId) continue;

    const identity = parseSpainTrainIdentity(tripId, kind);
    observations.push({
      kind,
      tripId,
      trainNumber: identity.trainNumber,
      serviceType: identity.serviceType,
      line: identity.line,
      stopId,
      station: catalogStationForSpainStopId(stopId),
      delaySeconds,
      delayMinutes: delaySecondsToMinutes(delaySeconds),
      estimatedArrivalAt: unixSecondsToIso(stop?.arrival?.time ?? stop?.departure?.time),
      scheduleRelationship: relationship,
    });
  }
  return observations;
}

export function mergeSpainTripUpdateFeeds(options: {
  cercanias?: unknown;
  longDistance?: unknown;
}): SpainDelayObservation[] {
  const byKey = new Map<string, SpainDelayObservation>();
  for (const observation of [
    ...parseGtfsRtTripUpdates(options.cercanias, "cercanias"),
    ...parseGtfsRtTripUpdates(options.longDistance, "longDistance"),
  ]) {
    byKey.set(`${observation.kind}:${observation.tripId}:${observation.stopId}`, observation);
  }
  return [...byKey.values()];
}
