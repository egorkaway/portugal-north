import { describe, expect, it } from "vitest";
import { hexPathStyle, movementsToH3Resolution } from "@/lib/stationH3Map";

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
