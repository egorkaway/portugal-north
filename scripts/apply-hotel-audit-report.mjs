#!/usr/bin/env node
/**
 * Apply a saved audit-hotel-links report: remove broken listings and update blocklist.
 *
 *   node scripts/apply-hotel-audit-report.mjs /path/to/report.txt
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseAllStationsFromRepo } from "./lib/stationImageFetch.mjs";
import { parseMetroHotelMap } from "./lib/hotelDataParse.mjs";
import {
  addRejectedHotel,
  normHotelName,
  readRejectedHotels,
  writeRejectedHotels,
} from "./lib/rejectedHotels.mjs";
import { parseHotelMap, writeHotelMap } from "./lib/stationHotelFetch.mjs";

/** @typedef {{ stationName: string, hotelName: string, source: string, reason: string, bookingUrl: string }} BrokenEntry */

/** @param {string} report */
export function parseAuditReport(report) {
  /** @type {BrokenEntry[]} */
  const entries = [];
  const lines = report.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(
      /^\s+\[BROKEN\] (.+) — (.+) \((hotels\.ts|metroStationAssets\.ts)\) · (.+)$/,
    );
    if (!match) continue;

    const urlLine = lines[i + 1]?.trim();
    const bookingUrl = urlLine?.startsWith("https://") ? urlLine : "";
    if (!bookingUrl) continue;

    entries.push({
      stationName: match[1],
      hotelName: match[2],
      source: match[3],
      reason: match[4],
      bookingUrl,
    });
  }

  return entries;
}

/** @param {BrokenEntry} target */
function matchesBrokenHotel(hotel, target) {
  return hotel.name === target.hotelName && hotel.bookingUrl === target.bookingUrl;
}

/** @param {string} metroTs */
function removeFromMetroSource(metroTs, brokenMetro) {
  let updated = metroTs;
  let removed = 0;

  for (const target of brokenMetro) {
    const escapedName = target.hotelName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const escapedUrl = target.bookingUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const blockPattern = new RegExp(
      `\n    \\{\n      name: "${escapedName}",\n      distanceKm: [\\d.]+,\n      priceFrom: \\d+,\n      bookingUrl: "${escapedUrl}",\n    \\},`,
      "g",
    );
    const next = updated.replace(blockPattern, "");
    if (next !== updated) {
      removed++;
      updated = next;
    }
  }

  return { updated, removed };
}

function main() {
  const root = join(dirname(fileURLToPath(import.meta.url)), "..");
  const reportPath = process.argv[2] ?? "/tmp/hotel-audit-report.txt";
  const hotelsPath = join(root, "src/data/hotels.ts");
  const metroPath = join(root, "src/data/metroStationAssets.ts");
  const rejectedPath = join(root, "scripts/data/rejected-hotels.json");

  const report = readFileSync(reportPath, "utf8");
  const broken = parseAuditReport(report);
  const stations = parseAllStationsFromRepo(root);
  const hotelMap = parseHotelMap(readFileSync(hotelsPath, "utf8"));
  const metroMap = parseMetroHotelMap(readFileSync(metroPath, "utf8"));
  const rejected = readRejectedHotels(rejectedPath);

  const brokenHotels = broken.filter((b) => b.source === "hotels.ts");
  const brokenMetro = broken.filter((b) => b.source === "metroStationAssets.ts");

  let hotelsRemoved = 0;
  for (const target of brokenHotels) {
    const current = hotelMap[target.stationName] ?? [];
    const next = current.filter((hotel) => !matchesBrokenHotel(hotel, target));
    if (next.length !== current.length) {
      hotelsRemoved += current.length - next.length;
      if (next.length) hotelMap[target.stationName] = next;
      else delete hotelMap[target.stationName];
    }

    addRejectedHotel(rejected, {
      stationName: target.stationName,
      hotelName: target.hotelName,
      normalizedName: normHotelName(target.hotelName),
      bookingUrl: target.bookingUrl,
      reason: target.reason,
      rejectedAt: new Date().toISOString(),
    });
  }

  for (const target of brokenMetro) {
    const current = metroMap[target.stationName] ?? [];
    if (current.some((hotel) => matchesBrokenHotel(hotel, target))) {
      addRejectedHotel(rejected, {
        stationName: target.stationName,
        hotelName: target.hotelName,
        normalizedName: normHotelName(target.hotelName),
        bookingUrl: target.bookingUrl,
        reason: target.reason,
        rejectedAt: new Date().toISOString(),
      });
    }
  }

  writeHotelMap(hotelsPath, hotelMap, stations);
  writeRejectedHotels(rejectedPath, rejected);

  const metroSource = readFileSync(metroPath, "utf8");
  const { updated: metroUpdated, removed: metroRemoved } = removeFromMetroSource(
    metroSource,
    brokenMetro,
  );
  writeFileSync(metroPath, metroUpdated);

  console.log(`Applied ${broken.length} broken entries from report`);
  console.log(`Removed ${hotelsRemoved} hotel(s) from hotels.ts`);
  console.log(`Removed ${metroRemoved} hotel(s) from metroStationAssets.ts`);
  console.log(`Blocklist now has ${rejected.entries.length} entr(ies)`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main();
}
