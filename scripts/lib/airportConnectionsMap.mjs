import { Resvg } from "@resvg/resvg-js";
import sharp from "sharp";
import { formatMapUrlLabel } from "./stationMapCard.mjs";
import { resolveAirportBasemap } from "./mapBasemaps.mjs";
import { stitchBoundsMap } from "./osmTiles.mjs";

const CARD_SIZE = 1080;
const FOOTER_HEIGHT = 240;
const MAP_HEIGHT = CARD_SIZE - FOOTER_HEIGHT;
const TEXT_X = 48;
const URL_FONT_SIZE = 36;
const URL_CHAR_WIDTH = URL_FONT_SIZE * 0.5;
const URL_MAX_CHARS = Math.floor((CARD_SIZE - TEXT_X * 2) / URL_CHAR_WIDTH);
const BRAND_DARK = "#0f3d38";
const BRAND_CREAM = "#f4f7f6";
const BRAND_GOLD = "#e8a838";

function formatAirportPageUrl(siteHost, slug) {
  const fullUrl = `${siteHost}/stations/${slug}`;
  return fullUrl.length <= URL_MAX_CHARS ? fullUrl : formatMapUrlLabel(siteHost, slug);
}

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
  slug,
  siteHost,
  origin,
  connections,
  project,
}) {
  const pageUrl = formatAirportPageUrl(siteHost, slug);
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
  <rect x="${TEXT_X}" y="${MAP_HEIGHT + 24}" width="72" height="5" rx="2.5" fill="${BRAND_GOLD}" />
  <text x="${TEXT_X}" y="${MAP_HEIGHT + 56}" fill="${BRAND_GOLD}" font-family="Inter, system-ui, sans-serif" font-size="22" font-weight="700" letter-spacing="0.08em">FLIGHT CONNECTIONS</text>
  <text x="${TEXT_X}" y="${MAP_HEIGHT + 104}" fill="${BRAND_CREAM}" font-family="Georgia, 'Times New Roman', serif" font-size="38" font-weight="700">${escapeXml(airportName)}</text>
  <text x="${TEXT_X}" y="${MAP_HEIGHT + 142}" fill="${BRAND_CREAM}" font-family="Inter, system-ui, sans-serif" font-size="24" opacity="0.85">${escapeXml(iata)} · ${connections.length} destinations in sample</text>
  <text x="${TEXT_X}" y="${MAP_HEIGHT + 204}" fill="${BRAND_GOLD}" font-family="Inter, system-ui, sans-serif" font-size="${URL_FONT_SIZE}" font-weight="700" letter-spacing="0.02em">${escapeXml(pageUrl)}</text>
</svg>`;
}

export async function renderAirportConnectionsMap(
  entry,
  { basemapMode = "random", siteUrl = "https://www.verystays.com" } = {},
) {
  const points = [
    entry.origin,
    ...entry.connections.map((connection) => ({
      lat: connection.lat,
      lng: connection.lng,
    })),
  ];

  const basemap = resolveAirportBasemap(basemapMode);
  const siteHost = siteUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const { buffer: mapBuffer, project, basemapId } = await stitchBoundsMap({
    points,
    width: CARD_SIZE,
    height: MAP_HEIGHT,
    basemap,
  });

  const overlaySvg = buildOverlaySvg({
    airportName: entry.stationName.replace(/\s*\([A-Z]{3}\)\s*$/, "").trim(),
    iata: entry.iata,
    slug: entry.slug,
    siteHost,
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
