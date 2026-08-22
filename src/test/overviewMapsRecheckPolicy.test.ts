import { mkdirSync, mkdtempSync, utimesSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  getOverviewMapDownloadFilename,
  getOverviewMapImagePath,
} from "@/lib/overviewMapImage";
import {
  OVERVIEW_MAP_FILENAMES,
  OVERVIEW_MAP_MIN_INTERVAL_MS,
  shouldRenderOverviewMaps,
} from "../../scripts/lib/overviewMapsRecheckPolicy.mjs";

function touchOverviewMaps(dir: string, ageMs: number, now: Date) {
  mkdirSync(dir, { recursive: true });
  const mtime = new Date(now.getTime() - ageMs);
  for (const filename of OVERVIEW_MAP_FILENAMES) {
    const path = join(dir, filename);
    writeFileSync(path, "png");
    utimesSync(path, mtime, mtime);
  }
}

describe("overviewMapImage", () => {
  it("resolves Portugal and Iberian image paths", () => {
    expect(getOverviewMapImagePath("activity", "portugal")).toBe("/maps/overview/portugal-activity.png");
    expect(getOverviewMapImagePath("reliability", "iberian")).toBe(
      "/maps/overview/iberian-reliability.png",
    );
    expect(getOverviewMapDownloadFilename("reliability", "iberian")).toBe(
      "verystays-iberian-reliability.png",
    );
  });
});

describe("shouldRenderOverviewMaps", () => {
  const now = new Date("2026-08-20T12:00:00.000Z");

  it("renders when any overview PNG is missing", () => {
    const dir = mkdtempSync(join(tmpdir(), "overview-maps-"));
    expect(shouldRenderOverviewMaps(dir, now)).toBe(true);
    writeFileSync(join(dir, OVERVIEW_MAP_FILENAMES[0]!), "png");
    expect(shouldRenderOverviewMaps(dir, now)).toBe(true);
  });

  it("skips when all PNGs are younger than 3 days", () => {
    const dir = mkdtempSync(join(tmpdir(), "overview-maps-"));
    touchOverviewMaps(dir, OVERVIEW_MAP_MIN_INTERVAL_MS - 60_000, now);
    expect(shouldRenderOverviewMaps(dir, now)).toBe(false);
  });

  it("renders at or after the 3 day mark", () => {
    const dir = mkdtempSync(join(tmpdir(), "overview-maps-"));
    touchOverviewMaps(dir, OVERVIEW_MAP_MIN_INTERVAL_MS, now);
    expect(shouldRenderOverviewMaps(dir, now)).toBe(true);
  });

  it("renders when the oldest PNG is stale even if others are fresh", () => {
    const dir = mkdtempSync(join(tmpdir(), "overview-maps-"));
    mkdirSync(dir, { recursive: true });
    const fresh = new Date(now.getTime() - 60_000);
    const stale = new Date(now.getTime() - OVERVIEW_MAP_MIN_INTERVAL_MS - 1);
    for (const [index, filename] of OVERVIEW_MAP_FILENAMES.entries()) {
      writeFileSync(join(dir, filename), "png");
      utimesSync(join(dir, filename), index === 0 ? stale : fresh, index === 0 ? stale : fresh);
    }
    expect(shouldRenderOverviewMaps(dir, now)).toBe(true);
  });
});
