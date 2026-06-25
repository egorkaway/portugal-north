import { sortTrainTypes } from "@/lib/trainTypes";

/** Map CP timetable service designations to site station `types` badges/filters. */
export const CP_SERVICE_TO_STATION_TYPE: Record<string, string> = {
  "Alfa Pendular": "Alfa Pendular",
  Intercidades: "Intercidades",
  /** IR is grouped with IC for filters — CP reports Minho/Norte intercity as InterRegional. */
  InterRegional: "Intercidades",
  Regional: "Regional",
  Urbano: "Urban",
};

export type CpTrainTypeCounts = {
  departuresNextHour?: number;
  arrivalsNextHour?: number;
};

export function stationTypesFromDepartureStats(
  byTrainType: Record<string, CpTrainTypeCounts> | undefined,
): string[] {
  if (!byTrainType) return [];

  const types = new Set<string>();
  for (const [cpType, counts] of Object.entries(byTrainType)) {
    const activity = (counts.departuresNextHour ?? 0) + (counts.arrivalsNextHour ?? 0);
    if (activity <= 0) continue;

    const mapped = CP_SERVICE_TO_STATION_TYPE[cpType];
    if (mapped) types.add(mapped);
  }

  return sortTrainTypes([...types]);
}

/** Add types inferred from stats; never remove manually curated types. */
export function mergeStationTypes(existing: string[], fromStats: string[]): string[] {
  return sortTrainTypes([...new Set([...existing, ...fromStats])]);
}
