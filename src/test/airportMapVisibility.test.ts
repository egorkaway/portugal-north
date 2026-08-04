import { describe, expect, it } from "vitest";
import {
  emptyAirportMapVisibilityManifest,
  hideNeverRecordedAirports,
  isAirportHiddenFromMap,
  isWithinNeverSeenRecheckWindow,
  recordAirportConnectionsEmpty,
  recordAirportConnectionsOk,
  shouldSampleAirportHub,
} from "../../server/lib/airportMapVisibility";

describe("airportMapVisibility", () => {
  it("hides never-recorded hubs on the first empty period", () => {
    let manifest = emptyAirportMapVisibilityManifest(3);
    manifest = recordAirportConnectionsEmpty(manifest, "TEV", "2026-01-01");
    expect(isAirportHiddenFromMap(manifest, "TEV")).toBe(true);
    expect(manifest.airports.TEV?.consecutiveEmptyPeriods).toBe(1);
  });

  it("hides a previously active hub after the empty-period streak", () => {
    let manifest = emptyAirportMapVisibilityManifest(3);
    manifest = recordAirportConnectionsOk(manifest, "RGS", "2025-10-24");
    expect(isAirportHiddenFromMap(manifest, "RGS")).toBe(false);
    manifest = recordAirportConnectionsEmpty(manifest, "RGS", "2026-01-01");
    expect(isAirportHiddenFromMap(manifest, "RGS")).toBe(false);
    manifest = recordAirportConnectionsEmpty(manifest, "RGS", "2026-02-07");
    expect(isAirportHiddenFromMap(manifest, "RGS")).toBe(false);
    manifest = recordAirportConnectionsEmpty(manifest, "RGS", "2026-03-16");
    expect(isAirportHiddenFromMap(manifest, "RGS")).toBe(true);
    expect(manifest.airports.RGS?.consecutiveEmptyPeriods).toBe(3);
  });

  it("does not double-count the same period", () => {
    let manifest = emptyAirportMapVisibilityManifest(2);
    manifest = recordAirportConnectionsEmpty(manifest, "TEV", "2026-01-01");
    manifest = recordAirportConnectionsEmpty(manifest, "TEV", "2026-01-01");
    expect(manifest.airports.TEV?.consecutiveEmptyPeriods).toBe(1);
    expect(isAirportHiddenFromMap(manifest, "TEV")).toBe(true);
  });

  it("clears the streak and unhides after a successful bake", () => {
    let manifest = emptyAirportMapVisibilityManifest(2);
    manifest = recordAirportConnectionsEmpty(manifest, "ABC", "2026-01-01");
    expect(isAirportHiddenFromMap(manifest, "ABC")).toBe(true);
    manifest = recordAirportConnectionsOk(manifest, "ABC", "2026-03-16");
    expect(isAirportHiddenFromMap(manifest, "ABC")).toBe(false);
    expect(manifest.airports.ABC?.consecutiveEmptyPeriods).toBe(0);
  });

  it("backfills hide for never-recorded hubs", () => {
    let manifest = emptyAirportMapVisibilityManifest(3);
    manifest = {
      ...manifest,
      airports: {
        TEV: {
          consecutiveEmptyPeriods: 1,
          lastEmptyPeriodId: "2026-07-05",
          lastOkPeriodId: null,
          hiddenFromMap: false,
          updatedAt: "2026-07-24T00:00:00.000Z",
        },
        LIS: {
          consecutiveEmptyPeriods: 0,
          lastEmptyPeriodId: null,
          lastOkPeriodId: "2026-07-05",
          hiddenFromMap: false,
          updatedAt: "2026-07-24T00:00:00.000Z",
        },
      },
    };
    manifest = hideNeverRecordedAirports(manifest, new Date("2026-08-03T12:00:00.000Z"));
    expect(isAirportHiddenFromMap(manifest, "TEV")).toBe(true);
    expect(isAirportHiddenFromMap(manifest, "LIS")).toBe(false);
  });
});

describe("never-seen airport recheck window", () => {
  it("covers the first 14 Lisbon days of a period", () => {
    expect(isWithinNeverSeenRecheckWindow("2026-07-05", "2026-07-05")).toBe(true);
    expect(isWithinNeverSeenRecheckWindow("2026-07-05", "2026-07-18")).toBe(true);
    expect(isWithinNeverSeenRecheckWindow("2026-07-05", "2026-07-19")).toBe(false);
    expect(isWithinNeverSeenRecheckWindow("2026-07-05", "2026-07-04")).toBe(false);
  });

  it("samples never-seen hubs only inside the window unless forced", () => {
    const neverSeen = {
      consecutiveEmptyPeriods: 1,
      lastEmptyPeriodId: "2026-07-05",
      lastOkPeriodId: null,
      hiddenFromMap: true,
      updatedAt: "2026-07-24T00:00:00.000Z",
    };
    expect(
      shouldSampleAirportHub({
        visibilityEntry: neverSeen,
        periodStart: "2026-07-05",
        todayYmd: "2026-07-10",
      }),
    ).toBe(true);
    expect(
      shouldSampleAirportHub({
        visibilityEntry: neverSeen,
        periodStart: "2026-07-05",
        todayYmd: "2026-07-25",
      }),
    ).toBe(false);
    expect(
      shouldSampleAirportHub({
        visibilityEntry: neverSeen,
        force: true,
        periodStart: "2026-07-05",
        todayYmd: "2026-07-25",
      }),
    ).toBe(true);
  });

  it("always samples hubs that once recorded flights", () => {
    const active = {
      consecutiveEmptyPeriods: 1,
      lastEmptyPeriodId: "2026-07-05",
      lastOkPeriodId: "2026-05-29",
      hiddenFromMap: false,
      updatedAt: "2026-07-24T00:00:00.000Z",
    };
    expect(
      shouldSampleAirportHub({
        visibilityEntry: active,
        periodStart: "2026-07-05",
        todayYmd: "2026-07-25",
      }),
    ).toBe(true);
  });
});
