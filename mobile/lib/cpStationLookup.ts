import { getCpCodes } from '@/lib/stationData';

export function getStationNameByCpCode(code: string): string | undefined {
  for (const [name, stationCode] of Object.entries(getCpCodes())) {
    if (stationCode === code) return name;
  }
  return undefined;
}
