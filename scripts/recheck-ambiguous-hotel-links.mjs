#!/usr/bin/env node
/**
 * Re-check ambiguous hotel URLs from a saved audit report (with delay between requests).
 *
 *   node scripts/recheck-ambiguous-hotel-links.mjs /path/to/report.txt
 */
import { readFileSync } from "node:fs";
import { parseAuditReport } from "./apply-hotel-audit-report.mjs";
import {
  checkBookingHotelUrl,
  launchBookingCheckerBrowser,
} from "./lib/bookingLinkCheck.mjs";
import { sleep } from "./lib/stationHotelFetch.mjs";

const reportPath = process.argv[2] ?? "/tmp/hotel-audit-report.txt";
const delayMs = Number(process.argv.find((a) => a.startsWith("--delay="))?.split("=")[1] ?? 4000);

const report = readFileSync(reportPath, "utf8");
const ambiguous = parseAuditReport(report).filter((entry) => entry.reason === "ambiguous_page");

console.log(`Re-checking ${ambiguous.length} ambiguous URL(s) with ${delayMs}ms delay...\n`);

const browser = await launchBookingCheckerBrowser();
const page = await browser.newPage();

/** @type {{ entry: typeof ambiguous[number], result: Awaited<ReturnType<typeof checkBookingHotelUrl>> }[]} */
const results = [];

for (const entry of ambiguous) {
  const result = await checkBookingHotelUrl(page, entry.bookingUrl);
  results.push({ entry, result });
  const status = result.ok ? "OK" : "BROKEN";
  console.log(`  [${status}] ${entry.stationName} — ${entry.hotelName}`);
  console.log(`         ${entry.bookingUrl}`);
  if (result.title) console.log(`         title: ${result.title}`);
  if (result.reason) console.log(`         reason: ${result.reason}`);
  await sleep(delayMs);
}

await browser.close();

const confirmedBroken = results.filter(({ result }) => !result.ok);
const falsePositives = results.filter(({ result }) => result.ok);

console.log(`\nConfirmed broken: ${confirmedBroken.length}`);
console.log(`False positives (valid pages): ${falsePositives.length}`);

if (falsePositives.length) {
  console.log("\nValid after re-check (removed in error — consider restoring):");
  for (const { entry } of falsePositives) {
    console.log(`  ${entry.stationName} — ${entry.hotelName}`);
  }
}

process.exit(confirmedBroken.length ? 1 : 0);
