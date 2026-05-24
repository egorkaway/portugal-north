import { describe, expect, it } from "vitest";
import {
  getTripHistorianStationUrl,
  tripHistorianStationIds,
} from "@/data/tripHistorianStationIds";

describe("getTripHistorianStationUrl", () => {
  it("builds /stations/:id URLs for mapped stations", () => {
    for (const [name, id] of Object.entries(tripHistorianStationIds)) {
      expect(getTripHistorianStationUrl(name)).toBe(
        `https://triphistorian.com/stations/${id}`,
      );
    }
  });

  it("returns undefined when no mapping exists", () => {
    expect(getTripHistorianStationUrl("Definitely Not A Station")).toBeUndefined();
  });
});
