import { pageStations } from "@/data/stationRegistry";
import type { Station } from "@/data/stationTypes";
import { getOverviewMapImagePath } from "@/lib/overviewMapImage";
import type { VisitedMap } from "@/lib/stationVisitedStorage";
import {
  buildIberianOverviewViewport,
  IBERIAN_OVERVIEW_SIZE,
  projectLatLngToOverview,
} from "@/lib/visitedMapProjection";

const VISITED_DOT_FILL = "#0f3d38";
const VISITED_DOT_STROKE = "#ffffff";
const VISITED_DOT_RADIUS = 7;
const OVERLAY_BG = "#ffffff";
const OVERLAY_BORDER = "#d1ddd9";
const OVERLAY_TEXT = "#1a2e2b";
const ATTRIBUTION = "© OpenStreetMap contributors";

export type VisitedMapRenderInput = {
  visitedMap: VisitedMap;
  title: string;
  countLabel: string;
  pageUrl?: string;
  /** Override stations catalog (tests). */
  stations?: Station[];
  /** Override basemap URL (tests). */
  basemapUrl?: string;
};

export type VisitedMapRenderResult = {
  blob: Blob;
  count: number;
  filename: string;
};

export function listVisitedStations(
  visitedMap: VisitedMap,
  stations: Station[] = pageStations,
): Station[] {
  const byName = new Map(stations.map((station) => [station.name, station]));
  const visited: Station[] = [];
  for (const [name, isVisited] of Object.entries(visitedMap)) {
    if (!isVisited) continue;
    const station = byName.get(name);
    if (!station) continue;
    if (station.country !== "pt" && station.country !== "es") continue;
    visited.push(station);
  }
  return visited;
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Failed to load map image: ${url}`));
    image.src = url;
  });
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function drawCornerOverlay(
  ctx: CanvasRenderingContext2D,
  {
    title,
    countLabel,
    pageUrl,
  }: {
    title: string;
    countLabel: string;
    pageUrl: string;
  },
) {
  const padX = 26;
  const padY = 22;
  const titleSize = 32;
  const bodySize = 24;
  const urlSize = 28;
  const gap = 14;
  const boxX = 16;
  const boxBottomPad = 16;

  ctx.save();
  ctx.font = `900 ${titleSize}px Helvetica, Arial, sans-serif`;
  const titleW = ctx.measureText(title).width;
  ctx.font = `600 ${bodySize}px Helvetica, Arial, sans-serif`;
  const countW = ctx.measureText(countLabel).width;
  ctx.font = `900 ${urlSize}px Helvetica, Arial, sans-serif`;
  const urlW = ctx.measureText(pageUrl).width;
  const attrW = ctx.measureText(ATTRIBUTION).width;

  const innerW = Math.max(titleW, countW, urlW, attrW);
  const boxW = Math.ceil(innerW + padX * 2 + 24);
  const boxH = Math.ceil(
    padY + titleSize + gap + bodySize + gap + urlSize + gap + bodySize + padY,
  );
  const boxY = IBERIAN_OVERVIEW_SIZE - boxH - boxBottomPad;

  drawRoundedRect(ctx, boxX, boxY, boxW, boxH, 16);
  ctx.fillStyle = OVERLAY_BG;
  ctx.fill();
  ctx.strokeStyle = OVERLAY_BORDER;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  let textY = boxY + padY + titleSize;
  ctx.fillStyle = VISITED_DOT_FILL;
  ctx.font = `900 ${titleSize}px Helvetica, Arial, sans-serif`;
  ctx.fillText(title, boxX + padX, textY);

  textY += gap + bodySize;
  ctx.fillStyle = OVERLAY_TEXT;
  ctx.font = `600 ${bodySize}px Helvetica, Arial, sans-serif`;
  ctx.fillText(countLabel, boxX + padX, textY);

  textY += gap + urlSize;
  ctx.fillStyle = OVERLAY_TEXT;
  ctx.font = `900 ${urlSize}px Helvetica, Arial, sans-serif`;
  ctx.fillText(pageUrl, boxX + padX, textY);

  textY += gap + bodySize;
  ctx.fillStyle = OVERLAY_TEXT;
  ctx.font = `500 ${bodySize}px Helvetica, Arial, sans-serif`;
  ctx.fillText(ATTRIBUTION, boxX + padX, textY);
  ctx.restore();
}

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Canvas export failed"));
        return;
      }
      resolve(blob);
    }, "image/png");
  });
}

/**
 * Build a PNG of visited Iberian stations on the static overview basemap.
 * Runs entirely in the browser; nothing is uploaded or stored server-side.
 */
export async function renderVisitedMapPng(
  input: VisitedMapRenderInput,
): Promise<VisitedMapRenderResult> {
  const stations = listVisitedStations(input.visitedMap, input.stations);
  if (stations.length === 0) {
    throw new Error("No visited stations to draw");
  }

  const basemapUrl = input.basemapUrl ?? getOverviewMapImagePath("reliability", "iberian");
  const basemap = await loadImage(basemapUrl);
  const viewport = buildIberianOverviewViewport();

  const canvas = document.createElement("canvas");
  canvas.width = IBERIAN_OVERVIEW_SIZE;
  canvas.height = IBERIAN_OVERVIEW_SIZE;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D unavailable");

  ctx.drawImage(basemap, 0, 0, IBERIAN_OVERVIEW_SIZE, IBERIAN_OVERVIEW_SIZE);

  for (const station of stations) {
    const { x, y } = projectLatLngToOverview(station.lat, station.lng, viewport);
    if (x < -20 || y < -20 || x > IBERIAN_OVERVIEW_SIZE + 20 || y > IBERIAN_OVERVIEW_SIZE + 20) {
      continue;
    }
    ctx.beginPath();
    ctx.arc(x, y, VISITED_DOT_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = VISITED_DOT_FILL;
    ctx.fill();
    ctx.strokeStyle = VISITED_DOT_STROKE;
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  drawCornerOverlay(ctx, {
    title: input.title,
    countLabel: input.countLabel,
    pageUrl: input.pageUrl ?? "verystays.com",
  });

  const blob = await canvasToBlob(canvas);
  return {
    blob,
    count: stations.length,
    filename: "verystays-visited-map.png",
  };
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
