import { describe, expect, it } from "vitest";
import {
  getBottomReliabilityStations,
  getTopReliabilityStations,
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
});
