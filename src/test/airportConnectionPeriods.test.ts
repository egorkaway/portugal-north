import { describe, expect, it } from "vitest";
import {
  PERIOD_ANCHORS,
  lisbonDateString,
  openDateForYear,
  periodContaining,
  periodOpenDates,
} from "../../scripts/lib/airportConnectionPeriods.mjs";

describe("airportConnectionPeriods", () => {
  it("has nine anchors", () => {
    expect(PERIOD_ANCHORS).toHaveLength(9);
    expect(periodOpenDates(2026)).toEqual([
      "2026-01-01",
      "2026-02-07",
      "2026-03-16",
      "2026-04-22",
      "2026-05-29",
      "2026-07-05",
      "2026-08-11",
      "2026-09-17",
      "2026-10-24",
    ]);
  });

  it("resolves periods around mid-year boundaries", () => {
    expect(periodContaining("2026-07-05")).toEqual({
      id: "2026-07-05",
      start: "2026-07-05",
      endExclusive: "2026-08-11",
    });
    expect(periodContaining("2026-08-10")).toEqual({
      id: "2026-07-05",
      start: "2026-07-05",
      endExclusive: "2026-08-11",
    });
    expect(periodContaining("2026-08-11")).toEqual({
      id: "2026-08-11",
      start: "2026-08-11",
      endExclusive: "2026-09-17",
    });
  });

  it("rolls from late October into next January", () => {
    expect(periodContaining("2026-10-24")).toEqual({
      id: "2026-10-24",
      start: "2026-10-24",
      endExclusive: "2027-01-01",
    });
    expect(periodContaining("2026-12-31")).toEqual({
      id: "2026-10-24",
      start: "2026-10-24",
      endExclusive: "2027-01-01",
    });
    expect(periodContaining("2027-01-01")).toEqual({
      id: "2027-01-01",
      start: "2027-01-01",
      endExclusive: "2027-02-07",
    });
  });

  it("repeats the same month-days next year", () => {
    expect(openDateForYear(2027, PERIOD_ANCHORS[6])).toBe("2027-08-11");
    expect(periodContaining("2027-08-11").id).toBe("2027-08-11");
  });

  it("formats Lisbon calendar dates as YYYY-MM-DD", () => {
    expect(lisbonDateString("2026-08-11")).toBe("2026-08-11");
  });
});
