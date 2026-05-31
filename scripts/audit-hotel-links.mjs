#!/usr/bin/env node
/**
 * Check direct Booking.com hotel URLs and optionally remove broken listings.
 *
 * Requires Playwright Chromium: npx playwright install chromium
 *
 * Usage:
 *   node scripts/audit-hotel-links.mjs --report
 *   node scripts/audit-hotel-links.mjs --dry-run
 *   node scripts/audit-hotel-links.mjs --fix
 *   node scripts/audit-hotel-links.mjs --station "Porto São Bento"
 *   node scripts/audit-hotel-links.mjs --max 10 --delay 4000
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseAllStationsFromRepo } from "./lib/stationImageFetch.mjs";
import {
  checkBookingHotelUrl,
  isDirectBookingHotelUrl,
  isBookingSearchUrl,
  launchBookingCheckerBrowser,
} from "./lib/bookingLinkCheck.mjs";
import { parseAllHotelEntries } from "./lib/hotelDataParse.mjs";
import {
  addRejectedHotel,
  normHotelName,
  readRejectedHotels,
  writeRejectedHotels,
} from "./lib/rejectedHotels.mjs";
import { parseHotelMap, sleep, writeHotelMap } from "./lib/stationHotelFetch.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const hotelsPath = join(root, "src/data/hotels.ts");
const metroHotelsPath = join(root, "src/data/metroStationAssets.ts");
const rejectedHotelsPath = join(root, "scripts/data/rejected-hotels.json");

const reportOnly = process.argv.includes("--report");
const dryRun = process.argv.includes("--fix") ? false : process.argv.includes("--dry-run") || !process.argv.includes("--fix");
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

const maxChecks = Number(readFlagValue("--max") ?? 0);
const delayMs = Number(readFlagValue("--delay") ?? 3500);

const hotelsTs = readFileSync(hotelsPath, "utf8");
const metroTs = readFileSync(metroHotelsPath, "utf8");
const stations = parseAllStationsFromRepo(root);
const hotelMap = parseHotelMap(hotelsTs);
const rejectedHotels = readRejectedHotels(rejectedHotelsPath);

let entries = parseAllHotelEntries(hotelsTs, metroTs).filter((entry) =>
  isDirectBookingHotelUrl(entry.bookingUrl),
);

if (onlyStation) {
  entries = entries.filter((entry) => entry.stationName === onlyStation);
  if (entries.length === 0) {
    console.error(`No direct Booking hotel URLs found for station: ${onlyStation}`);
    process.exit(1);
  }
}

const searchOnlyCount = parseAllHotelEntries(hotelsTs, metroTs).filter((entry) =>
  isBookingSearchUrl(entry.bookingUrl),
).length;

if (maxChecks > 0) {
  entries = entries.slice(0, maxChecks);
}

console.log(`Direct Booking hotel URLs to check: ${entries.length}`);
console.log(`Search-result links skipped: ${searchOnlyCount}`);
console.log(`Rejected hotels on blocklist: ${rejectedHotels.entries.length}`);
if (dryRun && !reportOnly) console.log("[dry-run] No files will be changed\n");
else if (!dryRun && !reportOnly) console.log("[fix] Broken hotels.ts links will be removed\n");

/** @type {{ entry: typeof entries[number], result: Awaited<ReturnType<typeof checkBookingHotelUrl>> }[]} */
const broken = [];
/** @type {{ entry: typeof entries[number], result: Awaited<ReturnType<typeof checkBookingHotelUrl>> }[]} */
const checked = [];

let browser;
let page;

try {
  browser = await launchBookingCheckerBrowser();
  page = await browser.newPage();
} catch (error) {
  console.error(
    "Could not launch Playwright Chromium. Install it with: npx playwright install chromium",
  );
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}

for (const entry of entries) {
  const result = await checkBookingHotelUrl(page, entry.bookingUrl);
  checked.push({ entry, result });

  const status = result.skipped ? "SKIP" : result.ok ? "OK" : "BROKEN";
  console.log(
    `  [${status}] ${entry.stationName} — ${entry.name} (${entry.source})${result.reason ? ` · ${result.reason}` : ""}`,
  );
  if (!result.ok && !result.skipped) {
    console.log(`         ${entry.bookingUrl}`);
    if (result.title) console.log(`         title: ${result.title}`);
    broken.push({ entry, result });
  }

  if (reportOnly) continue;
  await sleep(delayMs);
}

await browser.close();

console.log(`\nChecked: ${checked.length}, broken: ${broken.length}`);

if (reportOnly) {
  process.exit(broken.length ? 1 : 0);
}

if (broken.length === 0) {
  console.log("All checked links look valid.");
  process.exit(0);
}

const removable = broken.filter(({ entry }) => entry.source === "hotels.ts");
const manualFix = broken.filter(({ entry }) => entry.source !== "hotels.ts");

if (manualFix.length) {
  console.log(`\nBroken links in metroStationAssets.ts (${manualFix.length}) — fix manually:`);
  for (const { entry, result } of manualFix) {
    console.log(`  ${entry.stationName} — ${entry.name}: ${result.reason}`);
  }
}

for (const { entry, result } of broken) {
  addRejectedHotel(rejectedHotels, {
    stationName: entry.stationName,
    hotelName: entry.name,
    normalizedName: normHotelName(entry.name),
    bookingUrl: entry.bookingUrl,
    reason: result.reason ?? "broken_link",
    rejectedAt: new Date().toISOString(),
  });
}

let removedCount = 0;
for (const { entry } of removable) {
  const current = hotelMap[entry.stationName] ?? [];
  const next = current.filter(
    (hotel) =>
      !(
        hotel.name === entry.name &&
        hotel.bookingUrl === entry.bookingUrl &&
        isDirectBookingHotelUrl(hotel.bookingUrl)
      ),
  );
  if (next.length !== current.length) {
    removedCount += current.length - next.length;
    if (next.length) hotelMap[entry.stationName] = next;
    else delete hotelMap[entry.stationName];
  }
}

if (dryRun) {
  console.log(`\n[dry-run] Would remove ${removedCount} hotel(s) from hotels.ts`);
  console.log(`[dry-run] Would add ${broken.length} entr(ies) to ${rejectedHotelsPath}`);
  process.exit(0);
}

writeRejectedHotels(rejectedHotelsPath, rejectedHotels);
writeHotelMap(hotelsPath, hotelMap, stations);
console.log(`\nRemoved ${removedCount} broken hotel(s) from hotels.ts`);
console.log(`Updated blocklist: ${rejectedHotelsPath} (${rejectedHotels.entries.length} total)`);
process.exit(0);
