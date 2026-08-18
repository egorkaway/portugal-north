import { describe, expect, it } from "vitest";
import { catalogStationForSpainStopId, normalizeSpainStopId } from "@/data/spainAdifStopIds";
import {
  delaySecondsToMinutes,
  mergeSpainTripUpdateFeeds,
  parseGtfsRtTripUpdates,
  parseSpainTrainIdentity,
} from "@/lib/spainTripUpdates";
import { snapshotsFromSpainObservations } from "../../server/lib/spainReliabilityCollect";

const cercaniasFeed = {
  entity: [
    {
      id: "TUUPDATE_3028M23560C1",
      tripUpdate: {
        trip: { tripId: "3028M23560C1", scheduleRelationship: "SCHEDULED" },
        stopTimeUpdate: [{ arrival: { delay: 180, time: "1787070329" }, stopId: "98003" }],
        delay: 180,
      },
    },
    {
      id: "TUUPDATE_CANCELED",
      tripUpdate: {
        trip: { tripId: "3028M99999C1", scheduleRelationship: "CANCELED" },
        stopTimeUpdate: [{ arrival: { delay: 0 }, stopId: "98003" }],
        delay: 0,
      },
    },
  ],
};

const longDistanceFeed = {
  entity: [
    {
      id: "TUUPDATE_0319222026-08-17",
      tripUpdate: {
        trip: { tripId: "0319222026-08-17", scheduleRelationship: "SCHEDULED" },
        stopTimeUpdate: [{ arrival: { delay: 240, time: "1787068380" }, stopId: "71801" }],
        delay: 240,
      },
    },
    {
      id: "TUUPDATE_EARLY",
      tripUpdate: {
        trip: { tripId: "0415112026-08-17", scheduleRelationship: "SCHEDULED" },
        stopTimeUpdate: [{ arrival: { delay: -120 }, stopId: "99999" }],
        delay: -120,
      },
    },
  ],
};

describe("spainTripUpdates", () => {
  it("parses Cercanías delay seconds into minutes and skips canceled trips", () => {
    const observations = parseGtfsRtTripUpdates(cercaniasFeed, "cercanias");
    expect(observations).toHaveLength(1);
    expect(observations[0]).toMatchObject({
      kind: "cercanias",
      trainNumber: "23560",
      serviceType: "Cercanías C1",
      line: "C1",
      stopId: "98003",
      station: "Madrid-Chamartín",
      delaySeconds: 180,
      delayMinutes: 3,
    });
  });

  it("parses long-distance trip ids and maps Barcelona-Sants", () => {
    const observations = parseGtfsRtTripUpdates(longDistanceFeed, "longDistance");
    expect(observations[0]).toMatchObject({
      kind: "longDistance",
      trainNumber: "031922",
      serviceType: "Long distance",
      station: "Barcelona-Sants",
      delayMinutes: 4,
    });
    expect(observations[1]).toMatchObject({
      station: null,
      delayMinutes: 0,
    });
  });

  it("merges both feeds without dropping unmatched stops", () => {
    const merged = mergeSpainTripUpdateFeeds({
      cercanias: cercaniasFeed,
      longDistance: longDistanceFeed,
    });
    expect(merged.map((row) => row.kind).sort()).toEqual([
      "cercanias",
      "longDistance",
      "longDistance",
    ]);
  });
});

describe("spain train identity", () => {
  it("reads Cercanías line suffixes and long-distance date suffixes", () => {
    expect(parseSpainTrainIdentity("3028M23560C1", "cercanias")).toEqual({
      trainNumber: "23560",
      line: "C1",
      serviceType: "Cercanías C1",
    });
    expect(parseSpainTrainIdentity("1502012026-08-17", "longDistance")).toEqual({
      trainNumber: "150201",
      line: null,
      serviceType: "Long distance",
    });
  });

  it("clamps early arrivals to zero delay minutes", () => {
    expect(delaySecondsToMinutes(-180)).toBe(0);
    expect(delaySecondsToMinutes(90)).toBe(2);
  });
});

describe("spain Adif stop map", () => {
  it("normalizes leading zeros and maps catalog stations", () => {
    expect(normalizeSpainStopId("8223")).toBe("08223");
    expect(catalogStationForSpainStopId("08223")).toBe("Vigo-Urzáiz");
    expect(catalogStationForSpainStopId("17000")).toBe("Madrid-Chamartín");
  });
});

describe("spain reliability snapshots", () => {
  it("counts catalog-station arrivals only", () => {
    const snapshots = snapshotsFromSpainObservations(
      mergeSpainTripUpdateFeeds({
        cercanias: cercaniasFeed,
        longDistance: longDistanceFeed,
      }),
      "2026-08-18T16:00:00.000Z",
    );
    expect([...snapshots.keys()].sort()).toEqual(["Barcelona-Sants", "Madrid-Chamartín"]);
    expect(snapshots.get("Madrid-Chamartín")?.totals).toEqual({
      departures: 0,
      arrivals: 1,
      delayMinutes: 3,
    });
  });
});
