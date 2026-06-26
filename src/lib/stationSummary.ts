import { stationSummaries } from "@/data/stationSummaries";

export function getStationSummary(stationName: string): string | undefined {
  return stationSummaries[stationName];
}

export function hasStationSummary(stationName: string): boolean {
  return stationName in stationSummaries;
}
