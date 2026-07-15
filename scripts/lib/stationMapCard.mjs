import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Resvg } from "@resvg/resvg-js";
import sharp from "sharp";
import { stitchSquareMap } from "./osmTiles.mjs";
import { resolveBasemap } from "./mapBasemaps.mjs";
import { CARD_SIZE, siteHostFromUrl, stationToSlug } from "./socialCard.mjs";

export { stationToSlug, siteHostFromUrl };

const BRAND_DARK = "#0f3d38";
const BRAND_PRIMARY = "#1c7a6f";
const BRAND_GOLD = "#e8a838";
const BRAND_CREAM = "#f4f7f6";
const TEXT_X = 56;
const URL_FONT_SIZE = 52;
const URL_RIGHT_MARGIN = 56;
/** Rough avg glyph width for Inter bold at 52px (incl. letter-spacing). */
const URL_CHAR_WIDTH = URL_FONT_SIZE * 0.5;
const URL_MAX_CHARS = Math.floor((CARD_SIZE - TEXT_X - URL_RIGHT_MARGIN) / URL_CHAR_WIDTH);
const AIRPORT_NAME_RE = /\b(aeroporto|aeropuerto|airport)\b/i;
const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), "../..");

let topTrafficStationNames = null;

function getTopTrafficStationNames(limit = 3) {
  if (topTrafficStationNames) return topTrafficStationNames;

  const stats = JSON.parse(readFileSync(join(REPO_ROOT, "data/departure-stats.json"), "utf8"));
  topTrafficStationNames = Object.entries(stats.stations)
    .map(([name, entry]) => ({
      name,
      departures: entry.totals?.departuresNextHour ?? 0,
      samples: entry.successfulSamples ?? 0,
    }))
    .filter((entry) => entry.samples > 0)
    .sort((a, b) => b.departures - a.departures || a.name.localeCompare(b.name))
    .slice(0, limit)
    .map((entry) => entry.name);

  return topTrafficStationNames;
}

function isAirportStation(station) {
  return AIRPORT_NAME_RE.test(station.name);
}

function baseZoom(station) {
  const isMetro = station.lines.some((line) => /metro/i.test(line));
  if (isMetro) return 17;
  return 16;
}

export function pickZoom(station) {
  let zoom = baseZoom(station);

  if (getTopTrafficStationNames().includes(station.name)) {
    zoom -= 3;
  } else if (isAirportStation(station)) {
    zoom -= 2;
  }

  return Math.max(zoom, 10);
}

function escapeXml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function wrapTitle(title, maxChars = 22) {
  const words = title.split(/\s+/);
  const lines = [];
  let line = "";

  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines.slice(0, 2);
}

/** Full station URL when it fits the footer; otherwise domain only. */
export function formatMapUrlLabel(siteHost, slug) {
  const fullUrl = `${siteHost}/stations/${slug}`;
  return fullUrl.length <= URL_MAX_CHARS ? fullUrl : siteHost;
}

export function buildMapOverlaySvg({ stationName, slug, siteHost, markerX, markerY, primaryLine }) {
  const pageUrl = formatMapUrlLabel(siteHost, slug);
  const titleLines = wrapTitle(stationName);
  const titleTspans = titleLines
    .map((line, index) => {
      const dy = index === 0 ? 0 : 44;
      return `<tspan x="${TEXT_X}" dy="${dy}">${escapeXml(line)}</tspan>`;
    })
    .join("");

  const lineLabel = primaryLine
    ? `<text x="${TEXT_X}" y="892" fill="${BRAND_GOLD}" font-family="Inter, system-ui, sans-serif" font-size="24" font-weight="600" letter-spacing="0.06em">${escapeXml(primaryLine.toUpperCase())}</text>`
    : "";

  const titleY = primaryLine ? 948 : 912;
  const urlY = titleLines.length > 1 ? 1048 : 1012;

  const pinR = 14;
  const pinY = markerY - pinR * 2;
  const footerTop = 820;
  const footerHeight = 260;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${CARD_SIZE}" height="${CARD_SIZE}" viewBox="0 0 ${CARD_SIZE} ${CARD_SIZE}">
  <defs>
    <linearGradient id="footerFade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${BRAND_DARK}" stop-opacity="0"/>
      <stop offset="100%" stop-color="${BRAND_DARK}" stop-opacity="0.9"/>
    </linearGradient>
    <filter id="pinShadow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000" flood-opacity="0.35"/>
    </filter>
  </defs>
  <g filter="url(#pinShadow)">
    <circle cx="${markerX}" cy="${pinY + pinR}" r="${pinR}" fill="${BRAND_PRIMARY}" stroke="${BRAND_CREAM}" stroke-width="4"/>
    <circle cx="${markerX}" cy="${pinY + pinR}" r="5" fill="${BRAND_CREAM}"/>
    <path d="M ${markerX} ${pinY + pinR + pinR} L ${markerX - 10} ${pinY + pinR - 2} L ${markerX + 10} ${pinY + pinR - 2} Z" fill="${BRAND_PRIMARY}" stroke="${BRAND_CREAM}" stroke-width="2"/>
  </g>
  <rect x="0" y="${footerTop - 48}" width="${CARD_SIZE}" height="${footerHeight + 48}" fill="url(#footerFade)"/>
  <rect x="0" y="${footerTop}" width="${CARD_SIZE}" height="${footerHeight}" fill="${BRAND_DARK}"/>
  <rect x="${TEXT_X}" y="844" width="72" height="5" rx="2.5" fill="${BRAND_GOLD}"/>
  ${lineLabel}
  <text x="${TEXT_X}" y="${titleY}" fill="${BRAND_CREAM}" font-family="Georgia, 'Times New Roman', serif" font-size="42" font-weight="700">
    ${titleTspans}
  </text>
  <text x="${TEXT_X}" y="${urlY}" fill="${BRAND_GOLD}" font-family="Inter, system-ui, sans-serif" font-size="52" font-weight="700" letter-spacing="0.02em">${escapeXml(pageUrl)}</text>
</svg>`;
}

/**
 * @param {{ station: { name: string, lat: number, lng: number, lines: string[] }, siteUrl: string, zoom?: number, basemapMode?: "random" | string }} opts
 */
export async function renderStationMapCard({
  station,
  siteUrl,
  zoom,
  basemapMode = "random",
}) {
  const slug = stationToSlug(station.name);
  const siteHost = siteHostFromUrl(siteUrl);
  const mapZoom = zoom ?? pickZoom(station);
  const basemap = resolveBasemap(basemapMode);

  const { buffer: mapBuffer, markerX, markerY, basemapId } = await stitchSquareMap({
    lat: station.lat,
    lng: station.lng,
    size: CARD_SIZE,
    zoom: mapZoom,
    basemap,
  });

  const overlaySvg = buildMapOverlaySvg({
    stationName: station.name,
    slug,
    siteHost,
    markerX,
    markerY,
    primaryLine: station.lines[0],
  });

  const overlayPng = new Resvg(overlaySvg, {
    fitTo: { mode: "width", value: CARD_SIZE },
  }).render().asPng();

  return {
    buffer: await sharp(mapBuffer)
      .composite([{ input: overlayPng, top: 0, left: 0 }])
      .png({ compressionLevel: 9 })
      .toBuffer(),
    basemapId,
  };
}
