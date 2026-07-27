import { pageStations } from "../data/stationRegistry";
import type { Station } from "../data/stationTypes";
import { hasPublicStationPage } from "./airportTypes";

export function stationToSlug(name: string): string {
  return name
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[()]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Only Iberian hubs/stops — Europe destination airports have no public pages. */
const stationBySlug = new Map(
  pageStations.map((station) => [stationToSlug(station.name), station]),
);

export function getStationBySlug(slug: string): Station | undefined {
  return stationBySlug.get(slug);
}

export function getStationPath(station: Station): string {
  return `/stations/${stationToSlug(station.name)}`;
}

/** Path when the station has a public page; otherwise undefined (map-only destinations). */
export function getPublicStationPath(station: Station): string | undefined {
  if (!hasPublicStationPage(station)) return undefined;
  return getStationPath(station);
}
