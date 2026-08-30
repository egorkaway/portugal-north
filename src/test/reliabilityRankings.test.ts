import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  buildReliabilityRankingRows,
  buildSpainReliabilityRankings,
  filterScoresByMinMovements,
  formatReliabilityScore,
  getBottomReliabilityStations,
  getTopReliabilityStations,
  reliabilityRankingsToCsv,
  PORTUGAL_RELIABILITY_RANKING_LIMIT,
  SPAIN_RELIABILITY_MIN_MOVEMENTS,
  SPAIN_RELIABILITY_RANKING_LIMIT,
} from "@/lib/reliabilityScore";

describe("reliability rankings", () => {
  it("formats scores with one decimal when needed", () => {
    expect(formatReliabilityScore(9)).toBe("9");
    expect(formatReliabilityScore(10)).toBe("10");
    expect(formatReliabilityScore(9.1)).toBe("9.1");
    expect(formatReliabilityScore(9.04)).toBe("9");
  });

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

  it("limits Portugal ranking lists to 7", () => {
    expect(PORTUGAL_RELIABILITY_RANKING_LIMIT).toBe(7);
    const top = getTopReliabilityStations(scores, {}, PORTUGAL_RELIABILITY_RANKING_LIMIT);
    const bottom = getBottomReliabilityStations(scores, {}, PORTUGAL_RELIABILITY_RANKING_LIMIT);
    expect(top).toHaveLength(7);
    expect(bottom).toHaveLength(7);
    expect(top.map((row) => row.name)).toEqual([
      "Alpha",
      "Lima",
      "Bravo",
      "Charlie",
      "Delta",
      "Echo",
      "Foxtrot",
    ]);
    expect(bottom.map((row) => row.name)).toEqual([
      "Juliet",
      "Kilo",
      "India",
      "Hotel",
      "Golf",
      "Foxtrot",
      "Echo",
    ]);
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

  it("drops stations below the Spain observation gate", () => {
    const filtered = filterScoresByMinMovements(
      { Quiet: 10, Busy: 8, Thin: 9 },
      { Quiet: 12, Busy: 40, Thin: 2 },
      SPAIN_RELIABILITY_MIN_MOVEMENTS,
    );
    expect(filtered).toEqual({ Quiet: 10, Busy: 8 });
  });

  it("builds a separate Spain top and bottom 7 from gated scores", () => {
    const scores: Record<string, number> = {
      "A Coruña": 10,
      Pontevedra: 9,
      Ourense: 8,
      Vigo: 7,
      Santiago: 6,
      "Barcelona-Sants": 5,
      "Madrid-Chamartín": 4,
      "Zaragoza Delicias": 3,
      "Sevilla-Santa Justa": 2,
      "València-Estació del Nord": 1,
      "One sample halt": 10,
    };
    const movements = {
      "A Coruña": 26,
      Pontevedra: 23,
      Ourense: 41,
      Vigo: 30,
      Santiago: 18,
      "Barcelona-Sants": 224,
      "Madrid-Chamartín": 180,
      "Zaragoza Delicias": 56,
      "Sevilla-Santa Justa": 90,
      "València-Estació del Nord": 35,
      "One sample halt": 1,
    };

    const { top, bottom } = buildSpainReliabilityRankings(scores, movements);

    expect(SPAIN_RELIABILITY_RANKING_LIMIT).toBe(7);
    expect(top).toHaveLength(7);
    expect(bottom).toHaveLength(7);
    expect(top.map((row) => row.name)).toEqual([
      "A Coruña",
      "Pontevedra",
      "Ourense",
      "Vigo",
      "Santiago",
      "Barcelona-Sants",
      "Madrid-Chamartín",
    ]);
    expect(bottom.map((row) => row.name)).toEqual([
      "València-Estació del Nord",
      "Sevilla-Santa Justa",
      "Zaragoza Delicias",
      "Madrid-Chamartín",
      "Barcelona-Sants",
      "Santiago",
      "Vigo",
    ]);
    expect(top.some((row) => row.name === "One sample halt")).toBe(false);
    expect(bottom.some((row) => row.name === "One sample halt")).toBe(false);
  });

  it("keeps published Spain scores separate from Portugal and above the observation gate", () => {
    const portugal = JSON.parse(
      readFileSync(join(process.cwd(), "public/data/reliability-scores.json"), "utf8"),
    ) as { scores: Record<string, number> };
    const spain = JSON.parse(
      readFileSync(join(process.cwd(), "public/data/spain-reliability-scores.json"), "utf8"),
    ) as { scores: Record<string, number>; movements: Record<string, number> };

    const overlap = Object.keys(spain.scores).filter((name) => name in portugal.scores);
    expect(overlap).toEqual([]);
    expect(Object.keys(spain.scores).length).toBeGreaterThanOrEqual(6);
    expect(Object.values(spain.movements).every((count) => count >= SPAIN_RELIABILITY_MIN_MOVEMENTS)).toBe(
      true,
    );

    const { top, bottom } = buildSpainReliabilityRankings(spain.scores, spain.movements);
    expect(top).toHaveLength(7);
    expect(bottom).toHaveLength(7);
  });

  it("limits published Portugal rankings to 7", () => {
    const portugal = JSON.parse(
      readFileSync(join(process.cwd(), "public/data/reliability-scores.json"), "utf8"),
    ) as { scores: Record<string, number>; movements?: Record<string, number> };

    const top = getTopReliabilityStations(
      portugal.scores,
      portugal.movements ?? {},
      PORTUGAL_RELIABILITY_RANKING_LIMIT,
    );
    const bottom = getBottomReliabilityStations(
      portugal.scores,
      portugal.movements ?? {},
      PORTUGAL_RELIABILITY_RANKING_LIMIT,
    );
    expect(top).toHaveLength(7);
    expect(bottom).toHaveLength(7);
  });
});
