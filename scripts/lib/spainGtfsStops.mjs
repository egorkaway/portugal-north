import { mkdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { randomBytes } from "node:crypto";

const USER_AGENT = "VeryStays/1.0 (https://www.verystays.com)";
const CACHE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export const RENFE_GTFS_AV_LD_ZIP =
  "https://ssl.renfe.com/gtransit/Fichero_AV_LD/google_transit.zip";
export const RENFE_GTFS_CERCANIAS_ZIP =
  "https://ssl.renfe.com/ftransit/Fichero_CER_FOMENTO/fomento_transit.zip";

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

export function parseGtfsStopsTxt(text, kind) {
  const lines = text.split(/\r?\n/).filter((line) => line.trim());
  if (lines.length < 2) return [];
  const header = parseCsvLine(lines[0]).map((col) => col.trim());
  const idIdx = header.indexOf("stop_id");
  const nameIdx = header.indexOf("stop_name");
  const latIdx = header.indexOf("stop_lat");
  const lngIdx = header.indexOf("stop_lon");
  const typeIdx = header.indexOf("location_type");
  if (idIdx < 0 || nameIdx < 0 || latIdx < 0 || lngIdx < 0) return [];

  const stops = [];
  for (const line of lines.slice(1)) {
    const cols = parseCsvLine(line);
    const locationType = typeIdx >= 0 ? cols[typeIdx]?.trim() : "";
    if (locationType && locationType !== "0") continue;
    const lat = Number.parseFloat(cols[latIdx] ?? "");
    const lng = Number.parseFloat(cols[lngIdx] ?? "");
    const id = cols[idIdx]?.trim();
    const name = cols[nameIdx]?.trim();
    if (!id || !name || !Number.isFinite(lat) || !Number.isFinite(lng)) continue;
    stops.push({ id, name, lat, lng, kind });
  }
  return stops;
}

async function downloadZipStops(url, kind) {
  const res = await fetch(url, {
    headers: { "User-Agent": USER_AGENT, Accept: "application/zip" },
    signal: AbortSignal.timeout(90_000),
  });
  if (!res.ok) throw new Error(`gtfs_http_${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const zipPath = join(tmpdir(), `renfe-gtfs-${kind}-${randomBytes(6).toString("hex")}.zip`);
  writeFileSync(zipPath, buf);
  try {
    const text = execFileSync("unzip", ["-p", zipPath, "stops.txt"], {
      encoding: "utf8",
      maxBuffer: 4 * 1024 * 1024,
    });
    return parseGtfsStopsTxt(text, kind);
  } finally {
    try {
      unlinkSync(zipPath);
    } catch {
      // ignore
    }
  }
}

export function spainGtfsCachePath(root) {
  return join(root, "data/spain-gtfs-stops.json");
}

export function loadCachedSpainGtfsStops(root, maxAgeMs = CACHE_MAX_AGE_MS) {
  try {
    const raw = JSON.parse(readFileSync(spainGtfsCachePath(root), "utf8"));
    const fetchedAt = Date.parse(raw.fetchedAt);
    if (!Number.isFinite(fetchedAt) || Date.now() - fetchedAt > maxAgeMs) return null;
    if (!Array.isArray(raw.stops)) return null;
    return raw.stops;
  } catch {
    return null;
  }
}

export async function loadSpainGtfsStops(root, { forceRefresh = false } = {}) {
  if (!forceRefresh) {
    const cached = loadCachedSpainGtfsStops(root);
    if (cached) return cached;
  }

  const [longDistance, cercanias] = await Promise.all([
    downloadZipStops(RENFE_GTFS_AV_LD_ZIP, "longDistance"),
    downloadZipStops(RENFE_GTFS_CERCANIAS_ZIP, "cercanias"),
  ]);
  const stops = [...longDistance, ...cercanias];
  const path = spainGtfsCachePath(root);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(
    path,
    `${JSON.stringify({ fetchedAt: new Date().toISOString(), stopCount: stops.length, stops }, null, 2)}\n`,
  );
  return stops;
}
