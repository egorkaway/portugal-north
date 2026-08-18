import type { StationHourSnapshot } from "./cpDeparturesParse.js";
import {
  beginDepartureStatsRun,
  mergeStationSnapshot,
  type DepartureStatsStore,
} from "./departureStats.js";
import { primarySpainStopId } from "../../src/data/spainAdifStopIds.js";
import type { SpainDelayObservation } from "../../src/lib/spainTripUpdates.js";

export function snapshotsFromSpainObservations(
  observations: SpainDelayObservation[],
  observedAt = new Date().toISOString(),
): Map<string, StationHourSnapshot> {
  const byStation = new Map<
    string,
    { byTrainType: StationHourSnapshot["byTrainType"]; totals: StationHourSnapshot["totals"] }
  >();

  for (const observation of observations) {
    if (!observation.station) continue;
    let bucket = byStation.get(observation.station);
    if (!bucket) {
      bucket = {
        byTrainType: {},
        totals: { departures: 0, arrivals: 0, delayMinutes: 0 },
      };
      byStation.set(observation.station, bucket);
    }
    if (!bucket.byTrainType[observation.serviceType]) {
      bucket.byTrainType[observation.serviceType] = {
        departures: 0,
        arrivals: 0,
        delayMinutes: 0,
      };
    }
    const typeCounts = bucket.byTrainType[observation.serviceType]!;
    typeCounts.arrivals += 1;
    typeCounts.delayMinutes += observation.delayMinutes;
    bucket.totals.arrivals += 1;
    bucket.totals.delayMinutes += observation.delayMinutes;
  }

  const snapshots = new Map<string, StationHourSnapshot>();
  for (const [station, bucket] of byStation) {
    snapshots.set(station, {
      observedAt,
      byTrainType: bucket.byTrainType,
      totals: bucket.totals,
    });
  }
  return snapshots;
}

export function mergeSpainReliabilitySnapshots(
  store: DepartureStatsStore,
  observations: SpainDelayObservation[],
  observedAt = new Date().toISOString(),
): { matchedStations: number; unmatched: number } {
  beginDepartureStatsRun(store);
  const snapshots = snapshotsFromSpainObservations(observations, observedAt);
  for (const [station, snapshot] of snapshots) {
    const stopId = primarySpainStopId(station) ?? "";
    mergeStationSnapshot(store, station, stopId, snapshot);
  }
  return {
    matchedStations: snapshots.size,
    unmatched: observations.filter((observation) => !observation.station).length,
  };
}
