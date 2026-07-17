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

/**
 * Frame to the point cluster (aspect-matched contain/cover), then scale to the card.
 * Used for cover framing and when the Web Mercator world is smaller than the viewport.
 */
async function stitchScaledPointBounds(
  basemapConfig,
  points,
  zoom,
  width,
  height,
  paddingPx,
  fit = "contain",
) {
  const worldSize = worldSizePx(zoom);
  const xs = points.map((point) => latLngToWorldPx(point.lat, point.lng, zoom).x);
  const ys = points.map((point) => latLngToWorldPx(point.lat, point.lng, zoom).y);
  const pad = Math.max(0, paddingPx);
  const minX = Math.min(...xs) - pad;
  const maxX = Math.max(...xs) + pad;
  const minY = Math.min(...ys) - pad;
  const maxY = Math.max(...ys) + pad;
  let bw = Math.max(1, maxX - minX);
  let bh = Math.max(1, maxY - minY);
  const aspect = width / height;
  const bboxAspect = bw / bh;
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;

  // Match card aspect: contain expands empty margins; cover crops the longer axis.
  if (fit === "cover") {
    if (bboxAspect > aspect) {
      bw = bh * aspect;
    } else {
      bh = bw / aspect;
    }
  } else if (bboxAspect > aspect) {
    bh = bw / aspect;
  } else {
    bw = bh * aspect;
  }

  let topLeftX = cx - bw / 2;
  let topLeftY = cy - bh / 2;
  // Keep the crop centered on the points. Do not clamp into the Web Mercator world —
  // that shifts the frame and can push the origin or edge destinations off-canvas.
  // Areas outside the world are filled with ocean color below.

  const maxTile = (1 << zoom) - 1;
  const viewRight = topLeftX + bw;
  const viewBottom = topLeftY + bh;
  const tileX0 = Math.max(0, Math.floor(Math.max(0, topLeftX) / TILE_SIZE));
  const tileY0 = Math.max(0, Math.floor(Math.max(0, topLeftY) / TILE_SIZE));
  const tileX1 = Math.min(maxTile, Math.floor((Math.min(worldSize, viewRight) - 1e-6) / TILE_SIZE));
  const tileY1 = Math.min(maxTile, Math.floor((Math.min(worldSize, viewBottom) - 1e-6) / TILE_SIZE));

  const cropW = Math.max(1, Math.round(bw));
  const cropH = Math.max(1, Math.round(bh));
  const composites = [];

  for (let ty = tileY0; ty <= tileY1; ty += 1) {
    for (let tx = tileX0; tx <= tileX1; tx += 1) {
      const tileWorldLeft = tx * TILE_SIZE;
      const tileWorldTop = ty * TILE_SIZE;
      const interLeft = Math.max(topLeftX, tileWorldLeft, 0);
      const interTop = Math.max(topLeftY, tileWorldTop, 0);
      const interRight = Math.min(viewRight, tileWorldLeft + TILE_SIZE, worldSize);
      const interBottom = Math.min(viewBottom, tileWorldTop + TILE_SIZE, worldSize);
      if (interRight - interLeft < 0.5 || interBottom - interTop < 0.5) continue;

      const srcLeft = Math.max(0, Math.min(TILE_SIZE - 1, Math.round(interLeft - tileWorldLeft)));
      const srcTop = Math.max(0, Math.min(TILE_SIZE - 1, Math.round(interTop - tileWorldTop)));
      let extractWidth = Math.round(interRight - interLeft);
      let extractHeight = Math.round(interBottom - interTop);
      extractWidth = Math.max(1, Math.min(extractWidth, TILE_SIZE - srcLeft));
      extractHeight = Math.max(1, Math.min(extractHeight, TILE_SIZE - srcTop));

      let destLeft = Math.round(interLeft - topLeftX);
      let destTop = Math.round(interTop - topLeftY);
      if (destLeft >= cropW || destTop >= cropH) continue;
      destLeft = Math.max(0, destLeft);
      destTop = Math.max(0, destTop);
      extractWidth = Math.min(extractWidth, cropW - destLeft);
      extractHeight = Math.min(extractHeight, cropH - destTop);
      if (extractWidth < 1 || extractHeight < 1) continue;

      const tile = await fetchTile(basemapConfig, zoom, tx, ty);
      const cropped = await sharp(tile)
        .extract({ left: srcLeft, top: srcTop, width: extractWidth, height: extractHeight })
        .png()
        .toBuffer();
      composites.push({ input: cropped, left: destLeft, top: destTop });
    }
  }

  const mosaic = await sharp({
    create: { width: cropW, height: cropH, channels: 3, background: "#dce7ef" },
  })
    .composite(composites)
    .png()
    .toBuffer();

  const buffer = await sharp(mosaic).resize(width, height, { fit: "fill" }).png().toBuffer();
  const scaleX = width / bw;
  const scaleY = height / bh;
  const project = (lat, lng) => {
    const world = latLngToWorldPx(lat, lng, zoom);
    return {
      x: Math.round((world.x - topLeftX) * scaleX),
      y: Math.round((world.y - topLeftY) * scaleY),
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

function pickZoomForPoints(points, width, height, paddingPx = 72, maxZoom = 12, fit = "contain") {
  const startZoom = Math.max(1, Math.min(18, Math.floor(maxZoom)));
  const availW = width - paddingPx * 2;
  const availH = height - paddingPx * 2;
  const aspect = width / height;
  for (let zoom = startZoom; zoom >= 1; zoom -= 1) {
    const xs = points.map((point) => latLngToWorldPx(point.lat, point.lng, zoom).x);
    const ys = points.map((point) => latLngToWorldPx(point.lat, point.lng, zoom).y);
    const spanX = Math.max(...xs) - Math.min(...xs);
    const spanY = Math.max(...ys) - Math.min(...ys);
    if (fit === "cover") {
      const bboxAspect = spanY > 0 ? spanX / spanY : aspect;
      // Cover is limited by the axis we keep fully in frame.
      if (bboxAspect > aspect) {
        if (spanY <= availH) return zoom;
      } else if (spanX <= availW) {
        return zoom;
      }
    } else if (spanX <= availW && spanY <= availH) {
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
  /** @type {"contain" | "cover"} */
  fit = "contain",
  /**
   * Crop to the point extent (plus padding), match card aspect, then scale to size.
   * Avoids extra empty margin from a fixed-size viewport larger than the cluster.
   */
  tightBounds = false,
  basemap = "carto-voyager",
}) {
  const basemapConfig =
    typeof basemap === "string"
      ? getBasemap(isBasemapId(basemap) ? basemap : "carto-voyager")
      : basemap;

  const zoom = pickZoomForPoints(points, width, height, paddingPx, maxZoom, fit);
  const worldSize = worldSizePx(zoom);

  // Tight / cover / undersized-world: frame to destinations then scale to the card.
  if (tightBounds || fit === "cover" || width > worldSize || height > worldSize) {
    return stitchScaledPointBounds(basemapConfig, points, zoom, width, height, paddingPx, fit);
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
