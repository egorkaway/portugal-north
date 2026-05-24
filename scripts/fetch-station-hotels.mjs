#!/usr/bin/env node
/**
 * Find hotels near stations via OpenStreetMap (Overpass) and fill src/data/hotels.ts
 * until each station has up to 3 curated (non-placeholder) listings.
 *
 * Usage:
 *   node scripts/fetch-station-hotels.mjs --report
 *   node scripts/fetch-station-hotels.mjs --dry-run
 *   node scripts/fetch-station-hotels.mjs --station "Amadora"
 *   node scripts/fetch-station-hotels.mjs --max 8 --delay 5000
 *   node scripts/fetch-station-hotels.mjs
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseStations } from "./lib/stationImageFetch.mjs";
import {
  isPlaceholderHotelName,
  parseHotelMap,
  resolveHotelsForStation,
  sleep,
  writeHotelMap,
} from "./lib/stationHotelFetch.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const stationsPath = join(root, "src/data/stations.ts");
const hotelsPath = join(root, "src/data/hotels.ts");

const reportOnly = process.argv.includes("--report");
const dryRun = process.argv.includes("--dry-run");
const onlyMissing = process.argv.includes("--only-missing");
const onlyStation = process.argv.includes("--station")
  ? process.argv[process.argv.indexOf("--station") + 1]
  : null;
function readFlagValue(name) {
  const eq = process.argv.find((a) => a.startsWith(`${name}=`));
  if (eq) return eq.split("=")[1];
  const idx = process.argv.indexOf(name);
  if (idx !== -1 && process.argv[idx + 1] && !process.argv[idx + 1].startsWith("-")) {
    return process.argv[idx + 1];
  }
  return undefined;
}

const target = Number(readFlagValue("--target") ?? 3);
const maxStations = Number(readFlagValue("--max") ?? 0);
const delayMs = Number(readFlagValue("--delay") ?? 2500);

const stations = parseStations(readFileSync(stationsPath, "utf8"));
const hotelMap = parseHotelMap(readFileSync(hotelsPath, "utf8"));

function curatedCount(stationName) {
  return (hotelMap[stationName] ?? []).filter((h) => !isPlaceholderHotelName(h.name)).length;
}

let targets = (onlyStation ? stations.filter((s) => s.name === onlyStation) : stations).filter(
  (s) => curatedCount(s.name) < target,
);

if (onlyMissing) {
  targets = targets.filter((s) => !hotelMap[s.name]?.length);
}

if (maxStations > 0) {
  targets = targets.slice(0, maxStations);
}

if (onlyStation && targets.length === 0) {
  console.error(`Station not found or already has ${target} curated hotels: ${onlyStation}`);
  process.exit(1);
}

if (reportOnly) {
  console.log(`Stations with fewer than ${target} curated hotels: ${targets.length}\n`);
  for (const station of targets) {
    const all = hotelMap[station.name] ?? [];
    const curated = all.filter((h) => !isPlaceholderHotelName(h.name));
    const placeholders = all.length - curated.length;
    console.log(
      `  ${station.name}: ${curated.length} curated${placeholders ? `, ${placeholders} placeholder(s)` : ""}`,
    );
  }
  process.exit(0);
}

console.log(
  `${dryRun ? "[dry-run] " : ""}Resolving hotels for ${targets.length} station(s) (target ${target})...\n`,
);

let stationsUpdated = 0;
let hotelsAdded = 0;
const notFound = [];

for (const station of targets) {
  const existing = hotelMap[station.name] ?? [];
  try {
    const result = await resolveHotelsForStation(station, existing, { target });
    if (result.added.length === 0) {
      notFound.push(station.name);
      console.log(`  ${station.name}: NOT FOUND (have ${result.curated.length - result.added.length})`);
    } else {
      console.log(
        `  ${station.name}: +${result.added.length} (${result.radiusM}m) — ${result.added.map((h) => h.name).join(", ")}`,
      );
      hotelsAdded += result.added.length;
      if (!dryRun) {
        hotelMap[station.name] = result.curated;
        stationsUpdated++;
        writeHotelMap(hotelsPath, hotelMap, stations);
      }
    }
  } catch (error) {
    console.log(
      `  ${station.name}: ERROR — ${error instanceof Error ? error.message : error}`,
    );
  }

  await sleep(delayMs);
}

if (!dryRun && stationsUpdated > 0) {
  console.log(`\nSaved ${stationsUpdated} station(s), ${hotelsAdded} new hotel(s) to ${hotelsPath}`);
} else if (dryRun) {
  console.log(`\n[dry-run] Would add ${hotelsAdded} hotel(s) across ${targets.length} station(s)`);
}

if (notFound.length) {
  console.log(`\nNo OSM hotels found for ${notFound.length} station(s) (sparse mapping).`);
}
