import { statSync } from "node:fs";
import { join } from "node:path";

/** Regenerate overview PNGs at most this often during departure runs. */
export const OVERVIEW_MAP_MIN_INTERVAL_MS = 3 * 24 * 60 * 60 * 1000;

export const OVERVIEW_MAP_FILENAMES = [
  "portugal-activity.png",
  "portugal-reliability.png",
  "iberian-reliability.png",
];

/**
 * Overview maps change slowly; skip re-render on frequent train-stat runs unless
 * a PNG is missing or the oldest one is older than the interval.
 * @param {string} overviewDir
 * @param {Date} [now]
 */
export function shouldRenderOverviewMaps(overviewDir, now = new Date()) {
  let oldestMtimeMs = Infinity;
  for (const filename of OVERVIEW_MAP_FILENAMES) {
    try {
      const { mtimeMs } = statSync(join(overviewDir, filename));
      oldestMtimeMs = Math.min(oldestMtimeMs, mtimeMs);
    } catch {
      return true;
    }
  }
  return now.getTime() - oldestMtimeMs >= OVERVIEW_MAP_MIN_INTERVAL_MS;
}
