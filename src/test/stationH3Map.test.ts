import { describe, expect, it } from "vitest";
import {
  activityTierToH3Resolution,
  buildStationHexCells,
  findHexCellsAtLatLng,
  hexPathStyle,
  movementsToActivityTier,
  stationHexCellsToGeoJSON,
} from "@/lib/stationH3Map";

describe("movementsToActivityTier", () => {
  it("maps max movements to busy tier and min to quiet", () => {
    expect(movementsToActivityTier(100, 10, 100)).toBe("busy");
    expect(movementsToActivityTier(10, 10, 100)).toBe("quiet");
    expect(activityTierToH3Resolution("busy")).toBe(7);
    expect(activityTierToH3Resolution("quiet")).toBe(9);
  });

  it("uses busy, mid, and quiet tiers between extremes", () => {
    expect(movementsToActivityTier(90, 10, 100)).toBe("busy");
    expect(movementsToActivityTier(55, 10, 100)).toBe("mid");
    expect(movementsToActivityTier(20, 10, 100)).toBe("quiet");
  });

  it("returns mid when all movements are equal", () => {
    expect(movementsToActivityTier(42, 42, 42)).toBe("mid");
  });
});

describe("hexPathStyle", () => {
  it("uses a bright green border and faint fill for the busiest tier", () => {
    const busiest = hexPathStyle("busy", 100, 10, 100);
    expect(busiest.fillOpacity).toBeGreaterThan(0.3);
    expect(busiest.fillOpacity).toBeLessThan(0.4);
    expect(busiest.weight).toBeGreaterThanOrEqual(3);
    expect(busiest.color).toContain("145");

    const lessBusy = hexPathStyle("busy", 70, 10, 100);
    expect(lessBusy.fillOpacity).toBeGreaterThan(busiest.fillOpacity);
  });

  it("uses darker blue fills for the mid tier", () => {
    const style = hexPathStyle("mid", 50, 10, 100);
    expect(style.fillColor).toContain("210");
    expect(style.fillOpacity).toBeGreaterThan(0.4);
  });

  it("uses dark purple fills for the quiet tier", () => {
    const quietest = hexPathStyle("quiet", 10, 10, 100);
    expect(quietest.fillColor).toContain("275");
    expect(quietest.fillOpacity).toBeGreaterThan(0.85);
  });
});

describe("findHexCellsAtLatLng", () => {
  it("returns every overlapping cell at a point across different H3 resolutions", () => {
    const { cells } = buildStationHexCells(
      [
        { name: "Porto Campanhã", lat: 41.1496, lng: -8.585 },
        { name: "Porto São Bento", lat: 41.1496, lng: -8.585 },
      ],
      { "Porto Campanhã": 100, "Porto São Bento": 10 },
    );

    const matches = findHexCellsAtLatLng(41.1496, -8.585, cells);
    expect(matches).toHaveLength(2);
    expect(matches.map((c) => c.stationName)).toEqual(
      expect.arrayContaining(["Porto Campanhã", "Porto São Bento"]),
    );
    expect(matches[0]?.tier).toBe("busy");
    expect(matches[0]?.resolution).toBe(7);
    expect(matches[1]?.tier).toBe("quiet");
    expect(matches[1]?.resolution).toBe(9);
  });
});

describe("stationHexCellsToGeoJSON", () => {
  it("exports closed polygons with lng/lat coordinates and station properties", () => {
    const { cells } = buildStationHexCells(
      [{ name: "Porto Campanhã", lat: 41.15, lng: -8.58 }],
      { "Porto Campanhã": 42 },
    );

    const geojson = stationHexCellsToGeoJSON(cells);
    expect(geojson.type).toBe("FeatureCollection");
    expect(geojson.features).toHaveLength(1);

    const feature = geojson.features[0];
    expect(feature.properties.stationName).toBe("Porto Campanhã");
    expect(feature.properties.movements).toBe(42);
    expect(feature.properties.tier).toBe("mid");
    expect(feature.properties.resolution).toBe(7);
    expect(feature.geometry.type).toBe("Polygon");

    const ring = feature.geometry.coordinates[0];
    expect(ring.length).toBeGreaterThan(3);
    expect(ring[0]).toEqual(ring[ring.length - 1]);
    for (const [lng, lat] of ring) {
      expect(Math.abs(lng)).toBeLessThanOrEqual(180);
      expect(Math.abs(lat)).toBeLessThanOrEqual(90);
    }
  });
});
