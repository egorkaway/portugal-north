import { describe, expect, it } from "vitest";
import {
  buildReliabilityRankingRows,
  getBottomReliabilityStations,
  getTopReliabilityStations,
  reliabilityRankingsToCsv,
} from "@/lib/reliabilityScore";

describe("reliability rankings", () => {
  const scores: Record<string, number> = {
    Alpha: 10,
    Bravo: 9,
    Charlie: 8,
    Delta: 7,
    Echo: 6,
    Foxtrot: 5,
    Golf: 4,
    Hotel: 3,
    India: 2,
    Juliet: 1,
    Kilo: 1,
    Lima: 10,
  };

  it("breaks score ties by movement count descending", () => {
    const movements = { Alpha: 20, Lima: 80 };
    const top = getTopReliabilityStations(scores, movements, 10);
    expect(top[0]).toEqual({ name: "Lima", score: 10 });
    expect(top[1]).toEqual({ name: "Alpha", score: 10 });
  });

  it("returns top stations by score descending", () => {
    const top = getTopReliabilityStations(scores, {}, 10);
    expect(top).toHaveLength(10);
    expect(top[0].score).toBe(10);
    expect(top.map((s) => s.name)).toEqual([
      "Alpha",
      "Lima",
      "Bravo",
      "Charlie",
      "Delta",
      "Echo",
      "Foxtrot",
      "Golf",
      "Hotel",
      "India",
    ]);
  });

  it("returns bottom stations by score ascending", () => {
    const bottom = getBottomReliabilityStations(scores, {}, 10);
    expect(bottom).toHaveLength(10);
    expect(bottom[0].score).toBe(1);
    expect(bottom[bottom.length - 1].score).toBe(9);
  });

  it("builds ranked rows for stations in the site list only", () => {
    const rows = buildReliabilityRankingRows(
      ["Alpha", "Lima", "Missing"],
      scores,
      { Alpha: 20, Lima: 80 },
    );

    expect(rows).toHaveLength(2);
    expect(rows[0]).toEqual({ rank: 1, name: "Lima", score: 10, movements: 80 });
    expect(rows[1]).toEqual({ rank: 2, name: "Alpha", score: 10, movements: 20 });
  });

  it("exports CSV with headers and escaped station names", () => {
    const csv = reliabilityRankingsToCsv([
      { rank: 1, name: 'São Bento (Porto)', score: 10, movements: 85 },
      { rank: 2, name: "Station, Inc.", score: 8, movements: 12 },
    ]);

    expect(csv).toContain("rank,station,reliability_score,movements");
    expect(csv).toContain("1,São Bento (Porto),10,85");
    expect(csv).toContain('2,"Station, Inc.",8,12');
  });
});
