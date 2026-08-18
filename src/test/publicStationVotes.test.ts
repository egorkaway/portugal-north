import { describe, expect, it } from "vitest";
import {
  filterCommunityVotesForPublicStations,
  isVotableHotelKey,
  isVotableStationName,
} from "../../server/lib/publicStationVotes.js";

describe("publicStationVotes", () => {
  it("rejects destination airport station names", () => {
    expect(isVotableStationName("Aveiro")).toBe(true);
    expect(isVotableStationName("London Stansted Airport (STN)")).toBe(false);
    expect(isVotableStationName("London City Airport (LCY)")).toBe(false);
  });

  it("rejects hotel keys for destination airports", () => {
    expect(isVotableHotelKey("Aveiro::Hotel das Salinas")).toBe(true);
    expect(isVotableHotelKey("London City Airport (LCY)::Example Hotel")).toBe(false);
  });

  it("filters destination airport totals from community vote blob", () => {
    const filtered = filterCommunityVotesForPublicStations({
      ratings: {
        Aveiro: { up: 2, down: 0 },
        "London Stansted Airport (STN)": { up: 0, down: 3 },
      },
      hotelRatings: {
        "London City Airport (LCY)::Hotel": { up: 0, down: 1 },
      },
      imageRatings: {},
      hotelClosedReports: {},
    });

    expect(filtered.ratings).toEqual({
      Aveiro: { up: 2, down: 0 },
    });
    expect(filtered.hotelRatings).toEqual({});
  });
});
