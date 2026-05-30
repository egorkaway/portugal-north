import { describe, expect, it } from "vitest";
import {
  INITIAL_DEPARTURES_LIMIT,
  MAX_DEPARTURES_LIMIT,
  canLoadMoreDepartures,
  clampDeparturesLimit,
  nextDeparturesLimit,
} from "@/lib/departureLimits";

describe("departureLimits", () => {
  it("clamps limits to 1–10", () => {
    expect(clampDeparturesLimit(0)).toBe(1);
    expect(clampDeparturesLimit(3)).toBe(3);
    expect(clampDeparturesLimit(99)).toBe(MAX_DEPARTURES_LIMIT);
  });

  it("steps load-more by 3 up to the max", () => {
    expect(INITIAL_DEPARTURES_LIMIT).toBe(3);
    expect(nextDeparturesLimit(3)).toBe(6);
    expect(nextDeparturesLimit(9)).toBe(10);
    expect(nextDeparturesLimit(10)).toBe(10);
  });

  it("detects when more departures may exist", () => {
    expect(canLoadMoreDepartures(3, 3)).toBe(true);
    expect(canLoadMoreDepartures(3, 2)).toBe(false);
    expect(canLoadMoreDepartures(10, 10)).toBe(false);
  });
});
