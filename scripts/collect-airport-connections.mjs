#!/usr/bin/env node
/**
 * Fetch airport departures (AirLabs → AviationStack → AeroDataBox fallback),
 * bake connections JSON, and render static connection map PNGs.
 *
 * Periods: nine open dates per year (see snapshotPeriods.mjs). Within an open
 * period, each bake unions new destinations into the live list (never drops).
 * Connection map PNGs regenerate only when destination count changes (or the
 * PNG is missing); use --maps-only to force re-render.
 * Hubs that have never recorded flights are hidden on the map and only
 * re-sampled during the first 2 weeks after each period opens (unless
 * --airport is set). Previously active hubs still hide after 3 empty periods.
 * On each open-date boundary the previous live bake is frozen under
 * public/.../periods/{YYYY-MM-DD}/ and a new live period starts empty.
 * Until a hub gets a fresh sample, the live JSON keeps previous-period
 * destinations/maps under fallbackAirports for display.
 * Open-Meteo temperatures are logged only after a successful flight sample
 * (same as train stations: no temp log when the update is skipped or fails).
 *
 *   node --import tsx scripts/collect-airport-connections.mjs
 *   node --import tsx scripts/collect-airport-connections.mjs --airport LIS
 *   node --import tsx scripts/collect-airport-connections.mjs --dry-run
 *   node --import tsx scripts/collect-airport-connections.mjs --maps-only
 *   node --import tsx scripts/collect-airport-connections.mjs --period-status
 *   node --import tsx scripts/collect-airport-connections.mjs --as-of=2026-08-11
 *   node --import tsx scripts/collect-airport-connections.mjs --external-only
 *   node --import tsx scripts/collect-airport-connections.mjs --external-only --iberian-inbound --external-count=12
 *   node --import tsx scripts/collect-airport-connections.mjs --backfill-europe-destinations
 *
 * After a successful bake (or with --backfill-europe-destinations), European
 * destinations not in the PT/ES hub catalog are upserted into
 * src/data/europe/airports.ts as "Airport Destination" stations (map only;
 * no outbound collection).
 *
 * Each collect also draws one all-flights map outside the Iberian peninsula
 * (`public/maps/airports/external/{iata}-{place}.png`) unless `--external-count`
 * asks for more. Iberian-flights maps (`{iata}-{place}-iberia.png`) are added
 * one per `stats:departures` run (no flight API). Pass `--external-only
 * --iberian-inbound --external-count=N` (or `all`) to draw more at once.
 * Those airports do not appear in station lists until both maps exist, then
 * they get a compact station page.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
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
  buildAirportConnectionsPeriodFallback,
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
import {
  formatExternalAirportMapsLog,
  loadExternalAirportMapsStore,
  sampleExternalAirportConnectionMap,
} from "./lib/externalAirportConnectionMaps.mjs";
import { externalSpotlightLimit } from "../src/lib/externalAirportSpotlight.ts";

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
  mergeAirportConnectionsEntries,
  mergeCatalogIntoCoordinates,
} = await import("../server/lib/airportConnections.ts");
const {
  recordAirportConnectionsEmpty,
  recordAirportConnectionsOk,
  shouldSampleAirportHub,
  hideNeverRecordedAirports,
  airportHasRecordedFlights,
} = await import("../server/lib/airportMapVisibility.ts");
const {
  collectAndAppendStationTemperatures,
  readStationTemperatureLog,
  computeStationMonthlyTemperatureAverages,
  formatStationMonthlyTemperatureOkSuffix,
  lisbonYearMonth,
} = await import("../server/lib/stationTemperatureLog.ts");

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
const externalOnly = args.includes("--external-only");
const iberianInboundOnly = args.includes("--iberian-inbound");
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
    : args[args.indexOf("--basemap") + 1] ?? "osm"
  : "osm";

const siteUrl = (process.env.VITE_SITE_URL ?? "https://www.verystays.com").replace(/\/$/, "");

function parseExternalCount(argv) {
  const flag = argv.find((arg) => arg.startsWith("--external-count"));
  if (!flag) return 1;
  const raw = flag.includes("=")
    ? flag.slice("--external-count=".length)
    : argv[argv.indexOf("--external-count") + 1];
  if (!raw || raw === "all") return Number.POSITIVE_INFINITY;
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

const externalCount = parseExternalCount(args);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fillExternalAirportPageAssetsIfNeeded(rootDir, isDryRun) {
  if (isDryRun) return;
  const { fillExternalAirportPageAssets } = await import("./lib/expandStationAssets.mjs");
  const { missingImages } = await fillExternalAirportPageAssets(rootDir);
  if (missingImages.length) {
    console.log(`External airport page images still missing: ${missingImages.join(", ")}`);
  }
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

async function temperatureSuffixForAirport(airport, rootDir) {
  try {
    const weather = await collectAndAppendStationTemperatures({
      stations: [
        {
          name: airport.stationName,
          lat: airport.lat,
          lng: airport.lng,
          country: airport.countryCode,
        },
      ],
      logPath: join(rootDir, "data/station-temperature-log.ndjson"),
      delayMs: 0,
    });
    if (weather.ok <= 0) return { suffix: "", logged: 0, missed: weather.failed };
    const tempAvg = computeStationMonthlyTemperatureAverages({
      readings: readStationTemperatureLog(join(rootDir, "data/station-temperature-log.ndjson")),
      yearMonth: lisbonYearMonth(),
      stationNames: [airport.stationName],
    })[0];
    return {
      suffix: tempAvg ? ` - ${formatStationMonthlyTemperatureOkSuffix(tempAvg)}` : "",
      logged: weather.ok,
      missed: weather.failed,
    };
  } catch {
    return { suffix: "", logged: 0, missed: 1 };
  }
}

async function runExternalAirportSpotlight({
  rootDir,
  manifest,
  coordinates,
  isDryRun,
  quotaExhausted,
  forceAirport,
  periodId,
  siteUrl,
  basemapMode,
  count = 1,
}) {
  const skip = forceAirport;
  const skipReason = forceAirport ? "airport-filter" : null;
  const flightApisAvailable = !quotaExhausted && hasAirportFlightProvider();
  let store = loadExternalAirportMapsStore(rootDir);
  if (skip) {
    return store;
  }

  const limit = externalSpotlightLimit(count);
  for (let i = 0; i < limit; i += 1) {
    try {
      const result = await sampleExternalAirportConnectionMap({
        rootDir,
        manifest,
        coordinates,
        fetchDepartures: fetchDeparturesFromAirport,
        resolveMissingCoordinates: async (iatas) => {
          await resolveMissingCoordinates(iatas, coordinates, {});
        },
        buildAirportConnections,
        renderAirportConnectionsMap,
        siteUrl,
        basemapMode,
        periodId,
        dryRun: isDryRun,
        skip: false,
        skipReason: null,
        flightApisAvailable,
      });
      store = result.store;
      if (result.skipped) break;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`External destination map skipped: ${message}`);
      break;
    }
  }
  return store;
}

async function runExternalSpotlightFromExistingManifest({
  rootDir,
  isDryRun,
  asOf,
  siteUrl,
  basemapMode,
  quotaExhausted = true,
  count = 1,
}) {
  const coordsPath = join(rootDir, "data/airport-iata-coordinates.json");
  await ensureAirportCoordinateCache(coordsPath);
  const existing = loadExistingManifest(rootDir);
  const roll = ensureAirportConnectionPeriodRoll({
    rootDir,
    asOf: asOf ?? new Date(),
    dryRun: isDryRun,
  });
  return runExternalAirportSpotlight({
    rootDir,
    manifest: existing,
    coordinates: loadAirportCoordinateCache(coordsPath),
    isDryRun,
    quotaExhausted,
    forceAirport: false,
    periodId: existing.periodId ?? roll.period.id,
    siteUrl,
    basemapMode,
    count,
  });
}

export async function collectAirportConnections(options = {}) {
  const {
    rootDir = root,
    dryRun: isDryRun = dryRun,
    airportFilter: filter = airportFilter,
    delayMs: delay = delayMs,
    mapsOnly: renderMapsOnly = mapsOnly,
    externalOnly: sampleExternalOnly = externalOnly,
    iberianInbound: useIberianInbound = iberianInboundOnly,
    externalMapCount = externalCount,
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

  if (sampleExternalOnly) {
    const quotaExhausted = useIberianInbound || !hasAirportFlightProvider();
    if (!isDryRun && quotaExhausted) {
      console.warn(
        useIberianInbound
          ? `Drawing ${Number.isFinite(externalMapCount) ? externalMapCount : "all unmapped"} external destination map(s) from Iberian connections we already have.`
          : "No airport flight provider available — drawing external destination map(s) from Iberian connections we already have.",
      );
    } else if (!quotaExhausted) {
      resetAirportFlightProvider();
    }
    const store = await runExternalSpotlightFromExistingManifest({
      rootDir,
      isDryRun,
      asOf,
      siteUrl,
      basemapMode,
      quotaExhausted,
      count: externalMapCount,
    });
    await fillExternalAirportPageAssetsIfNeeded(rootDir, isDryRun);
    return {
      ok: store.airports?.length ? 1 : 0,
      failed: 0,
      skipped: false,
      externalOnly: true,
      externalAirportMaps: store,
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
      "No airport flight provider available — skipping hub sampling, drawing one Iberian-flights map from connections we already have.",
    );
    if (filter) {
      return { ok: 0, failed: 0, skipped: true };
    }
    const store = await runExternalSpotlightFromExistingManifest({
      rootDir,
      isDryRun,
      asOf,
      siteUrl,
      basemapMode,
      quotaExhausted: true,
      count: externalMapCount,
    });
    await fillExternalAirportPageAssetsIfNeeded(rootDir, isDryRun);
    return {
      ok: 0,
      failed: 0,
      skipped: false,
      quotaExhausted: true,
      lastProvider: null,
      europeDestinationCount: 0,
      externalAirportMaps: store,
    };
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
  // inherit the previous network. Within an open period, re-samples union destinations.
  const airports = { ...roll.airports };

  let ok = 0;
  let failed = 0;
  let skippedNeverSeen = 0;
  let quotaExhausted = false;
  let lastProvider = null;
  let temperaturesLogged = 0;
  let temperaturesMissed = 0;
  let mapVisibilityLoaded = loadAirportMapVisibility(rootDir);
  let mapVisibility = hideNeverRecordedAirports(mapVisibilityLoaded);
  let mapVisibilityDirty = mapVisibility !== mapVisibilityLoaded;
  const todayYmd = lisbonDateString(asOf ?? new Date());
  const forceAirport = Boolean(filter);

  const stopForQuota = (error) => {
    quotaExhausted = true;
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Flight API monthly limit reached: ${message}`);
    console.error("Stopping flights collection — no further departure API calls this run.");
  };

  for (const airport of catalog) {
    if (quotaExhausted) break;

    const label = `${airport.stationName} (${airport.iata})`;
    const visibilityEntry = mapVisibility.airports[airport.iata];
    const previous = airports[airport.iata];
    const sampleThisHub = shouldSampleAirportHub({
      visibilityEntry,
      hasLiveConnections: Boolean(previous?.connections?.length),
      force: forceAirport,
      periodStart: period.start,
      todayYmd,
    });

    if (!sampleThisHub) {
      skippedNeverSeen += 1;
      console.log(
        `Skip ${label}: never recorded flights — outside 2-week recheck window after ${period.start}`,
      );
      continue;
    }

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

      const sample = buildAirportConnections(airport, flights, coordinates);
      if (!sample) {
        if (previous?.connections?.length) {
          const temp = await temperatureSuffixForAirport(airport, rootDir);
          temperaturesLogged += temp.logged;
          temperaturesMissed += temp.missed;
          console.warn(
            `No mappable connections in this sample for ${label}; keeping ${previous.connections.length} destination(s) from this period${temp.suffix}`,
          );
          ok += 1;
          continue;
        }
        console.warn(`No mappable connections for ${label}`);
        const neverRecorded = !airportHasRecordedFlights(visibilityEntry);
        const beforeHidden = Boolean(visibilityEntry?.hiddenFromMap);
        mapVisibility = recordAirportConnectionsEmpty(mapVisibility, airport.iata, period.id);
        mapVisibilityDirty = true;
        const after = mapVisibility.airports[airport.iata];
        if (after?.hiddenFromMap && !beforeHidden) {
          console.warn(
            neverRecorded
              ? `Hiding ${airport.iata} from map (no flights ever recorded)`
              : `Hiding ${airport.iata} from map after ${after.consecutiveEmptyPeriods} empty periods`,
          );
        } else if (!after?.hiddenFromMap) {
          console.warn(
            `Empty streak ${airport.iata}: ${after?.consecutiveEmptyPeriods ?? 0}/${mapVisibility.hideAfterEmptyPeriods}`,
          );
        }
        failed += 1;
        continue;
      }

      const entry = mergeAirportConnectionsEntries(previous, sample);
      const added = previous
        ? entry.connections.length - previous.connections.length
        : entry.connections.length;
      const mapPath = join(mapsOutDir, `${entry.slug}-connections.png`);
      // Same destination count → geometry unchanged (period merges only add, never drop).
      // Skip expensive tile stitch/render unless the PNG is missing.
      const shouldRenderMap =
        !previous ||
        entry.connections.length !== previous.connections.length ||
        !existsSync(mapPath);

      mapVisibility = recordAirportConnectionsOk(mapVisibility, airport.iata, period.id);
      mapVisibilityDirty = true;

      let basemapNote = "map unchanged";
      if (shouldRenderMap) {
        mkdirSync(mapsOutDir, { recursive: true });
        const png = await renderAirportConnectionsMap(entry, { siteUrl, basemapMode });
        writeFileSync(mapPath, png.buffer);
        basemapNote = png.basemapId;
      }
      airports[entry.iata] = entry;
      ok += 1;
      const temp = await temperatureSuffixForAirport(airport, rootDir);
      temperaturesLogged += temp.logged;
      temperaturesMissed += temp.missed;
      console.log(
        `OK ${label}: ${entry.connections.length} destinations` +
          (previous ? ` (+${Math.max(0, added)} new this sample)` : "") +
          ` from ${entry.sampledFlights} sampled flights via ${provider} (${basemapNote})${temp.suffix}`,
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
  let externalAirportMaps = loadExternalAirportMapsStore(rootDir);

  // Always refresh live JSON after a collect so previous-period display fallback
  // stays available until hubs are re-sampled (even when this run got 0 OK).
  if (!isDryRun) {
    const { fallbackPeriodId, fallbackAirports } = buildAirportConnectionsPeriodFallback(
      rootDir,
      airports,
      period.id,
      roll.index,
    );
    const manifest = {
      generatedAt: new Date().toISOString(),
      runCount: loadRunCount(rootDir),
      airportCount: Object.keys(airports).length,
      periodId: period.id,
      periodStart: period.start,
      periodEndExclusive: period.endExclusive,
      flightProvider: lastProvider,
      airports,
      fallbackPeriodId,
      fallbackAirports,
    };
    mkdirSync(dirname(outJsonPath), { recursive: true });
    writeFileSync(outJsonPath, `${JSON.stringify(manifest, null, 2)}\n`);
    console.log(`Wrote ${outJsonPath} (period ${period.id})`);
    if (fallbackPeriodId) {
      console.log(
        `Display fallback: ${Object.keys(fallbackAirports).length} hub(s) from period ${fallbackPeriodId} until re-sampled`,
      );
    }

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

    if (!quotaExhausted) {
      externalAirportMaps = await runExternalAirportSpotlight({
        rootDir,
        manifest,
        coordinates: loadAirportCoordinateCache(cachePath),
        isDryRun,
        quotaExhausted: false,
        forceAirport,
        periodId: period.id,
        siteUrl,
        basemapMode,
        count: externalMapCount,
      });
    }
  } else if (isDryRun && !forceAirport) {
    const existing = loadExistingManifest(rootDir);
    await runExternalAirportSpotlight({
      rootDir,
      manifest: existing,
      coordinates: loadAirportCoordinateCache(cachePath),
      isDryRun: true,
      quotaExhausted: useIberianInbound,
      forceAirport: false,
      periodId: period.id,
      siteUrl,
      basemapMode,
      count: externalMapCount,
    });
  }

  if (!isDryRun && (temperaturesLogged > 0 || temperaturesMissed > 0)) {
    console.log(
      `Airport temperatures: ${temperaturesLogged} logged, ${temperaturesMissed} missed`,
    );
  }

  await fillExternalAirportPageAssetsIfNeeded(rootDir, isDryRun);

  return {
    ok,
    failed,
    skipped: false,
    skippedNeverSeen,
    monthlyLimitReached: quotaExhausted,
    quotaExhausted,
    lastProvider,
    periodId: period.id,
    rolled: roll.rolled,
    frozen: roll.frozen,
    europeDestinationCount: europeDestinations.count,
    externalAirportMaps,
  };
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];

if (isMain) {
  collectAirportConnections().then(
    ({
      ok,
      failed,
      skipped,
      skippedNeverSeen,
      monthlyLimitReached,
      periodStatus: statusOnly,
      externalAirportMaps,
    }) => {
    if (statusOnly) process.exit(0);
    if (skipped) process.exit(0);
    const limitNote = monthlyLimitReached ? " (stopped: flight API monthly limit)" : "";
    const skipNote = skippedNeverSeen
      ? `, ${skippedNeverSeen} never-seen hub(s) skipped (outside 2-week window)`
      : "";
    console.log(`Done: ${ok} airport(s) updated, ${failed} failed${skipNote}${limitNote}`);
    console.log(formatExternalAirportMapsLog(externalAirportMaps ?? loadExternalAirportMapsStore(root)));
    process.exit(failed > 0 && ok === 0 ? 1 : 0);
  });
}
