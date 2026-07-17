import sharp from "sharp";
import { getBasemap, isBasemapId } from "./mapBasemaps.mjs";

const TILE_SIZE = 256;

/** Web Mercator pixel position at zoom (top-left origin). */
export function latLngToWorldPx(lat, lng, zoom) {
  const scale = TILE_SIZE * 2 ** zoom;
  const x = ((lng + 180) / 360) * scale;
  const sinLat = Math.sin((lat * Math.PI) / 180);
  const y = (0.5 - Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI)) * scale;
  return { x, y };
}

export function tileRangeForViewport(topLeftX, topLeftY, width, height) {
  const x0 = Math.floor(topLeftX / TILE_SIZE);
  const y0 = Math.floor(topLeftY / TILE_SIZE);
  const x1 = Math.floor((topLeftX + width - 1) / TILE_SIZE);
  const y1 = Math.floor((topLeftY + height - 1) / TILE_SIZE);
  return { x0, y0, x1, y1 };
}

const tileCache = new Map();

async function fetchTile(basemap, z, x, y) {
  const key = `${basemap.id}/${z}/${x}/${y}`;
  if (tileCache.has(key)) return tileCache.get(key);

  const promise = (async () => {
    const res = await fetch(basemap.url(z, x, y), {
      headers: { "User-Agent": "VeryStays-StationMapGenerator/1.0 (+https://www.verystays.com)" },
      signal: AbortSignal.timeout(20_000),
    });
    if (!res.ok) throw new Error(`tile_http_${res.status}_${key}`);
    return Buffer.from(await res.arrayBuffer());
  })().catch(async (error) => {
    tileCache.delete(key);
    if (basemap.id === "carto-voyager") throw error;
    const fallback = getBasemap("carto-voyager");
    return fetchTile(fallback, z, x, y);
  });

  tileCache.set(key, promise);
  return promise;
}

function worldSizePx(zoom) {
  return TILE_SIZE * (1 << zoom);
}

async function stitchFullWorldMap(basemapConfig, zoom, width, height) {
  const worldSize = worldSizePx(zoom);
  const maxTile = (1 << zoom) - 1;
  const composites = [];

  for (let ty = 0; ty <= maxTile; ty += 1) {
    for (let tx = 0; tx <= maxTile; tx += 1) {
      const tile = await fetchTile(basemapConfig, zoom, tx, ty);
      composites.push({
        input: tile,
        left: tx * TILE_SIZE,
        top: ty * TILE_SIZE,
      });
    }
  }

  const mosaic = await sharp({
    create: { width: worldSize, height: worldSize, channels: 3, background: "#dce7ef" },
  })
    .composite(composites)
    .png()
    .toBuffer();

  const scaleX = width / worldSize;
  const scaleY = height / worldSize;
  const buffer = await sharp(mosaic).resize(width, height, { fit: "fill" }).png().toBuffer();
  const project = (lat, lng) => {
    const world = latLngToWorldPx(lat, lng, zoom);
    return {
      x: Math.round(world.x * scaleX),
      y: Math.round(world.y * scaleY),
    };
  };

  return { buffer, project, basemapId: basemapConfig.id, zoom };
}

/**
 * Stitch a square map centered on lat/lng.
 * @param {{ lat: number, lng: number, size?: number, zoom?: number, basemap?: string | import("./mapBasemaps.mjs").BASEMAPS[string] }} opts
 * @returns {Promise<{ buffer: Buffer, markerX: number, markerY: number, basemapId: string }>}
 */
export async function stitchSquareMap({
  lat,
  lng,
  size = 1080,
  zoom = 15,
  basemap = "osm",
}) {
  const basemapConfig =
    typeof basemap === "string"
      ? getBasemap(isBasemapId(basemap) ? basemap : "osm")
      : basemap;

  const center = latLngToWorldPx(lat, lng, zoom);
  const topLeftX = center.x - size / 2;
  const topLeftY = center.y - size / 2;
  const { x0, y0, x1, y1 } = tileRangeForViewport(topLeftX, topLeftY, size, size);

  const cols = x1 - x0 + 1;
  const rows = y1 - y0 + 1;
  const mosaicWidth = cols * TILE_SIZE;
  const mosaicHeight = rows * TILE_SIZE;

  const composites = [];
  for (let ty = y0; ty <= y1; ty++) {
    for (let tx = x0; tx <= x1; tx++) {
      const tile = await fetchTile(basemapConfig, zoom, tx, ty);
      composites.push({
        input: tile,
        left: (tx - x0) * TILE_SIZE,
        top: (ty - y0) * TILE_SIZE,
      });
    }
  }

  const mosaic = await sharp({
    create: { width: mosaicWidth, height: mosaicHeight, channels: 3, background: "#e8ece9" },
  })
    .composite(composites)
    .png()
    .toBuffer();

  const cropLeft = Math.max(0, Math.round(topLeftX - x0 * TILE_SIZE));
  const cropTop = Math.max(0, Math.round(topLeftY - y0 * TILE_SIZE));
  const extractWidth = Math.min(size, mosaicWidth - cropLeft);
  const extractHeight = Math.min(size, mosaicHeight - cropTop);

  if (extractWidth <= 0 || extractHeight <= 0) {
    throw new Error("extract_area: bad extract area");
  }

  let buffer = await sharp(mosaic)
    .extract({ left: cropLeft, top: cropTop, width: extractWidth, height: extractHeight })
    .png()
    .toBuffer();

  if (extractWidth !== size || extractHeight !== size) {
    buffer = await sharp(buffer)
      .extend({
        top: 0,
        bottom: size - extractHeight,
        left: 0,
        right: size - extractWidth,
        background: "#e8ece9",
      })
      .png()
      .toBuffer();
  }

  return {
    buffer,
    markerX: Math.round(center.x - topLeftX),
    markerY: Math.round(center.y - topLeftY),
    basemapId: basemapConfig.id,
  };
}

function pickZoomForPoints(points, width, height, paddingPx = 72, maxZoom = 12) {
  const startZoom = Math.max(1, Math.min(18, Math.floor(maxZoom)));
  for (let zoom = startZoom; zoom >= 1; zoom -= 1) {
    const xs = points.map((point) => latLngToWorldPx(point.lat, point.lng, zoom).x);
    const ys = points.map((point) => latLngToWorldPx(point.lat, point.lng, zoom).y);
    const spanX = Math.max(...xs) - Math.min(...xs);
    const spanY = Math.max(...ys) - Math.min(...ys);
    if (spanX <= width - paddingPx * 2 && spanY <= height - paddingPx * 2) {
      return zoom;
    }
  }
  return 1;
}

/**
 * Stitch a map viewport that fits all points. Clamps tile fetches to valid Web Mercator
 * indices so low-zoom world views still render when the viewport extends past x/y = 0.
 */
export async function stitchBoundsMap({
  points,
  width,
  height,
  paddingPx = 72,
  maxZoom = 12,
  basemap = "carto-voyager",
}) {
  const basemapConfig =
    typeof basemap === "string"
      ? getBasemap(isBasemapId(basemap) ? basemap : "carto-voyager")
      : basemap;

  const zoom = pickZoomForPoints(points, width, height, paddingPx, maxZoom);
  const worldSize = worldSizePx(zoom);

  // Low-zoom world views are smaller than the card viewport; upscale the full world
  // so we do not leave blank strips when centering on global connection points.
  if (width > worldSize || height > worldSize) {
    return stitchFullWorldMap(basemapConfig, zoom, width, height);
  }

  const xs = points.map((point) => latLngToWorldPx(point.lat, point.lng, zoom).x);
  const ys = points.map((point) => latLngToWorldPx(point.lat, point.lng, zoom).y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;
  let topLeftX = centerX - width / 2;
  let topLeftY = centerY - height / 2;
  topLeftX = Math.max(0, Math.min(topLeftX, worldSize - width));
  topLeftY = Math.max(0, Math.min(topLeftY, worldSize - height));
  const maxTile = (1 << zoom) - 1;

  const tileX0 = Math.max(0, Math.floor(topLeftX / TILE_SIZE));
  const tileY0 = Math.max(0, Math.floor(topLeftY / TILE_SIZE));
  const tileX1 = Math.min(maxTile, Math.floor((topLeftX + width - 1) / TILE_SIZE));
  const tileY1 = Math.min(maxTile, Math.floor((topLeftY + height - 1) / TILE_SIZE));

  const composites = [];
  if (tileX0 <= tileX1 && tileY0 <= tileY1) {
    for (let ty = tileY0; ty <= tileY1; ty += 1) {
      for (let tx = tileX0; tx <= tileX1; tx += 1) {
        const tile = await fetchTile(basemapConfig, zoom, tx, ty);
        composites.push({
          input: tile,
          left: (tx - tileX0) * TILE_SIZE,
          top: (ty - tileY0) * TILE_SIZE,
        });
      }
    }
  }

  const mosaicWidth = Math.max(TILE_SIZE, (tileX1 - tileX0 + 1) * TILE_SIZE);
  const mosaicHeight = Math.max(TILE_SIZE, (tileY1 - tileY0 + 1) * TILE_SIZE);
  const mosaic =
    composites.length > 0
      ? await sharp({
          create: { width: mosaicWidth, height: mosaicHeight, channels: 3, background: "#dce7ef" },
        })
          .composite(composites)
          .png()
          .toBuffer()
      : await sharp({
          create: { width: 1, height: 1, channels: 3, background: "#dce7ef" },
        })
          .png()
          .toBuffer();

  const interLeft = Math.max(topLeftX, tileX0 * TILE_SIZE);
  const interTop = Math.max(topLeftY, tileY0 * TILE_SIZE);
  const interRight = Math.min(topLeftX + width, (tileX1 + 1) * TILE_SIZE);
  const interBottom = Math.min(topLeftY + height, (tileY1 + 1) * TILE_SIZE);

  const canvas = sharp({
    create: { width, height, channels: 3, background: "#dce7ef" },
  });

  if (interRight > interLeft && interBottom > interTop) {
    const srcLeft = Math.round(interLeft - tileX0 * TILE_SIZE);
    const srcTop = Math.round(interTop - tileY0 * TILE_SIZE);
    const extractWidth = Math.round(interRight - interLeft);
    const extractHeight = Math.round(interBottom - interTop);
    const destLeft = Math.round(interLeft - topLeftX);
    const destTop = Math.round(interTop - topLeftY);

    const cropped = await sharp(mosaic)
      .extract({ left: srcLeft, top: srcTop, width: extractWidth, height: extractHeight })
      .png()
      .toBuffer();

    const buffer = await canvas.composite([{ input: cropped, left: destLeft, top: destTop }]).png().toBuffer();

    const project = (lat, lng) => {
      const world = latLngToWorldPx(lat, lng, zoom);
      return {
        x: Math.round(world.x - topLeftX),
        y: Math.round(world.y - topLeftY),
      };
    };

    return { buffer, project, basemapId: basemapConfig.id, zoom };
  }

  const buffer = await canvas.png().toBuffer();
  const project = (lat, lng) => {
    const world = latLngToWorldPx(lat, lng, zoom);
    return {
      x: Math.round(world.x - topLeftX),
      y: Math.round(world.y - topLeftY),
    };
  };

  return { buffer, project, basemapId: basemapConfig.id, zoom };
}
