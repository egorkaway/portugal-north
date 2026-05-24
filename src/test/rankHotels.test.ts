import { describe, expect, it } from "vitest";
import { getTopDownvotedHotels, getTopUpvotedHotels, parseHotelVoteKey } from "@/lib/rankHotels";

describe("rankHotels", () => {
  it("parses hotel vote keys", () => {
    expect(parseHotelVoteKey("Aveiro::Hotel das Salinas")).toEqual({
      stationName: "Aveiro",
      hotelName: "Hotel das Salinas",
    });
  });

  it("ranks hotels nationally by upvotes", () => {
    const ranked = getTopUpvotedHotels({
      "Aveiro::Hotel A": { up: 2, down: 0 },
      "Porto-Campanhã::Hotel B": { up: 5, down: 1 },
      "Faro::Hotel C": { up: 5, down: 0 },
    });

    expect(ranked.map((h) => h.hotelName)).toEqual(["Hotel C", "Hotel B", "Hotel A"]);
    expect(ranked[0].stationName).toBe("Faro");
  });

  it("ranks hotels nationally by downvotes", () => {
    const ranked = getTopDownvotedHotels({
      "Aveiro::Hotel A": { up: 0, down: 4 },
      "Porto-Campanhã::Hotel B": { up: 1, down: 2 },
    });

    expect(ranked.map((h) => h.hotelName)).toEqual(["Hotel A", "Hotel B"]);
  });
});
