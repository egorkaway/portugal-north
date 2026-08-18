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

export type TrainReliabilitySpotlightManifest = {
  generatedAt: string;
  runCount: number;
  mostDelayed: TrainSpotlightEntry | null;
  mostReliable: (TrainSpotlightEntry & {
    selectionMode: "stable" | "rotating";
    poolSize: number;
  }) | null;
};

/** Minimum arrival samples before a train can win "most delayed". */
export const TRAIN_SPOTLIGHT_MIN_OBSERVATIONS = 5;

/** Pool entry threshold for the reliable train rotation. */
export const TRAIN_SPOTLIGHT_RELIABLE_POOL_MIN = 5;

/** Observations needed on the leader before we stop rotating the reliable pick. */
export const TRAIN_SPOTLIGHT_STABLE_RELIABLE_OBSERVATIONS = 20;

/** How many low-delay trains to rotate through while data is still thin. */
export const TRAIN_SPOTLIGHT_ROTATION_POOL_SIZE = 12;

/** How many major stops to list on the train spotlight cards. */
export const TRAIN_SPOTLIGHT_MAJOR_STATIONS_LIMIT = 4;

type TrainAggregate = {
  trainNumber: string;
  serviceType: string;
  observations: number;
  totalDelayMinutes: number;
  stations: Set<string>;
};

function aggregateTrainDelays(entries: TrainDelayLogEntry[]): TrainAggregate[] {
  const byKey = new Map<string, TrainAggregate>();

  for (const entry of entries) {
    const key = `${entry.trainNumber}|${entry.serviceType}`;
    let aggregate = byKey.get(key);
    if (!aggregate) {
      aggregate = {
        trainNumber: entry.trainNumber,
        serviceType: entry.serviceType,
        observations: 0,
        totalDelayMinutes: 0,
        stations: new Set<string>(),
      };
      byKey.set(key, aggregate);
    }
    aggregate.observations += 1;
    aggregate.totalDelayMinutes += entry.delayMinutes;
    aggregate.stations.add(entry.station);
  }

  return [...byKey.values()];
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

export function pickMostDelayedTrain(
  entries: TrainDelayLogEntry[],
  stationTraffic: Record<string, number> = {},
  minObservations = TRAIN_SPOTLIGHT_MIN_OBSERVATIONS,
): TrainSpotlightEntry | null {
  const candidates = aggregateTrainDelays(entries).filter(
    (aggregate) =>
      aggregate.observations >= minObservations &&
      aggregate.totalDelayMinutes > 0,
  );
  if (candidates.length === 0) return null;
  candidates.sort(compareDelayed);
  return toSpotlightEntry(candidates[0]!, stationTraffic);
}

export function pickMostReliableTrain(
  entries: TrainDelayLogEntry[],
  runCount: number,
  options: {
    poolMin?: number;
    stableObservations?: number;
    poolSize?: number;
    stationTraffic?: Record<string, number>;
  } = {},
): (TrainSpotlightEntry & { selectionMode: "stable" | "rotating"; poolSize: number }) | null {
  const poolMin = options.poolMin ?? TRAIN_SPOTLIGHT_RELIABLE_POOL_MIN;
  const stableObservations =
    options.stableObservations ?? TRAIN_SPOTLIGHT_STABLE_RELIABLE_OBSERVATIONS;
  const poolSize = options.poolSize ?? TRAIN_SPOTLIGHT_ROTATION_POOL_SIZE;
  const stationTraffic = options.stationTraffic ?? {};

  const candidates = aggregateTrainDelays(entries).filter(
    (aggregate) => aggregate.observations >= poolMin,
  );
  if (candidates.length === 0) return null;

  candidates.sort(compareReliable);
  const leader = candidates[0]!;

  if (leader.observations >= stableObservations) {
    return {
      ...toSpotlightEntry(leader, stationTraffic),
      selectionMode: "stable",
      poolSize: 1,
    };
  }

  const pool = candidates.slice(0, Math.min(poolSize, candidates.length));
  const index = runCount > 0 ? runCount % pool.length : 0;
  const picked = pool[index] ?? leader;

  return {
    ...toSpotlightEntry(picked, stationTraffic),
    selectionMode: "rotating",
    poolSize: pool.length,
  };
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
  return {
    generatedAt: options.generatedAt ?? new Date().toISOString(),
    runCount: options.runCount,
    mostDelayed: pickMostDelayedTrain(options.entries, stationTraffic),
    mostReliable: pickMostReliableTrain(options.entries, options.runCount, { stationTraffic }),
  };
}
