import { allStations } from "../data/stationRegistry";
import type { Station } from "../data/stationTypes";

export function stationToSlug(name: string): string {
  return name
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[()]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const stationBySlug = new Map(
  allStations.map((station) => [stationToSlug(station.name), station]),
);

export function getStationBySlug(slug: string): Station | undefined {
  return stationBySlug.get(slug);
}

export function getStationPath(station: Station): string {
  return `/stations/${stationToSlug(station.name)}`;
}
