import { hasStationSummary } from "@/lib/stationSummary";
import { rankStationsByTrainVolume } from "@/lib/stationTrainVolume";
import { portugalStations } from "@/data/stations";

/** Stations with departure-stats data but no summary yet, busiest first. */
export function stationsNeedingSummaries(limit?: number): string[] {
  const pending = rankStationsByTrainVolume()
    .map((entry) => entry.station.name)
    .filter((name) => !hasStationSummary(name));

  return limit ? pending.slice(0, limit) : pending;
}

/** Portuguese CP/metro/airport stops with no editorial summary yet. */
export function portugalStationsWithoutSummaries(): string[] {
  return portugalStations
    .map((station) => station.name)
    .filter((name) => !hasStationSummary(name));
}
