/** Mainland Iberia; drops GPS glitches far outside the map. */
const MIN_LAT = 35.8;
const MAX_LAT = 44.0;
const MIN_LNG = -10.0;
const MAX_LNG = 4.0;

function isInIberianBounds(lat: number, lng: number): boolean {
  return lat >= MIN_LAT && lat <= MAX_LAT && lng >= MIN_LNG && lng <= MAX_LNG;
}

export type SpainTrainKind = "cercanias" | "longDistance";

export type SpainTrainPosition = {
  id: string;
  tripId: string | null;
  lat: number;
  lng: number;
  label: string;
  line: string | null;
  kind: SpainTrainKind;
  status: string | null;
  delayMinutes: number | null;
  nextStation: string | null;
  serviceType: string | null;
};

export type SpainTrainsManifest = {
  fetchedAt: string;
  trainCount: number;
  trains: SpainTrainPosition[];
};

type GtfsRtVehicleEntity = {
  id?: string;
  vehicle?: {
    trip?: { tripId?: string };
    position?: { latitude?: number; longitude?: number };
    currentStatus?: string;
    vehicle?: { id?: string; label?: string };
  };
};

type GtfsRtFeed = {
  entity?: GtfsRtVehicleEntity[];
};

function lineFromLabel(label: string): string | null {
  const match = label.match(/^([A-Z]\d[\dA-Z]?)\b/i);
  return match ? match[1]!.toUpperCase() : null;
}

export function parseGtfsRtVehicles(
  feed: unknown,
  kind: SpainTrainKind,
): SpainTrainPosition[] {
  if (!feed || typeof feed !== "object") return [];
  const entities = (feed as GtfsRtFeed).entity;
  if (!Array.isArray(entities)) return [];

  const trains: SpainTrainPosition[] = [];
  for (const entity of entities) {
    const vehicle = entity?.vehicle;
    const lat = vehicle?.position?.latitude;
    const lng = vehicle?.position?.longitude;
    if (typeof lat !== "number" || typeof lng !== "number") continue;
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;
    if (!isInIberianBounds(lat, lng)) continue;

    const label =
      vehicle?.vehicle?.label?.trim() ||
      vehicle?.vehicle?.id?.trim() ||
      entity.id?.trim() ||
      "";
    if (!label) continue;

    trains.push({
      id: `${kind}:${entity.id ?? label}`,
      tripId: vehicle?.trip?.tripId?.trim() ?? null,
      lat,
      lng,
      label,
      line: lineFromLabel(label),
      kind,
      status: vehicle?.currentStatus ?? null,
      delayMinutes: null,
      nextStation: null,
      serviceType: null,
    });
  }
  return trains;
}

export function mergeSpainTrainFeeds(options: {
  cercanias?: unknown;
  longDistance?: unknown;
}): SpainTrainPosition[] {
  const byId = new Map<string, SpainTrainPosition>();
  for (const train of [
    ...parseGtfsRtVehicles(options.cercanias, "cercanias"),
    ...parseGtfsRtVehicles(options.longDistance, "longDistance"),
  ]) {
    byId.set(train.id, train);
  }
  return [...byId.values()];
}
