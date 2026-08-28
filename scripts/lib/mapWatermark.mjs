import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { isCartoBasemapId } from "./mapBasemaps.mjs";

const TEMPLATE_PATH = join(dirname(fileURLToPath(import.meta.url)), "../data/carto-api-key-watermark.png");
const TEMPLATE_SIZE = 64;

/** High-pass NCC against the Carto "API KEY REQUIRED" tile. Positron-style overlays score ~0.8. */
export const CARTO_WATERMARK_SCORE_THRESHOLD = 0.4;

let templateCache = null;

async function loadTemplate() {
  if (templateCache) return templateCache;
  const gray = await sharp(TEMPLATE_PATH).greyscale().resize(TEMPLATE_SIZE, TEMPLATE_SIZE).raw().toBuffer();
  const blur = await sharp(TEMPLATE_PATH).greyscale().resize(TEMPLATE_SIZE, TEMPLATE_SIZE).blur(2.5).raw().toBuffer();
  const data = new Float32Array(TEMPLATE_SIZE * TEMPLATE_SIZE);
  let sum = 0;
  let sum2 = 0;
  for (let i = 0; i < data.length; i++) {
    const v = gray[i] - blur[i];
    data[i] = v;
    sum += v;
    sum2 += v * v;
  }
  const n = data.length;
  const mean = sum / n;
  templateCache = {
    data,
    mean,
    std: Math.sqrt(Math.max(1e-6, sum2 / n - mean * mean)),
  };
  return templateCache;
}

function mapCrop(width, height) {
  const cropHeight = height >= 800 ? Math.max(Math.round(height * 0.72), TEMPLATE_SIZE) : height;
  return { left: 0, top: 0, width, height: Math.min(cropHeight, height) };
}

function preparedMap(input, width, height) {
  return sharp(input).extract(mapCrop(width, height)).greyscale().resize(270, null);
}

/**
 * @param {string | Buffer} input
 * @returns {Promise<number>} 0–1-ish match score against the Carto watermark glyph
 */
export async function cartoWatermarkScore(input) {
  const tmpl = await loadTemplate();
  const meta = await sharp(input).metadata();
  const width = meta.width ?? 0;
  const height = meta.height ?? 0;
  if (width < 32 || height < 32) {
    throw new Error("image too small to scan for watermarks");
  }
  const gray = await preparedMap(input, width, height).raw().toBuffer({ resolveWithObject: true });
  const blur = await preparedMap(input, width, height).blur(2.5).raw().toBuffer();

  const iw = gray.info.width;
  const ih = gray.info.height;
  const hp = new Float32Array(gray.data.length);
  for (let i = 0; i < hp.length; i++) hp[i] = gray.data[i] - blur[i];

  const tw = TEMPLATE_SIZE;
  const th = TEMPLATE_SIZE;
  const n = tw * th;
  const step = 2;
  let best = -1;
  for (let y = 0; y <= ih - th; y += step) {
    for (let x = 0; x <= iw - tw; x += step) {
      let sum = 0;
      let sum2 = 0;
      let st = 0;
      for (let ty = 0; ty < th; ty++) {
        const ir = (y + ty) * iw + x;
        const tr = ty * tw;
        for (let tx = 0; tx < tw; tx++) {
          const iv = hp[ir + tx];
          const tv = tmpl.data[tr + tx];
          sum += iv;
          sum2 += iv * iv;
          st += iv * tv;
        }
      }
      const mean = sum / n;
      const std = Math.sqrt(Math.max(1e-6, sum2 / n - mean * mean));
      const c = (st / n - mean * tmpl.mean) / (std * tmpl.std);
      if (c > best) best = c;
    }
  }
  return best;
}

export async function pngHasCartoApiKeyWatermark(input, threshold = CARTO_WATERMARK_SCORE_THRESHOLD) {
  return (await cartoWatermarkScore(input)) >= threshold;
}

function manifestCartoSlugs(outDir) {
  try {
    const manifest = JSON.parse(readFileSync(join(outDir, "manifest.json"), "utf8"));
    return (manifest.stations ?? [])
      .filter((entry) => isCartoBasemapId(entry.basemap))
      .map((entry) => entry.slug);
  } catch {
    return [];
  }
}

/**
 * Carto Voyager overlays are often too faint for glyph matching; any map recorded
 * as a Carto basemap is treated as watermarked. Strong Positron overlays are
 * caught by scanning PNGs that the manifest never tagged.
 *
 * @returns {Promise<{ slugs: string[], fromManifest: number, fromScan: number }>}
 */
export async function listWatermarkedStationMapSlugs(outDir) {
  const fromManifest = manifestCartoSlugs(outDir);
  const slugs = new Set(fromManifest);
  const files = existsSync(outDir) ? readdirSync(outDir).filter((file) => file.endsWith(".png")) : [];
  let fromScan = 0;

  const unchecked = files.filter((file) => !slugs.has(file.slice(0, -4)));
  const CONCURRENCY = 4;
  for (let i = 0; i < unchecked.length; i += CONCURRENCY) {
    const chunk = unchecked.slice(i, i + CONCURRENCY);
    const hits = await Promise.all(
      chunk.map(async (file) => {
        const hit = await pngHasCartoApiKeyWatermark(join(outDir, file));
        return hit ? file.slice(0, -4) : null;
      }),
    );
    for (const slug of hits) {
      if (!slug) continue;
      slugs.add(slug);
      fromScan += 1;
    }
  }

  return {
    slugs: [...slugs].sort((a, b) => a.localeCompare(b)),
    fromManifest: fromManifest.length,
    fromScan,
  };
}
