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

  it("keeps airport connection basemaps fixed to osm", () => {
    const picks = new Set(
      Array.from({ length: 40 }, (_, index) => randomAirportBasemap(() => index / 40).id),
    );
    expect(picks).toEqual(new Set(["osm"]));
  });

  it("keeps explicit airport connection basemaps but rejects opentopomap", () => {
    expect(resolveAirportBasemap("random").id).toBe("osm");
    expect(() => resolveAirportBasemap("opentopomap")).toThrow(/not supported/);
    expect(resolveAirportBasemap("carto-voyager").id).toBe("carto-voyager");
  });

  it("keeps overview map basemaps fixed to osm", () => {
    const picks = new Set(
      Array.from({ length: 40 }, (_, index) => randomOverviewBasemap(() => index / 40).id),
    );
    expect(picks).toEqual(new Set(["osm"]));
  });

  it("keeps explicit overview basemaps but rejects topo and satellite", () => {
    expect(resolveOverviewBasemap("random").id).toBe("osm");
    expect(() => resolveOverviewBasemap("opentopomap")).toThrow(/not supported/);
    expect(() => resolveOverviewBasemap("satellite")).toThrow(/not supported/);
    expect(resolveOverviewBasemap("carto-positron").id).toBe("carto-positron");
  });
});
