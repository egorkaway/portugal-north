/** Raster tile basemaps for station map card generation. */

export const BASEMAP_IDS = [
  "osm",
  "carto-positron",
  "carto-voyager",
  "carto-dark",
  "opentopomap",
];

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
    url: (z, x, y) =>
      `https://${subdomain(x, y)}.basemaps.cartocdn.com/light_all/${z}/${x}/${y}.png`,
    attribution: "© OpenStreetMap contributors © CARTO",
  },
  "carto-voyager": {
    id: "carto-voyager",
    label: "Carto Voyager",
    url: (z, x, y) =>
      `https://${subdomain(x, y)}.basemaps.cartocdn.com/rastertiles/voyager/${z}/${x}/${y}.png`,
    attribution: "© OpenStreetMap contributors © CARTO",
  },
  "carto-dark": {
    id: "carto-dark",
    label: "Carto Dark Matter",
    url: (z, x, y) =>
      `https://${subdomain(x, y)}.basemaps.cartocdn.com/dark_all/${z}/${x}/${y}.png`,
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

/** Pick a basemap at random (new pick on every call). */
export function randomBasemap(random = Math.random) {
  const index = Math.floor(random() * BASEMAP_IDS.length);
  return getBasemap(BASEMAP_IDS[index]);
}

/**
 * @param {"random" | string} mode — "random" or a fixed basemap id
 */
export function resolveBasemap(mode = "random") {
  if (mode === "random") {
    return randomBasemap();
  }
  return getBasemap(mode);
}
