import type { StationHourSnapshot, TrainTypeHourCounts } from "./cpDeparturesParse.js";

export type CumulativeTrainTypeStats = {
  departuresNextHour: number;
  arrivalsNextHour: number;
  delayMinutes: number;
};

export type StationDepartureStats = {
  cpCode: string;
  byTrainType: Record<string, CumulativeTrainTypeStats>;
  totals: CumulativeTrainTypeStats;
  successfulSamples: number;
  failedSamples: number;
  lastSampleAt: string | null;
  lastError: string | null;
};

export type DepartureStatsStore = {
  runCount: number;
  lastRunAt: string | null;
  stations: Record<string, StationDepartureStats>;
};

export function createEmptyDepartureStatsStore(): DepartureStatsStore {
  return {
    runCount: 0,
    lastRunAt: null,
    stations: {},
  };
}

function emptyCumulative(): CumulativeTrainTypeStats {
  return { departuresNextHour: 0, arrivalsNextHour: 0, delayMinutes: 0 };
}

function addSnapshotCounts(
  target: CumulativeTrainTypeStats,
  snapshot: TrainTypeHourCounts,
): void {
  target.departuresNextHour += snapshot.departures;
  target.arrivalsNextHour += snapshot.arrivals;
  target.delayMinutes += snapshot.delayMinutes;
}

export function beginDepartureStatsRun(store: DepartureStatsStore): void {
  store.runCount += 1;
  store.lastRunAt = new Date().toISOString();
}

export function ensureStationStats(
  store: DepartureStatsStore,
  stationName: string,
  cpCode: string,
): StationDepartureStats {
  if (!store.stations[stationName]) {
    store.stations[stationName] = {
      cpCode,
      byTrainType: {},
      totals: emptyCumulative(),
      successfulSamples: 0,
      failedSamples: 0,
      lastSampleAt: null,
      lastError: null,
    };
  }

  const station = store.stations[stationName];
  station.cpCode = cpCode;
  return station;
}

export function mergeStationSnapshot(
  store: DepartureStatsStore,
  stationName: string,
  cpCode: string,
  snapshot: StationHourSnapshot,
): void {
  const station = ensureStationStats(store, stationName, cpCode);

  for (const [trainType, counts] of Object.entries(snapshot.byTrainType)) {
    if (!station.byTrainType[trainType]) {
      station.byTrainType[trainType] = emptyCumulative();
    }
    addSnapshotCounts(station.byTrainType[trainType], counts);
  }

  addSnapshotCounts(station.totals, snapshot.totals);
  station.successfulSamples += 1;
  station.lastSampleAt = snapshot.observedAt;
  station.lastError = null;
}

export function recordStationSampleFailure(
  store: DepartureStatsStore,
  stationName: string,
  cpCode: string,
  error: string,
): void {
  const station = ensureStationStats(store, stationName, cpCode);
  station.failedSamples += 1;
  station.lastError = error;
}

export function loadDepartureStatsStore(raw: unknown): DepartureStatsStore {
  if (!raw || typeof raw !== "object") {
    return createEmptyDepartureStatsStore();
  }

  const parsed = raw as Partial<DepartureStatsStore>;
  return {
    runCount: typeof parsed.runCount === "number" ? parsed.runCount : 0,
    lastRunAt: typeof parsed.lastRunAt === "string" ? parsed.lastRunAt : null,
    stations:
      parsed.stations && typeof parsed.stations === "object" ? parsed.stations : {},
  };
}
