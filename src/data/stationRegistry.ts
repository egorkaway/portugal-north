import type { CountryCode } from "../lib/countries";
import { portugalStations } from "./stations";
import { spainStations } from "./spain/stations";
import type { Station } from "./stationTypes";

export const stationsByCountry: Record<CountryCode, Station[]> = {
  pt: portugalStations,
  es: spainStations,
};

export const allStations: Station[] = [...portugalStations, ...spainStations];

export function getStationsForCountry(country: CountryCode): Station[] {
  return stationsByCountry[country];
}
