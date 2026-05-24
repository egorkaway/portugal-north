#!/usr/bin/env node
/**
 * Replace duplicate station photos with unique Pexels/Wikimedia images.
 *
 *   node scripts/diversify-station-images.mjs
 *   node scripts/diversify-station-images.mjs --dry-run
 *   node scripts/diversify-station-images.mjs --only-pexels
 */
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";
import {
  findDuplicateGroups,
  loadEnvFile,
  parseImageMap,
  parseStations,
  resolveStationImage,
  sleep,
  writeImageMap,
} from "./lib/stationImageFetch.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const stationsPath = join(root, "src/data/stations.ts");
const imagesPath = join(root, "src/data/stationImages.ts");

loadEnvFile(join(root, ".env"));
const apiKey = process.env.PEXELS_API_KEY;
const dryRun = process.argv.includes("--dry-run");
const onlyPexels = process.argv.includes("--only-pexels");

if (!apiKey) {
  console.error("Set PEXELS_API_KEY in .env or the environment.");
  process.exit(1);
}

const stations = parseStations(readFileSync(stationsPath, "utf8"));
const stationByName = new Map(stations.map((station) => [station.name, station]));
const imageMap = parseImageMap(readFileSync(imagesPath, "utf8"));

const duplicateGroups = findDuplicateGroups(imageMap).filter(([url]) =>
  onlyPexels ? url.includes("pexels.com") : true,
);

const toFix = duplicateGroups.flatMap(([, names]) => names).sort((a, b) => a.localeCompare(b));

console.log(
  `${duplicateGroups.length} duplicate URL group(s), ${toFix.length} station(s) to re-resolve${dryRun ? " (dry run)" : ""}.`,
);

const usedUrls = new Set(
  Object.entries(imageMap)
    .filter(([name]) => !toFix.includes(name))
    .map(([, url]) => url),
);

let updated = 0;
let failed = 0;

for (const name of toFix) {
  const station = stationByName.get(name);
  if (!station) {
    console.log(`  ${name}: no station metadata, skip`);
    failed++;
    continue;
  }

  try {
    const result = await resolveStationImage(station, {
      apiKey,
      usedUrls,
      pexelsOnly: onlyPexels || imageMap[name]?.includes("pexels.com"),
    });

    if (!result) {
      console.log(`  ${name}: no unique image found`);
      failed++;
      continue;
    }

    if (result.url === imageMap[name]) {
      console.log(`  ${name}: unchanged`);
      continue;
    }

    console.log(`  ${name}: ${result.source}${result.query ? ` (“${result.query}”)` : ""}`);
    if (!dryRun) {
      imageMap[name] = result.url;
      updated++;
    }
  } catch (error) {
    console.log(`  ${name}: ERROR — ${error instanceof Error ? error.message : error}`);
    failed++;
  }

  await sleep(700);
}

if (!dryRun && updated > 0) {
  writeImageMap(imagesPath, imageMap);
}

const afterGroups = findDuplicateGroups(dryRun ? imageMap : imageMap);
console.log(
  `\nDone. ${dryRun ? "Would update" : "Updated"} ${updated}, failed ${failed}. Duplicate groups now: ${afterGroups.length}.`,
);
