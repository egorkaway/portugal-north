import { readFileSync } from "node:fs";
import { join } from "node:path";
import { cellToBoundary, latLngToCell } from "h3-js";
import { Resvg } from "@resvg/resvg-js";
import sharp from "sharp";
import { parseAllStationsFromRepo } from "./stationImageFetch.mjs";
import { siteHostFromUrl } from "./socialCard.mjs";
import { stitchBoundsMap } from "./osmTiles.mjs";

export const CARD_SIZE = 1080;
export const FOOTER_HEIGHT = 240;
export const MAP_HEIGHT = CARD_SIZE - FOOTER_HEIGHT;
const TEXT_X = 48;
const URL_FONT_SIZE = 36;
const BRAND_DARK = "#0f3d38";
const BRAND_CREAM = "#f4f7f6";
const BRAND_GOLD = "#e8a838";

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

function activityTierToH3Resolution(tier) {
  return tier === "quiet" ? 9 : 7;
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
        fill: "hsl(145 58% 50%)",
        fillOpacity: 0.48 - t * 0.14,
        stroke: "hsl(145 82% 26%)",
        strokeWidth: 3,
      };
    case "mid":
      return {
        fill: "hsl(210 52% 46%)",
        fillOpacity: 0.42 + t * 0.22,
        stroke: "hsl(210 72% 18%)",
        strokeWidth: 2,
      };
    case "quiet":
      return {
        fill: "hsl(275 48% 34%)",
        fillOpacity: 0.78 + (1 - t) * 0.18,
        stroke: "hsl(275 68% 10%)",
        strokeWidth: 2,
      };
    default:
      return { fill: "#888", fillOpacity: 0.5, stroke: "#333", strokeWidth: 1 };
  }
}

function buildStationHexCells(stations, movementsByStation) {
  const entries = stations
    .map((station) => ({
      station,
      movements: movementsByStation[station.name] ?? 0,
    }))
    .filter((entry) => entry.movements > 0);

  if (entries.length === 0) {
    return { cells: [], minMovements: 0, maxMovements: 0 };
  }

  const minMovements = Math.min(...entries.map((entry) => entry.movements));
  const maxMovements = Math.max(...entries.map((entry) => entry.movements));

  const cells = entries.map(({ station, movements }) => {
    const tier = movementsToActivityTier(movements, minMovements, maxMovements);
    const resolution = activityTierToH3Resolution(tier);
    const cellId = latLngToCell(station.lat, station.lng, resolution);
    const boundary = cellToBoundary(cellId).map(([lat, lng]) => [lat, lng]);

    return {
      stationName: station.name,
      movements,
      tier,
      resolution,
      cellId,
      boundary,
    };
  });

  return { cells, minMovements, maxMovements };
}

function reliabilityScoreColor(score) {
  if (score >= 8) return RELIABILITY_COLORS.high;
  if (score >= 5) return RELIABILITY_COLORS.mid;
  return RELIABILITY_COLORS.low;
}

function markerRadius(movements) {
  if (movements >= 500) return 7;
  if (movements >= 200) return 5.5;
  if (movements >= 50) return 4.5;
  return 3.5;
}

function isAirportStation(station) {
  return station.types?.includes("Airport") || /\bairport\b/i.test(station.name);
}

function portugalStationsFromRepo(root) {
  return parseAllStationsFromRepo(root).filter((station) => station.country === "pt");
}

function viewportPoints(stations) {
  const lats = stations.map((station) => station.lat);
  const lngs = stations.map((station) => station.lng);
  const padLat = 0.4;
  const padLng = 0.55;
  return [
    ...stations.map((station) => ({ lat: station.lat, lng: station.lng })),
    { lat: Math.min(...lats) - padLat, lng: Math.min(...lngs) - padLng },
    { lat: Math.max(...lats) + padLat, lng: Math.max(...lngs) + padLng },
  ];
}

function boundaryToSvgPoints(boundary, project) {
  return boundary
    .map(([lat, lng]) => {
      const point = project(lat, lng);
      return `${point.x},${point.y}`;
    })
    .join(" ");
}

function buildFooter({ eyebrow, title, subtitle, pageUrl }) {
  return `
  <rect x="0" y="${MAP_HEIGHT - 4}" width="${CARD_SIZE}" height="4" fill="${BRAND_GOLD}" />
  <rect x="0" y="${MAP_HEIGHT}" width="${CARD_SIZE}" height="${FOOTER_HEIGHT}" fill="${BRAND_DARK}" />
  <rect x="${TEXT_X}" y="${MAP_HEIGHT + 24}" width="72" height="5" rx="2.5" fill="${BRAND_GOLD}" />
  <text x="${TEXT_X}" y="${MAP_HEIGHT + 56}" fill="${BRAND_GOLD}" font-family="Inter, system-ui, sans-serif" font-size="22" font-weight="700" letter-spacing="0.08em">${escapeXml(eyebrow)}</text>
  <text x="${TEXT_X}" y="${MAP_HEIGHT + 104}" fill="${BRAND_CREAM}" font-family="Georgia, 'Times New Roman', serif" font-size="38" font-weight="700">${escapeXml(title)}</text>
  <text x="${TEXT_X}" y="${MAP_HEIGHT + 142}" fill="${BRAND_CREAM}" font-family="Inter, system-ui, sans-serif" font-size="24" opacity="0.85">${escapeXml(subtitle)}</text>
  <text x="${TEXT_X}" y="${MAP_HEIGHT + 204}" fill="${BRAND_GOLD}" font-family="Inter, system-ui, sans-serif" font-size="${URL_FONT_SIZE}" font-weight="700" letter-spacing="0.02em">${escapeXml(pageUrl)}</text>`;
}

function buildActivityLegend() {
  const items = [
    { label: "Busiest", fill: "hsl(145 58% 50%)", stroke: "hsl(145 82% 26%)" },
    { label: "Mid traffic", fill: "hsl(210 52% 46%)", stroke: "hsl(210 72% 18%)" },
    { label: "Quietest", fill: "hsl(275 48% 34%)", stroke: "hsl(275 68% 10%)" },
  ];
  return items
    .map((item, index) => {
      const x = CARD_SIZE - 220 + index * 72;
      const y = 28;
      return `
        <rect x="${x}" y="${y}" width="18" height="18" rx="4" fill="${item.fill}" stroke="${item.stroke}" stroke-width="2" />
        <text x="${x + 9}" y="${y + 44}" text-anchor="middle" fill="#1f2937" font-family="Inter, system-ui, sans-serif" font-size="13" font-weight="600">${escapeXml(item.label)}</text>`;
    })
    .join("");
}

function buildReliabilityLegend() {
  const items = [
    { label: "8–10", color: RELIABILITY_COLORS.high },
    { label: "5–7", color: RELIABILITY_COLORS.mid },
    { label: "0–4", color: RELIABILITY_COLORS.low },
  ];
  return items
    .map((item, index) => {
      const x = CARD_SIZE - 210 + index * 72;
      const y = 30;
      return `
        <circle cx="${x + 9}" cy="${y + 9}" r="9" fill="${item.color}" stroke="#ffffff" stroke-width="2" />
        <text x="${x + 9}" y="${y + 44}" text-anchor="middle" fill="#1f2937" font-family="Inter, system-ui, sans-serif" font-size="13" font-weight="600">${escapeXml(item.label)}</text>`;
    })
    .join("");
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

  const pageUrl = `${siteHost}/map`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${CARD_SIZE}" height="${CARD_SIZE}" viewBox="0 0 ${CARD_SIZE} ${CARD_SIZE}">
  ${hexElements}
  <rect x="16" y="16" width="${CARD_SIZE - 32}" height="72" rx="12" fill="#ffffff" fill-opacity="0.88" />
  ${buildActivityLegend()}
  ${buildFooter({
    eyebrow: "STATION ACTIVITY",
    title: "Mainland Portugal",
    subtitle: "H3 hexes sized by sampled departures and arrivals",
    pageUrl,
  })}
</svg>`;
}

function buildReliabilityOverlaySvg({ stations, scores, movements, project, siteHost }) {
  const markerElements = stations
    .map((station) => {
      const score = scores[station.name] ?? null;
      const stationMovements = movements[station.name] ?? 0;
      const point = project(station.lat, station.lng);
      const color =
        score !== null
          ? reliabilityScoreColor(score)
          : isAirportStation(station)
            ? RELIABILITY_COLORS.airport
            : RELIABILITY_COLORS.unknown;
      const radius = markerRadius(stationMovements);
      return `<circle cx="${point.x}" cy="${point.y}" r="${radius}" fill="${color}" stroke="#ffffff" stroke-width="2" />`;
    })
    .join("");

  const pageUrl = `${siteHost}/map`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${CARD_SIZE}" height="${CARD_SIZE}" viewBox="0 0 ${CARD_SIZE} ${CARD_SIZE}">
  ${markerElements}
  <rect x="16" y="16" width="${CARD_SIZE - 32}" height="72" rx="12" fill="#ffffff" fill-opacity="0.88" />
  ${buildReliabilityLegend()}
  ${buildFooter({
    eyebrow: "STATION RELIABILITY",
    title: "Mainland Portugal",
    subtitle: "Marker colour from on-time score; size from activity",
    pageUrl,
  })}
</svg>`;
}

export function loadReliabilityManifest(root) {
  const path = join(root, "public/data/reliability-scores.json");
  return JSON.parse(readFileSync(path, "utf8"));
}

export async function renderPortugalActivityMap(root, { siteUrl = "https://www.verystays.com" } = {}) {
  const manifest = loadReliabilityManifest(root);
  const stations = portugalStationsFromRepo(root).filter((station) => !isAirportStation(station));
  const points = viewportPoints(stations);
  const siteHost = siteHostFromUrl(siteUrl);

  const { buffer: mapBuffer, project } = await stitchBoundsMap({
    points,
    width: CARD_SIZE,
    height: MAP_HEIGHT,
    paddingPx: 48,
    basemap: "carto-voyager",
  });

  const hexData = buildStationHexCells(stations, manifest.movements ?? {});
  const overlaySvg = buildActivityOverlaySvg({
    cells: hexData.cells,
    minMovements: hexData.minMovements,
    maxMovements: hexData.maxMovements,
    project,
    siteHost,
  });

  const overlayPng = new Resvg(overlaySvg, {
    fitTo: { mode: "width", value: CARD_SIZE },
  }).render().asPng();

  return sharp(mapBuffer)
    .extend({
      top: 0,
      bottom: FOOTER_HEIGHT,
      left: 0,
      right: 0,
      background: BRAND_DARK,
    })
    .composite([{ input: overlayPng, top: 0, left: 0 }])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

export async function renderPortugalReliabilityMap(root, { siteUrl = "https://www.verystays.com" } = {}) {
  const manifest = loadReliabilityManifest(root);
  const stations = portugalStationsFromRepo(root);
  const points = viewportPoints(stations);
  const siteHost = siteHostFromUrl(siteUrl);

  const { buffer: mapBuffer, project } = await stitchBoundsMap({
    points,
    width: CARD_SIZE,
    height: MAP_HEIGHT,
    paddingPx: 48,
    basemap: "carto-voyager",
  });

  const overlaySvg = buildReliabilityOverlaySvg({
    stations,
    scores: manifest.scores ?? {},
    movements: manifest.movements ?? {},
    project,
    siteHost,
  });

  const overlayPng = new Resvg(overlaySvg, {
    fitTo: { mode: "width", value: CARD_SIZE },
  }).render().asPng();

  return sharp(mapBuffer)
    .extend({
      top: 0,
      bottom: FOOTER_HEIGHT,
      left: 0,
      right: 0,
      background: BRAND_DARK,
    })
    .composite([{ input: overlayPng, top: 0, left: 0 }])
    .png({ compressionLevel: 9 })
    .toBuffer();
}
