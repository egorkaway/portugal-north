import { describe, expect, it } from "vitest";
import { distanceKm, formatDistance } from "@/lib/geo";

describe("geo", () => {
  it("computes known great-circle distance", () => {
    const porto = { lat: 41.1579, lng: -8.6291 };
    const saoBento = { lat: 41.1456, lng: -8.6109 };
    const km = distanceKm(porto.lat, porto.lng, saoBento.lat, saoBento.lng);
    expect(km).toBeGreaterThan(1.5);
    expect(km).toBeLessThan(2.5);
  });

  it("formats sub-kilometre distances in metres", () => {
    expect(formatDistance(0.42)).toBe("420 m");
  });
});
