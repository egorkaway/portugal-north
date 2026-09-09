/**
 * Area maps are only shown on public station pages.
 * That is Iberian rail/hubs plus destination airports that have both Iberian +
 * all-flights connection maps (EXTERNAL_AIRPORT_PAGE_IATAS).
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { parseAllStationsFromRepo, parseStations } from "./stationImageFetch.mjs";

function loadExternalAirportPageIatas(rootDir) {
  const raw = readFileSync(join(rootDir, "src/data/externalAirportPageIatas.ts"), "utf8");
  const matches = [...raw.matchAll(/"([A-Z]{3})"/g)].map((match) => match[1]);
  return new Set(matches);
}

/**
 * Catalog stations that may receive a surrounding-area PNG under public/maps/stations/.
 * Map-only European destination airports (no dedicated page) are excluded.
 */
export function loadStationsEligibleForAreaMaps(rootDir) {
  const pageIatas = loadExternalAirportPageIatas(rootDir);
  const europeNames = new Set(
    parseStations(readFileSync(join(rootDir, "src/data/europe/airports.ts"), "utf8")).map(
      (station) => station.name,
    ),
  );
  return parseAllStationsFromRepo(rootDir).filter((station) => {
    if (!Number.isFinite(station.lat) || !Number.isFinite(station.lng)) return false;
    if (!europeNames.has(station.name)) return true;
    const iata = String(station.lines?.[0] ?? "")
      .trim()
      .toUpperCase();
    return pageIatas.has(iata);
  });
}

export function stationNamesEligibleForAreaMaps(rootDir) {
  return new Set(loadStationsEligibleForAreaMaps(rootDir).map((station) => station.name));
}
