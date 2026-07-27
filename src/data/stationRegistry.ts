import type { CountryCode, HomeScope } from "../lib/countries";
import { hasPublicStationPage } from "../lib/airportTypes";
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
 * Full catalog for maps / flight tracking: Iberian hubs/stops plus European
 * destination airports reached by direct flights from PT/ES hubs.
 * Destinations are not listed and have no `/stations/:slug` pages.
 */
export const allStations: Station[] = [
  ...stationsByCountry.pt,
  ...stationsByCountry.es,
  ...europeDestinationAirports,
];

/** Stations that get list entries, search hits, and public station pages. */
export const pageStations: Station[] = allStations.filter(hasPublicStationPage);

export function getStationsForCountry(country: CountryCode): Station[] {
  return stationsByCountry[country];
}

export function getStationsForHomeScope(scope: HomeScope): Station[] {
  if (scope === "all") return pageStations;
  return getStationsForCountry(scope);
}
