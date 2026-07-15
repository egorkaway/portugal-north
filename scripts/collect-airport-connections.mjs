#!/usr/bin/env node
/**
 * Fetch AviationStack departures for catalog airports, bake connections JSON,
 * and render static connection map PNGs.
 *
 *   node --import tsx scripts/collect-airport-connections.mjs
 *   node --import tsx scripts/collect-airport-connections.mjs --airport LIS
 *   node --import tsx scripts/collect-airport-connections.mjs --dry-run
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

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
loadEnvFile(join(root, ".env"));

const { fetchDeparturesFromAirport, fetchAirportByIata } = await import(
  "../server/lib/aviationStackClient.ts"
);
const {
  buildAirportConnections,
  mergeCatalogIntoCoordinates,
} = await import("../server/lib/airportConnections.ts");

const outJsonPath = join(root, "public/data/airport-connections.json");
const cachePath = join(root, "data/airport-iata-coordinates.json");
const mapsOutDir = join(root, "public/maps/airports");

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

const siteUrl = (process.env.VITE_SITE_URL ?? "https://www.verystays.com").replace(/\/$/, "");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function loadRunCount() {
  try {
    const stats = JSON.parse(readFileSync(join(root, "data/departure-stats.json"), "utf8"));
    return typeof stats.runCount === "number" ? stats.runCount : 0;
  } catch {
    return 0;
  }
}

function loadExistingManifest() {
  try {
    return JSON.parse(readFileSync(outJsonPath, "utf8"));
  } catch {
    return { airports: {} };
  }
}

async function resolveMissingCoordinates(groupedIatas, coordinates) {
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
      const message = error instanceof Error ? error.message : String(error);
      console.warn(`Skip ${iata} coords: ${message}`);
    }
    if (delayMs > 0) await sleep(Math.max(200, delayMs / 2));
  }
  if (updated) saveAirportCoordinateCache(cachePath, coordinates);
}

export async function collectAirportConnections(options = {}) {
  const {
    rootDir = root,
    dryRun: isDryRun = dryRun,
    airportFilter: filter = airportFilter,
    delayMs: delay = delayMs,
  } = options;

  if (!process.env.AVIATIONSTACK_API_KEY?.trim()) {
    console.warn("AVIATIONSTACK_API_KEY not set — skipping airport connections collection.");
    return { ok: 0, failed: 0, skipped: true };
  }

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
  const existing = loadExistingManifest();
  const airports = { ...(existing.airports ?? {}) };

  let ok = 0;
  let failed = 0;

  for (const airport of catalog) {
    const label = `${airport.stationName} (${airport.iata})`;
    if (isDryRun) {
      console.log(`[dry-run] ${label}`);
      ok += 1;
      continue;
    }

    try {
      const flights = await fetchDeparturesFromAirport(airport.iata, 100);
      const groupedIatas = [
        ...new Set(
          flights
            .map((flight) => flight.arrival?.iata?.trim().toUpperCase())
            .filter((iata) => iata && iata !== airport.iata),
        ),
      ];
      await resolveMissingCoordinates(
        groupedIatas.filter((iata) => !coordinates[iata]),
        coordinates,
      );
      coordinates = mergeCatalogIntoCoordinates(catalog, loadAirportCoordinateCache(cachePath));

      const entry = buildAirportConnections(airport, flights, coordinates);
      if (!entry) {
        console.warn(`No mappable connections for ${label}`);
        failed += 1;
        continue;
      }

      mkdirSync(mapsOutDir, { recursive: true });
      const png = await renderAirportConnectionsMap(entry, { siteUrl });
      writeFileSync(join(mapsOutDir, `${entry.slug}-connections.png`), png.buffer);
      airports[entry.iata] = entry;
      ok += 1;
      console.log(
        `OK ${label}: ${entry.connections.length} destinations from ${entry.sampledFlights} sampled flights (${png.basemapId})`,
      );
    } catch (error) {
      failed += 1;
      const message = error instanceof Error ? error.message : String(error);
      console.error(`FAIL ${label}: ${message}`);
    }

    if (delay > 0) await sleep(delay);
  }

  if (!isDryRun && ok > 0) {
    const manifest = {
      generatedAt: new Date().toISOString(),
      runCount: loadRunCount(),
      airportCount: Object.keys(airports).length,
      airports,
    };
    mkdirSync(dirname(outJsonPath), { recursive: true });
    writeFileSync(outJsonPath, `${JSON.stringify(manifest, null, 2)}\n`);
    console.log(`Wrote ${outJsonPath}`);
  }

  return { ok, failed, skipped: false };
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];

if (isMain) {
  collectAirportConnections().then(({ ok, failed, skipped }) => {
    if (skipped) process.exit(0);
    console.log(`Done: ${ok} airport(s) updated, ${failed} failed`);
    process.exit(failed > 0 && ok === 0 ? 1 : 0);
  });
}
