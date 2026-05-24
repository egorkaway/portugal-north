import { readFileSync, writeFileSync } from "node:fs";

export function loadEnvFile(envPath) {
  try {
    const text = readFileSync(envPath, "utf8");
    for (const line of text.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim();
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    // optional
  }
}

export function hashString(value) {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function parseStations(ts) {
  return [...ts.matchAll(/\{\s*name:\s*"([^"]+)"[^}]*lines:\s*\[([^\]]*)\][^}]*lat:\s*([\d.-]+)[^}]*lng:\s*([\d.-]+)/gs)].map(
    (match) => ({
      name: match[1],
      lines: [...match[2].matchAll(/"([^"]+)"/g)].map((line) => line[1]),
      lat: Number(match[3]),
      lng: Number(match[4]),
    }),
  );
}

export function parseImageMap(ts) {
  const map = {};
  for (const match of ts.matchAll(/"([^"]+)":\s*"(https:\/\/[^"]+)"/g)) {
    map[match[1]] = match[2];
  }
  return map;
}

export function writeImageMap(imagesPath, map) {
  const lines = Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, url]) => `  ${JSON.stringify(name)}: ${JSON.stringify(url)},`);
  const content = `// Real photos sourced from Wikimedia Commons (CC-licensed) and Pexels (free use).
// Each URL is a thumbnail served directly by the source CDN.
export const stationImages: Record<string, string> = {
${lines.join("\n")}
};
`;
  writeFileSync(imagesPath, content);
}

export function updateImageInMap(map, name, url) {
  map[name] = url;
}

function stripDiacritics(text) {
  return text.normalize("NFD").replace(/\p{M}/gu, "");
}

function localityFromName(name) {
  const paren = name.match(/\(([^)]+)\)/);
  if (paren) return paren[1].replace(/\s+area$/i, "").trim();
  return name.split(/[-–]/)[0].trim();
}

function regionFromCoords(lat, lng) {
  if (lat >= 41.7) return "Minho";
  if (lat >= 41.1 && lng >= -8.75) return "Porto";
  if (lat >= 41 && lng < -8.2) return "Douro";
  if (lat >= 40.5 && lng >= -8.7) return "Aveiro";
  if (lat >= 40.2 && lng < -7.5) return "Beira";
  if (lat < 39.5) return "Algarve";
  if (lng >= -9.3) return "Lisbon";
  return "Portugal";
}

const LINE_QUERY_HINTS = {
  "Linha do Minho": ["Minho Portugal train", "Viana Castelo railway", "green train Portugal north"],
  "Linha do Douro": ["Douro valley train", "Douro railway Portugal", "vineyard railway Portugal"],
  "Linha do Norte": ["Portuguese railway Atlantic", "train platform Portugal", "CP train Portugal"],
  "Linha de Braga": ["Braga railway", "train Braga Portugal"],
  "Linha de Guimarães": ["Guimaraes train", "tram train Portugal"],
  "Linha do Vouga": ["Aveiro region train", "Portuguese regional train"],
  "Linha da Beira Alta": ["Beira Alta train", "mountain railway Portugal"],
  "Linha do Algarve": ["Algarve train", "southern Portugal railway"],
  "Linha de Cascais": ["Cascais train", "coastal tram Portugal"],
  "Linha de Sintra": ["Sintra train", "suburban train Lisbon"],
};

/** Distinct Pexels search phrases per station (most specific first). */
export function buildPexelsQueries(station) {
  const locality = localityFromName(station.name);
  const region = regionFromCoords(station.lat, station.lng);
  const plain = stripDiacritics(locality);

  const queries = new Set([
    `${locality} train station Portugal`,
    `${locality} railway Portugal`,
    `${region} train station Portugal`,
    `${plain} Portugal railroad`,
    "Comboios de Portugal train",
    "Portuguese railway station",
    "Portugal train tracks landscape",
    "European commuter train station",
  ]);

  for (const line of station.lines) {
    for (const hint of LINE_QUERY_HINTS[line] ?? []) {
      queries.add(hint);
    }
    if (line.includes("Douro")) queries.add("Douro scenic railway");
    if (line.includes("Minho")) queries.add("northern Portugal railway");
    if (line.includes("Urban")) queries.add("urban train Portugal");
  }

  return [...queries];
}

export async function wikiThumb(title) {
  const url = new URL("https://pt.wikipedia.org/w/api.php");
  url.searchParams.set("action", "query");
  url.searchParams.set("titles", title);
  url.searchParams.set("prop", "pageimages");
  url.searchParams.set("pithumbsize", "960");
  url.searchParams.set("format", "json");
  const res = await fetch(url, {
    headers: { "User-Agent": "portugal-north/1.0 (image-fetch; contact: verystays.com)" },
  });
  const text = await res.text();
  if (!res.ok || text.startsWith("You are making too many requests")) {
    return { thumb: null, rateLimited: true };
  }
  try {
    const data = JSON.parse(text);
    const page = Object.values(data.query?.pages ?? {})[0];
    const src = page?.thumbnail?.source;
    if (!src || src.includes("Pt_ferv.png")) return { thumb: null, rateLimited: false };
    return { thumb: src, rateLimited: false };
  } catch {
    return { thumb: null, rateLimited: false };
  }
}

const wikiTitles = (stationName) => [
  `Apeadeiro de ${stationName}`,
  `Estação Ferroviária de ${stationName}`,
  `Estação Ferroviária da ${stationName}`,
  `${stationName} train station`,
];

export async function pexelsPickUnique(query, stationName, usedUrls, apiKey, { perPage = 40 } = {}) {
  const page = (hashString(`${stationName}:${query}`) % 8) + 1;
  const url = new URL("https://api.pexels.com/v1/search");
  url.searchParams.set("query", query);
  url.searchParams.set("per_page", String(perPage));
  url.searchParams.set("page", String(page));
  url.searchParams.set("orientation", "landscape");

  const res = await fetch(url, { headers: { Authorization: apiKey } });
  if (!res.ok) {
    throw new Error(`Pexels ${res.status}: ${await res.text()}`);
  }

  const data = await res.json();
  const photos = data.photos ?? [];
  if (photos.length === 0) return null;

  const start = hashString(stationName) % photos.length;
  for (let offset = 0; offset < photos.length; offset++) {
    const photo = photos[(start + offset) % photos.length];
    const candidate = photo?.src?.large;
    if (candidate && !usedUrls.has(candidate)) {
      usedUrls.add(candidate);
      return candidate;
    }
  }
  return null;
}

export async function resolveStationImage(station, { apiKey, usedUrls, pexelsOnly = false }) {
  if (!pexelsOnly) {
    for (const title of wikiTitles(station.name)) {
      const { thumb, rateLimited } = await wikiThumb(title);
      if (rateLimited) break;
      if (thumb && !usedUrls.has(thumb)) {
        usedUrls.add(thumb);
        return { url: thumb, source: "wikimedia" };
      }
      await sleep(1200);
    }
  }

  const queries = buildPexelsQueries(station);
  for (const query of queries) {
    const url = await pexelsPickUnique(query, station.name, usedUrls, apiKey);
    if (url) return { url, source: "pexels", query };
    await sleep(400);
  }
  return null;
}

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function findDuplicateGroups(imageMap) {
  const byUrl = new Map();
  for (const [name, url] of Object.entries(imageMap)) {
    if (!byUrl.has(url)) byUrl.set(url, []);
    byUrl.get(url).push(name);
  }
  return [...byUrl.entries()]
    .filter(([, names]) => names.length > 1)
    .sort((a, b) => b[1].length - a[1].length);
}
