import { mkdirSync, mkdtempSync, utimesSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
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

describe("shouldRenderOverviewMaps", () => {
  const now = new Date("2026-08-20T12:00:00.000Z");

  it("renders when either overview PNG is missing", () => {
    const dir = mkdtempSync(join(tmpdir(), "overview-maps-"));
    expect(shouldRenderOverviewMaps(dir, now)).toBe(true);
    writeFileSync(join(dir, OVERVIEW_MAP_FILENAMES[0]!), "png");
    expect(shouldRenderOverviewMaps(dir, now)).toBe(true);
  });

  it("skips when both PNGs are younger than 3 days", () => {
    const dir = mkdtempSync(join(tmpdir(), "overview-maps-"));
    touchOverviewMaps(dir, OVERVIEW_MAP_MIN_INTERVAL_MS - 60_000, now);
    expect(shouldRenderOverviewMaps(dir, now)).toBe(false);
  });

  it("renders at or after the 3 day mark", () => {
    const dir = mkdtempSync(join(tmpdir(), "overview-maps-"));
    touchOverviewMaps(dir, OVERVIEW_MAP_MIN_INTERVAL_MS, now);
    expect(shouldRenderOverviewMaps(dir, now)).toBe(true);
  });

  it("renders when the older PNG is stale even if the other is fresh", () => {
    const dir = mkdtempSync(join(tmpdir(), "overview-maps-"));
    mkdirSync(dir, { recursive: true });
    const fresh = new Date(now.getTime() - 60_000);
    const stale = new Date(now.getTime() - OVERVIEW_MAP_MIN_INTERVAL_MS - 1);
    writeFileSync(join(dir, OVERVIEW_MAP_FILENAMES[0]!), "png");
    writeFileSync(join(dir, OVERVIEW_MAP_FILENAMES[1]!), "png");
    utimesSync(join(dir, OVERVIEW_MAP_FILENAMES[0]!), fresh, fresh);
    utimesSync(join(dir, OVERVIEW_MAP_FILENAMES[1]!), stale, stale);
    expect(shouldRenderOverviewMaps(dir, now)).toBe(true);
  });
});
