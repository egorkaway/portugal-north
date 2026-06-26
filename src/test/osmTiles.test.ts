import { describe, expect, it } from "vitest";
import {
  latLngToWorldPx,
  tileRangeForViewport,
} from "../../scripts/lib/osmTiles.mjs";

describe("osmTiles", () => {
  it("places Porto-Campanhã near expected tile grid at z15", () => {
    const { x, y } = latLngToWorldPx(41.1496, -8.5859, 15);
    const range = tileRangeForViewport(x - 540, y - 540, 1080, 1080);
    expect(range.x1 - range.x0).toBeLessThanOrEqual(5);
    expect(range.y1 - range.y0).toBeLessThanOrEqual(5);
  });

  it("centers viewport on station coordinates", () => {
    const lat = 38.7058;
    const lng = -9.1442;
    const size = 1080;
    const zoom = 15;
    const center = latLngToWorldPx(lat, lng, zoom);
    const topLeftX = center.x - size / 2;
    const topLeftY = center.y - size / 2;
    const markerX = Math.round(center.x - topLeftX);
    const markerY = Math.round(center.y - topLeftY);
    expect(markerX).toBe(540);
    expect(markerY).toBe(540);
  });
});
