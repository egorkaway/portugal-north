import { readFileSync } from "node:fs";
import { join } from "node:path";
import { stationToSlug } from "./socialCard.mjs";

const IATA_IN_NAME_RE = /\(([A-Z]{3})\)\s*$/;

function parseAirportStations(ts, countryCode) {
  return [...ts.matchAll(/\{\s*name:\s*"([^"]+)"[^}]*lines:\s*\[([^\]]*)\][^}]*types:\s*\[[^\]]*Airport[^\]]*\][^}]*lat:\s*([\d.-]+)[^}]*lng:\s*([\d.-]+)/gs)].map(
    (match) => {
      const stationName = match[1];
      const lineCodes = [...match[2].matchAll(/"([^"]+)"/g)].map((entry) => entry[1]);
      const iata =
        lineCodes[0] ??
        stationName.match(IATA_IN_NAME_RE)?.[1] ??
        null;
      return {
        stationName,
        slug: stationToSlug(stationName),
        iata,
        name: stationName.replace(/\s*\([A-Z]{3}\)\s*$/, "").trim(),
        lat: Number(match[3]),
        lng: Number(match[4]),
        countryCode,
      };
    },
  );
}

export function loadAirportCatalog(root) {
  const read = (rel) => readFileSync(join(root, rel), "utf8");
  return [
    ...parseAirportStations(read("src/data/portugal/airports.ts"), "pt"),
    ...parseAirportStations(read("src/data/spain/airports.ts"), "es"),
  ].filter((airport) => airport.iata);
}
