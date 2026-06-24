import type { CountryCode } from "../lib/countries";
import { portugalStations } from "./stations";
import { portugalAirports } from "./portugal/airports";
import { spainStations } from "./spain/stations";
import { spainAirports } from "./spain/airports";
import type { Station } from "./stationTypes";

export const stationsByCountry: Record<CountryCode, Station[]> = {
  pt: [...portugalStations, ...portugalAirports],
  es: [...spainStations, ...spainAirports],
};

export const allStations: Station[] = [...stationsByCountry.pt, ...stationsByCountry.es];

export function getStationsForCountry(country: CountryCode): Station[] {
  return stationsByCountry[country];
}
