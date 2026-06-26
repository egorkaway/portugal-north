import { Resvg } from "@resvg/resvg-js";
import sharp from "sharp";
import { stitchSquareMap } from "./osmTiles.mjs";
import { CARD_SIZE, stationToSlug } from "./socialCard.mjs";

export { stationToSlug };

const BRAND_DARK = "#0f3d38";
const BRAND_PRIMARY = "#1c7a6f";
const BRAND_GOLD = "#e8a838";
const BRAND_CREAM = "#f4f7f6";

function escapeXml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function pickZoom(station) {
  const isMetro = station.lines.some((line) => /metro/i.test(line));
  if (isMetro) return 16;
  return 15;
}

export function buildMapOverlaySvg({ slug, siteHost, markerX, markerY }) {
  const pageUrl = `${siteHost}/stations/${slug}`;
  const pinR = 14;
  const pinY = markerY - pinR * 2;
  const footerTop = 920;
  const footerHeight = 160;

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
  <rect x="0" y="${footerTop - 40}" width="${CARD_SIZE}" height="${footerHeight + 40}" fill="url(#footerFade)"/>
  <rect x="0" y="${footerTop}" width="${CARD_SIZE}" height="${footerHeight}" fill="${BRAND_DARK}"/>
  <text x="${CARD_SIZE / 2}" y="1020" text-anchor="middle" fill="${BRAND_GOLD}" font-family="Inter, system-ui, sans-serif" font-size="40" font-weight="700" letter-spacing="0.02em">${escapeXml(pageUrl)}</text>
</svg>`;
}

/**
 * @param {{ station: { name: string, lat: number, lng: number, lines: string[] }, siteUrl: string, zoom?: number }} opts
 */
export async function renderStationMapCard({ station, siteUrl, zoom }) {
  const slug = stationToSlug(station.name);
  const siteHost = siteUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const mapZoom = zoom ?? pickZoom(station);

  const { buffer: mapBuffer, markerX, markerY } = await stitchSquareMap({
    lat: station.lat,
    lng: station.lng,
    size: CARD_SIZE,
    zoom: mapZoom,
  });

  const overlaySvg = buildMapOverlaySvg({
    slug,
    siteHost,
    markerX,
    markerY,
  });

  const overlayPng = new Resvg(overlaySvg, {
    fitTo: { mode: "width", value: CARD_SIZE },
  }).render().asPng();

  return sharp(mapBuffer)
    .composite([{ input: overlayPng, top: 0, left: 0 }])
    .png({ compressionLevel: 9 })
    .toBuffer();
}
