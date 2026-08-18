import { describe, expect, it } from "vitest";
import {
  buildTrainReliabilitySpotlightManifest,
  pickMajorStationsForTrain,
  pickMostDelayedTrain,
  pickMostReliableTrain,
} from "../../server/lib/trainReliabilitySpotlight.js";
import type { TrainDelayLogEntry } from "../../server/lib/trainDelayLog.js";

function entry(
  overrides: Partial<TrainDelayLogEntry> & Pick<TrainDelayLogEntry, "trainNumber" | "delayMinutes">,
): TrainDelayLogEntry {
  return {
    recordedAt: "2026-08-18T10:00:00.000Z",
    station: "Aveiro",
    cpCode: "94-38000",
    serviceType: "Regional",
    arrivalTime: "11:00",
    departureTime: "11:01",
    movement: "both",
    ...overrides,
  };
}

describe("trainReliabilitySpotlight", () => {
  it("picks the train with the highest average delay", () => {
    const entries = [
      ...Array.from({ length: 6 }, () => entry({ trainNumber: "100", delayMinutes: 10 })),
      ...Array.from({ length: 6 }, () => entry({ trainNumber: "200", delayMinutes: 2 })),
    ];

    expect(pickMostDelayedTrain(entries)).toMatchObject({
      trainNumber: "100",
      avgDelayMinutes: 10,
      observations: 6,
    });
  });

  it("ignores trains below the minimum observation threshold", () => {
    const entries = [
      entry({ trainNumber: "999", delayMinutes: 60 }),
      ...Array.from({ length: 5 }, () => entry({ trainNumber: "100", delayMinutes: 1 })),
    ];

    expect(pickMostDelayedTrain(entries)?.trainNumber).toBe("100");
  });

  it("uses a stable reliable pick once the leader has enough samples", () => {
    const entries = [
      ...Array.from({ length: 20 }, () => entry({ trainNumber: "100", delayMinutes: 0 })),
      ...Array.from({ length: 10 }, () => entry({ trainNumber: "200", delayMinutes: 0 })),
    ];

    expect(pickMostReliableTrain(entries, 42)).toMatchObject({
      trainNumber: "100",
      selectionMode: "stable",
      poolSize: 1,
    });
  });

  it("rotates the reliable pick across sample runs while data is thin", () => {
    const entries = [
      ...Array.from({ length: 8 }, () => entry({ trainNumber: "100", delayMinutes: 0 })),
      ...Array.from({ length: 8 }, () => entry({ trainNumber: "200", delayMinutes: 0 })),
      ...Array.from({ length: 8 }, () => entry({ trainNumber: "300", delayMinutes: 0 })),
    ];

    const run7 = pickMostReliableTrain(entries, 7, { poolSize: 3 });
    const run8 = pickMostReliableTrain(entries, 8, { poolSize: 3 });

    expect(run7?.selectionMode).toBe("rotating");
    expect(run8?.selectionMode).toBe("rotating");
    expect(run7?.trainNumber).not.toBe(run8?.trainNumber);
  });

  it("builds a manifest with both spotlight picks", () => {
    const manifest = buildTrainReliabilitySpotlightManifest({
      runCount: 12,
      entries: [
        ...Array.from({ length: 6 }, () => entry({ trainNumber: "900", delayMinutes: 15 })),
        ...Array.from({ length: 6 }, () => entry({ trainNumber: "100", delayMinutes: 0 })),
      ],
    });

    expect(manifest.mostDelayed?.trainNumber).toBe("900");
    expect(manifest.mostReliable?.trainNumber).toBe("100");
    expect(manifest.runCount).toBe(12);
  });

  it("lists major stations where the train was sampled, busiest first", () => {
    const entries = [
      entry({ trainNumber: "900", station: "Pinhão", delayMinutes: 15 }),
      entry({ trainNumber: "900", station: "Porto-Campanhã", delayMinutes: 15 }),
      entry({ trainNumber: "900", station: "Aveiro", delayMinutes: 15 }),
      entry({ trainNumber: "900", station: "Coimbra-B", delayMinutes: 15 }),
      entry({ trainNumber: "900", station: "Pombal", delayMinutes: 15 }),
      entry({ trainNumber: "900", station: "Braga", delayMinutes: 15 }),
    ];
    const traffic = {
      "Porto-Campanhã": 500,
      "Coimbra-B": 400,
      Aveiro: 300,
      Braga: 200,
      Pombal: 100,
      Pinhão: 10,
    };

    expect(pickMostDelayedTrain(entries, traffic)?.majorStations).toEqual([
      "Porto-Campanhã",
      "Coimbra-B",
      "Aveiro",
      "Braga",
    ]);
    expect(
      pickMajorStationsForTrain(
        new Set(["Pinhão", "Porto-Campanhã", "Aveiro"]),
        traffic,
        2,
      ),
    ).toEqual(["Porto-Campanhã", "Aveiro"]);
  });
});
