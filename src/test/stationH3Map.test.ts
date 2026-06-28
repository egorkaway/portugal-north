import { describe, expect, it } from "vitest";
import {
  buildStationHexCells,
  findHexCellsAtLatLng,
  hexPathStyle,
  movementsToH3Resolution,
  stationHexCellsToGeoJSON,
} from "@/lib/stationH3Map";

describe("movementsToH3Resolution", () => {
  it("maps max movements to resolution 5 and min to 9", () => {
    expect(movementsToH3Resolution(100, 10, 100)).toBe(5);
    expect(movementsToH3Resolution(10, 10, 100)).toBe(9);
  });

  it("uses only resolutions 5, 7, and 9 between extremes", () => {
    expect(movementsToH3Resolution(90, 10, 100)).toBe(5);
    expect(movementsToH3Resolution(55, 10, 100)).toBe(7);
    expect(movementsToH3Resolution(20, 10, 100)).toBe(9);
  });

  it("returns 7 when all movements are equal", () => {
    expect(movementsToH3Resolution(42, 42, 42)).toBe(7);
  });
});

describe("hexPathStyle", () => {
  it("uses a bright green border and faint fill for resolution 5", () => {
    const busiest = hexPathStyle(5, 100, 10, 100);
    expect(busiest.fillOpacity).toBeGreaterThan(0.3);
    expect(busiest.fillOpacity).toBeLessThan(0.4);
    expect(busiest.weight).toBeGreaterThanOrEqual(3);
    expect(busiest.color).toContain("145");

    const lessBusy = hexPathStyle(5, 70, 10, 100);
    expect(lessBusy.fillOpacity).toBeGreaterThan(busiest.fillOpacity);
  });

  it("uses darker blue fills for resolution 7", () => {
    const style = hexPathStyle(7, 50, 10, 100);
    expect(style.fillColor).toContain("210");
    expect(style.fillOpacity).toBeGreaterThan(0.4);
  });

  it("uses dark purple fills for resolution 9", () => {
    const quietest = hexPathStyle(9, 10, 10, 100);
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
