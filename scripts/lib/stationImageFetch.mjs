import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

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

/** CP stations, Spanish stations, airports, plus Metro do Porto and Metropolitano de Lisboa termini. */
export function parseAllStationsFromRepo(root) {
  const read = (rel) => readFileSync(join(root, rel), "utf8");
  return [
    ...parseStations(read("src/data/stations.ts")).map((station) => ({ ...station, country: "pt" })),
    ...parseStations(read("src/data/portugal/airports.ts")).map((station) => ({ ...station, country: "pt" })),
    ...parseStations(read("src/data/spain/stations.ts")).map((station) => ({ ...station, country: "es" })),
    ...parseStations(read("src/data/spain/airports.ts")).map((station) => ({ ...station, country: "es" })),
    ...parseStations(read("src/data/metroPortoStations.ts")).map((station) => ({ ...station, country: "pt" })),
    ...parseStations(read("src/data/metroLisboaStations.ts")).map((station) => ({ ...station, country: "pt" })),
  ];
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

/** Place names to search when train-specific Pexels queries fail. */
export function locationNamesFromStation(station) {
  const { name, lat, lng, country = "pt" } = station;
  const names = new Set();
  const plainName = stripDiacritics(name);

  const paren = name.match(/\(([^)]+)\)/);
  if (paren) names.add(paren[1].replace(/\s+area$/i, "").trim());

  const isNamedStop = /^(senhora|sao|hospital|apeadeiro)\b/i.test(plainName);

  if (!isNamedStop) {
    const deTown = name.match(
      /\b(?:de|da|do)\s+([A-Za-zÀ-ÿ][A-Za-zÀ-ÿ\s]{2,}?)(?=\s*\(|\s*[-–]|$)/i,
    );
    if (deTown) names.add(deTown[1].trim());

    if (!paren) {
      const beforeHyphen = name.split(/[-–]/)[0].trim();
      if (beforeHyphen.length >= 4 && !isGenericStationLabel(beforeHyphen)) {
        names.add(beforeHyphen);
      }
    }
  }

  names.add(regionFromCoords(lat, lng, country));

  return [...names].filter((place) => place.length >= 3 && !isGenericStationLabel(place));
}

function isGenericStationLabel(label) {
  const lower = stripDiacritics(label).toLowerCase();
  if (/^(senhora|sao|hospital|estacao|apeadeiro|comboios)\b/.test(lower)) return true;
  const generic =
    /^(portela|leandro|travagem|cabeda|suzao|oleiros|irivo|juncal|mirao|carreira|porto rei|madalena|arroteia|bustelo|meinedo|cuca|giesteira|pereirinhas|nespereira|covas|silva|midoes|seixas|esqueiro|carvalha|barrimau|esmeriz|ferreiros|mazagao|aveleda|tadim|ruilhe|arentim|alvaraes|barroselas|carapecos|ferrao|ermida|barqueiros|godim|covelinhas|recesinhos|agonia|neves|torre)$/i;
  return generic.test(lower);
}

function regionFromCoords(lat, lng, country = "pt") {
  if (country === "es") {
    if (lat >= 41.2 && lng >= 1.5 && lng <= 2.5) return "Barcelona";
    if (lat >= 40.2 && lat < 41 && lng >= -4 && lng <= -3) return "Madrid";
    if (lat >= 42.5 && lng >= -9.5 && lng <= -7.5) return "Galicia";
    if (lat >= 42 && lng >= -8.5) return "Galicia";
    return "Spain";
  }
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

/** Train-focused Pexels queries (tried first). */
export function buildPexelsQueries(station) {
  const { country = "pt" } = station;
  const locality = localityFromName(station.name);
  const region = regionFromCoords(station.lat, station.lng, country);
  const plain = stripDiacritics(locality);

  if (country === "es") {
    const queries = new Set([
      `${locality} train station Spain`,
      `${locality} railway Spain`,
      `${region} train station Spain`,
      `${plain} Spain railroad`,
      "Renfe train station Spain",
      "Spanish railway station",
    ]);
    for (const line of station.lines) {
      if (line.includes("alta velocidad") || line.includes("AVE")) {
        queries.add("AVE high speed train Spain");
      }
      if (line.includes("Eje Atlántico")) {
        queries.add("Galicia train station Spain");
      }
    }
    return [...queries];
  }

  const queries = new Set([
    `${locality} train station Portugal`,
    `${locality} railway Portugal`,
    `${region} train station Portugal`,
    `${plain} Portugal railroad`,
    "Comboios de Portugal train",
    "Portuguese railway station",
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

/** Location-only Pexels queries (fallback when train searches fail or duplicate). */
export function buildLocationPexelsQueries(station) {
  const { country = "pt" } = station;
  const queries = new Set();

  for (const place of locationNamesFromStation(station)) {
    const plain = stripDiacritics(place);
    const nation = country === "es" ? "Spain" : "Portugal";
    queries.add(`${place} ${nation}`);
    queries.add(`${place} ${nation} landscape`);
    queries.add(`${place} ${nation} city`);
    queries.add(`${plain} ${nation} travel`);
    queries.add(`${place} town ${nation}`);
  }

  return [...queries];
}

export async function wikiThumb(title, lang = "pt") {
  const url = new URL(`https://${lang}.wikipedia.org/w/api.php`);
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

const wikiTitlesPt = (stationName) => [
  `Apeadeiro de ${stationName}`,
  `Estação Ferroviária de ${stationName}`,
  `Estação Ferroviária da ${stationName}`,
  `${stationName} train station`,
];

const wikiTitlesEs = (stationName) => {
  const base = stationName.replace(/-Sants$/, " Sants").replace(/-Chamartín$/, " Chamartín");
  return [
    `Estación de ${stationName}`,
    `Estación de ${base}`,
    `Estación de Adif de ${stationName}`,
    `${stationName} train station`,
  ];
};

export function wikiTitlesForStation(station) {
  return station.country === "es" ? wikiTitlesEs(station.name) : wikiTitlesPt(station.name);
}

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
    const langs = station.country === "es" ? ["es", "gl"] : ["pt"];
    for (const lang of langs) {
      for (const title of wikiTitlesForStation(station)) {
        const { thumb, rateLimited } = await wikiThumb(title, lang);
        if (rateLimited) break;
        if (thumb && !usedUrls.has(thumb)) {
          usedUrls.add(thumb);
          return { url: thumb, source: `wikimedia-${lang}` };
        }
        await sleep(1200);
      }
    }
  }

  for (const query of buildPexelsQueries(station)) {
    const url = await pexelsPickUnique(query, station.name, usedUrls, apiKey);
    if (url) return { url, source: "pexels", query };
    await sleep(400);
  }

  for (const query of buildLocationPexelsQueries(station)) {
    const url = await pexelsPickUnique(query, station.name, usedUrls, apiKey);
    if (url) return { url, source: "pexels-location", query };
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
