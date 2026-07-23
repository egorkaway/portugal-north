#!/usr/bin/env node
/**
 * Fetch airport departures (AviationStack, with AirLabs Schedules fallback),
 * bake connections JSON, and render static connection map PNGs.
 *
 * Periods: nine open dates per year (see airportConnectionPeriods.mjs). On each
 * boundary the previous live bake is frozen under public/.../periods/{YYYY-MM-DD}/
 * and a new live period starts.
 *
 *   node --import tsx scripts/collect-airport-connections.mjs
 *   node --import tsx scripts/collect-airport-connections.mjs --airport LIS
 *   node --import tsx scripts/collect-airport-connections.mjs --dry-run
 *   node --import tsx scripts/collect-airport-connections.mjs --maps-only
 *   node --import tsx scripts/collect-airport-connections.mjs --period-status
 *   node --import tsx scripts/collect-airport-connections.mjs --as-of=2026-08-11
 *   node --import tsx scripts/collect-airport-connections.mjs --backfill-europe-destinations
 *
 * After a successful bake (or with --backfill-europe-destinations), European
 * destinations not in the PT/ES hub catalog are upserted into
 * src/data/europe/airports.ts as "Airport Destination" stations (map only;
 * no outbound collection).
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnvFile } from "./lib/stationImageFetch.mjs";
import { loadAirportCatalog } from "./lib/airportCatalog.mjs";
import {
  ensureAirportCoordinateCache,
  loadAirportCoordinateCache,
  saveAirportCoordinateCache,
} from "./lib/airportCoordinates.mjs";
import { renderAirportConnectionsMap } from "./lib/airportConnectionsMap.mjs";
import { periodContaining, lisbonDateString } from "./lib/airportConnectionPeriods.mjs";
import {
  ensureAirportConnectionPeriodRoll,
  liveMapsDir,
  liveManifestPath,
  loadPeriodsIndex,
} from "./lib/airportConnectionPeriodStore.mjs";
import {
  loadAirportMapVisibility,
  saveAirportMapVisibility,
} from "./lib/airportMapVisibilityStore.mjs";
import {
  collectDestinationIatasFromManifest,
  upsertEuropeDestinationAirports,
} from "./lib/europeDestinationAirports.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
loadEnvFile(join(root, ".env"));

const {
  fetchDeparturesFromAirport,
  fetchAirportByIata,
  hasAirportFlightProvider,
  isAirportFlightQuotaExhaustedError,
  resetAirportFlightProvider,
  availableAirportFlightProviders,
} = await import("../server/lib/airportFlightProvider.ts");
const {
  buildAirportConnections,
  mergeCatalogIntoCoordinates,
} = await import("../server/lib/airportConnections.ts");
const {
  recordAirportConnectionsEmpty,
  recordAirportConnectionsOk,
} = await import("../server/lib/airportMapVisibility.ts");

const cachePath = join(root, "data/airport-iata-coordinates.json");

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const airportArg = args.find((arg) => arg.startsWith("--airport"));
const airportFilter = airportArg
  ? (airportArg.includes("=")
      ? airportArg.split("=")[1]
      : args[args.indexOf("--airport") + 1])
  : null;
const delayArg = args.find((arg) => arg.startsWith("--delay"));
const delayMs = delayArg
  ? Number.parseInt(delayArg.split("=")[1] ?? args[args.indexOf("--delay") + 1], 10)
  : 400;
const mapsOnly = args.includes("--maps-only");
const periodStatus = args.includes("--period-status");
const backfillEuropeDestinations = args.includes("--backfill-europe-destinations");
const asOfArg = args.find((arg) => arg.startsWith("--as-of"));
const asOfDate = asOfArg
  ? asOfArg.includes("=")
    ? asOfArg.split("=")[1]
    : args[args.indexOf("--as-of") + 1]
  : null;
const basemapArg = args.find((arg) => arg.startsWith("--basemap"));
const defaultBasemapMode = basemapArg
  ? basemapArg.includes("=")
    ? basemapArg.split("=")[1]
    : args[args.indexOf("--basemap") + 1] ?? "random"
  : "random";

const siteUrl = (process.env.VITE_SITE_URL ?? "https://www.verystays.com").replace(/\/$/, "");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function loadRunCount(rootDir) {
  try {
    const stats = JSON.parse(readFileSync(join(rootDir, "data/departure-stats.json"), "utf8"));
    return typeof stats.runCount === "number" ? stats.runCount : 0;
  } catch {
    return 0;
  }
}

function loadExistingManifest(rootDir) {
  try {
    return JSON.parse(readFileSync(liveManifestPath(rootDir), "utf8"));
  } catch {
    return { airports: {} };
  }
}

function printPeriodStatus(rootDir, asOf) {
  const asOfLabel = asOf ? lisbonDateString(asOf) : lisbonDateString();
  const period = periodContaining(asOf ?? new Date());
  const index = loadPeriodsIndex(rootDir);
  const live = loadExistingManifest(rootDir);
  console.log(`Timezone: ${index.timezone ?? "Europe/Lisbon"}`);
  console.log(`As of: ${asOfLabel} → open period ${period.id} (until ${period.endExclusive})`);
  console.log(`Index current: ${index.currentPeriodId ?? "(none)"}`);
  console.log(`Live manifest periodId: ${live.periodId ?? "(none)"}`);
  console.log(`Frozen periods: ${(index.periods ?? []).map((p) => p.id).join(", ") || "(none)"}`);
}

async function resolveMissingCoordinates(groupedIatas, coordinates, options = {}) {
  const { delay = delayMs, onQuotaExhausted } = options;
  let updated = false;
  for (const iata of groupedIatas) {
    if (coordinates[iata]) continue;
    try {
      const airport = await fetchAirportByIata(iata);
      const lat = Number.parseFloat(String(airport?.latitude ?? ""));
      const lng = Number.parseFloat(String(airport?.longitude ?? ""));
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;
      coordinates[iata] = {
        name: airport?.airport_name?.trim() || iata,
        country: airport?.country_name?.trim() || "",
        lat,
        lng,
      };
      updated = true;
      console.log(`Cached coords for ${iata}`);
    } catch (error) {
      if (isAirportFlightQuotaExhaustedError(error)) {
        onQuotaExhausted?.(error);
        return true;
      }
      const message = error instanceof Error ? error.message : String(error);
      console.warn(`Skip ${iata} coords: ${message}`);
    }
    if (delay > 0) await sleep(Math.max(200, delay / 2));
  }
  if (updated) saveAirportCoordinateCache(cachePath, coordinates);
  return false;
}

export async function collectAirportConnections(options = {}) {
  const {
    rootDir = root,
    dryRun: isDryRun = dryRun,
    airportFilter: filter = airportFilter,
    delayMs: delay = delayMs,
    mapsOnly: renderMapsOnly = mapsOnly,
    basemapMode: basemapMode = defaultBasemapMode,
    asOf = asOfDate,
    periodStatusOnly = periodStatus,
    backfillEurope = backfillEuropeDestinations,
  } = options;

  if (periodStatusOnly) {
    printPeriodStatus(rootDir, asOf);
    return { ok: 0, failed: 0, skipped: true, periodStatus: true };
  }

  const mapsOutDir = liveMapsDir(rootDir);
  const outJsonPath = liveManifestPath(rootDir);

  if (backfillEurope) {
    await ensureAirportCoordinateCache(cachePath);
    const existing = loadExistingManifest(rootDir);
    const destIatas = collectDestinationIatasFromManifest(existing);
    const result = upsertEuropeDestinationAirports(
      rootDir,
      destIatas,
      loadAirportCoordinateCache(cachePath),
      { dryRun: isDryRun },
    );
    console.log(
      `${isDryRun ? "[dry-run] " : ""}Backfilled ${result.count} Europe destination airport(s) from live connections (${destIatas.size} unique destinations)`,
    );
    return {
      ok: result.count,
      failed: 0,
      skipped: false,
      backfillEurope: true,
      europeDestinationCount: result.count,
      europeDestinationIatas: result.iatas,
    };
  }

  if (renderMapsOnly) {
    const existing = loadExistingManifest(rootDir);
    let entries = Object.values(existing.airports ?? {});
    if (filter) {
      const needle = filter.toUpperCase();
      entries = entries.filter(
        (airport) =>
          airport.iata === needle ||
          airport.stationName?.toLowerCase().includes(filter.toLowerCase()) ||
          airport.slug?.includes(filter.toLowerCase().replace(/\s+/g, "-")),
      );
    }
    if (!entries.length) {
      console.error("No airports matched in existing manifest.");
      return { ok: 0, failed: 0, skipped: true };
    }

    mkdirSync(mapsOutDir, { recursive: true });
    let ok = 0;
    let failed = 0;
    for (const entry of entries) {
      try {
        if (isDryRun) {
          console.log(`[dry-run] ${entry.stationName} (${entry.iata})`);
          ok += 1;
          continue;
        }
        const png = await renderAirportConnectionsMap(entry, { siteUrl, basemapMode });
        writeFileSync(join(mapsOutDir, `${entry.slug}-connections.png`), png.buffer);
        ok += 1;
        console.log(`Wrote ${entry.slug}-connections.png (${entry.iata}, ${png.basemapId})`);
      } catch (error) {
        failed += 1;
        const message = error instanceof Error ? error.message : String(error);
        console.error(`FAIL ${entry.iata}: ${message}`);
      }
    }
    return { ok, failed, skipped: false };
  }

  if (!hasAirportFlightProvider()) {
    console.warn(
      "AVIATIONSTACK_API_KEY / AIRLABS_API_KEY not set — skipping airport connections collection.",
    );
    return { ok: 0, failed: 0, skipped: true };
  }

  resetAirportFlightProvider();
  console.log(
    `Airport flight providers: ${availableAirportFlightProviders().join(" → ")}`,
  );

  const roll = ensureAirportConnectionPeriodRoll({
    rootDir,
    asOf: asOf ?? new Date(),
    dryRun: isDryRun,
  });
  const period = roll.period;

  let catalog = loadAirportCatalog(rootDir);
  if (filter) {
    const needle = filter.toUpperCase();
    catalog = catalog.filter(
      (airport) =>
        airport.iata === needle ||
        airport.stationName.toLowerCase().includes(filter.toLowerCase()) ||
        airport.slug.includes(filter.toLowerCase().replace(/\s+/g, "-")),
    );
  }

  if (!catalog.length) {
    console.error("No airports matched.");
    return { ok: 0, failed: 0, skipped: true };
  }

  const cache = await ensureAirportCoordinateCache(cachePath);
  let coordinates = mergeCatalogIntoCoordinates(catalog, cache);
  // After a period roll, start from an empty airport map so the new period does not
  // inherit the previous network. Single-airport updates on an active period still merge.
  const airports = { ...roll.airports };

  let ok = 0;
  let failed = 0;
  let quotaExhausted = false;
  let lastProvider = null;
  let mapVisibility = loadAirportMapVisibility(rootDir);
  let mapVisibilityDirty = false;

  const stopForQuota = (error) => {
    quotaExhausted = true;
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Flight API monthly limit reached: ${message}`);
    console.error("Stopping flights collection — no further departure API calls this run.");
  };

  for (const airport of catalog) {
    if (quotaExhausted) break;

    const label = `${airport.stationName} (${airport.iata})`;
    if (isDryRun) {
      console.log(`[dry-run] ${label}`);
      ok += 1;
      continue;
    }

    try {
      const { flights, provider } = await fetchDeparturesFromAirport(airport.iata, 100);
      lastProvider = provider;
      const groupedIatas = [
        ...new Set(
          flights
            .map((flight) => flight.arrival?.iata?.trim().toUpperCase())
            .filter((iata) => iata && iata !== airport.iata),
        ),
      ];
      const hitQuota = await resolveMissingCoordinates(
        groupedIatas.filter((iata) => !coordinates[iata]),
        coordinates,
        { delay, onQuotaExhausted: stopForQuota },
      );
      if (hitQuota) {
        break;
      }
      coordinates = mergeCatalogIntoCoordinates(catalog, loadAirportCoordinateCache(cachePath));

      const entry = buildAirportConnections(airport, flights, coordinates);
      if (!entry) {
        console.warn(`No mappable connections for ${label}`);
        const before = mapVisibility.airports[airport.iata]?.consecutiveEmptyPeriods ?? 0;
        mapVisibility = recordAirportConnectionsEmpty(mapVisibility, airport.iata, period.id);
        mapVisibilityDirty = true;
        const after = mapVisibility.airports[airport.iata];
        if (after?.hiddenFromMap && !(before >= (mapVisibility.hideAfterEmptyPeriods ?? 3))) {
          console.warn(
            `Hiding ${airport.iata} from map after ${after.consecutiveEmptyPeriods} empty periods`,
          );
        } else if (!after?.hiddenFromMap) {
          console.warn(
            `Empty streak ${airport.iata}: ${after?.consecutiveEmptyPeriods ?? 0}/${mapVisibility.hideAfterEmptyPeriods}`,
          );
        }
        failed += 1;
        continue;
      }

      mapVisibility = recordAirportConnectionsOk(mapVisibility, airport.iata, period.id);
      mapVisibilityDirty = true;

      mkdirSync(mapsOutDir, { recursive: true });
      const png = await renderAirportConnectionsMap(entry, { siteUrl, basemapMode });
      writeFileSync(join(mapsOutDir, `${entry.slug}-connections.png`), png.buffer);
      airports[entry.iata] = entry;
      ok += 1;
      console.log(
        `OK ${label}: ${entry.connections.length} destinations from ${entry.sampledFlights} sampled flights via ${provider} (${png.basemapId})`,
      );
    } catch (error) {
      failed += 1;
      const message = error instanceof Error ? error.message : String(error);
      console.error(`FAIL ${label}: ${message}`);
      if (isAirportFlightQuotaExhaustedError(error)) {
        stopForQuota(error);
        break;
      }
    }

    if (delay > 0) await sleep(delay);
  }

  if (!isDryRun && mapVisibilityDirty) {
    saveAirportMapVisibility(rootDir, mapVisibility);
    const hidden = Object.values(mapVisibility.airports).filter((a) => a.hiddenFromMap).length;
    console.log(
      `Wrote ${join(rootDir, "public/data/airport-map-visibility.json")} (${hidden} hub(s) hidden from map)`,
    );
  }

  let europeDestinations = { count: 0, iatas: [] };

  if (!isDryRun && (ok > 0 || roll.rolled)) {
    const manifest = {
      generatedAt: new Date().toISOString(),
      runCount: loadRunCount(rootDir),
      airportCount: Object.keys(airports).length,
      periodId: period.id,
      periodStart: period.start,
      periodEndExclusive: period.endExclusive,
      flightProvider: lastProvider,
      airports,
    };
    mkdirSync(dirname(outJsonPath), { recursive: true });
    writeFileSync(outJsonPath, `${JSON.stringify(manifest, null, 2)}\n`);
    console.log(`Wrote ${outJsonPath} (period ${period.id})`);

    // Upsert Europe destination stations from this run's (and prior live) destinations.
    // Hubs only are in loadAirportCatalog — destinations never get outbound collection.
    const destIatas = collectDestinationIatasFromManifest(manifest);
    europeDestinations = upsertEuropeDestinationAirports(
      rootDir,
      destIatas,
      loadAirportCoordinateCache(cachePath),
      { dryRun: isDryRun },
    );
    console.log(
      `Europe destination airports: ${europeDestinations.count} (from ${destIatas.size} unique destinations)`,
    );
  }

  return {
    ok,
    failed,
    skipped: false,
    monthlyLimitReached: quotaExhausted,
    quotaExhausted,
    lastProvider,
    periodId: period.id,
    rolled: roll.rolled,
    frozen: roll.frozen,
    europeDestinationCount: europeDestinations.count,
  };
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];

if (isMain) {
  collectAirportConnections().then(({ ok, failed, skipped, monthlyLimitReached, periodStatus: statusOnly }) => {
    if (statusOnly) process.exit(0);
    if (skipped) process.exit(0);
    const limitNote = monthlyLimitReached ? " (stopped: flight API monthly limit)" : "";
    console.log(`Done: ${ok} airport(s) updated, ${failed} failed${limitNote}`);
    process.exit(failed > 0 && ok === 0 ? 1 : 0);
  });
}
