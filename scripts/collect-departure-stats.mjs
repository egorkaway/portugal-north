#!/usr/bin/env node
/**
 * Sample CP departures/arrivals for each station and accumulate hourly stats.
 *
 *   npm run stats:departures
 *   npm run stats:departures -- --limit 5
 *   npm run stats:departures -- --station "Porto-Campanhã"
 *   npm run stats:departures -- --dry-run
 *
 * Also collects airport flight connections (skipped if the last airport check
 * was < 3 hours ago — train-only runs do not count),
 * logs temperatures (Open-Meteo) for train stations that returned a departure
 * sample attempt (OK or FAIL). Airport hub temperatures are logged only during
 * a flight-connections collect, after a successful flight sample,
 * and prints this month's avg low / avg high on OK/FAIL lines only when the
 * temperature fetch for this run succeeded,
 * publishes public/data/station-monthly-temperatures.json for station pages
 * (client hides when the Lisbon month rolls over or samples ≤ 9),
 * and syncs mobile/data (npm run sync:data).
 * Overview PNGs (portugal-activity / portugal-reliability) regenerate only when
 * at least one station sample succeeds.
 * Stations are shuffled each run so partial runs (--limit or timeouts) spread across the network.
 * Stops early after 3 consecutive API failures (e.g. CP outage or rate limit).
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnvFile, parseAllStationsFromRepo } from "./lib/stationImageFetch.mjs";
import { shouldRecheckAirportDestinations } from "./lib/airportRecheckPolicy.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const statsPath = join(root, "data/departure-stats.json");
const temperatureLogPath = join(root, "data/station-temperature-log.ndjson");

loadEnvFile(join(root, ".env"));

const { fetchCpStationTimetable } = await import("../server/lib/cpDeparturesServer.ts");
const { parseTrainsInNextHour } = await import("../server/lib/cpDeparturesParse.ts");
const {
  beginDepartureStatsRun,
  loadDepartureStatsStore,
  mergeStationSnapshot,
  recordStationSampleFailure,
} = await import("../server/lib/departureStats.ts");
const { buildReliabilityScoresManifest } = await import("../server/lib/reliabilityScore.ts");
const {
  ensureReliabilityPeriodSnapshot,
  loadLiveReliabilityManifest,
} = await import("./lib/reliabilityScorePeriodStore.mjs");

const reliabilityPath = join(root, "public/data/reliability-scores.json");
const CONSECUTIVE_FAILURE_LIMIT = 3;

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

/** Prefer store field; fall back to airport-connections.json for installs predating the field. */
function resolveLastAirportConnectionsAt(store) {
  if (store.lastAirportConnectionsAt) return store.lastAirportConnectionsAt;
  try {
    const manifest = JSON.parse(
      readFileSync(join(root, "public/data/airport-connections.json"), "utf8"),
    );
    return typeof manifest.generatedAt === "string" ? manifest.generatedAt : null;
  } catch {
    return null;
  }
}

function saveStore(store) {
  mkdirSync(dirname(statsPath), { recursive: true });
  writeFileSync(statsPath, `${JSON.stringify(store, null, 2)}\n`);

  const previousLive = loadLiveReliabilityManifest(root);
  const nextLive = buildReliabilityScoresManifest(store);
  const { stampedManifest } = ensureReliabilityPeriodSnapshot({
    rootDir: root,
    previousLiveManifest: previousLive,
    nextLiveManifest: nextLive,
  });

  mkdirSync(dirname(reliabilityPath), { recursive: true });
  writeFileSync(reliabilityPath, `${JSON.stringify(stampedManifest, null, 2)}\n`);
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
const previousAirportAt = resolveLastAirportConnectionsAt(store);
const recheckAirports = shouldRecheckAirportDestinations(previousAirportAt);
beginDepartureStatsRun(store);

if (!recheckAirports) {
  const minutesAgo = Math.round(
    (Date.now() - Date.parse(previousAirportAt)) / 60_000,
  );
  console.log(
    `Last airport destination check was ${minutesAgo} min ago (< 3 h) — sampling trains only, skipping airport destinations.`,
  );
}

let ok = 0;
let failed = 0;
let consecutiveFailures = 0;
let stoppedEarly = false;
let temperaturesLogged = 0;
let temperaturesMissed = 0;

const {
  collectAndAppendStationTemperatures,
  readStationTemperatureLog,
  computeStationMonthlyTemperatureAverages,
  formatStationMonthlyTemperatureOkSuffix,
  lisbonYearMonth,
} = await import("../server/lib/stationTemperatureLog.ts");

async function temperatureSuffixForStation(station) {
  try {
    const weather = await collectAndAppendStationTemperatures({
      stations: [station],
      logPath: temperatureLogPath,
      delayMs: 0,
    });
    temperaturesLogged += weather.ok;
    temperaturesMissed += weather.failed;
    if (weather.ok <= 0) return "";
    const tempAvg = computeStationMonthlyTemperatureAverages({
      readings: readStationTemperatureLog(temperatureLogPath),
      yearMonth: lisbonYearMonth(),
      stationNames: [station.name],
    })[0];
    return tempAvg ? ` - ${formatStationMonthlyTemperatureOkSuffix(tempAvg)}` : "";
  } catch {
    temperaturesMissed += 1;
    return "";
  }
}

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
    consecutiveFailures = 0;
    const tempSuffix = await temperatureSuffixForStation(station);
    console.log(
      `OK ${label}: +${snapshot.totals.departures} dep, +${snapshot.totals.arrivals} arr, +${snapshot.totals.delayMinutes} delay min${tempSuffix}`,
    );
  } catch (error) {
    failed += 1;
    consecutiveFailures += 1;
    const message = error instanceof Error ? error.message : String(error);
    recordStationSampleFailure(store, station.name, cpCode, message);
    const tempSuffix = await temperatureSuffixForStation(station);
    console.error(`FAIL ${label}: ${message}${tempSuffix}`);
    if (consecutiveFailures >= CONSECUTIVE_FAILURE_LIMIT) {
      stoppedEarly = true;
      console.error(
        `Stopping after ${CONSECUTIVE_FAILURE_LIMIT} consecutive failures — skipping remaining stations.`,
      );
      break;
    }
  }

  if (delayMs > 0) {
    await sleep(delayMs);
  }
}

if (!dryRun) {
  saveStore(store);

  if (temperaturesLogged > 0 || temperaturesMissed > 0) {
    console.log(
      `Temperatures: ${temperaturesLogged} logged, ${temperaturesMissed} missed → ${temperatureLogPath}`,
    );
  } else {
    console.log("No temperature samples this run.");
  }

  try {
    const {
      buildStationMonthlyTemperaturesManifest,
      writeStationMonthlyTemperaturesManifest,
      readStationTemperatureLog,
      lisbonYearMonth,
    } = await import("../server/lib/stationTemperatureLog.ts");
    const { loadAirportCatalog } = await import("./lib/airportCatalog.mjs");
    const yearMonth = lisbonYearMonth();
    const activeStationNames = new Set([
      ...Object.entries(store.stations)
        .filter(([, entry]) => entry.successfulSamples > 0)
        .map(([name]) => name),
      ...loadAirportCatalog(root).map((airport) => airport.stationName),
    ]);
    const manifest = buildStationMonthlyTemperaturesManifest({
      readings: readStationTemperatureLog(temperatureLogPath),
      yearMonth,
      stationNames: activeStationNames,
    });
    const monthlyTempPath = join(root, "public/data/station-monthly-temperatures.json");
    writeStationMonthlyTemperaturesManifest(monthlyTempPath, manifest);
    console.log(
      `Published monthly temperatures for ${Object.keys(manifest.stations).length} station(s) (${yearMonth}) → ${monthlyTempPath}`,
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Monthly temperature publish skipped: ${message}`);
  }

  if (recheckAirports) {
    const { collectAirportConnections } = await import("./collect-airport-connections.mjs");
    await collectAirportConnections({ rootDir: root, delayMs });
    store.lastAirportConnectionsAt = new Date().toISOString();
    saveStore(store);
  } else {
    console.log("Skipping airport destination recheck (last airport check < 3 hours ago).");
  }

  const { syncMobileData } = await import("../mobile/scripts/sync-data.mjs");
  console.log("Syncing mobile bundled data…");
  await syncMobileData();

  if (ok === 0) {
    console.log(
      "Skipping portugal-activity.png / portugal-reliability.png — no successful station samples this run.",
    );
  } else {
    const { renderPortugalActivityMap, renderPortugalReliabilityMap } = await import("./lib/portugalOverviewMap.mjs");
    const { resolveOverviewBasemap } = await import("./lib/mapBasemaps.mjs");
    const { mkdirSync, writeFileSync } = await import("node:fs");
    const overviewDir = join(root, "public/maps/overview");
    mkdirSync(overviewDir, { recursive: true });
    const siteUrl = (process.env.VITE_SITE_URL ?? "https://www.verystays.com").replace(/\/$/, "");
    const basemap = resolveOverviewBasemap("osm");
    const overviewMaps = [
      { filename: "portugal-activity.png", render: () => renderPortugalActivityMap(root, { siteUrl, basemap }) },
      { filename: "portugal-reliability.png", render: () => renderPortugalReliabilityMap(root, { siteUrl, basemap }) },
    ];
    for (const map of overviewMaps) {
      process.stdout.write(`Rendering overview ${map.filename}… `);
      const buf = await map.render();
      writeFileSync(join(overviewDir, map.filename), buf);
      process.stdout.write(`done (${Math.round(buf.length / 1024)} KB)\n`);
    }
    console.log(`Overview maps used ${basemap.id}`);
  }
}

const skipped = stoppedEarly ? targets.length - ok - failed : 0;
const earlyNote = stoppedEarly ? `, ${skipped} skipped after ${CONSECUTIVE_FAILURE_LIMIT} consecutive failures` : "";
const airportNote = recheckAirports ? "airport connections" : "airports skipped (<3h)";

console.log(
  dryRun
    ? `Dry run: ${ok} station(s) planned (run #${store.runCount} not saved)`
    : `Done: run #${store.runCount}, ${ok} sampled, ${failed} failed${earlyNote} → ${statsPath} (+ reliability scores, temperatures, ${airportNote}, mobile data)`,
);
