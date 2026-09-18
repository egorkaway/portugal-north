/**
 * Soft cap on PT/ES stations + Iberian airports + metro termini.
 * Europe destination airports are outside this count (even when country is pt/es).
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { parseStations } from "./stationImageFetch.mjs";

/** Raised from the 1.0 freeze (1404). Departures still add at most one Iberian entry per run. */
export const IBERIAN_CATALOG_CAP = 1411;

/** Previous freeze watermark (docs / migration notes). */
export const IBERIAN_CATALOG_CAP_PREVIOUS = 1404;

const IBERIAN_STATION_FILES = [
  { rel: "src/data/stations.ts", country: "pt" },
  { rel: "src/data/portugal/airports.ts", country: "pt" },
  { rel: "src/data/spain/stations.ts", country: "es" },
  { rel: "src/data/spain/airports.ts", country: "es" },
  { rel: "src/data/metroPortoStations.ts", country: "pt" },
  { rel: "src/data/metroLisboaStations.ts", country: "pt" },
];

/**
 * @param {string} rootDir
 * @returns {Array<{ name: string, country: string }>}
 */
export function listIberianCatalogStations(rootDir) {
  const rows = [];
  for (const file of IBERIAN_STATION_FILES) {
    const text = readFileSync(join(rootDir, file.rel), "utf8");
    for (const station of parseStations(text)) {
      rows.push({ ...station, country: file.country });
    }
  }
  return rows;
}

/**
 * @param {string} rootDir
 * @returns {number}
 */
export function countIberianCatalog(rootDir) {
  return listIberianCatalogStations(rootDir).length;
}

/**
 * @param {string} rootDir
 * @param {number} [cap]
 * @returns {number} how many Iberian entries may still be added
 */
export function iberianCatalogSlotsRemaining(rootDir, cap = IBERIAN_CATALOG_CAP) {
  return Math.max(0, Number(cap) - countIberianCatalog(rootDir));
}
