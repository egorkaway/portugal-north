import { readFileSync } from "node:fs";
import { join } from "node:path";
import { allStations } from "@/data/stationRegistry";
import type { Station } from "@/data/stationTypes";

export type StationTrainVolume = {
  station: Station;
  departuresNextHour: number;
  successfulSamples: number;
};

let cachedStats: {
  stations: Record<
    string,
    {
      totals?: { departuresNextHour?: number };
      successfulSamples?: number;
    }
  >;
} | null = null;

function loadDepartureStats() {
  if (!cachedStats) {
    const path = join(process.cwd(), "data/departure-stats.json");
    cachedStats = JSON.parse(readFileSync(path, "utf8"));
  }
  return cachedStats;
}

/** Rank stations by cumulative departures observed in departure-stats samples. */
export function rankStationsByTrainVolume(
  stations: Station[] = allStations,
): StationTrainVolume[] {
  const stats = loadDepartureStats();

  return stations
    .map((station) => {
      const entry = stats.stations[station.name];
      return {
        station,
        departuresNextHour: entry?.totals?.departuresNextHour ?? 0,
        successfulSamples: entry?.successfulSamples ?? 0,
      };
    })
    .filter((entry) => entry.successfulSamples > 0)
    .sort((a, b) => {
      if (b.departuresNextHour !== a.departuresNextHour) {
        return b.departuresNextHour - a.departuresNextHour;
      }
      return a.station.name.localeCompare(b.station.name);
    });
}
