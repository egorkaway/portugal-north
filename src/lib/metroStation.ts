import type { Station } from "@/data/stations";

export const METRO_DO_PORTO_URL = "https://www.metrodoporto.pt/";
export const METRO_LISBOA_URL = "https://www.metrolisboa.pt/";

export function isMetroStation(station: Station): boolean {
  return station.types.includes("Metro");
}

export function isLisboaMetroStation(station: Station): boolean {
  return isMetroStation(station) && station.lines.some((line) => line.includes("Lisboa"));
}

/** Official metro operator site and i18n label key for station page links. */
export function getMetroOperatorLink(
  station: Station,
): { url: string; labelKey: "station.metroDoPorto" | "station.metroLisboa" } | null {
  if (!isMetroStation(station)) return null;
  if (isLisboaMetroStation(station)) {
    return { url: METRO_LISBOA_URL, labelKey: "station.metroLisboa" };
  }
  return { url: METRO_DO_PORTO_URL, labelKey: "station.metroDoPorto" };
}
