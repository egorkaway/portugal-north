import { spainStations } from "@/data/spain/stations";
import { portugalStations } from "@/data/stations";
import type { CountryCode } from "@/lib/countries";
import type { Station } from "@/data/stationTypes";

export const stationsByCountry: Record<CountryCode, Station[]> = {
  pt: portugalStations,
  es: spainStations,
};

export const allStations: Station[] = [...portugalStations, ...spainStations];

export function getStationsForCountry(country: CountryCode): Station[] {
  return stationsByCountry[country];
}
