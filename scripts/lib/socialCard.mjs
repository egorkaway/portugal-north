import { Resvg } from "@resvg/resvg-js";
import sharp from "sharp";

export const CARD_SIZE = 1080;
export const PHOTO_HEIGHT = 640;

const BRAND_DARK = "#0f3d38";
const BRAND_PRIMARY = "#1c7a6f";
const BRAND_GOLD = "#e8a838";
const BRAND_CREAM = "#f4f7f6";

export const TAGLINES = [
  "Budget hotels · Live departures",
  "Trains, maps & walking-distance stays",
  "Plan your route through Portugal",
  "Community picks · Nearby stays",
];

const PLACEHOLDER_MARKERS = [
  "Comboios_de_Portugal_logo",
  "station-placeholder",
];

export function stationToSlug(name) {
  return name
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[()]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function isPlaceholderImageUrl(url) {
  if (!url) return true;
  return PLACEHOLDER_MARKERS.some((marker) => url.includes(marker));
}

export function pickTagline(stationName) {
  let hash = 0;
  for (let i = 0; i < stationName.length; i++) {
    hash = (hash * 31 + stationName.charCodeAt(i)) >>> 0;
  }
  return TAGLINES[hash % TAGLINES.length];
}

function escapeXml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function wrapTitle(title, maxChars = 24) {
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

function titleFontSize(lineCount, longestLine) {
  if (lineCount > 1 || longestLine > 28) return 52;
  if (longestLine > 22) return 58;
  return 64;
}

export function buildOverlaySvg({
  stationName,
  slug,
  siteHost,
  tagline,
  primaryLine,
}) {
  const titleLines = wrapTitle(stationName);
  const longest = Math.max(...titleLines.map((l) => l.length));
  const fontSize = titleFontSize(titleLines.length, longest);
  const lineFontSize = 28;
  const taglineFontSize = 34;

  const accentY = 648;
  const gapAccentToLine = 32;
  const visualGapLineToTitle = 40;
  const visualGapBetweenTitleLines = 28;
  const visualGapTitleToTagline = 44;

  const primaryLineY = accentY + 6 + gapAccentToLine + lineFontSize;
  const titleStartY = primaryLine
    ? primaryLineY + 8 + visualGapLineToTitle + fontSize * 0.82
    : accentY + 6 + gapAccentToLine + fontSize;

  const titleTspans = titleLines
    .map((line, index) => {
      const dy = index === 0 ? 0 : fontSize + visualGapBetweenTitleLines;
      return `<tspan x="72" dy="${dy}">${escapeXml(line)}</tspan>`;
    })
    .join("");

  const titleBlockHeight =
    titleLines.length === 1
      ? fontSize
      : fontSize + visualGapBetweenTitleLines + fontSize;
  const taglineY =
    titleStartY + titleBlockHeight + visualGapTitleToTagline - fontSize * 0.15;

  const lineText = primaryLine
    ? `<text x="72" y="${primaryLineY}" fill="${BRAND_GOLD}" font-family="Inter, system-ui, sans-serif" font-size="${lineFontSize}" font-weight="600" letter-spacing="0.08em">${escapeXml(primaryLine.toUpperCase())}</text>`
    : "";

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${CARD_SIZE}" height="${CARD_SIZE}" viewBox="0 0 ${CARD_SIZE} ${CARD_SIZE}">
  <defs>
    <linearGradient id="photoFade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${BRAND_DARK}" stop-opacity="0"/>
      <stop offset="58%" stop-color="${BRAND_DARK}" stop-opacity="0"/>
      <stop offset="78%" stop-color="${BRAND_DARK}" stop-opacity="0.88"/>
      <stop offset="100%" stop-color="${BRAND_DARK}" stop-opacity="1"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="${CARD_SIZE}" height="${PHOTO_HEIGHT + 80}" fill="url(#photoFade)"/>
  <rect x="0" y="${PHOTO_HEIGHT - 40}" width="${CARD_SIZE}" height="${CARD_SIZE - PHOTO_HEIGHT + 40}" fill="${BRAND_DARK}"/>
  <rect x="72" y="${accentY}" width="96" height="6" rx="3" fill="${BRAND_GOLD}"/>
  ${lineText}
  <text y="${titleStartY}" fill="${BRAND_CREAM}" font-family="Georgia, 'Times New Roman', serif" font-size="${fontSize}" font-weight="700">
    ${titleTspans}
  </text>
  <text x="72" y="${taglineY}" fill="#c5d6d2" font-family="Inter, system-ui, sans-serif" font-size="${taglineFontSize}" font-weight="500">${escapeXml(tagline)}</text>
  <text x="72" y="1000" fill="#8fb5ad" font-family="Inter, system-ui, sans-serif" font-size="28" font-weight="600" letter-spacing="0.04em">SUSTAINABLE IBERIAN TRAVEL</text>
  <text x="72" y="1044" fill="${BRAND_GOLD}" font-family="Inter, system-ui, sans-serif" font-size="30" font-weight="600">${escapeXml(`${siteHost}/stations/${slug}`)}</text>
  <circle cx="984" cy="1020" r="34" fill="${BRAND_PRIMARY}"/>
  <path d="M968 1020 H1000 M984 1004 V1036" stroke="${BRAND_CREAM}" stroke-width="5" stroke-linecap="round"/>
</svg>`;
}

async function makePlaceholderPhoto(width, height) {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1c7a6f"/>
      <stop offset="100%" stop-color="#0f3d38"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <path d="M120 ${height - 120} L280 ${height - 280} L420 ${height - 180} L620 ${height - 340} L${width - 120} ${height - 140} V${height} H120 Z" fill="#2a9588" opacity="0.35"/>
</svg>`;
  return new Resvg(svg, { fitTo: { mode: "width", value: width } }).render().asPng();
}

async function fetchPhotoBuffer(imageUrl, width, height) {
  const res = await fetch(imageUrl, {
    headers: { "User-Agent": "PortugalByTrain-SocialCard/1.0" },
    signal: AbortSignal.timeout(20_000),
  });
  if (!res.ok) {
    throw new Error(`photo_http_${res.status}`);
  }
  const bytes = Buffer.from(await res.arrayBuffer());
  return sharp(bytes).resize(width, height, { fit: "cover", position: "centre" }).toBuffer();
}

/**
 * @param {{ stationName: string, slug: string, imageUrl?: string, siteUrl: string, tagline?: string, primaryLine?: string }} opts
 */
export async function renderSocialCard({
  stationName,
  slug,
  imageUrl,
  siteUrl,
  tagline = pickTagline(stationName),
  primaryLine,
}) {
  const siteHost = siteUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");

  let photoBuffer;
  try {
    if (imageUrl && !isPlaceholderImageUrl(imageUrl)) {
      photoBuffer = await fetchPhotoBuffer(imageUrl, CARD_SIZE, PHOTO_HEIGHT);
    } else {
      photoBuffer = await makePlaceholderPhoto(CARD_SIZE, PHOTO_HEIGHT);
    }
  } catch {
    photoBuffer = await makePlaceholderPhoto(CARD_SIZE, PHOTO_HEIGHT);
  }

  const overlaySvg = buildOverlaySvg({
    stationName,
    slug,
    siteHost,
    tagline,
    primaryLine: primaryLine ?? stationName.split(" · ")[0]?.split(" (")[0],
  });
  const overlayPng = new Resvg(overlaySvg, {
    fitTo: { mode: "width", value: CARD_SIZE },
  }).render().asPng();

  const base = await sharp({
    create: {
      width: CARD_SIZE,
      height: CARD_SIZE,
      channels: 3,
      background: BRAND_DARK,
    },
  })
    .png()
    .toBuffer();

  return sharp(base)
    .composite([
      { input: photoBuffer, top: 0, left: 0 },
      { input: overlayPng, top: 0, left: 0 },
    ])
    .png({ compressionLevel: 9 })
    .toBuffer();
}
