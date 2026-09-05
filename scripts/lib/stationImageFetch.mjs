import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { pexelsPhotoIdFromUrl } from "./pexelsCredits.mjs";

/** Exact URL plus Pexels photo-id / Wikimedia path so query-param variants still collide. */
export function imageOccupationKeys(url) {
  if (!url || typeof url !== "string") return [];
  const keys = [url];
  const photoId = pexelsPhotoIdFromUrl(url);
  if (photoId) keys.push(`pexels:${photoId}`);
  try {
    const parsed = new URL(url);
    if (/(^|\.)(wikimedia|wikipedia)\.org$/i.test(parsed.hostname)) {
      keys.push(`wiki:${parsed.pathname}`);
    }
  } catch {
    // ignore invalid URLs
  }
  return keys;
}

export function markImageUsed(used, url) {
  for (const key of imageOccupationKeys(url)) used.add(key);
}

export function isImageUsed(used, url) {
  return imageOccupationKeys(url).some((key) => used.has(key));
}

/** @param {Iterable<string>} urls */
export function seedUsedImages(urls) {
  const used = new Set();
  for (const url of urls) markImageUsed(used, url);
  return used;
}

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
    (match) => {
      const country = match[0].match(/\bcountry:\s*"([a-z]{2})"/i)?.[1]?.toLowerCase();
      return {
        name: match[1],
        lines: [...match[2].matchAll(/"([^"]+)"/g)].map((line) => line[1]),
        lat: Number(match[3]),
        lng: Number(match[4]),
        ...(country ? { country } : {}),
      };
    },
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
    ...parseStations(read("src/data/europe/airports.ts")),
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

/** Drop mode suffixes like "(Metro)" and airport IATA so locality is the place name. */
export function stationBaseName(name) {
  return name
    .replace(/\s*\((?:Metro(?:\s+[^)]*)?|CP|Renfe)\)\s*$/i, "")
    .replace(/\s*\(([A-Z]{3})\)\s*$/, "")
    .trim();
}

export function isAirportStationName(name) {
  return /\bairport\b/i.test(name);
}

function isGenericParenLabel(label) {
  const folded = stripDiacritics(label).trim();
  return /^(metro|cp|renfe)(\s|$)/i.test(folded) || /^[A-Z]{3}$/i.test(folded);
}

function localityFromName(name) {
  const base = stationBaseName(name);
  const paren = base.match(/\(([^)]+)\)/);
  if (paren) {
    const inner = paren[1].replace(/\s+area$/i, "").trim();
    if (!isGenericParenLabel(inner)) return inner;
  }
  return base.split(/[-–]/)[0].trim();
}

export function isMetroStation(station) {
  if (/\(metro\b/i.test(station.name)) return true;
  return station.lines?.some((line) => /\bmetro\b/i.test(line)) ?? false;
}

/** @returns {"porto" | "lisbon" | null} */
export function metroSystemForStation(station) {
  if (!isMetroStation(station)) return null;
  const lines = station.lines ?? [];
  if (lines.some((line) => /lisboa|metropolitano/i.test(line))) return "lisbon";
  const { lat, lng } = station;
  if (Number.isFinite(lat) && Number.isFinite(lng)) {
    if (lat >= 38.5 && lat <= 39.2 && lng <= -8.8) return "lisbon";
    if (lat >= 40.9) return "porto";
  }
  return "porto";
}

/** Place names to search when train-specific Pexels queries fail. */
export function locationNamesFromStation(station) {
  const { name, lat, lng, country = "pt" } = station;
  const names = new Set();
  const plainName = stripDiacritics(name);
  const base = stationBaseName(name);

  const paren = base.match(/\(([^)]+)\)/);
  if (paren) {
    const inner = paren[1].replace(/\s+area$/i, "").trim();
    if (!isGenericParenLabel(inner)) names.add(inner);
  }

  const isNamedStop = /^(senhora|sao|hospital|apeadeiro|estadio)\b/i.test(plainName);

  if (!isNamedStop) {
    const deTown = base.match(
      /\b(?:de|da|do)\s+([A-Za-zÀ-ÿ][A-Za-zÀ-ÿ\s]{2,}?)(?=\s*\(|\s*[-–]|$)/i,
    );
    if (deTown) names.add(deTown[1].trim());

    if (!paren) {
      const beforeHyphen = base.split(/[-–]/)[0].trim();
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

/** Safe Iberian atmosphere queries when stop-specific photos are scarce. */
function universalAtmosphereQueries(station) {
  const region = regionFromCoords(station.lat, station.lng, station.country ?? "pt");
  const metro = metroSystemForStation(station);
  if (metro === "porto" || region === "Porto") {
    return [
      "Metro do Porto",
      "Porto metro Portugal",
      "light rail Porto Portugal",
      "Porto Portugal city",
      "Ribeira Porto Portugal",
      "Douro river Porto",
    ];
  }
  if (metro === "lisbon" || region === "Lisbon") {
    return [
      "Lisbon metro Portugal",
      "Metropolitano de Lisboa",
      "Lisbon tram Portugal",
      "Lisbon Portugal city",
      "yellow tram Lisbon",
    ];
  }
  if (station.country === "es") {
    return ["Spanish railway station", "Renfe train Spain", "Spain train platform"];
  }
  return [
    "Portuguese railway station",
    "Comboios de Portugal train",
    "train platform Portugal",
    "Portugal countryside railway",
  ];
}

function airportPexelsQueries(station) {
  const full = stationBaseName(station.name);
  const noIntl = full.replace(/\s+International\b/gi, "").replace(/\s+/g, " ").trim();
  return [...new Set([
    `${full} airport`,
    `${noIntl} airport`,
    `${full} terminal`,
    `${noIntl} airport terminal`,
  ])];
}

/** Train-focused Pexels queries (tried first). */
export function buildPexelsQueries(station) {
  if (isAirportStationName(station.name)) return airportPexelsQueries(station);

  const { country = "pt" } = station;
  const locality = localityFromName(station.name);
  const region = regionFromCoords(station.lat, station.lng, country);
  const plain = stripDiacritics(locality);
  const metro = metroSystemForStation(station);

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
    for (const q of universalAtmosphereQueries(station)) queries.add(q);
    return [...queries];
  }

  if (metro === "porto") {
    return [
      `${locality} Metro do Porto`,
      `Estação ${locality} Porto metro`,
      "Metro do Porto station",
      "Porto metro Portugal",
      "light rail Porto Portugal",
      ...universalAtmosphereQueries(station),
    ];
  }

  if (metro === "lisbon") {
    return [
      `${locality} Lisbon metro`,
      `${locality} Metropolitano de Lisboa`,
      "Lisbon metro Portugal",
      "Metropolitano de Lisboa station",
      ...universalAtmosphereQueries(station),
    ];
  }

  const queries = new Set([
    `${locality} train station Portugal`,
    `${locality} railway Portugal`,
    `${region} train station Portugal`,
    `${plain} Portugal railroad`,
    "Comboios de Portugal train",
    "Portuguese railway station",
  ]);

  for (const line of station.lines ?? []) {
    for (const hint of LINE_QUERY_HINTS[line] ?? []) {
      queries.add(hint);
    }
    if (line.includes("Douro")) queries.add("Douro scenic railway");
    if (line.includes("Minho")) queries.add("northern Portugal railway");
    if (line.includes("Urban")) queries.add("urban train Portugal");
  }

  for (const q of universalAtmosphereQueries(station)) queries.add(q);
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

  for (const q of universalAtmosphereQueries(station)) queries.add(q);
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

const wikiTitlesPt = (station) => {
  const name = station.name;
  const base = stationBaseName(name);
  const titles = [];
  const metro = metroSystemForStation(station);

  if (metro === "porto") {
    titles.push(`Estação ${base} (Metro do Porto)`);
    titles.push(`Estação ${base}`);
    // Common wiki naming variants
    if (/^Hospital São João$/i.test(base)) {
      titles.push("Estação Hospital de São João (Metro do Porto)");
      titles.push("Estação Hospital de São João");
    }
    if (/^Senhora da Hora$/i.test(base)) {
      titles.push("Estação Senhora da Hora");
    }
  } else if (metro === "lisbon") {
    titles.push(`Estação ${base} (Metropolitano de Lisboa)`);
    titles.push(`${base} (Metropolitano de Lisboa)`);
    titles.push(`Estação ${base}`);
  }

  titles.push(
    `Apeadeiro de ${base}`,
    `Apeadeiro de ${name}`,
    `Estação Ferroviária de ${base}`,
    `Estação Ferroviária da ${base}`,
    `Estação Ferroviária de ${name}`,
    `${base} train station`,
    `${name} train station`,
  );

  return [...new Set(titles)];
};

const wikiTitlesEs = (stationName) => {
  const base = stationName.replace(/-Sants$/, " Sants").replace(/-Chamartín$/, " Chamartín");
  return [
    `Estación de ${stationName}`,
    `Estación de ${base}`,
    `Estación de Adif de ${stationName}`,
    `${stationName} train station`,
  ];
};

const WIKI_LANG_BY_COUNTRY = {
  pt: "pt",
  es: "es",
  fr: "fr",
  de: "de",
  it: "it",
  nl: "nl",
  be: "nl",
  ch: "de",
  gb: "en",
};

export function wikiLangsForStation(station) {
  if (isAirportStationName(station.name)) {
    const local = WIKI_LANG_BY_COUNTRY[station.country] ?? "en";
    return [...new Set(["en", local])];
  }
  if (station.country === "es") return ["es", "gl"];
  return ["pt"];
}

export function wikiTitlesForAirport(station) {
  const full = stationBaseName(station.name);
  const noIntl = full.replace(/\s+International\b/gi, "").replace(/\s+/g, " ").trim();
  const titles = [full, noIntl, full.replace(/\bInternational Airport\b/i, "Airport")];
  if (/^London\s+/i.test(full)) titles.push(full.replace(/^London\s+/i, ""));
  if (/^Frankfurt Main Airport$/i.test(full)) titles.push("Frankfurt Airport");
  if (/^Paris-Orly Airport$/i.test(full)) titles.push("Orly Airport");
  if (/Tenerife Norte/i.test(full)) titles.push("Tenerife North Airport");
  if (/Zürich Airport/i.test(full)) titles.push("Zurich Airport");
  if (/Fiumicino/i.test(full)) titles.push("Leonardo da Vinci–Fiumicino Airport");
  return [...new Set(titles.map((title) => title.replace(/\s+/g, " ").trim()).filter(Boolean))];
}

export function wikiTitlesForStation(station) {
  if (isAirportStationName(station.name)) return wikiTitlesForAirport(station);
  return station.country === "es" ? wikiTitlesEs(station.name) : wikiTitlesPt(station);
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
    if (!candidate) continue;
    const idKey = photo.id != null ? `pexels:${photo.id}` : null;
    if (usedUrls.has(candidate) || (idKey && usedUrls.has(idKey))) continue;
    markImageUsed(usedUrls, candidate);
    if (idKey) usedUrls.add(idKey);
    return {
      url: candidate,
      credit: {
        photographer: photo.photographer ?? "",
        photographerUrl: photo.photographer_url ?? "",
        photoPageUrl: photo.url ?? "",
      },
    };
  }
  return null;
}

export async function resolveStationImage(station, { apiKey, usedUrls, pexelsOnly = false }) {
  if (!pexelsOnly) {
    const langs = wikiLangsForStation(station);
    for (const lang of langs) {
      for (const title of wikiTitlesForStation(station)) {
        const { thumb, rateLimited } = await wikiThumb(title, lang);
        if (rateLimited) break;
        if (thumb && !isImageUsed(usedUrls, thumb)) {
          markImageUsed(usedUrls, thumb);
          return { url: thumb, source: `wikimedia-${lang}` };
        }
        await sleep(1200);
      }
    }
  }

  for (const query of buildPexelsQueries(station)) {
    const picked = await pexelsPickUnique(query, station.name, usedUrls, apiKey);
    if (picked) return { url: picked.url, source: "pexels", query, credit: picked.credit };
    await sleep(400);
  }

  for (const query of buildLocationPexelsQueries(station)) {
    const picked = await pexelsPickUnique(query, station.name, usedUrls, apiKey);
    if (picked) return { url: picked.url, source: "pexels-location", query, credit: picked.credit };
    await sleep(400);
  }

  const country = station.country === "es" ? "Spain" : "Portugal";
  for (const query of [
    `${stationBaseName(station.name)} ${country} landscape`,
    `${country} railway countryside`,
    `Iberian peninsula landscape`,
  ]) {
    const picked = await pexelsPickUnique(query, station.name, usedUrls, apiKey, { perPage: 80 });
    if (picked) return { url: picked.url, source: "pexels-fallback", query, credit: picked.credit };
    await sleep(400);
  }

  return null;
}

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function findDuplicateGroups(imageMap) {
  const byKey = new Map();
  for (const [name, url] of Object.entries(imageMap)) {
    const keys = imageOccupationKeys(url);
    const key = keys.find((item) => item.startsWith("pexels:") || item.startsWith("wiki:")) ?? url;
    const group = byKey.get(key) ?? { url, names: [] };
    group.names.push(name);
    byKey.set(key, group);
  }
  return [...byKey.values()]
    .filter((group) => group.names.length > 1)
    .map((group) => [group.url, group.names])
    .sort((a, b) => b[1].length - a[1].length);
}
