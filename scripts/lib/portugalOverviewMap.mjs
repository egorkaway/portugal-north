import { readFileSync } from "node:fs";
import { join } from "node:path";
import { cellToBoundary, latLngToCell } from "h3-js";
import { Resvg } from "@resvg/resvg-js";
import sharp from "sharp";
import { parseAllStationsFromRepo } from "./stationImageFetch.mjs";
import { siteHostFromUrl } from "./socialCard.mjs";
import { stitchBoundsMap } from "./osmTiles.mjs";

export const CARD_WIDTH = 1080;
export const CARD_HEIGHT = 1350;

/** Mainland Portugal bbox — includes Valença (north) and Faro (south) with margin. */
const PORTUGAL_BOUNDS = {
  minLat: 36.85,
  maxLat: 42.15,
  minLng: -9.55,
  maxLng: -6.15,
};

const BRAND_DARK = "#0f3d38";
const OVERLAY_BG = "#ffffff";
const OVERLAY_TEXT = "#1a2e2b";
const OVERLAY_BORDER = "#d1ddd9";

const RELIABILITY_COLORS = {
  high: "#059669",
  mid: "#D97706",
  low: "#DC2626",
  airport: "#0284C7",
  unknown: "#94A3B8",
};

function escapeXml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function movementsToActivityTier(movements, minMovements, maxMovements) {
  if (maxMovements <= minMovements) return "mid";
  if (movements >= maxMovements) return "busy";
  if (movements <= minMovements) return "quiet";
  const t = (movements - minMovements) / (maxMovements - minMovements);
  if (t >= 2 / 3) return "busy";
  if (t >= 1 / 3) return "mid";
  return "quiet";
}

function activityTierToH3Resolution(_tier) {
  // One mid size for all tiers — readable hexes without mismatched blobs.
  return 6;
}

function movementRatio(movements, minMovements, maxMovements) {
  if (maxMovements <= minMovements) return 1;
  return (movements - minMovements) / (maxMovements - minMovements);
}

function hexPathStyle(tier, movements, minMovements, maxMovements) {
  const t = movementRatio(movements, minMovements, maxMovements);
  switch (tier) {
    case "busy":
      return {
        fill: "#ef4444",
        fillOpacity: 0.62 + t * 0.18,
        stroke: "#ffffff",
        strokeWidth: 2.5,
      };
    case "mid":
      return {
        fill: "#22c55e",
        fillOpacity: 0.52 + t * 0.2,
        stroke: "#ffffff",
        strokeWidth: 2,
      };
    case "quiet":
      return {
        fill: "#7c3aed",
        fillOpacity: 0.42 + (1 - t) * 0.16,
        stroke: "#ffffff",
        strokeWidth: 1.75,
      };
    default:
      return { fill: "#888", fillOpacity: 0.5, stroke: "#fff", strokeWidth: 1 };
  }
}

function buildStationHexCells(stations, movementsByStation) {
  const entries = stations
    .map((station) => ({
      station,
      movements: movementsByStation[station.name] ?? 0,
    }))
    .filter((entry) => entry.movements > 0);

  if (entries.length === 0) return { cells: [], minMovements: 0, maxMovements: 0 };

  const minMovements = Math.min(...entries.map((e) => e.movements));
  const maxMovements = Math.max(...entries.map((e) => e.movements));

  const cells = entries.map(({ station, movements }) => {
    const tier = movementsToActivityTier(movements, minMovements, maxMovements);
    const resolution = activityTierToH3Resolution(tier);
    const cellId = latLngToCell(station.lat, station.lng, resolution);
    const boundary = cellToBoundary(cellId).map(([lat, lng]) => [lat, lng]);
    return { stationName: station.name, movements, tier, resolution, cellId, boundary };
  });

  return { cells, minMovements, maxMovements };
}

function reliabilityScoreColor(score) {
  if (score >= 8) return RELIABILITY_COLORS.high;
  if (score >= 5) return RELIABILITY_COLORS.mid;
  return RELIABILITY_COLORS.low;
}

function markerRadius(movements) {
  if (movements >= 500) return 20;
  if (movements >= 200) return 16;
  if (movements >= 50) return 13;
  return 10;
}

function isAirportStation(station) {
  return station.types?.includes("Airport") || /\bairport\b/i.test(station.name);
}

function isMetroStation(station) {
  if (station.types?.includes("Metro")) return true;
  if (/\(metro\)/i.test(station.name)) return true;
  return station.lines?.some((line) => /\bmetro\b/i.test(line)) ?? false;
}

function portugalStationsFromRepo(root) {
  return parseAllStationsFromRepo(root).filter((station) => station.country === "pt");
}

const OVERLAY = {
  padX: 26,
  padY: 22,
  titleFontSize: 34,
  labelFontSize: 24,
  urlFontSize: 30,
  swatchSize: 22,
  swatchGap: 10,
  boxX: 16,
  boxY: CARD_HEIGHT - 168 - 16,
  boxH: 168,
  cornerRadius: 16,
};

function buildCornerOverlayShell({ boxW, title, legendMarkup, pageUrl }) {
  const { padX, padY, titleFontSize, urlFontSize, boxX, boxY, boxH, cornerRadius } = OVERLAY;
  // Helvetica Bold + light stroke so Resvg actually renders weight (font-weight alone is unreliable).
  const boldFont = "Helvetica Bold, Arial Black, Arial Bold, sans-serif";
  return `
  <rect x="${boxX}" y="${boxY}" width="${boxW}" height="${boxH}" rx="${cornerRadius}"
        fill="${OVERLAY_BG}" stroke="${OVERLAY_BORDER}" stroke-width="1.5" />
  <text x="${boxX + padX}" y="${boxY + padY + titleFontSize}"
        fill="${BRAND_DARK}" stroke="${BRAND_DARK}" stroke-width="1.1" paint-order="stroke fill"
        font-family="${boldFont}"
        font-size="${titleFontSize}" font-weight="900" letter-spacing="0.04em">${escapeXml(title)}</text>
  ${legendMarkup}
  <text x="${boxX + padX}" y="${boxY + boxH - padY}"
        fill="${OVERLAY_TEXT}" stroke="${OVERLAY_TEXT}" stroke-width="0.9" paint-order="stroke fill"
        font-family="${boldFont}"
        font-size="${urlFontSize}" font-weight="900" letter-spacing="0.01em">${escapeXml(pageUrl)}</text>`;
}

function estimateOverlayTextWidth(text, fontSize) {
  return text.length * fontSize * 0.58;
}

function overlayBoxWidth({ title, pageUrl, legendInnerWidth }) {
  const { padX, titleFontSize, urlFontSize } = OVERLAY;
  return Math.ceil(
    Math.max(
      legendInnerWidth + padX * 2,
      estimateOverlayTextWidth(title, titleFontSize) + padX * 2,
      estimateOverlayTextWidth(pageUrl, urlFontSize) + padX * 2,
    ),
  );
}

/** Corner overlay pill: title + legend items + URL */
function buildActivityCornerOverlay(siteHost) {
  const pageUrl = `${siteHost}/map`;
  const title = "Station activity";
  const items = [
    { label: "Busiest", fill: "#ef4444", stroke: "#b91c1c" },
    { label: "Mid", fill: "#22c55e", stroke: "#15803d" },
    { label: "Quietest", fill: "#7c3aed", stroke: "#5b21b6" },
  ];

  const { padX, padY, titleFontSize, labelFontSize, swatchSize, swatchGap, boxX, boxY } = OVERLAY;
  const itemSpacing = 122;
  const legendY = boxY + padY + titleFontSize + 22;
  const maxLabelWidth = Math.max(
    ...items.map((item) => estimateOverlayTextWidth(item.label, labelFontSize)),
  );
  const legendInnerWidth =
    (items.length - 1) * itemSpacing + swatchSize + swatchGap + maxLabelWidth;
  const boxW = overlayBoxWidth({ title, pageUrl, legendInnerWidth });

  const legendMarkup = items
    .map((item, i) => {
      const x = boxX + padX + i * itemSpacing;
      return `
        <rect x="${x}" y="${legendY}" width="${swatchSize}" height="${swatchSize}" rx="4"
              fill="${item.fill}" stroke="${item.stroke}" stroke-width="2" />
        <text x="${x + swatchSize + swatchGap}" y="${legendY + swatchSize - 2}"
              fill="${OVERLAY_TEXT}" font-family="Inter, system-ui, sans-serif"
              font-size="${labelFontSize}" font-weight="600">${escapeXml(item.label)}</text>`;
    })
    .join("");

  return buildCornerOverlayShell({
    boxW,
    title,
    legendMarkup,
    pageUrl,
  });
}

function buildReliabilityCornerOverlay(siteHost) {
  const pageUrl = `${siteHost}/map`;
  const title = "Station reliability";
  const items = [
    { label: "8–10", color: RELIABILITY_COLORS.high },
    { label: "5–7", color: RELIABILITY_COLORS.mid },
    { label: "0–4", color: RELIABILITY_COLORS.low },
  ];

  const { padX, padY, titleFontSize, labelFontSize, swatchGap, boxX, boxY } = OVERLAY;
  const r = 10;
  const itemSpacing = 100;
  const legendY = boxY + padY + titleFontSize + 22 + r;
  const maxLabelWidth = Math.max(
    ...items.map((item) => estimateOverlayTextWidth(item.label, labelFontSize)),
  );
  const legendInnerWidth =
    (items.length - 1) * itemSpacing + r * 2 + swatchGap + maxLabelWidth;
  const boxW = overlayBoxWidth({ title, pageUrl, legendInnerWidth });

  const legendMarkup = items
    .map((item, i) => {
      const cx = boxX + padX + r + i * itemSpacing;
      return `
        <circle cx="${cx}" cy="${legendY}" r="${r}" fill="${item.color}" stroke="${OVERLAY_BORDER}" stroke-width="2" />
        <text x="${cx + r + swatchGap}" y="${legendY + r - 2}"
              fill="${OVERLAY_TEXT}" font-family="Inter, system-ui, sans-serif"
              font-size="${labelFontSize}" font-weight="600">${escapeXml(item.label)}</text>`;
    })
    .join("");

  return buildCornerOverlayShell({
    boxW,
    title,
    legendMarkup,
    pageUrl,
  });
}

/** Slight grow so hexes stay readable without looking bloated. */
const HEX_PIXEL_SCALE = 1.2;

function boundaryToSvgPoints(boundary, project) {
  const points = boundary.map(([lat, lng]) => project(lat, lng));
  const cx = points.reduce((sum, point) => sum + point.x, 0) / points.length;
  const cy = points.reduce((sum, point) => sum + point.y, 0) / points.length;
  return points
    .map((point) => ({
      x: Math.round(cx + (point.x - cx) * HEX_PIXEL_SCALE),
      y: Math.round(cy + (point.y - cy) * HEX_PIXEL_SCALE),
    }))
    .map((point) => `${point.x},${point.y}`)
    .join(" ");
}

function buildActivityOverlaySvg({ cells, minMovements, maxMovements, project, siteHost }) {
  const tierRank = { quiet: 0, mid: 1, busy: 2 };
  const sortedCells = [...cells].sort(
    (a, b) => tierRank[a.tier] - tierRank[b.tier] || a.movements - b.movements,
  );

  const hexElements = sortedCells
    .map((cell) => {
      const style = hexPathStyle(cell.tier, cell.movements, minMovements, maxMovements);
      const points = boundaryToSvgPoints(cell.boundary, project);
      return `<polygon points="${points}" fill="${style.fill}" fill-opacity="${style.fillOpacity}" stroke="${style.stroke}" stroke-width="${style.strokeWidth}" />`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${CARD_WIDTH}" height="${CARD_HEIGHT}" viewBox="0 0 ${CARD_WIDTH} ${CARD_HEIGHT}">
  ${hexElements}
  ${buildActivityCornerOverlay(siteHost)}
</svg>`;
}

function buildReliabilityOverlaySvg({ stations, scores, movements, project, siteHost }) {
  const markerElements = stations
    .map((station) => {
      const score = scores[station.name] ?? null;
      const stationMovements = movements[station.name] ?? 0;
      const pt = project(station.lat, station.lng);
      const color =
        score !== null
          ? reliabilityScoreColor(score)
          : isAirportStation(station)
            ? RELIABILITY_COLORS.airport
            : RELIABILITY_COLORS.unknown;
      const radius = markerRadius(stationMovements);
      return `<circle cx="${pt.x}" cy="${pt.y}" r="${radius}" fill="${color}" stroke="#ffffff" stroke-width="3" />`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${CARD_WIDTH}" height="${CARD_HEIGHT}" viewBox="0 0 ${CARD_WIDTH} ${CARD_HEIGHT}">
  ${markerElements}
  ${buildReliabilityCornerOverlay(siteHost)}
</svg>`;
}

export function loadReliabilityManifest(root) {
  return JSON.parse(readFileSync(join(root, "public/data/reliability-scores.json"), "utf8"));
}

function portugalBoundsPoints() {
  const { minLat, maxLat, minLng, maxLng } = PORTUGAL_BOUNDS;
  return [
    { lat: minLat, lng: minLng },
    { lat: maxLat, lng: maxLng },
    { lat: 37.0186, lng: -7.9319 }, // Faro
    { lat: 42.0275, lng: -8.6425 }, // Valença
  ];
}

/**
 * Extra viewport width stitched, then crop the RIGHT edge (Spain).
 * Keeps more Atlantic on the left so the bottom-left overlay sits over ocean.
 */
const MAP_SHIFT_PX = 420;

/** Stitch a 4:5 portrait map fitted to mainland Portugal bounds. */
async function stitchPortugalMap(basemap = "carto-voyager") {
  const { buffer, project } = await stitchBoundsMap({
    points: portugalBoundsPoints(),
    width: CARD_WIDTH + MAP_SHIFT_PX,
    height: CARD_HEIGHT,
    paddingPx: 48,
    basemap,
  });

  const cropped = await sharp(buffer)
    .extract({ left: 0, top: 0, width: CARD_WIDTH, height: CARD_HEIGHT })
    .png()
    .toBuffer();

  // project() is already relative to the full stitch; left crop keeps x as-is.
  return { buffer: cropped, project };
}

export async function renderPortugalActivityMap(root, { siteUrl = "https://www.verystays.com", basemap = "carto-voyager" } = {}) {
  const manifest = loadReliabilityManifest(root);
  const stations = portugalStationsFromRepo(root).filter((s) => !isAirportStation(s));
  const siteHost = siteHostFromUrl(siteUrl);

  const { buffer: mapBuffer, project } = await stitchPortugalMap(basemap);

  const hexData = buildStationHexCells(stations, manifest.movements ?? {});
  const overlaySvg = buildActivityOverlaySvg({
    cells: hexData.cells,
    minMovements: hexData.minMovements,
    maxMovements: hexData.maxMovements,
    project,
    siteHost,
  });

  const overlayPng = new Resvg(overlaySvg, {
    fitTo: { mode: "width", value: CARD_WIDTH },
  }).render().asPng();

  return sharp(mapBuffer)
    .composite([{ input: overlayPng, top: 0, left: 0 }])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

export async function renderPortugalReliabilityMap(root, { siteUrl = "https://www.verystays.com", basemap = "carto-voyager" } = {}) {
  const manifest = loadReliabilityManifest(root);
  const stations = portugalStationsFromRepo(root).filter(
    (station) => !isAirportStation(station) && !isMetroStation(station),
  );
  const siteHost = siteHostFromUrl(siteUrl);

  const { buffer: mapBuffer, project } = await stitchPortugalMap(basemap);

  const overlaySvg = buildReliabilityOverlaySvg({
    stations,
    scores: manifest.scores ?? {},
    movements: manifest.movements ?? {},
    project,
    siteHost,
  });

  const overlayPng = new Resvg(overlaySvg, {
    fitTo: { mode: "width", value: CARD_WIDTH },
  }).render().asPng();

  return sharp(mapBuffer)
    .composite([{ input: overlayPng, top: 0, left: 0 }])
    .png({ compressionLevel: 9 })
    .toBuffer();
}
