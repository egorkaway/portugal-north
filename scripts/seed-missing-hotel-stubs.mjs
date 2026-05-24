#!/usr/bin/env node
/**
 * Add 3 Booking search listings for stations with no hotels.ts entry (deploy-friendly, no API).
 * Not OSM properties — use fetch-station-hotels.mjs to replace with real names later.
 *
 *   node scripts/seed-missing-hotel-stubs.mjs
 *   node scripts/seed-missing-hotel-stubs.mjs --dry-run
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseStations } from "./lib/stationImageFetch.mjs";
import { parseHotelMap, writeHotelMap } from "./lib/stationHotelFetch.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const stationsPath = join(root, "src/data/stations.ts");
const hotelsPath = join(root, "src/data/hotels.ts");
const dryRun = process.argv.includes("--dry-run");

function bookingUrl(stationName) {
  const ss = encodeURIComponent(`${stationName}, Portugal`);
  return `https://www.booking.com/searchresults.html?ss=${ss}&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price`;
}

function stubHotels(stationName) {
  const url = bookingUrl(stationName);
  return [
    { name: `Budget hotels · ${stationName}`, distanceKm: 0.8, priceFrom: 35, bookingUrl: url },
    { name: `Guest houses · ${stationName}`, distanceKm: 1.1, priceFrom: 30, bookingUrl: url },
    { name: `Hostels · ${stationName}`, distanceKm: 1.4, priceFrom: 25, bookingUrl: url },
  ];
}

const stations = parseStations(readFileSync(stationsPath, "utf8"));
const hotelMap = parseHotelMap(readFileSync(hotelsPath, "utf8"));

const missing = stations.filter((s) => !hotelMap[s.name]?.length);

if (missing.length === 0) {
  console.log("No stations without a hotels.ts entry.");
  process.exit(0);
}

console.log(`${dryRun ? "[dry-run] " : ""}Seeding ${missing.length} station(s)...`);

for (const station of missing) {
  hotelMap[station.name] = stubHotels(station.name);
  console.log(`  ${station.name}`);
}

if (!dryRun) {
  writeHotelMap(hotelsPath, hotelMap, stations);
  console.log(`\nWrote ${missing.length} station(s) to ${hotelsPath}`);
}
