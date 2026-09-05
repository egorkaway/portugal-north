import { europeDestinationAirports } from "@/data/europe/airports";
import { EXTERNAL_AIRPORT_PAGE_IATAS } from "@/data/externalAirportPageIatas";
import type { Station } from "@/data/stationTypes";
import { isAirportDestinationStation } from "@/lib/airportTypes";
import { externalMapPublicPath } from "@/lib/externalAirportSpotlight";
import { stationToSlug } from "@/lib/stationSlug";

const pageIataSet = new Set(
  EXTERNAL_AIRPORT_PAGE_IATAS.map((iata) => iata.trim().toUpperCase()),
);

function stationIata(station: Pick<Station, "name" | "lines">): string | null {
  const fromLine = station.lines[0]?.trim().toUpperCase();
  if (fromLine && /^[A-Z]{3}$/.test(fromLine)) return fromLine;
  return station.name.match(/\(([A-Z]{3})\)\s*$/)?.[1] ?? null;
}

export function hasExternalAirportDestinationPage(
  station: Pick<Station, "name" | "lines" | "types">,
): boolean {
  if (!isAirportDestinationStation(station)) return false;
  const iata = stationIata(station);
  return Boolean(iata && pageIataSet.has(iata));
}

export function getExternalAirportPageStations(): Station[] {
  return europeDestinationAirports.filter(hasExternalAirportDestinationPage);
}

export function getExternalAirportPageIataSet(): ReadonlySet<string> {
  return pageIataSet;
}

export function getExternalAirportMapPaths(station: Pick<Station, "name">): {
  iberian: string;
  all: string;
} {
  const slug = stationToSlug(station.name);
  return {
    iberian: externalMapPublicPath(slug, "iberian"),
    all: externalMapPublicPath(slug, "all"),
  };
}
