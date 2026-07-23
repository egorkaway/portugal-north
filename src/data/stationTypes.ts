import type { CountryCode } from "../lib/countries";

export type { CountryCode };

export interface StationData {
  name: string;
  lines: string[];
  types: string[];
  lat: number;
  lng: number;
}

/**
 * Iberian hubs use `pt` / `es`. Europe destination airports use ISO 3166-1
 * alpha-2 lowercase (e.g. `de`, `fr`) — see `europe/airports.ts`.
 */
export type StationCountry = CountryCode | string;

export interface Station extends StationData {
  country: StationCountry;
}
