import { describe, expect, it } from "vitest";
import {
  buildStationRankingRows,
  getTopDownvoted,
  getTopUpvoted,
  orderStationsForHome,
  sortStationsByCommunityUpvotes,
  sortStationsByDistance,
  stationRankingsToCsv,
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

  it("builds ranked CSV rows for every station with votes", () => {
    const rows = buildStationRankingRows({
      Alpha: { up: 2, down: 1 },
      Bravo: { up: 5, down: 0 },
      Charlie: { up: 0, down: 0 },
      "Station, Inc.": { up: 1, down: 3 },
    });

    expect(rows.map((row) => row.name)).toEqual(["Bravo", "Alpha", "Station, Inc."]);
    expect(rows[0]).toMatchObject({ rank: 1, up: 5, down: 0, net: 5 });
  });

  it("serialises station rankings to CSV", () => {
    const csv = stationRankingsToCsv([
      { rank: 1, name: "Bravo", up: 5, down: 0, net: 5 },
      { rank: 2, name: "Station, Inc.", up: 1, down: 3, net: -2 },
    ]);

    expect(csv).toContain("rank,station,upvotes,downvotes,net");
    expect(csv).toContain("1,Bravo,5,0,5");
    expect(csv).toContain('2,"Station, Inc.",1,3,-2');
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

  it("sorts Coimbra stations first from a Coimbra origin", () => {
    const origin = { lat: 40.21, lng: -8.43 };
    const items: Station[] = [
      { name: "Pombal", lines: [], types: [], lat: 39.9153, lng: -8.6283 },
      { name: "Coimbra-B", lines: [], types: [], lat: 40.2117, lng: -8.4353 },
      { name: "Coimbra", lines: [], types: [], lat: 40.205, lng: -8.4297 },
    ];
    expect(sortStationsByDistance(items, origin).map((s) => s.name)).toEqual([
      "Coimbra-B",
      "Coimbra",
      "Pombal",
    ]);
  });

  it("does not apply community order while distance sort is pending coords", () => {
    const items: Station[] = [
      { name: "Zeta", lines: [], types: [], lat: 0, lng: 0 },
      { name: "Alpha", lines: [], types: [], lat: 0, lng: 0 },
      { name: "Bravo", lines: [], types: [], lat: 0, lng: 0 },
    ];
    const ratings = {
      Alpha: { up: 2, down: 0 },
      Bravo: { up: 5, down: 1 },
    };
    const withoutDistance = orderStationsForHome(items, {
      distanceSortOn: false,
      coords: null,
      globalRatings: ratings,
      votesConfigured: true,
    });
    expect(withoutDistance.map((s) => s.name)).toEqual(["Bravo", "Alpha", "Zeta"]);

    const pending = orderStationsForHome(items, {
      distanceSortOn: true,
      coords: null,
      globalRatings: ratings,
      votesConfigured: true,
    });
    expect(pending.map((s) => s.name)).toEqual(["Zeta", "Alpha", "Bravo"]);
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
