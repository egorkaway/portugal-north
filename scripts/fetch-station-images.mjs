#!/usr/bin/env node
/**
 * Fill missing entries in src/data/stationImages.ts.
 * Prefers Wikimedia (via Wikipedia page image); falls back to varied Pexels search.
 *
 * Usage:
 *   PEXELS_API_KEY=your_key node scripts/fetch-station-images.mjs
 *   PEXELS_API_KEY=your_key node scripts/fetch-station-images.mjs --pexels-only
 *   PEXELS_API_KEY=your_key node scripts/fetch-station-images.mjs --station "Oiã"
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  loadEnvFile,
  parseImageMap,
  parseStations,
  resolveStationImage,
  sleep,
  updateImageInMap,
  writeImageMap,
} from "./lib/stationImageFetch.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const stationsPath = join(root, "src/data/stations.ts");
const imagesPath = join(root, "src/data/stationImages.ts");

loadEnvFile(join(root, ".env"));
const apiKey = process.env.PEXELS_API_KEY;
const pexelsOnly = process.argv.includes("--pexels-only");
const onlyStation = process.argv.includes("--station")
  ? process.argv[process.argv.indexOf("--station") + 1]
  : null;

if (!apiKey) {
  console.error("Set PEXELS_API_KEY in the environment (see .env.example).");
  process.exit(1);
}

const stations = parseStations(readFileSync(stationsPath, "utf8"));
const imageMap = parseImageMap(readFileSync(imagesPath, "utf8"));
const targets = onlyStation
  ? stations.filter((station) => station.name === onlyStation)
  : stations.filter((station) => !imageMap[station.name]);

if (onlyStation && targets.length === 0) {
  console.error(`Unknown station or already has image: ${onlyStation}`);
  process.exit(1);
}

console.log(
  `Resolving images for ${targets.length} station(s)${pexelsOnly ? " (Pexels only)" : ""}...`,
);

const usedUrls = new Set(Object.values(imageMap));
let added = 0;

for (const station of targets) {
  try {
    const result = await resolveStationImage(station, { apiKey, usedUrls, pexelsOnly });
    if (result) {
      updateImageInMap(imageMap, station.name, result.url);
      added++;
      console.log(`  ${station.name}: ${result.source}`);
    } else {
      console.log(`  ${station.name}: NOT FOUND`);
    }
  } catch (error) {
    console.log(`  ${station.name}: ERROR — ${error instanceof Error ? error.message : error}`);
  }
  await sleep(600);
}

if (added > 0) {
  writeImageMap(imagesPath, imageMap);
}

console.log(`Done. Added ${added} image(s) to ${imagesPath}`);
