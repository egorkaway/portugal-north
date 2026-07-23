import type { CountryCode, HomeScope } from "../lib/countries";
import { portugalStations } from "./stations";
import { portugalAirports } from "./portugal/airports";
import { spainStations } from "./spain/stations";
import { spainAirports } from "./spain/airports";
import { europeDestinationAirports } from "./europe/airports";
import type { Station } from "./stationTypes";

/** Iberian train + hub airports only (PT/ES). Europe destinations are separate. */
export const stationsByCountry: Record<CountryCode, Station[]> = {
  pt: [...portugalStations, ...portugalAirports],
  es: [...spainStations, ...spainAirports],
};

/**
 * All map/list stations: Iberian hubs/stops plus European destination airports
 * reached by direct flights from PT/ES hubs (no outbound collection from those).
 */
export const allStations: Station[] = [
  ...stationsByCountry.pt,
  ...stationsByCountry.es,
  ...europeDestinationAirports,
];

export function getStationsForCountry(country: CountryCode): Station[] {
  return stationsByCountry[country];
}

export function getStationsForHomeScope(scope: HomeScope): Station[] {
  // Destination airports only appear in the combined "all" scope.
  if (scope === "all") return allStations;
  return getStationsForCountry(scope);
}
