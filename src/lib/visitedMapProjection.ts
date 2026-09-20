/**
 * Web Mercator projection helpers matching scripts/lib/osmTiles.mjs
 * (stitchScaledPointBounds / pickZoomForPoints) for overview PNGs.
 */

export const TILE_SIZE = 256;

/** Iberian overview PNG bbox — same as scripts/lib/portugalOverviewMap.mjs */
export const IBERIAN_OVERVIEW_BOUNDS = {
  minLat: 35.9,
  maxLat: 43.9,
  minLng: -10.0,
  maxLng: 3.5,
} as const;

export const IBERIAN_OVERVIEW_SIZE = 1080;
export const IBERIAN_OVERVIEW_PADDING_PX = 36;
/** Positive values pan the viewport south (content shifts up on the card). */
export const IBERIAN_VIEW_OFFSET_FRACTION = 0.06;
export const IBERIAN_OVERVIEW_MAX_ZOOM = 12;

export type LatLng = { lat: number; lng: number };
export type PixelPoint = { x: number; y: number };

export type OverviewViewport = {
  zoom: number;
  topLeftX: number;
  topLeftY: number;
  /** World-pixel width/height of the framed bbox before resize to card. */
  frameWidth: number;
  frameHeight: number;
  width: number;
  height: number;
};

/** Web Mercator pixel position at zoom (top-left origin). */
export function latLngToWorldPx(lat: number, lng: number, zoom: number): PixelPoint {
  const scale = TILE_SIZE * 2 ** zoom;
  const x = ((lng + 180) / 360) * scale;
  const sinLat = Math.sin((lat * Math.PI) / 180);
  const y = (0.5 - Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI)) * scale;
  return { x, y };
}

export function iberianOverviewCornerPoints(): LatLng[] {
  const { minLat, maxLat, minLng, maxLng } = IBERIAN_OVERVIEW_BOUNDS;
  return [
    { lat: minLat, lng: minLng },
    { lat: maxLat, lng: maxLng },
    { lat: minLat, lng: maxLng },
    { lat: maxLat, lng: minLng },
  ];
}

export function pickZoomForPoints(
  points: LatLng[],
  width: number,
  height: number,
  paddingPx = 72,
  maxZoom = 12,
  fit: "contain" | "cover" = "contain",
): number {
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
 * Viewport for the Iberian reliability overview PNG
 * (tightBounds contain fit + south pan), matching stitchIberianMap.
 */
export function buildIberianOverviewViewport(
  width = IBERIAN_OVERVIEW_SIZE,
  height = IBERIAN_OVERVIEW_SIZE,
): OverviewViewport {
  const points = iberianOverviewCornerPoints();
  const zoom = pickZoomForPoints(
    points,
    width,
    height,
    IBERIAN_OVERVIEW_PADDING_PX,
    IBERIAN_OVERVIEW_MAX_ZOOM,
    "contain",
  );
  const xs = points.map((point) => latLngToWorldPx(point.lat, point.lng, zoom).x);
  const ys = points.map((point) => latLngToWorldPx(point.lat, point.lng, zoom).y);
  const pad = Math.max(0, IBERIAN_OVERVIEW_PADDING_PX);
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

  // contain: expand empty margins to match card aspect
  if (bboxAspect > aspect) {
    bh = bw / aspect;
  } else {
    bw = bh * aspect;
  }

  const topLeftX = cx - bw / 2;
  const topLeftY = cy - bh / 2 + IBERIAN_VIEW_OFFSET_FRACTION * bh;

  return {
    zoom,
    topLeftX,
    topLeftY,
    frameWidth: bw,
    frameHeight: bh,
    width,
    height,
  };
}

export function projectLatLngToOverview(
  lat: number,
  lng: number,
  viewport: OverviewViewport,
): PixelPoint {
  const world = latLngToWorldPx(lat, lng, viewport.zoom);
  const scaleX = viewport.width / viewport.frameWidth;
  const scaleY = viewport.height / viewport.frameHeight;
  return {
    x: Math.round((world.x - viewport.topLeftX) * scaleX),
    y: Math.round((world.y - viewport.topLeftY) * scaleY),
  };
}
