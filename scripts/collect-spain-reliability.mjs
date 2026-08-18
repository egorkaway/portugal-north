#!/usr/bin/env node
/**
 * Sample Renfe GTFS-RT trip updates (Cercanías + long-distance) and accumulate
 * delay observations for Spanish catalog stations and trains.
 *
 *   npm run stats:spain
 *   npm run stats:spain -- --dry-run
 *
 * Writes data/spain-departure-stats.json (committed snapshots) and appends
 * data/spain-train-delay-log.ndjson (local ops log, gitignored).
 * Also invoked from collect-departure-stats.mjs so the launchd loop picks it up.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const statsPath = join(root, "data/spain-departure-stats.json");
const delayLogPath = join(root, "data/spain-train-delay-log.ndjson");
const FETCH_TIMEOUT_MS = 12_000;

export async function collectSpainReliability(options = {}) {
  const dryRun = Boolean(options.dryRun);
  const { loadDepartureStatsStore } = await import("../server/lib/departureStats.ts");
  const { mergeSpainReliabilitySnapshots } = await import(
    "../server/lib/spainReliabilityCollect.ts"
  );
  const { appendSpainTrainDelayLog, spainTrainDelayEntriesFromObservations } = await import(
    "../server/lib/spainTrainDelayLog.ts"
  );
  const { mergeSpainTripUpdateFeeds } = await import("../src/lib/spainTripUpdates.ts");
  const {
    RENFE_TRIP_UPDATES_CERCANIAS,
    RENFE_TRIP_UPDATES_LONG_DISTANCE,
  } = await import("../src/lib/spainRenfeFeeds.ts");

  async function fetchFeedOrNull(url) {
    try {
      const res = await fetch(url, {
        cache: "no-store",
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error(`renfe_http_${res.status}`);
      return await res.json();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`Spain trip updates failed (${url}): ${message}`);
      return null;
    }
  }

  const [cercanias, longDistance] = await Promise.all([
    fetchFeedOrNull(RENFE_TRIP_UPDATES_CERCANIAS),
    fetchFeedOrNull(RENFE_TRIP_UPDATES_LONG_DISTANCE),
  ]);

  if (!cercanias && !longDistance) {
    return { ok: false, observations: 0, matchedStations: 0, unmatched: 0, dryRun };
  }

  const observations = mergeSpainTripUpdateFeeds({ cercanias, longDistance });
  let store;
  try {
    store = loadDepartureStatsStore(JSON.parse(readFileSync(statsPath, "utf8")));
  } catch {
    store = loadDepartureStatsStore(null);
  }

  const recordedAt = new Date().toISOString();
  const { matchedStations, unmatched } = mergeSpainReliabilitySnapshots(
    store,
    observations,
    recordedAt,
  );
  const delayEntries = spainTrainDelayEntriesFromObservations({ observations, recordedAt });

  if (!dryRun) {
    mkdirSync(dirname(statsPath), { recursive: true });
    writeFileSync(statsPath, `${JSON.stringify(store, null, 2)}\n`);
    appendSpainTrainDelayLog(delayLogPath, delayEntries);
  }

  const matchedObs = observations.length - unmatched;
  console.log(
    `${dryRun ? "Dry run: " : ""}Spain reliability run #${store.runCount}: ${observations.length} trip update(s), ${matchedObs} at catalog stations (${matchedStations} station(s)), ${unmatched} unmatched stop(s) → ${statsPath}`,
  );

  return {
    ok: true,
    observations: observations.length,
    matchedStations,
    unmatched,
    dryRun,
    runCount: store.runCount,
  };
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];

if (isMain) {
  const dryRun = process.argv.includes("--dry-run");
  collectSpainReliability({ dryRun }).then((result) => {
    process.exit(result.ok ? 0 : 1);
  });
}
