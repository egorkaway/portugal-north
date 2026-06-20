import { describe, expect, it } from "vitest";
import {
  isWithinNextHour,
  minutesUntilLisbonTime,
  parseTrainsInNextHour,
  parseTimeToMinutes,
} from "@/lib/cpDeparturesParse";
import {
  beginDepartureStatsRun,
  createEmptyDepartureStatsStore,
  mergeStationSnapshot,
  recordStationSampleFailure,
} from "../../server/lib/departureStats";

describe("parseTrainsInNextHour", () => {
  const now = new Date("2026-06-20T14:30:00.000Z");
  const timetableDate = "2026-06-20";

  it("counts departures, arrivals, and delay minutes within the next hour", () => {
    const snapshot = parseTrainsInNextHour(
      {
        stationStops: [
          {
            trainNumber: 1,
            departureTime: "16:00",
            trainOrigin: { code: "a", designation: "A" },
            trainDestination: { code: "b", designation: "B" },
            trainService: { code: "U", designation: "Urbano" },
            delay: 4,
          },
          {
            trainNumber: 2,
            arrivalTime: "16:15",
            trainOrigin: { code: "c", designation: "C" },
            trainDestination: { code: "a", designation: "A" },
            trainService: { code: "R", designation: "Regional" },
            delay: 6,
          },
          {
            trainNumber: 3,
            departureTime: "18:30",
            trainOrigin: { code: "a", designation: "A" },
            trainDestination: { code: "d", designation: "D" },
            trainService: { code: "IC", designation: "Intercidades" },
          },
          {
            trainNumber: 4,
            arrivalTime: "14:00",
            trainOrigin: { code: "e", designation: "E" },
            trainDestination: { code: "a", designation: "A" },
            trainService: { code: "U", designation: "Urbano" },
          },
        ],
      },
      now,
      timetableDate,
    );

    expect(snapshot.byTrainType.Urbano).toEqual({
      departures: 1,
      arrivals: 0,
      delayMinutes: 4,
    });
    expect(snapshot.byTrainType.Regional).toEqual({
      departures: 0,
      arrivals: 1,
      delayMinutes: 6,
    });
    expect(snapshot.byTrainType.Intercidades).toBeUndefined();
    expect(snapshot.totals).toEqual({
      departures: 1,
      arrivals: 1,
      delayMinutes: 10,
    });
  });
});

describe("minutesUntilLisbonTime", () => {
  const now = new Date("2026-06-20T14:30:00.000Z");

  it("returns null for times already passed today", () => {
    expect(minutesUntilLisbonTime("14:00", now, "2026-06-20")).toBeNull();
  });

  it("treats times within 60 minutes as upcoming", () => {
    expect(minutesUntilLisbonTime("16:15", now, "2026-06-20")).toBe(45);
    expect(isWithinNextHour("16:15", now, "2026-06-20")).toBe(true);
    expect(isWithinNextHour("17:31", now, "2026-06-20")).toBe(false);
  });
});

describe("departure stats store", () => {
  it("accumulates counts across runs", () => {
    const store = createEmptyDepartureStatsStore();
    beginDepartureStatsRun(store);

    mergeStationSnapshot(store, "Aveiro", "94-38000", {
      observedAt: "2026-06-20T10:00:00.000Z",
      byTrainType: {
        Regional: { departures: 2, arrivals: 1, delayMinutes: 5 },
      },
      totals: { departures: 2, arrivals: 1, delayMinutes: 5 },
    });

    beginDepartureStatsRun(store);
    mergeStationSnapshot(store, "Aveiro", "94-38000", {
      observedAt: "2026-06-20T11:00:00.000Z",
      byTrainType: {
        Regional: { departures: 1, arrivals: 0, delayMinutes: 3 },
        Urbano: { departures: 0, arrivals: 2, delayMinutes: 0 },
      },
      totals: { departures: 1, arrivals: 2, delayMinutes: 3 },
    });

    expect(store.runCount).toBe(2);
    expect(store.stations.Aveiro.byTrainType.Regional).toEqual({
      departuresNextHour: 3,
      arrivalsNextHour: 1,
      delayMinutes: 8,
    });
    expect(store.stations.Aveiro.byTrainType.Urbano).toEqual({
      departuresNextHour: 0,
      arrivalsNextHour: 2,
      delayMinutes: 0,
    });
    expect(store.stations.Aveiro.totals).toEqual({
      departuresNextHour: 3,
      arrivalsNextHour: 3,
      delayMinutes: 8,
    });
    expect(store.stations.Aveiro.successfulSamples).toBe(2);
  });

  it("records failed samples separately", () => {
    const store = createEmptyDepartureStatsStore();
    recordStationSampleFailure(store, "Braga", "94-29157", "cp_api_http_502");
    expect(store.stations.Braga.failedSamples).toBe(1);
    expect(store.stations.Braga.lastError).toBe("cp_api_http_502");
  });
});

describe("parseTimeToMinutes", () => {
  it("parses HH:MM", () => {
    expect(parseTimeToMinutes("16:45")).toBe(16 * 60 + 45);
  });
});
