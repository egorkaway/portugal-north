import sharp from "sharp";

const TILE_SIZE = 256;
const OSM_TILE_URL = "https://tile.openstreetmap.org";

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

function tileUrl(z, x, y) {
  return `${OSM_TILE_URL}/${z}/${x}/${y}.png`;
}

const tileCache = new Map();

async function fetchTile(z, x, y) {
  const key = `${z}/${x}/${y}`;
  if (tileCache.has(key)) return tileCache.get(key);

  const promise = (async () => {
    const res = await fetch(tileUrl(z, x, y), {
      headers: { "User-Agent": "VeryStays-StationMapGenerator/1.0 (+https://www.verystays.com)" },
      signal: AbortSignal.timeout(20_000),
    });
    if (!res.ok) throw new Error(`tile_http_${res.status}_${key}`);
    return Buffer.from(await res.arrayBuffer());
  })();

  tileCache.set(key, promise);
  return promise;
}

/**
 * Stitch a square OSM map centered on lat/lng.
 * @param {{ lat: number, lng: number, size?: number, zoom?: number }} opts
 * @returns {Promise<{ buffer: Buffer, markerX: number, markerY: number }>}
 */
export async function stitchSquareMap({ lat, lng, size = 1080, zoom = 15 }) {
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
      const tile = await fetchTile(zoom, tx, ty);
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
  };
}
