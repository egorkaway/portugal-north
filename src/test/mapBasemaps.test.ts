import { describe, expect, it } from "vitest";
import {
  BASEMAP_IDS,
  getBasemap,
  randomAirportBasemap,
  randomBasemap,
  randomOverviewBasemap,
  resolveAirportBasemap,
  resolveBasemap,
  resolveOverviewBasemap,
} from "../../scripts/lib/mapBasemaps.mjs";

describe("mapBasemaps", () => {
  it("returns a known basemap for each id", () => {
    for (const id of BASEMAP_IDS) {
      expect(getBasemap(id).id).toBe(id);
    }
  });

  it("picks randomly from the pool", () => {
    const picks = new Set(
      Array.from({ length: 40 }, (_, index) => randomBasemap(() => index / 40).id),
    );
    expect(picks.size).toBeGreaterThan(1);
    for (const id of picks) {
      expect(BASEMAP_IDS).toContain(id);
    }
  });

  it("uses a fixed basemap when mode is not random", () => {
    expect(resolveBasemap("carto-voyager").id).toBe("carto-voyager");
  });

  it("randomises when mode is random", () => {
    expect(BASEMAP_IDS).toContain(resolveBasemap("random").id);
  });

  it("weights opentopomap twice as often in random mode", () => {
    const counts = Object.fromEntries(BASEMAP_IDS.map((id) => [id, 0]));
    for (let i = 0; i < 500; i++) {
      counts[randomBasemap(Math.random).id] += 1;
    }
    expect(counts.opentopomap).toBeGreaterThan(counts.osm);
    expect(counts.opentopomap).toBeGreaterThan(counts["carto-positron"]);
    expect(counts.opentopomap).toBeGreaterThan(counts["carto-voyager"]);
  });

  it("excludes opentopomap from airport connection basemaps", () => {
    const picks = new Set(
      Array.from({ length: 40 }, (_, index) => randomAirportBasemap(() => index / 40).id),
    );
    expect(picks.has("opentopomap")).toBe(false);
    for (const id of picks) {
      expect(["osm", "carto-positron", "carto-voyager"]).toContain(id);
    }
  });

  it("rejects opentopomap for airport connection maps", () => {
    expect(() => resolveAirportBasemap("opentopomap")).toThrow(/not supported/);
    expect(resolveAirportBasemap("carto-voyager").id).toBe("carto-voyager");
  });

  it("excludes opentopomap from overview map basemaps", () => {
    const picks = new Set(
      Array.from({ length: 40 }, (_, index) => randomOverviewBasemap(() => index / 40).id),
    );
    expect(picks.has("opentopomap")).toBe(false);
    for (const id of picks) {
      expect(["osm", "carto-positron", "carto-voyager"]).toContain(id);
    }
  });

  it("rejects topo and satellite for overview maps", () => {
    expect(() => resolveOverviewBasemap("opentopomap")).toThrow(/not supported/);
    expect(() => resolveOverviewBasemap("satellite")).toThrow(/not supported/);
    expect(resolveOverviewBasemap("carto-positron").id).toBe("carto-positron");
  });
});
