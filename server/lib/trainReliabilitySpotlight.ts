import type { TrainDelayLogEntry } from "./trainDelayLog.js";

export type TrainSpotlightEntry = {
  trainNumber: string;
  serviceType: string;
  avgDelayMinutes: number;
  observations: number;
  stationsSampled: number;
  /** Busiest sampled stops where we have seen this train (departure-stats traffic order). */
  majorStations: string[];
};

export type TrainSpotlightReliableEntry = TrainSpotlightEntry & {
  selectionMode: "stable" | "rotating";
  poolSize: number;
};

export type TrainReliabilitySpotlightManifest = {
  generatedAt: string;
  runCount: number;
  mostDelayed: TrainSpotlightEntry[];
  mostReliable: TrainSpotlightReliableEntry[];
};

/** Minimum independent sightings before a train can appear in the spotlight. */
export const TRAIN_SPOTLIGHT_MIN_INSTANCES = 3;

/** At least this many Lisbon calendar days among those sightings. */
export const TRAIN_SPOTLIGHT_MIN_DISTINCT_DAYS = 2;

/**
 * Samples of the same train this close together are one sighting
 * (e.g. five stations in a 3-minute collect burst).
 */
export const TRAIN_SPOTLIGHT_INSTANCE_GAP_MS = 2 * 60 * 60 * 1000;

/** Ignore trains whose newest sample is older than this (occasional / one-off runs). */
export const TRAIN_SPOTLIGHT_MAX_STALE_MS = 7 * 24 * 60 * 60 * 1000;

/** Pool entry threshold for the reliable train rotation (instance count). */
export const TRAIN_SPOTLIGHT_RELIABLE_POOL_MIN = TRAIN_SPOTLIGHT_MIN_INSTANCES;

/** Sightings needed on the leader before we stop rotating the reliable pick. */
export const TRAIN_SPOTLIGHT_STABLE_RELIABLE_OBSERVATIONS = 20;

/** How many low-delay trains to rotate through while data is still thin. */
export const TRAIN_SPOTLIGHT_ROTATION_POOL_SIZE = 12;

/** Best and worst trains shown on the Portugal train spotlight. */
export const TRAIN_SPOTLIGHT_LIST_SIZE = 3;

/** How many major stops to list on the train spotlight cards. */
export const TRAIN_SPOTLIGHT_MAJOR_STATIONS_LIMIT = 4;

type TrainAggregate = {
  trainNumber: string;
  serviceType: string;
  /** Independent sightings (clustered samples), not raw station hits. */
  observations: number;
  totalDelayMinutes: number;
  distinctDays: number;
  stations: Set<string>;
};

type TimedSample = {
  at: number;
  delayMinutes: number;
  station: string;
};

export type TrainSighting = {
  delayMinutes: number;
  observedAtMs: number;
};

export function lisbonCalendarDate(ms: number): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Lisbon",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(ms));
}

/** Group station samples of one train into sightings when they fall within `gapMs`. */
export function clusterTrainSightings(
  samples: TimedSample[],
  gapMs = TRAIN_SPOTLIGHT_INSTANCE_GAP_MS,
): TrainSighting[] {
  const sorted = samples
    .filter((sample) => Number.isFinite(sample.at))
    .sort((a, b) => a.at - b.at);
  if (sorted.length === 0) return [];

  const clusters: TimedSample[][] = [[sorted[0]!]];
  for (const sample of sorted.slice(1)) {
    const cluster = clusters[clusters.length - 1]!;
    const previous = cluster[cluster.length - 1]!;
    if (sample.at - previous.at <= gapMs) {
      cluster.push(sample);
    } else {
      clusters.push([sample]);
    }
  }

  return clusters.map((cluster) => ({
    delayMinutes: cluster.reduce((sum, item) => sum + item.delayMinutes, 0) / cluster.length,
    observedAtMs: cluster[0]!.at,
  }));
}

function trainKey(entry: Pick<TrainDelayLogEntry, "trainNumber" | "serviceType">): string {
  return `${entry.trainNumber}|${entry.serviceType}`;
}

export function lastObservedAtMsByTrain(
  entries: TrainDelayLogEntry[],
): Map<string, number> {
  const lastByKey = new Map<string, number>();
  for (const entry of entries) {
    const observedAt = Date.parse(entry.recordedAt);
    if (!Number.isFinite(observedAt)) continue;
    const key = trainKey(entry);
    const previous = lastByKey.get(key);
    if (previous == null || observedAt > previous) lastByKey.set(key, observedAt);
  }
  return lastByKey;
}

/** Keep history for trains seen in the last week; drop trains with no recent sample. */
export function entriesForRecentlyObservedTrains(
  entries: TrainDelayLogEntry[],
  nowMs: number,
  maxStaleMs = TRAIN_SPOTLIGHT_MAX_STALE_MS,
): TrainDelayLogEntry[] {
  const lastByKey = lastObservedAtMsByTrain(entries);
  const fresh = new Set<string>();
  for (const [key, lastMs] of lastByKey) {
    if (nowMs - lastMs <= maxStaleMs) fresh.add(key);
  }
  return entries.filter((entry) => fresh.has(trainKey(entry)));
}

function aggregateTrainDelays(entries: TrainDelayLogEntry[]): TrainAggregate[] {
  const samplesByKey = new Map<
    string,
    { trainNumber: string; serviceType: string; samples: TimedSample[] }
  >();

  for (const entry of entries) {
    const at = Date.parse(entry.recordedAt);
    if (!Number.isFinite(at)) continue;
    const key = trainKey(entry);
    let group = samplesByKey.get(key);
    if (!group) {
      group = {
        trainNumber: entry.trainNumber,
        serviceType: entry.serviceType,
        samples: [],
      };
      samplesByKey.set(key, group);
    }
    group.samples.push({
      at,
      delayMinutes: entry.delayMinutes,
      station: entry.station,
    });
  }

  const aggregates: TrainAggregate[] = [];
  for (const group of samplesByKey.values()) {
    const sightings = clusterTrainSightings(group.samples);
    const days = new Set(sightings.map((sighting) => lisbonCalendarDate(sighting.observedAtMs)));
    aggregates.push({
      trainNumber: group.trainNumber,
      serviceType: group.serviceType,
      observations: sightings.length,
      totalDelayMinutes: sightings.reduce((sum, sighting) => sum + sighting.delayMinutes, 0),
      distinctDays: days.size,
      stations: new Set(group.samples.map((sample) => sample.station)),
    });
  }
  return aggregates;
}

function meetsSpotlightSampleFloor(aggregate: TrainAggregate, minInstances: number): boolean {
  return (
    aggregate.observations >= minInstances &&
    aggregate.distinctDays >= TRAIN_SPOTLIGHT_MIN_DISTINCT_DAYS
  );
}

export function pickMajorStationsForTrain(
  observedStations: Iterable<string>,
  stationTraffic: Record<string, number>,
  limit = TRAIN_SPOTLIGHT_MAJOR_STATIONS_LIMIT,
): string[] {
  return [...observedStations]
    .sort(
      (a, b) =>
        (stationTraffic[b] ?? 0) - (stationTraffic[a] ?? 0) || a.localeCompare(b),
    )
    .slice(0, limit);
}

function toSpotlightEntry(
  aggregate: TrainAggregate,
  stationTraffic: Record<string, number>,
): TrainSpotlightEntry {
  return {
    trainNumber: aggregate.trainNumber,
    serviceType: aggregate.serviceType,
    avgDelayMinutes:
      aggregate.observations > 0
        ? Math.round((aggregate.totalDelayMinutes / aggregate.observations) * 10) / 10
        : 0,
    observations: aggregate.observations,
    stationsSampled: aggregate.stations.size,
    majorStations: pickMajorStationsForTrain(aggregate.stations, stationTraffic),
  };
}

function compareDelayed(a: TrainAggregate, b: TrainAggregate): number {
  const avgA = a.totalDelayMinutes / a.observations;
  const avgB = b.totalDelayMinutes / b.observations;
  return (
    avgB - avgA ||
    b.observations - a.observations ||
    a.trainNumber.localeCompare(b.trainNumber)
  );
}

function compareReliable(a: TrainAggregate, b: TrainAggregate): number {
  const avgA = a.totalDelayMinutes / a.observations;
  const avgB = b.totalDelayMinutes / b.observations;
  return (
    avgA - avgB ||
    b.observations - a.observations ||
    a.trainNumber.localeCompare(b.trainNumber)
  );
}

export function pickMostDelayedTrains(
  entries: TrainDelayLogEntry[],
  stationTraffic: Record<string, number> = {},
  minInstances = TRAIN_SPOTLIGHT_MIN_INSTANCES,
  nowMs = Date.now(),
  limit = TRAIN_SPOTLIGHT_LIST_SIZE,
): TrainSpotlightEntry[] {
  const candidates = aggregateTrainDelays(
    entriesForRecentlyObservedTrains(entries, nowMs),
  ).filter(
    (aggregate) =>
      meetsSpotlightSampleFloor(aggregate, minInstances) &&
      aggregate.totalDelayMinutes > 0,
  );
  if (candidates.length === 0) return [];
  candidates.sort(compareDelayed);
  return candidates.slice(0, limit).map((aggregate) => toSpotlightEntry(aggregate, stationTraffic));
}

export function pickMostDelayedTrain(
  entries: TrainDelayLogEntry[],
  stationTraffic: Record<string, number> = {},
  minInstances = TRAIN_SPOTLIGHT_MIN_INSTANCES,
  nowMs = Date.now(),
): TrainSpotlightEntry | null {
  return pickMostDelayedTrains(entries, stationTraffic, minInstances, nowMs, 1)[0] ?? null;
}

function spotlightEntryKey(entry: Pick<TrainSpotlightEntry, "trainNumber" | "serviceType">): string {
  return `${entry.trainNumber}|${entry.serviceType}`;
}

export function pickMostReliableTrains(
  entries: TrainDelayLogEntry[],
  runCount: number,
  options: {
    poolMin?: number;
    stableObservations?: number;
    poolSize?: number;
    stationTraffic?: Record<string, number>;
    nowMs?: number;
    limit?: number;
    excludeKeys?: Iterable<string>;
  } = {},
): TrainSpotlightReliableEntry[] {
  const poolMin = options.poolMin ?? TRAIN_SPOTLIGHT_RELIABLE_POOL_MIN;
  const stableObservations =
    options.stableObservations ?? TRAIN_SPOTLIGHT_STABLE_RELIABLE_OBSERVATIONS;
  const poolSize = options.poolSize ?? TRAIN_SPOTLIGHT_ROTATION_POOL_SIZE;
  const stationTraffic = options.stationTraffic ?? {};
  const nowMs = options.nowMs ?? Date.now();
  const limit = options.limit ?? TRAIN_SPOTLIGHT_LIST_SIZE;
  const excluded = new Set(options.excludeKeys ?? []);

  const candidates = aggregateTrainDelays(
    entriesForRecentlyObservedTrains(entries, nowMs),
  ).filter(
    (aggregate) =>
      meetsSpotlightSampleFloor(aggregate, poolMin) &&
      !excluded.has(trainKey(aggregate)),
  );
  if (candidates.length === 0) return [];

  candidates.sort(compareReliable);
  const leader = candidates[0]!;

  const withMeta = (
    aggregates: TrainAggregate[],
    selectionMode: "stable" | "rotating",
    metaPoolSize: number,
  ): TrainSpotlightReliableEntry[] =>
    aggregates.map((aggregate) => ({
      ...toSpotlightEntry(aggregate, stationTraffic),
      selectionMode,
      poolSize: metaPoolSize,
    }));

  if (leader.observations >= stableObservations) {
    return withMeta(candidates.slice(0, limit), "stable", 1);
  }

  const pool = candidates.slice(0, Math.min(poolSize, candidates.length));
  const windowSize = Math.min(limit, pool.length);
  const start = runCount > 0 ? runCount % pool.length : 0;
  const picked = Array.from({ length: windowSize }, (_, index) => pool[(start + index) % pool.length]!);
  return withMeta(picked, "rotating", pool.length);
}

export function pickMostReliableTrain(
  entries: TrainDelayLogEntry[],
  runCount: number,
  options: {
    poolMin?: number;
    stableObservations?: number;
    poolSize?: number;
    stationTraffic?: Record<string, number>;
    nowMs?: number;
  } = {},
): TrainSpotlightReliableEntry | null {
  return pickMostReliableTrains(entries, runCount, { ...options, limit: 1 })[0] ?? null;
}

export function stationTrafficFromDepartureStats(
  stations: Record<string, { totals?: { departuresNextHour?: number } }>,
): Record<string, number> {
  const traffic: Record<string, number> = {};
  for (const [name, stats] of Object.entries(stations)) {
    traffic[name] = stats.totals?.departuresNextHour ?? 0;
  }
  return traffic;
}

export function buildTrainReliabilitySpotlightManifest(options: {
  entries: TrainDelayLogEntry[];
  runCount: number;
  stationTraffic?: Record<string, number>;
  generatedAt?: string;
}): TrainReliabilitySpotlightManifest {
  const stationTraffic = options.stationTraffic ?? {};
  const generatedAt = options.generatedAt ?? new Date().toISOString();
  const nowMs = Date.parse(generatedAt);
  const asOf = Number.isFinite(nowMs) ? nowMs : Date.now();
  const mostDelayed = pickMostDelayedTrains(
    options.entries,
    stationTraffic,
    TRAIN_SPOTLIGHT_MIN_INSTANCES,
    asOf,
  );
  return {
    generatedAt,
    runCount: options.runCount,
    mostDelayed,
    mostReliable: pickMostReliableTrains(options.entries, options.runCount, {
      stationTraffic,
      nowMs: asOf,
      excludeKeys: mostDelayed.map(spotlightEntryKey),
    }),
  };
}
