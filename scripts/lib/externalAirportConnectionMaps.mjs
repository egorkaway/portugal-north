/**
 * One non-Iberian airport per connections collect: sample its outbound
 * destinations and render a connection map. No station pages.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { stationToSlug } from "./socialCard.mjs";
import {
  externalAirportDisplayName,
  pickExternalAirportForRun,
  rankExternalAirportsFromManifest,
} from "../../src/lib/externalAirportSpotlight.ts";
import { loadAirportCatalog } from "./airportCatalog.mjs";
import { getFlightLineColor, getFlightLineWeight } from "../../server/lib/airportIata.ts";
import { formatCountryName } from "../../server/lib/countryName.ts";

export const EXTERNAL_MAPS_REL = "public/maps/airports/external";
export const EXTERNAL_STORE_REL = "data/external-airport-connection-maps.json";

export function externalMapsDir(rootDir) {
  return join(rootDir, EXTERNAL_MAPS_REL);
}

export function externalStorePath(rootDir) {
  return join(rootDir, EXTERNAL_STORE_REL);
}

export function loadExternalAirportMapsStore(rootDir) {
  try {
    const raw = JSON.parse(readFileSync(externalStorePath(rootDir), "utf8"));
    const airports = Array.isArray(raw?.airports) ? raw.airports : [];
    return {
      updatedAt: typeof raw?.updatedAt === "string" ? raw.updatedAt : null,
      airports,
    };
  } catch {
    return { updatedAt: null, airports: [] };
  }
}

export function saveExternalAirportMapsStore(rootDir, store) {
  const outPath = externalStorePath(rootDir);
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, `${JSON.stringify(store, null, 2)}\n`);
  return outPath;
}

export function formatExternalAirportMapsLog(store) {
  const rows = store?.airports ?? [];
  if (!rows.length) {
    return "External destination maps (outside Iberian peninsula): none yet";
  }
  const lines = ["External destination maps (outside Iberian peninsula):"];
  for (const row of rows) {
    const name = row.stationName || row.iata;
    const flights = row.iberianFlightCount ?? 0;
    const dests = row.destinationCount ?? 0;
    lines.push(
      `  ${row.iata}  ${name} — ${flights} Iberian flights, ${dests} destinations`,
    );
  }
  return lines.join("\n");
}

function hubIataSet(rootDir) {
  return new Set(
    loadAirportCatalog(rootDir)
      .map((airport) => airport.iata?.toUpperCase())
      .filter(Boolean),
  );
}

export function chooseExternalAirportForRun(rootDir, manifest, coordinates, store) {
  const ranked = rankExternalAirportsFromManifest(
    manifest,
    hubIataSet(rootDir),
    coordinates,
  );
  const sampled = new Set(
    (store?.airports ?? []).map((row) => String(row.iata ?? "").toUpperCase()).filter(Boolean),
  );
  const pick = pickExternalAirportForRun(ranked, sampled);
  if (!pick) return { ranked, pick: null, coords: null, stationName: null, slug: null };
  const coords = coordinates[pick.iata];
  const stationName = externalAirportDisplayName(pick.iata, coords);
  return {
    ranked,
    pick,
    coords,
    stationName,
    slug: stationToSlug(stationName),
  };
}

function hubNetwork(manifest) {
  const byIata = new Map();
  for (const entry of Object.values(manifest?.fallbackAirports ?? {})) {
    const iata = entry.iata?.trim().toUpperCase();
    if (iata) byIata.set(iata, entry);
  }
  for (const entry of Object.values(manifest?.airports ?? {})) {
    const iata = entry.iata?.trim().toUpperCase();
    if (iata) byIata.set(iata, entry);
  }
  return [...byIata.values()];
}

function buildIberianInboundEntry({
  pick,
  coords,
  stationName,
  slug,
  manifest,
  coordinates,
}) {
  const dest = pick.iata;
  const connections = [];
  for (const hub of hubNetwork(manifest)) {
    const originIata = hub.iata?.trim().toUpperCase();
    if (!originIata || originIata === dest) continue;
    const inbound = (hub.connections ?? []).find(
      (connection) => connection.iata?.trim().toUpperCase() === dest,
    );
    if (!inbound) continue;
    const origin = hub.origin;
    if (!origin || !Number.isFinite(origin.lat) || !Number.isFinite(origin.lng)) continue;
    const hubCoords = coordinates[originIata];
    const flightCount = inbound.flightCount || 0;
    connections.push({
      iata: originIata,
      name: hub.stationName || hubCoords?.name || originIata,
      country: formatCountryName(hubCoords?.country || ""),
      lat: origin.lat,
      lng: origin.lng,
      flightCount,
      flights: inbound.flights ?? [],
      lineColor: getFlightLineColor(flightCount),
      lineWeight: getFlightLineWeight(flightCount),
    });
  }
  connections.sort(
    (a, b) => b.flightCount - a.flightCount || a.name.localeCompare(b.name),
  );
  if (!connections.length) return null;
  return {
    stationName,
    slug,
    iata: dest,
    origin: { lat: coords.lat, lng: coords.lng },
    sampledFlights: pick.iberianFlightCount,
    connections,
    topDestinations: connections.slice(0, 10),
    mapImage: `/${EXTERNAL_MAPS_REL}/${slug}-connections.png`.replace(/^\/public\//, "/"),
  };
}

function upsertAirportRow(store, row) {
  const airports = [...(store.airports ?? [])];
  const index = airports.findIndex((entry) => entry.iata === row.iata);
  if (index >= 0) airports[index] = row;
  else airports.push(row);
  return {
    updatedAt: row.sampledAt,
    airports,
  };
}

/**
 * Sample outbound flights from the busiest non-peninsula destination and
 * write a connections PNG. Does not create station pages or hub catalog entries.
 */
export async function sampleExternalAirportConnectionMap(options) {
  const {
    rootDir,
    manifest,
    coordinates,
    fetchDepartures,
    resolveMissingCoordinates,
    buildAirportConnections,
    renderAirportConnectionsMap,
    siteUrl,
    basemapMode = "osm",
    periodId = null,
    dryRun = false,
    skip = false,
    skipReason = null,
  } = options;

  const store = loadExternalAirportMapsStore(rootDir);
  if (skip) {
    return { store, skipped: true, skipReason, pick: null };
  }

  const chosen = chooseExternalAirportForRun(rootDir, manifest, coordinates, store);
  if (!chosen.pick || !chosen.coords) {
    return { store, skipped: true, skipReason: "no-external-destination", pick: null };
  }

  const { pick, coords, stationName, slug } = chosen;
  const label = `${stationName} (${pick.iata})`;

  if (dryRun) {
    console.log(
      `[dry-run] External spotlight: ${label} — ${pick.iberianFlightCount} Iberian flights`,
    );
    return { store, skipped: true, skipReason: "dry-run", pick };
  }

  const synthetic = {
    stationName,
    slug,
    iata: pick.iata,
    name: coords.name || pick.iata,
    lat: coords.lat,
    lng: coords.lng,
    countryCode: "pt",
  };

  let provider = null;
  let entry = null;
  try {
    const sample = await fetchDepartures(pick.iata, 100);
    provider = sample.provider;
    const destIatas = [
      ...new Set(
        sample.flights
          .map((flight) => flight.arrival?.iata?.trim().toUpperCase())
          .filter((iata) => iata && iata !== pick.iata),
      ),
    ];
    await resolveMissingCoordinates(destIatas.filter((iata) => !coordinates[iata]));
    entry = buildAirportConnections(synthetic, sample.flights, coordinates);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(
      `External spotlight ${label}: outbound sample failed (${message}); mapping Iberian hubs that fly here`,
    );
  }

  if (!entry) {
    entry = buildIberianInboundEntry({
      pick,
      coords,
      stationName,
      slug,
      manifest,
      coordinates,
    });
    provider = provider || "iberian-inbound";
  }

  if (!entry) {
    console.warn(`External spotlight ${label}: no mappable destinations`);
    return { store, skipped: true, skipReason: "no-connections", pick };
  }

  entry.mapImage = `/${EXTERNAL_MAPS_REL}/${slug}-connections.png`.replace(
    /^\/public\//,
    "/",
  );
  const png = await renderAirportConnectionsMap(entry, {
    siteUrl,
    basemapMode,
    showStationPageUrl: false,
  });
  const mapsDir = externalMapsDir(rootDir);
  mkdirSync(mapsDir, { recursive: true });
  writeFileSync(join(mapsDir, `${slug}-connections.png`), png.buffer);

  const sampledAt = new Date().toISOString();
  const nextStore = upsertAirportRow(store, {
    iata: pick.iata,
    stationName,
    slug,
    country: coords.country ?? "",
    iberianFlightCount: pick.iberianFlightCount,
    destinationCount: entry.connections.length,
    sampledFlights: entry.sampledFlights,
    mapImage: entry.mapImage,
    sampledAt,
    periodId,
    provider,
    basemapId: png.basemapId,
  });
  saveExternalAirportMapsStore(rootDir, nextStore);
  console.log(
    `External spotlight ${label}: ${entry.connections.length} destinations` +
      ` (${pick.iberianFlightCount} Iberian flights in) via ${provider} (${png.basemapId})`,
  );
  return { store: nextStore, skipped: false, skipReason: null, pick, entry };
}
