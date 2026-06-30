import { cpStationCodes } from "@/data/cpStationCodes";

export function getStationNameByCpCode(code: string): string | undefined {
  for (const [name, stationCode] of Object.entries(cpStationCodes)) {
    if (stationCode === code) return name;
  }
  return undefined;
}
