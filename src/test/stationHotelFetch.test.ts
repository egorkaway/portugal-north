import { describe, expect, it } from "vitest";
import { townQueryForStation } from "../../scripts/lib/stationHotelFetch.mjs";

describe("stationHotelFetch", () => {
  it("builds town geocode query from station name", () => {
    expect(townQueryForStation("Campanhã (Metro)")).toBe("Campanhã, Portugal");
    expect(townQueryForStation("Mafra")).toBe("Mafra, Portugal");
    expect(townQueryForStation("Vigo-Urzáiz", "es")).toBe("Vigo, Spain");
    expect(townQueryForStation("Barcelona-Sants", "es")).toBe("Barcelona, Spain");
  });
});
