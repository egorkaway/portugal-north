import { describe, expect, it } from "vitest";
import {
  getTopDownvoted,
  getTopUpvoted,
  sortStationsByCommunityUpvotes,
  sortStationsByDistance,
} from "@/lib/rankStations";
import { distanceKm } from "@/lib/geo";
import type { Station } from "@/data/stations";

describe("rankStations", () => {
  it("returns top 3 upvoted stations by up count", () => {
    const ranked = getTopUpvoted({
      Alpha: { up: 2, down: 0 },
      Bravo: { up: 5, down: 1 },
      Charlie: { up: 5, down: 0 },
      Delta: { up: 1, down: 0 },
    });

    expect(ranked.map((s) => s.name)).toEqual(["Charlie", "Bravo", "Alpha"]);
  });

  it("returns top 3 downvoted stations by down count", () => {
    const ranked = getTopDownvoted({
      Alpha: { up: 0, down: 4 },
      Bravo: { up: 1, down: 2 },
      Charlie: { up: 0, down: 7 },
      Delta: { up: 0, down: 1 },
    });

    expect(ranked.map((s) => s.name)).toEqual(["Charlie", "Alpha", "Bravo"]);
  });

  it("sorts stations nearest-first from an origin", () => {
    const origin = { lat: 41.1579, lng: -8.6291 };
    const items: Station[] = [
      { name: "Far", lines: [], types: [], lat: 40.6443, lng: -8.6455 },
      { name: "Near", lines: [], types: [], lat: 41.1456, lng: -8.6109 },
      { name: "Mid", lines: [], types: [], lat: 41.0078, lng: -8.6403 },
    ];
    const sorted = sortStationsByDistance(items, origin);
    expect(sorted.map((s) => s.name)).toEqual(["Near", "Mid", "Far"]);

    for (let i = 1; i < sorted.length; i++) {
      const prev = sorted[i - 1];
      const next = sorted[i];
      expect(
        distanceKm(origin.lat, origin.lng, next.lat, next.lng),
      ).toBeGreaterThanOrEqual(
        distanceKm(origin.lat, origin.lng, prev.lat, prev.lng),
      );
    }
  });

  it("sorts stations with upvotes ahead of the rest", () => {
    const items: Station[] = [
      { name: "Zeta", lines: [], types: [], lat: 0, lng: 0 },
      { name: "Alpha", lines: [], types: [], lat: 0, lng: 0 },
      { name: "Bravo", lines: [], types: [], lat: 0, lng: 0 },
    ];
    const sorted = sortStationsByCommunityUpvotes(items, {
      Alpha: { up: 2, down: 0 },
      Bravo: { up: 5, down: 1 },
    });
    expect(sorted.map((s) => s.name)).toEqual(["Bravo", "Alpha", "Zeta"]);
  });
});
