import { describe, expect, it } from "vitest";
import {
  adjustedStationDelayRate,
  computeReliabilityScores,
  scaleReliabilityScore,
  stationDelayRate,
} from "../../server/lib/reliabilityScore";
import { createEmptyDepartureStatsStore, mergeStationSnapshot } from "../../server/lib/departureStats";

describe("stationDelayRate", () => {
  it("returns average delay minutes per movement", () => {
    expect(stationDelayRate(10, 4, 1)).toBe(2);
    expect(stationDelayRate(0, 0, 0)).toBeNull();
  });
});

describe("scaleReliabilityScore", () => {
  it("maps the best rate to 10 and the worst to 1", () => {
    expect(scaleReliabilityScore(0, 0, 10)).toBe(10);
    expect(scaleReliabilityScore(10, 0, 10)).toBe(1);
    expect(scaleReliabilityScore(5, 0, 10)).toBe(6);
  });

  it("returns 10 when all rates are equal", () => {
    expect(scaleReliabilityScore(3, 3, 3)).toBe(10);
  });
});

describe("adjustedStationDelayRate", () => {
  it("scores busier stations more leniently for the same raw delay rate", () => {
    const referenceMovements = 40;
    const busy = adjustedStationDelayRate(200, 100, 0, referenceMovements);
    const quiet = adjustedStationDelayRate(20, 10, 0, referenceMovements);
    expect(busy).toBeLessThan(quiet!);
  });
});

describe("computeReliabilityScores", () => {
  it("ranks stations by cumulative delay per movement", () => {
    const store = createEmptyDepartureStatsStore();

    mergeStationSnapshot(store, "On time", "94-1", {
      observedAt: "2026-06-20T10:00:00.000Z",
      byTrainType: { Urbano: { departures: 10, arrivals: 0, delayMinutes: 0 } },
      totals: { departures: 10, arrivals: 0, delayMinutes: 0 },
    });
    mergeStationSnapshot(store, "Sometimes late", "94-2", {
      observedAt: "2026-06-20T10:00:00.000Z",
      byTrainType: { Regional: { departures: 10, arrivals: 0, delayMinutes: 50 } },
      totals: { departures: 10, arrivals: 0, delayMinutes: 50 },
    });
    mergeStationSnapshot(store, "Often late", "94-3", {
      observedAt: "2026-06-20T10:00:00.000Z",
      byTrainType: { Intercidades: { departures: 10, arrivals: 0, delayMinutes: 100 } },
      totals: { departures: 10, arrivals: 0, delayMinutes: 100 },
    });

    expect(computeReliabilityScores(store)).toEqual({
      "On time": 10,
      "Sometimes late": 6,
      "Often late": 1,
    });
  });

  it("ignores stations without successful samples or movements", () => {
    const store = createEmptyDepartureStatsStore();
    store.stations.Empty = {
      cpCode: "94-9",
      byTrainType: {},
      totals: { departuresNextHour: 0, arrivalsNextHour: 0, delayMinutes: 0 },
      successfulSamples: 0,
      failedSamples: 1,
      lastSampleAt: null,
      lastError: "cp_api_http_502",
    };

    expect(computeReliabilityScores(store)).toEqual({});
  });

  it("ranks a busy station above a quiet one with the same raw delay rate", () => {
    const store = createEmptyDepartureStatsStore();

    mergeStationSnapshot(store, "Busy hub", "94-4", {
      observedAt: "2026-06-20T10:00:00.000Z",
      byTrainType: { Urbano: { departures: 100, arrivals: 0, delayMinutes: 200 } },
      totals: { departures: 100, arrivals: 0, delayMinutes: 200 },
    });
    mergeStationSnapshot(store, "Quiet halt", "94-5", {
      observedAt: "2026-06-20T10:00:00.000Z",
      byTrainType: { Regional: { departures: 10, arrivals: 0, delayMinutes: 20 } },
      totals: { departures: 10, arrivals: 0, delayMinutes: 20 },
    });

    const scores = computeReliabilityScores(store);
    expect(scores["Busy hub"]).toBeGreaterThan(scores["Quiet halt"]!);
  });

  it("winsorizes scale max so one outlier does not hide other poor performers", () => {
    const store = createEmptyDepartureStatsStore();

    mergeStationSnapshot(store, "Outlier", "94-0", {
      observedAt: "2026-06-20T10:00:00.000Z",
      byTrainType: { Regional: { departures: 10, arrivals: 0, delayMinutes: 1000 } },
      totals: { departures: 10, arrivals: 0, delayMinutes: 1000 },
    });
    for (let i = 1; i <= 8; i++) {
      mergeStationSnapshot(store, `Poor ${i}`, `94-${i}`, {
        observedAt: "2026-06-20T10:00:00.000Z",
        byTrainType: {
          Regional: { departures: 10, arrivals: 0, delayMinutes: 20 + i * 5 },
        },
        totals: { departures: 10, arrivals: 0, delayMinutes: 20 + i * 5 },
      });
    }
    mergeStationSnapshot(store, "Good", "94-9", {
      observedAt: "2026-06-20T10:00:00.000Z",
      byTrainType: { Regional: { departures: 10, arrivals: 0, delayMinutes: 0 } },
      totals: { departures: 10, arrivals: 0, delayMinutes: 0 },
    });

    const scores = computeReliabilityScores(store);
    expect(Object.values(scores).filter((score) => score < 5).length).toBeGreaterThanOrEqual(5);
    expect(scores["Outlier"]).toBeLessThan(5);
    expect(scores["Poor 8"]).toBeLessThan(5);
  });
});
