/** Raster tile basemaps for station map card generation. */

export const BASEMAP_IDS = [
  "osm",
  "carto-positron",
  "carto-voyager",
  "opentopomap",
];

/** Weighted pool when a Carto basemap API key is available. */
export const RANDOM_BASEMAP_POOL = [
  "osm",
  "carto-positron",
  "carto-voyager",
  "opentopomap",
  "opentopomap",
];

/** Carto raster tiles watermark without a key — keep osm/topo only. */
export const RANDOM_BASEMAP_POOL_NO_CARTO = ["osm", "opentopomap", "opentopomap"];

export function cartoApiKey() {
  return (process.env.CARTO_API_KEY ?? process.env.CARTO_BASEMAP_KEY ?? "").trim();
}

export function isCartoBasemapId(id) {
  return id === "carto-positron" || id === "carto-voyager";
}

function cartoTileUrl(path, z, x, y) {
  const url = `https://${subdomain(x, y)}.basemaps.cartocdn.com/${path}/${z}/${x}/${y}.png`;
  const key = cartoApiKey();
  return key ? `${url}?key=${encodeURIComponent(key)}` : url;
}

/** Airport connection maps stay on OSM for a consistent regional/world look. */
export const AIRPORT_CONNECTIONS_BASEMAP_ID = "osm";

/** Portugal overview PNGs stay on OSM for a consistent public download style. */
export const OVERVIEW_MAP_BASEMAP_ID = "osm";

const OVERVIEW_MAP_EXCLUDED_BASEMAPS = new Set(["opentopomap", "satellite"]);

export const BASEMAPS = {
  osm: {
    id: "osm",
    label: "OpenStreetMap",
    url: (z, x, y) => `https://tile.openstreetmap.org/${z}/${x}/${y}.png`,
    attribution: "© OpenStreetMap contributors",
  },
  "carto-positron": {
    id: "carto-positron",
    label: "Carto Positron",
    url: (z, x, y) => cartoTileUrl("light_all", z, x, y),
    attribution: "© OpenStreetMap contributors © CARTO",
  },
  "carto-voyager": {
    id: "carto-voyager",
    label: "Carto Voyager",
    url: (z, x, y) => cartoTileUrl("rastertiles/voyager", z, x, y),
    attribution: "© OpenStreetMap contributors © CARTO",
  },
  opentopomap: {
    id: "opentopomap",
    label: "OpenTopoMap",
    url: (z, x, y) => `https://tile.opentopomap.org/${z}/${x}/${y}.png`,
    attribution: "© OpenStreetMap contributors, SRTM | OpenTopoMap",
  },
};

function subdomain(x, y) {
  return "abcd"[(x + y) % 4];
}

export function isBasemapId(value) {
  return typeof value === "string" && value in BASEMAPS;
}

export function getBasemap(id) {
  const basemap = BASEMAPS[id];
  if (!basemap) {
    throw new Error(`Unknown basemap: ${id}. Choose one of: ${BASEMAP_IDS.join(", ")}`);
  }
  return basemap;
}

export function activeRandomBasemapPool() {
  return cartoApiKey() ? RANDOM_BASEMAP_POOL : RANDOM_BASEMAP_POOL_NO_CARTO;
}

let warnedMissingCartoKey = false;

function fallbackOsmIfCartoUnavailable(basemap) {
  if (!isCartoBasemapId(basemap.id) || cartoApiKey()) return basemap;
  if (!warnedMissingCartoKey) {
    warnedMissingCartoKey = true;
    console.warn(
      "CARTO_API_KEY is not set; Carto tiles include an API-key watermark. Using OpenStreetMap instead.",
    );
  }
  return getBasemap("osm");
}

/** Pick a basemap at random (new pick on every call). */
export function randomBasemap(random = Math.random) {
  const pool = activeRandomBasemapPool();
  const index = Math.floor(random() * pool.length);
  return getBasemap(pool[index]);
}

/** Airport connection maps are fixed to OSM (legacy "random" mode alias). */
export function randomAirportBasemap(_random = Math.random) {
  return getBasemap(AIRPORT_CONNECTIONS_BASEMAP_ID);
}

/** Overview PNGs are fixed to OSM (legacy "random" mode alias). */
export function randomOverviewBasemap(_random = Math.random) {
  return getBasemap(OVERVIEW_MAP_BASEMAP_ID);
}

/**
 * @param {"random" | string} mode — "random" or a fixed basemap id
 */
export function resolveBasemap(mode = "random") {
  if (mode === "random") {
    return randomBasemap();
  }
  return fallbackOsmIfCartoUnavailable(getBasemap(mode));
}

/**
 * @param {"random" | string} mode — "random" aliases to OSM; opentopomap rejected
 */
export function resolveAirportBasemap(mode = "random") {
  if (mode === "random") {
    return randomAirportBasemap();
  }
  if (mode === "opentopomap") {
    throw new Error("opentopomap is not supported for airport connection maps");
  }
  return fallbackOsmIfCartoUnavailable(getBasemap(mode));
}

/**
 * @param {"random" | string} mode — "random" aliases to OSM; opentopomap/satellite rejected
 */
export function resolveOverviewBasemap(mode = "random") {
  if (mode === "random") {
    return randomOverviewBasemap();
  }
  if (OVERVIEW_MAP_EXCLUDED_BASEMAPS.has(mode)) {
    throw new Error(`${mode} is not supported for overview maps`);
  }
  return fallbackOsmIfCartoUnavailable(getBasemap(mode));
}
