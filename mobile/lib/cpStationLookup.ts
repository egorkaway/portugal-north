import { bakedCpCodes } from '@/lib/stationData';

export function getStationNameByCpCode(code: string): string | undefined {
  for (const [name, stationCode] of Object.entries(bakedCpCodes)) {
    if (stationCode === code) return name;
  }
  return undefined;
}
