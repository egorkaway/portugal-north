import { pageStations } from "../data/stationRegistry";
import type { Station } from "../data/stationTypes";
import { hasPublicStationPage } from "./airportTypes";
import { getExternalAirportPageStations, hasExternalAirportDestinationPage } from "./externalAirportPages";

export function stationToSlug(name: string): string {
  return name
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[()]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Listed Iberian hubs/stops plus destination airports that have both connection maps. */
const stationBySlug = new Map(
  [...pageStations, ...getExternalAirportPageStations()].map((station) => [
    stationToSlug(station.name),
    station,
  ]),
);

export function getStationBySlug(slug: string): Station | undefined {
  const trimmed = slug.trim();
  return stationBySlug.get(trimmed) ?? stationBySlug.get(stationToSlug(trimmed));
}

export function getStationPath(station: Station): string {
  return `/stations/${stationToSlug(station.name)}`;
}

/** Path when the station has a public page; otherwise undefined (map-only destinations). */
export function getPublicStationPath(station: Station): string | undefined {
  if (hasPublicStationPage(station) || hasExternalAirportDestinationPage(station)) {
    return getStationPath(station);
  }
  return undefined;
}
