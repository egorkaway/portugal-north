import { Resvg } from "@resvg/resvg-js";
import sharp from "sharp";
import { resolveBasemap } from "./mapBasemaps.mjs";
import { stitchBoundsMap } from "./osmTiles.mjs";

const CARD_SIZE = 1080;
const FOOTER_HEIGHT = 220;
const MAP_HEIGHT = CARD_SIZE - FOOTER_HEIGHT;
const BRAND_DARK = "#0f3d38";
const BRAND_CREAM = "#f4f7f6";
const BRAND_GOLD = "#e8a838";

function escapeXml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function buildOverlaySvg({
  airportName,
  iata,
  origin,
  connections,
  project,
}) {
  const lineElements = connections
    .map((connection) => {
      const from = project(origin.lat, origin.lng);
      const to = project(connection.lat, connection.lng);
      return `<line x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}" stroke="${connection.lineColor}" stroke-width="${connection.lineWeight}" stroke-opacity="0.72" stroke-linecap="round" />`;
    })
    .join("");

  const markerElements = connections
    .map((connection) => {
      const point = project(connection.lat, connection.lng);
      return `<circle cx="${point.x}" cy="${point.y}" r="5" fill="${connection.lineColor}" stroke="#ffffff" stroke-width="2" />`;
    })
    .join("");

  const originPoint = project(origin.lat, origin.lng);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${CARD_SIZE}" height="${CARD_SIZE}" viewBox="0 0 ${CARD_SIZE} ${CARD_SIZE}">
  ${lineElements}
  ${markerElements}
  <circle cx="${originPoint.x}" cy="${originPoint.y}" r="9" fill="#0f766e" stroke="#ffffff" stroke-width="4" />
  <rect x="0" y="${MAP_HEIGHT - 4}" width="${CARD_SIZE}" height="4" fill="${BRAND_GOLD}" />
  <rect x="0" y="${MAP_HEIGHT}" width="${CARD_SIZE}" height="${FOOTER_HEIGHT}" fill="${BRAND_DARK}" />
  <text x="48" y="${MAP_HEIGHT + 56}" fill="${BRAND_GOLD}" font-family="Inter, system-ui, sans-serif" font-size="22" font-weight="700" letter-spacing="0.08em">FLIGHT CONNECTIONS</text>
  <text x="48" y="${MAP_HEIGHT + 108}" fill="${BRAND_CREAM}" font-family="Georgia, 'Times New Roman', serif" font-size="38" font-weight="700">${escapeXml(airportName)}</text>
  <text x="48" y="${MAP_HEIGHT + 148}" fill="${BRAND_CREAM}" font-family="Inter, system-ui, sans-serif" font-size="24" opacity="0.85">${escapeXml(iata)} · ${connections.length} destinations in sample</text>
</svg>`;
}

export async function renderAirportConnectionsMap(entry, { basemapMode = "random" } = {}) {
  const points = [
    entry.origin,
    ...entry.connections.map((connection) => ({
      lat: connection.lat,
      lng: connection.lng,
    })),
  ];

  const basemap = resolveBasemap(basemapMode);
  const { buffer: mapBuffer, project, basemapId } = await stitchBoundsMap({
    points,
    width: CARD_SIZE,
    height: MAP_HEIGHT,
    basemap,
  });

  const overlaySvg = buildOverlaySvg({
    airportName: entry.stationName.replace(/\s*\([A-Z]{3}\)\s*$/, "").trim(),
    iata: entry.iata,
    origin: entry.origin,
    connections: entry.connections,
    project,
  });

  const overlayPng = new Resvg(overlaySvg, {
    fitTo: { mode: "width", value: CARD_SIZE },
  }).render().asPng();

  return {
    buffer: await sharp(mapBuffer)
      .extend({
        top: 0,
        bottom: FOOTER_HEIGHT,
        left: 0,
        right: 0,
        background: BRAND_DARK,
      })
      .composite([{ input: overlayPng, top: 0, left: 0 }])
      .png({ compressionLevel: 9 })
      .toBuffer(),
    basemapId,
  };
}
