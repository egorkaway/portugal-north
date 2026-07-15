import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const OUR_AIRPORTS_CSV =
  "https://davidmegginson.github.io/ourairports-data/airports.csv";

function parseCsvLine(line) {
  const values = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (char === "," && !inQuotes) {
      values.push(current);
      current = "";
      continue;
    }
    current += char;
  }
  values.push(current);
  return values;
}

export async function ensureAirportCoordinateCache(cachePath) {
  try {
    const existing = JSON.parse(readFileSync(cachePath, "utf8"));
    if (existing && typeof existing === "object" && Object.keys(existing).length > 500) {
      return existing;
    }
  } catch {
    // seed below
  }

  const res = await fetch(OUR_AIRPORTS_CSV, {
    headers: { "User-Agent": "VeryStays-AirportConnections/1.0 (+https://www.verystays.com)" },
    signal: AbortSignal.timeout(120_000),
  });
  if (!res.ok) {
    throw new Error(`ourairports_csv_http_${res.status}`);
  }

  const text = await res.text();
  const lines = text.split("\n");
  const header = parseCsvLine(lines[0] ?? "");
  const iataIndex = header.indexOf("iata_code");
  const nameIndex = header.indexOf("name");
  const countryIndex = header.indexOf("iso_country");
  const latIndex = header.indexOf("latitude_deg");
  const lngIndex = header.indexOf("longitude_deg");

  const cache = {};
  for (const line of lines.slice(1)) {
    if (!line.trim()) continue;
    const cols = parseCsvLine(line);
    const iata = cols[iataIndex]?.trim().toUpperCase();
    const lat = Number.parseFloat(cols[latIndex] ?? "");
    const lng = Number.parseFloat(cols[lngIndex] ?? "");
    if (!iata || iata.length !== 3) continue;
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;
    if (lat === 0 && lng === 0) continue;
    cache[iata] = {
      name: cols[nameIndex]?.trim() || iata,
      country: cols[countryIndex]?.trim() || "",
      lat,
      lng,
    };
  }

  mkdirSync(dirname(cachePath), { recursive: true });
  writeFileSync(cachePath, `${JSON.stringify(cache, null, 2)}\n`);
  return cache;
}

export function loadAirportCoordinateCache(cachePath) {
  return JSON.parse(readFileSync(cachePath, "utf8"));
}

export function saveAirportCoordinateCache(cachePath, cache) {
  mkdirSync(dirname(cachePath), { recursive: true });
  writeFileSync(cachePath, `${JSON.stringify(cache, null, 2)}\n`);
}
