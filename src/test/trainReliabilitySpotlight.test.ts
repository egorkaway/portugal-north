import { describe, expect, it } from "vitest";
import {
  clusterTrainSightings,
  buildTrainReliabilitySpotlightManifest,
  pickMajorStationsForTrain,
  pickMostDelayedTrain,
  pickMostReliableTrain,
  pickMostDelayedTrains,
  pickMostReliableTrains,
} from "../../server/lib/trainReliabilitySpotlight.js";
import { normalizeTrainReliabilitySpotlight } from "../lib/trainReliabilitySpotlight";
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

/** One station sample per timestamp (each gap is a separate sighting). */
function sightings(
  trainNumber: string,
  delayMinutes: number,
  recordedAts: string[],
  extras: Partial<TrainDelayLogEntry> = {},
): TrainDelayLogEntry[] {
  return recordedAts.map((recordedAt, index) =>
    entry({
      trainNumber,
      delayMinutes,
      recordedAt,
      station: extras.station ?? `Stop ${index + 1}`,
      ...extras,
    }),
  );
}

const THREE_DAYS = [
  "2026-08-16T10:00:00.000Z",
  "2026-08-17T10:00:00.000Z",
  "2026-08-18T10:00:00.000Z",
];

describe("trainReliabilitySpotlight", () => {
  const nowMs = Date.parse("2026-08-18T12:00:00.000Z");

  it("counts a multi-station burst as one sighting", () => {
    const clustered = clusterTrainSightings([
      { at: Date.parse("2026-08-16T14:16:57.000Z"), delayMinutes: 45, station: "Fátima" },
      { at: Date.parse("2026-08-16T14:18:30.000Z"), delayMinutes: 45, station: "Entroncamento" },
      { at: Date.parse("2026-08-16T14:18:45.000Z"), delayMinutes: 45, station: "Santarém" },
      { at: Date.parse("2026-08-16T14:19:02.000Z"), delayMinutes: 45, station: "Caxarias" },
      { at: Date.parse("2026-08-16T14:19:08.000Z"), delayMinutes: 46, station: "Pombal" },
    ]);

    expect(clustered).toHaveLength(1);
    expect(clustered[0]?.delayMinutes).toBeCloseTo(45.2, 5);
  });

  it("splits sightings when samples are hours apart", () => {
    expect(
      clusterTrainSightings([
        { at: Date.parse("2026-08-16T10:00:00.000Z"), delayMinutes: 10, station: "A" },
        { at: Date.parse("2026-08-16T13:00:00.000Z"), delayMinutes: 12, station: "B" },
      ]),
    ).toHaveLength(2);
  });

  it("picks the train with the highest average delay across sightings", () => {
    const entries = [
      ...sightings("100", 10, THREE_DAYS),
      ...sightings("200", 2, THREE_DAYS),
    ];

    expect(pickMostDelayedTrain(entries, {}, 3, nowMs)).toMatchObject({
      trainNumber: "100",
      avgDelayMinutes: 10,
      observations: 3,
    });
  });

  it("ignores a one-burst train even with many station hits", () => {
    const burst = [
      "2026-08-16T14:16:57.000Z",
      "2026-08-16T14:18:30.000Z",
      "2026-08-16T14:18:45.000Z",
      "2026-08-16T14:19:02.000Z",
      "2026-08-16T14:19:08.000Z",
    ].map((recordedAt, index) =>
      entry({
        trainNumber: "516",
        delayMinutes: 45,
        recordedAt,
        station: `Burst ${index}`,
        serviceType: "Intercidades",
      }),
    );
    const entries = [...burst, ...sightings("100", 1, THREE_DAYS)];

    expect(pickMostDelayedTrain(entries, {}, 3, nowMs)?.trainNumber).toBe("100");
  });

  it("requires at least three sightings on two different days", () => {
    const sameDayThrice = [
      "2026-08-18T08:00:00.000Z",
      "2026-08-18T12:00:00.000Z",
      "2026-08-18T16:00:00.000Z",
    ];
    const twoDaysTwoSightings = ["2026-08-17T10:00:00.000Z", "2026-08-18T10:00:00.000Z"];

    expect(pickMostDelayedTrain(sightings("100", 20, sameDayThrice), {}, 3, nowMs)).toBeNull();
    expect(pickMostDelayedTrain(sightings("100", 20, twoDaysTwoSightings), {}, 3, nowMs)).toBeNull();
    expect(pickMostDelayedTrain(sightings("100", 20, THREE_DAYS), {}, 3, nowMs)?.trainNumber).toBe(
      "100",
    );
  });

  it("ignores trains whose newest sample is older than a week", () => {
    const entries = [
      ...sightings("516", 45, [
        "2026-08-10T10:00:00.000Z",
        "2026-08-12T10:00:00.000Z",
        "2026-08-16T14:19:00.000Z",
      ]),
      ...sightings("868", 20, [
        "2026-08-24T12:00:00.000Z",
        "2026-08-26T12:00:00.000Z",
        "2026-08-28T12:00:00.000Z",
      ]),
    ];

    expect(
      pickMostDelayedTrain(entries, {}, 3, Date.parse("2026-08-31T12:00:00.000Z"))?.trainNumber,
    ).toBe("868");
  });

  it("also skips stale trains for the most reliable pick", () => {
    const entries = [
      ...sightings(
        "18528",
        0,
        Array.from({ length: 20 }, (_, i) => `2026-08-${String(i + 1).padStart(2, "0")}T10:00:00.000Z`),
      ),
      ...sightings("36407", 1, [
        "2026-08-28T10:00:00.000Z",
        "2026-08-29T10:00:00.000Z",
        "2026-08-30T10:00:00.000Z",
      ]),
    ];

    expect(
      pickMostReliableTrain(entries, 1, { nowMs: Date.parse("2026-08-31T12:00:00.000Z") })
        ?.trainNumber,
    ).toBe("36407");
  });

  it("still uses older samples for a train that was also seen this week", () => {
    const entries = sightings("722", 10, [
      "2026-08-10T10:00:00.000Z",
      "2026-08-11T10:00:00.000Z",
      "2026-08-30T10:00:00.000Z",
    ]);
    entries[0]!.delayMinutes = 40;
    entries[1]!.delayMinutes = 40;

    expect(
      pickMostDelayedTrain(entries, {}, 3, Date.parse("2026-08-31T12:00:00.000Z")),
    ).toMatchObject({
      trainNumber: "722",
      observations: 3,
      avgDelayMinutes: 30,
    });
  });

  it("weights each sighting equally when averaging delay", () => {
    const burst = ["A", "B", "C", "D", "E"].map((station, index) =>
      entry({
        trainNumber: "900",
        delayMinutes: 50,
        recordedAt: `2026-08-16T14:1${index}:00.000Z`,
        station,
      }),
    );
    const later = [
      entry({
        trainNumber: "900",
        delayMinutes: 10,
        recordedAt: "2026-08-17T10:00:00.000Z",
        station: "F",
      }),
      entry({
        trainNumber: "900",
        delayMinutes: 10,
        recordedAt: "2026-08-18T10:00:00.000Z",
        station: "G",
      }),
    ];

    expect(pickMostDelayedTrain([...burst, ...later], {}, 3, nowMs)).toMatchObject({
      trainNumber: "900",
      observations: 3,
      avgDelayMinutes: 23.3,
    });
  });

  it("uses a stable reliable pick once the leader has enough sightings", () => {
    const entries = [
      ...sightings(
        "100",
        0,
        Array.from({ length: 20 }, (_, i) => {
          const day = new Date(Date.UTC(2026, 6, 30 + i, 10, 0, 0));
          return day.toISOString();
        }),
      ),
      ...sightings("200", 0, THREE_DAYS),
    ];

    expect(pickMostReliableTrain(entries, 42, { nowMs })).toMatchObject({
      trainNumber: "100",
      selectionMode: "stable",
      poolSize: 1,
    });
  });

  it("rotates the reliable pick across sample runs while data is thin", () => {
    const entries = [
      ...sightings("100", 0, THREE_DAYS),
      ...sightings("200", 0, THREE_DAYS),
      ...sightings("300", 0, THREE_DAYS),
    ];

    const run7 = pickMostReliableTrain(entries, 7, { poolSize: 3, nowMs });
    const run8 = pickMostReliableTrain(entries, 8, { poolSize: 3, nowMs });

    expect(run7?.selectionMode).toBe("rotating");
    expect(run8?.selectionMode).toBe("rotating");
    expect(run7?.trainNumber).not.toBe(run8?.trainNumber);
  });

  it("rotates a window of three reliable trains while data is thin", () => {
    const entries = [100, 200, 300, 400, 500, 600].flatMap((trainNumber) =>
      sightings(String(trainNumber), 0, THREE_DAYS),
    );

    const run7 = pickMostReliableTrains(entries, 7, { poolSize: 6, nowMs });
    const run8 = pickMostReliableTrains(entries, 8, { poolSize: 6, nowMs });

    expect(run7).toHaveLength(3);
    expect(run8).toHaveLength(3);
    expect(run7.map((entry) => entry.trainNumber)).not.toEqual(
      run8.map((entry) => entry.trainNumber),
    );
  });

  it("picks the three most delayed trains", () => {
    const entries = [
      ...sightings("100", 30, THREE_DAYS),
      ...sightings("200", 20, THREE_DAYS),
      ...sightings("300", 10, THREE_DAYS),
      ...sightings("400", 5, THREE_DAYS),
    ];

    expect(pickMostDelayedTrains(entries, {}, 3, nowMs).map((entry) => entry.trainNumber)).toEqual([
      "100",
      "200",
      "300",
    ]);
  });

  it("normalizes the older single-train JSON shape", () => {
    const normalized = normalizeTrainReliabilitySpotlight({
      generatedAt: "2026-08-18T12:00:00.000Z",
      runCount: 9,
      mostDelayed: { trainNumber: "900", serviceType: "Regional" },
      mostReliable: {
        trainNumber: "100",
        serviceType: "Regional",
        selectionMode: "rotating",
        poolSize: 12,
      },
    });

    expect(normalized.mostDelayed).toHaveLength(1);
    expect(normalized.mostReliable).toHaveLength(1);
    expect(normalized.mostReliable[0]?.selectionMode).toBe("rotating");
  });

  it("builds a manifest with both spotlight picks", () => {
    const manifest = buildTrainReliabilitySpotlightManifest({
      runCount: 12,
      generatedAt: "2026-08-18T12:00:00.000Z",
      entries: [...sightings("900", 15, THREE_DAYS), ...sightings("100", 0, THREE_DAYS)],
    });

    expect(manifest.mostDelayed.map((entry) => entry.trainNumber)).toEqual(["900"]);
    expect(manifest.mostReliable.map((entry) => entry.trainNumber)).toEqual(["100"]);
    expect(manifest.runCount).toBe(12);
  });

  it("picks three most delayed and three most reliable trains", () => {
    const entries = [
      ...sightings(
        "100",
        0,
        Array.from({ length: 20 }, (_, i) => {
          const day = new Date(Date.UTC(2026, 6, 30 + i, 10, 0, 0));
          return day.toISOString();
        }),
      ),
      ...sightings("200", 1, THREE_DAYS),
      ...sightings("300", 2, THREE_DAYS),
      ...sightings("400", 10, THREE_DAYS),
      ...sightings("500", 20, THREE_DAYS),
      ...sightings("600", 30, THREE_DAYS),
    ];
    const manifest = buildTrainReliabilitySpotlightManifest({
      runCount: 1,
      generatedAt: "2026-08-18T12:00:00.000Z",
      entries,
    });

    expect(manifest.mostDelayed.map((entry) => entry.trainNumber)).toEqual(["600", "500", "400"]);
    expect(manifest.mostReliable.map((entry) => entry.trainNumber)).toEqual(["100", "200", "300"]);
    expect(manifest.mostReliable[0]?.selectionMode).toBe("stable");
  });

  it("keeps delayed trains out of the reliable list", () => {
    const entries = [
      ...sightings("100", 0, THREE_DAYS),
      ...sightings("200", 1, THREE_DAYS),
      ...sightings("900", 40, THREE_DAYS),
    ];
    const manifest = buildTrainReliabilitySpotlightManifest({
      runCount: 0,
      generatedAt: "2026-08-18T12:00:00.000Z",
      entries,
    });

    expect(manifest.mostDelayed.map((entry) => entry.trainNumber)).toEqual(["900", "200"]);
    expect(manifest.mostReliable.map((entry) => entry.trainNumber)).toEqual(["100"]);
  });

  it("lists major stations where the train was sampled, busiest first", () => {
    const entries = [
      entry({ trainNumber: "900", station: "Pinhão", delayMinutes: 15, recordedAt: THREE_DAYS[0] }),
      entry({
        trainNumber: "900",
        station: "Porto-Campanhã",
        delayMinutes: 15,
        recordedAt: THREE_DAYS[0],
      }),
      entry({ trainNumber: "900", station: "Aveiro", delayMinutes: 15, recordedAt: THREE_DAYS[1] }),
      entry({
        trainNumber: "900",
        station: "Coimbra-B",
        delayMinutes: 15,
        recordedAt: THREE_DAYS[1],
      }),
      entry({ trainNumber: "900", station: "Pombal", delayMinutes: 15, recordedAt: THREE_DAYS[2] }),
      entry({ trainNumber: "900", station: "Braga", delayMinutes: 15, recordedAt: THREE_DAYS[2] }),
    ];
    const traffic = {
      "Porto-Campanhã": 500,
      "Coimbra-B": 400,
      Aveiro: 300,
      Braga: 200,
      Pombal: 100,
      Pinhão: 10,
    };

    expect(pickMostDelayedTrain(entries, traffic, 3, nowMs)?.majorStations).toEqual([
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
