#!/usr/bin/env node
/**
 * Sample CP departures/arrivals for each station and accumulate hourly stats.
 *
 *   npm run stats:departures
 *   npm run stats:departures -- --limit 5
 *   npm run stats:departures -- --station "Porto-Campanhã"
 *   npm run stats:departures -- --dry-run
 *
 * Stations are shuffled each run so partial runs (--limit or timeouts) spread across the network.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnvFile, parseAllStationsFromRepo } from "./lib/stationImageFetch.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const statsPath = join(root, "data/departure-stats.json");

loadEnvFile(join(root, ".env"));

const { fetchCpStationTimetable } = await import("../server/lib/cpDeparturesServer.ts");
const { parseTrainsInNextHour } = await import("../server/lib/cpDeparturesParse.ts");
const {
  beginDepartureStatsRun,
  loadDepartureStatsStore,
  mergeStationSnapshot,
  recordStationSampleFailure,
} = await import("../server/lib/departureStats.ts");

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const limitArg = args.find((a) => a.startsWith("--limit"));
const limit = limitArg
  ? Number.parseInt(limitArg.split("=")[1] ?? args[args.indexOf("--limit") + 1], 10)
  : Infinity;
const stationArg = args.find((a) => a.startsWith("--station"));
const stationFilter = stationArg
  ? (stationArg.includes("=")
      ? stationArg.split("=")[1]
      : args[args.indexOf("--station") + 1])
  : null;
const delayArg = args.find((a) => a.startsWith("--delay"));
const delayMs = delayArg
  ? Number.parseInt(delayArg.split("=")[1] ?? args[args.indexOf("--delay") + 1], 10)
  : 250;

function parseCpStationCodes(ts) {
  const map = {};
  for (const match of ts.matchAll(/"([^"]+)":\s*"(94-\d+)"/g)) {
    map[match[1]] = match[2];
  }
  return map;
}

function loadStore() {
  try {
    return loadDepartureStatsStore(JSON.parse(readFileSync(statsPath, "utf8")));
  } catch {
    return loadDepartureStatsStore(null);
  }
}

function saveStore(store) {
  mkdirSync(dirname(statsPath), { recursive: true });
  writeFileSync(statsPath, `${JSON.stringify(store, null, 2)}\n`);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Fisher–Yates shuffle (mutates array). */
function shuffleInPlace(items) {
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

const cpCodes = parseCpStationCodes(readFileSync(join(root, "src/data/cpStationCodes.ts"), "utf8"));
const stations = parseAllStationsFromRepo(root);

let targets = stations
  .map((station) => ({ station, cpCode: cpCodes[station.name] }))
  .filter((entry) => Boolean(entry.cpCode));

if (stationFilter) {
  const needle = stationFilter.toLowerCase();
  targets = targets.filter(
    (entry) =>
      entry.station.name.toLowerCase().includes(needle) ||
      entry.cpCode.includes(needle),
  );
}

shuffleInPlace(targets);

if (Number.isFinite(limit) && limit > 0) {
  targets = targets.slice(0, limit);
}

if (!targets.length) {
  console.error("No stations with CP codes matched.");
  process.exit(1);
}

const store = loadStore();
beginDepartureStatsRun(store);

let ok = 0;
let failed = 0;

for (const { station, cpCode } of targets) {
  const label = `${station.name} (${cpCode})`;
  if (dryRun) {
    console.log(`[dry-run] ${label}`);
    ok += 1;
    continue;
  }

  try {
    const timetable = await fetchCpStationTimetable(cpCode);
    const snapshot = parseTrainsInNextHour(
      timetable.response,
      new Date(),
      timetable.timetableDate,
    );
    mergeStationSnapshot(store, station.name, cpCode, snapshot);
    ok += 1;
    console.log(
      `OK ${label}: +${snapshot.totals.departures} dep, +${snapshot.totals.arrivals} arr, +${snapshot.totals.delayMinutes} delay min`,
    );
  } catch (error) {
    failed += 1;
    const message = error instanceof Error ? error.message : String(error);
    recordStationSampleFailure(store, station.name, cpCode, message);
    console.error(`FAIL ${label}: ${message}`);
  }

  if (delayMs > 0) {
    await sleep(delayMs);
  }
}

if (!dryRun) {
  saveStore(store);
}

console.log(
  dryRun
    ? `Dry run: ${ok} station(s) planned (run #${store.runCount} not saved)`
    : `Done: run #${store.runCount}, ${ok} sampled, ${failed} failed → ${statsPath}`,
);
