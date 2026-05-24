import { describe, expect, it } from "vitest";
import { applyClosedReportDeltaInMemory, applyDeltaInMemory } from "../../api/lib/voteLogic";

describe("applyDeltaInMemory", () => {
  it("increments and decrements vote counts", () => {
    let ratings = applyDeltaInMemory({}, "Aveiro", null, "up");
    expect(ratings.Aveiro).toEqual({ up: 1, down: 0 });

    ratings = applyDeltaInMemory(ratings, "Aveiro", "up", "down");
    expect(ratings.Aveiro).toEqual({ up: 0, down: 1 });

    ratings = applyDeltaInMemory(ratings, "Aveiro", "down", null);
    expect(ratings.Aveiro).toBeUndefined();
  });
});

describe("applyClosedReportDeltaInMemory", () => {
  it("increments and decrements closed report counts", () => {
    const key = "Aveiro::Hotel Example";
    let reports = applyClosedReportDeltaInMemory({}, key, false, true);
    expect(reports[key]).toEqual({ reports: 1 });

    reports = applyClosedReportDeltaInMemory(reports, key, true, false);
    expect(reports[key]).toBeUndefined();
  });
});
