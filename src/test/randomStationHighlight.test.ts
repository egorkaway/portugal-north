import { describe, expect, it } from "vitest";
import type { Station } from "@/data/stationTypes";
import {
  listStationHighlightCandidates,
  pickRandomStationHighlight,
  stationHighlightScore,
} from "@/lib/randomStationHighlight";

const porto: Station = {
  name: "Porto-Campanhã",
  country: "pt",
  lines: ["Linha do Norte"],
  types: ["Intercidades"],
  lat: 41.15,
  lng: -8.58,
};

const madrid: Station = {
  name: "Madrid-Chamartín",
  country: "es",
  lines: ["Madrid"],
  types: ["AVE"],
  lat: 40.47,
  lng: -3.68,
};

const airport: Station = {
  name: "Lisbon Airport (LIS)",
  country: "pt",
  lines: ["LIS"],
  types: ["Airport"],
  lat: 38.78,
  lng: -9.13,
};

describe("randomStationHighlight", () => {
  it("prefers stations that already have a reliability score", () => {
    const candidates = listStationHighlightCandidates([porto, madrid], {
      portugalScores: { "Porto-Campanhã": 9.1 },
      portugalMovements: { "Porto-Campanhã": 40 },
      spainScores: { "Madrid-Chamartín": 8 },
      spainMovements: { "Madrid-Chamartín": 2 },
    });
    expect(candidates.map((row) => row.name)).toEqual(["Porto-Campanhã"]);
  });

  it("ignores Spain scores below the minimum sample floor", () => {
    expect(
      stationHighlightScore(madrid, {
        spainScores: { "Madrid-Chamartín": 7 },
        spainMovements: { "Madrid-Chamartín": 4 },
      }),
    ).toBeNull();
  });

  it("skips airports and picks by random index", () => {
    const picked = pickRandomStationHighlight([porto, airport], {}, () => 0);
    expect(picked?.name).toBe("Porto-Campanhã");
  });

  it("can restrict candidates to one country", () => {
    const candidates = listStationHighlightCandidates(
      [porto, madrid],
      {
        portugalScores: { "Porto-Campanhã": 9 },
        portugalMovements: { "Porto-Campanhã": 10 },
        spainScores: { "Madrid-Chamartín": 8 },
        spainMovements: { "Madrid-Chamartín": 10 },
      },
      "es",
    );
    expect(candidates.map((row) => row.name)).toEqual(["Madrid-Chamartín"]);
  });
});
