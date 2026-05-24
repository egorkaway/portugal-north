import { describe, expect, it } from "vitest";
import { getTopDownvoted, getTopUpvoted } from "@/lib/rankStations";

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
});
