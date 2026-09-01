import { mkdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { randomBytes } from "node:crypto";
import { parseGtfsStopsTxt } from "./spainGtfsStops.mjs";

const USER_AGENT = "VeryStays/1.0 (https://www.verystays.com)";
const CACHE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export const CP_GTFS_ZIP = "https://publico.cp.pt/gtfs/gtfs.zip";

function parseCsvLine(line) {
  const out = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (char === "," && !inQuotes) {
      out.push(current);
      current = "";
      continue;
    }
    current += char;
  }
  out.push(current);
  return out;
}

function parseHeaderedCsv(text) {
  const lines = text.split(/\r?\n/).filter((line) => line.trim());
  if (lines.length < 2) return { header: [], rows: [] };
  const header = parseCsvLine(lines[0]).map((col) => col.trim());
  const rows = lines.slice(1).map((line) => parseCsvLine(line));
  return { header, rows };
}

function col(header, name) {
  return header.indexOf(name);
}

export function portugalGtfsCachePath(root) {
  return join(root, "data/portugal-gtfs-stops.json");
}

export function enrichPortugalGtfsStops(stopsTxt, stopTimesTxt, tripsTxt, routesTxt) {
  const stops = parseGtfsStopsTxt(stopsTxt, "cp").map((stop) => ({
    ...stop,
    code: String(stop.id).replaceAll("_", "-"),
    scheduledStops: 0,
    routeShortNames: [],
  }));
  const byId = new Map(stops.map((stop) => [stop.id, stop]));

  const routes = parseHeaderedCsv(routesTxt);
  const routeIdIdx = col(routes.header, "route_id");
  const routeShortIdx = col(routes.header, "route_short_name");
  const routeShortById = new Map();
  for (const row of routes.rows) {
    const id = row[routeIdIdx]?.trim();
    const shortName = row[routeShortIdx]?.trim();
    if (id && shortName) routeShortById.set(id, shortName);
  }

  const trips = parseHeaderedCsv(tripsTxt);
  const tripIdIdx = col(trips.header, "trip_id");
  const tripRouteIdx = col(trips.header, "route_id");
  const routeByTrip = new Map();
  for (const row of trips.rows) {
    const tripId = row[tripIdIdx]?.trim();
    const routeId = row[tripRouteIdx]?.trim();
    if (tripId && routeId) routeByTrip.set(tripId, routeId);
  }

  const stopTimes = parseHeaderedCsv(stopTimesTxt);
  const stTripIdx = col(stopTimes.header, "trip_id");
  const stStopIdx = col(stopTimes.header, "stop_id");
  for (const row of stopTimes.rows) {
    const stop = byId.get(row[stStopIdx]?.trim());
    if (!stop) continue;
    stop.scheduledStops += 1;
    const routeId = routeByTrip.get(row[stTripIdx]?.trim());
    const shortName = routeId ? routeShortById.get(routeId) : undefined;
    if (shortName && !stop.routeShortNames.includes(shortName)) {
      stop.routeShortNames.push(shortName);
    }
  }

  return stops;
}

export function loadCachedPortugalGtfsStops(root, maxAgeMs = CACHE_MAX_AGE_MS) {
  try {
    const raw = JSON.parse(readFileSync(portugalGtfsCachePath(root), "utf8"));
    const fetchedAt = Date.parse(raw.fetchedAt);
    if (!Number.isFinite(fetchedAt) || Date.now() - fetchedAt > maxAgeMs) return null;
    if (!Array.isArray(raw.stops)) return null;
    return raw.stops;
  } catch {
    return null;
  }
}

async function downloadCpGtfsZip() {
  const res = await fetch(CP_GTFS_ZIP, {
    headers: { "User-Agent": USER_AGENT, Accept: "application/zip" },
    signal: AbortSignal.timeout(90_000),
  });
  if (!res.ok) throw new Error(`gtfs_http_${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

function unzipText(zipPath, fileName) {
  return execFileSync("unzip", ["-p", zipPath, fileName], {
    encoding: "utf8",
    maxBuffer: 8 * 1024 * 1024,
  });
}

export async function loadPortugalGtfsStops(root, { forceRefresh = false } = {}) {
  if (!forceRefresh) {
    const cached = loadCachedPortugalGtfsStops(root);
    if (cached) return cached;
  }

  const buf = await downloadCpGtfsZip();
  const zipPath = join(tmpdir(), `cp-gtfs-${randomBytes(6).toString("hex")}.zip`);
  writeFileSync(zipPath, buf);
  try {
    const stopsTxt = unzipText(zipPath, "stops.txt");
    const stopTimesTxt = unzipText(zipPath, "stop_times.txt");
    const tripsTxt = unzipText(zipPath, "trips.txt");
    const routesTxt = unzipText(zipPath, "routes.txt");
    const stops = enrichPortugalGtfsStops(stopsTxt, stopTimesTxt, tripsTxt, routesTxt);
    const path = portugalGtfsCachePath(root);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(
      path,
      `${JSON.stringify(
        { fetchedAt: new Date().toISOString(), stopCount: stops.length, stops },
        null,
        2,
      )}\n`,
    );
    return stops;
  } finally {
    try {
      unlinkSync(zipPath);
    } catch {
      // ignore
    }
  }
}
