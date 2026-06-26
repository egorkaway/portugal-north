import { hasStationSummary } from "@/lib/stationSummary";
import { rankStationsByTrainVolume } from "@/lib/stationTrainVolume";

/** Stations with departure-stats data but no summary yet, busiest first. */
export function stationsNeedingSummaries(limit?: number): string[] {
  const pending = rankStationsByTrainVolume()
    .map((entry) => entry.station.name)
    .filter((name) => !hasStationSummary(name));

  return limit ? pending.slice(0, limit) : pending;
}
