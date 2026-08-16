import { describe, expect, it } from "vitest";
import {
  extractTrainDelayObservations,
  parseUpcomingArrivals,
} from "@/lib/cpDeparturesParse";
import {
  appendTrainDelayLog,
  readTrainDelayLog,
  trainDelayEntriesFromObservations,
  writeTrainDelayLog,
} from "../../server/lib/trainDelayLog";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

describe("parseUpcomingArrivals", () => {
  it("returns next arrivals sorted by arrival time and flags terminations", () => {
    const result = parseUpcomingArrivals(
      {
        stationStops: [
          {
            trainNumber: 100,
            arrivalTime: "18:00",
            departureTime: "18:05",
            trainOrigin: { code: "a", designation: "Aveiro" },
            trainDestination: { code: "b", designation: "Braga" },
            trainService: { code: "R", designation: "Regional" },
          },
          {
            trainNumber: 200,
            arrivalTime: "17:30",
            trainOrigin: { code: "c", designation: "Coimbra" },
            trainDestination: { code: "d", designation: "Porto-Campanhã" },
            trainService: { code: "IC", designation: "Intercidades" },
            delay: 8,
          },
          {
            trainNumber: 300,
            arrivalTime: "17:10",
            departureTime: "17:12",
            trainOrigin: { code: "e", designation: "Espinho" },
            trainDestination: { code: "f", designation: "Guimarães" },
            trainService: { code: "U", designation: "Urbano" },
          },
          {
            trainNumber: 400,
            departureTime: "16:00",
            trainOrigin: { code: "g", designation: "Gaia" },
            trainDestination: { code: "h", designation: "Lisboa" },
            trainService: { code: "R", designation: "Regional" },
          },
        ],
      },
      3,
    );

    expect(result).toHaveLength(3);
    expect(result[0]?.trainNumber).toBe("300");
    expect(result[0]?.terminatesHere).toBe(false);
    expect(result[0]?.departureTime).toBe("17:12");
    expect(result[1]?.trainNumber).toBe("200");
    expect(result[1]?.terminatesHere).toBe(true);
    expect(result[1]?.origin).toBe("Coimbra");
    expect(result[1]?.delayMinutes).toBe(8);
    expect(result[2]?.trainNumber).toBe("100");
  });

  it("ignores departure-only stops", () => {
    const result = parseUpcomingArrivals({
      stationStops: [
        {
          trainNumber: 1,
          departureTime: "12:00",
          trainOrigin: { code: "a", designation: "A" },
          trainDestination: { code: "b", designation: "B" },
          trainService: { code: "U", designation: "Urbano" },
        },
      ],
    });
    expect(result).toHaveLength(0);
  });
});

describe("extractTrainDelayObservations", () => {
  it("samples trains with arrival in the next hour", () => {
    // 17:00 Lisbon summer = 16:00 UTC
    const now = new Date("2026-06-30T16:00:00.000Z");
    const observations = extractTrainDelayObservations(
      {
        stationStops: [
          {
            trainNumber: 542,
            arrivalTime: "17:20",
            departureTime: "17:22",
            delay: 4,
            trainOrigin: { code: "a", designation: "A" },
            trainDestination: { code: "b", designation: "B" },
            trainService: { code: "U", designation: "Urbano" },
          },
          {
            trainNumber: 100,
            arrivalTime: "19:00",
            trainOrigin: { code: "a", designation: "A" },
            trainDestination: { code: "b", designation: "B" },
            trainService: { code: "IC", designation: "Intercidades" },
          },
          {
            trainNumber: 200,
            arrivalTime: "17:45",
            trainOrigin: { code: "a", designation: "A" },
            trainDestination: { code: "c", designation: "C" },
            trainService: { code: "R", designation: "Regional" },
          },
        ],
      },
      now,
      "2026-06-30",
    );

    expect(observations).toHaveLength(2);
    expect(observations.map((o) => o.trainNumber).sort()).toEqual(["200", "542"]);
    const continuing = observations.find((o) => o.trainNumber === "542");
    expect(continuing?.hasDeparture).toBe(true);
    expect(continuing?.delayMinutes).toBe(4);
    const terminating = observations.find((o) => o.trainNumber === "200");
    expect(terminating?.hasDeparture).toBe(false);
  });
});

describe("trainDelayLog", () => {
  it("appends and reads NDJSON entries", () => {
    const dir = mkdtempSync(join(tmpdir(), "train-delay-"));
    const logPath = join(dir, "train-delay-log.ndjson");
    try {
      writeTrainDelayLog(logPath, []);
      const entries = trainDelayEntriesFromObservations({
        station: "Porto-Campanhã",
        cpCode: "94-20007",
        recordedAt: "2026-06-30T16:00:00.000Z",
        observations: [
          {
            trainNumber: "542",
            serviceType: "Urbano",
            delayMinutes: 3,
            arrivalTime: "17:20",
            departureTime: "17:22",
            hasArrival: true,
            hasDeparture: true,
          },
        ],
      });
      appendTrainDelayLog(logPath, entries);
      const read = readTrainDelayLog(logPath);
      expect(read).toHaveLength(1);
      expect(read[0]?.trainNumber).toBe("542");
      expect(read[0]?.movement).toBe("both");
      expect(read[0]?.station).toBe("Porto-Campanhã");
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
