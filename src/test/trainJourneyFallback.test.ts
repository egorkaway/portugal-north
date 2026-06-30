import { describe, expect, it } from "vitest";
import {
  buildJourneyFromTimedStops,
  findTrainStopInTimetable,
  haversineKm,
  rankCandidateStationCodes,
} from "../../server/lib/cpTrainJourneyFallback";
import type { CpStationIndexEntry } from "../../server/lib/cpStationIndex";
import { findCpStationByFuzzyName } from "../../server/lib/cpStationIndex";

const origin: CpStationIndexEntry = {
  name: "Porto-Campanhã",
  code: "94-2006",
  lines: ["Linha do Norte", "Minho", "Douro"],
  lat: 41.1489,
  lng: -8.5856,
};

const neighbors: CpStationIndexEntry[] = [
  origin,
  {
    name: "General Torres",
    code: "94-39172",
    lines: ["Linha do Norte", "Minho", "Douro"],
    lat: 41.17,
    lng: -8.57,
  },
  {
    name: "Ermesinde",
    code: "94-21055",
    lines: ["Linha do Minho", "Douro"],
    lat: 41.2139,
    lng: -8.5528,
  },
  {
    name: "Ermesinde",
    code: "94-4002",
    lines: ["Linha do Minho", "Douro"],
    lat: 41.2139,
    lng: -8.5528,
  },
  {
    name: "Porto-Campanhã",
    code: "94-2006",
    lines: ["Linha do Norte", "Minho", "Douro"],
    lat: 41.1489,
    lng: -8.5856,
  },
  {
    name: "Braga",
    code: "94-29157",
    lines: ["Linha de Braga"],
    lat: 41.5494,
    lng: -8.4344,
  },
];

describe("haversineKm", () => {
  it("returns zero for identical coordinates", () => {
    expect(haversineKm(41.1, -8.5, 41.1, -8.5)).toBe(0);
  });
});

describe("findCpStationByFuzzyName", () => {
  it("resolves Porto Campanha to Porto-Campanhã", () => {
    expect(findCpStationByFuzzyName("Porto Campanha")?.code).toBe("94-2006");
  });
});

describe("rankCandidateStationCodes", () => {
  it("prefers nearby stations on shared lines and puts destination first", () => {
    const ranked = rankCandidateStationCodes(origin, neighbors, "Braga", 3);
    expect(ranked[0]).toBe("94-29157");
    expect(ranked).toContain("94-39172");
    expect(ranked).not.toContain("94-2006");
  });

  it("excludes stations without shared lines unless destination", () => {
    const ranked = rankCandidateStationCodes(origin, neighbors, undefined, 5);
    expect(ranked).not.toContain("94-29157");
    expect(ranked).toContain("94-39172");
  });

  it("puts the destination first for Ermesinde to Porto Campanha", () => {
    const ermesinde = neighbors.find((station) => station.code === "94-4002");
    expect(ermesinde).toBeDefined();
    const ranked = rankCandidateStationCodes(ermesinde!, neighbors, "Porto Campanha", 5);
    expect(ranked[0]).toBe("94-2006");
  });
});

describe("findTrainStopInTimetable", () => {
  it("finds the train after the origin departure and matches destination", () => {
    const hit = findTrainStopInTimetable(
      {
        stationStops: [
          {
            trainNumber: 542,
            departureTime: "17:10",
            trainDestination: { code: "94-29157", designation: "Braga" },
            trainOrigin: { code: "94-2006", designation: "Porto - Campanha" },
            trainService: { code: "U", designation: "Urbano" },
          },
          {
            trainNumber: 542,
            arrivalTime: "17:14",
            departureTime: "17:15",
            trainDestination: { code: "94-29157", designation: "Braga" },
            trainOrigin: { code: "94-2006", designation: "Porto - Campanha" },
            trainService: { code: "U", designation: "Urbano" },
          },
          {
            trainNumber: 999,
            departureTime: "17:20",
            trainDestination: { code: "94-31005", designation: "Lisboa" },
            trainOrigin: { code: "94-2006", designation: "Porto - Campanha" },
            trainService: { code: "R", designation: "Regional" },
          },
        ],
      },
      "542",
      17 * 60 + 11,
      "Braga",
    );

    expect(hit?.arrivalTime).toBe("17:14");
  });

  it("matches by destination code when the name from CP differs", () => {
    const hit = findTrainStopInTimetable(
      {
        stationStops: [
          {
            trainNumber: 856,
            arrivalTime: "10:26",
            trainDestination: { code: "94-2006", designation: "Porto - Campanha" },
            trainOrigin: { code: "94-4002", designation: "Ermesinde" },
            trainService: { code: "IR", designation: "InterRegional" },
          },
        ],
      },
      "856",
      10 * 60,
      "Porto Campanha",
      {
        atStationCode: "94-2006",
        destinationStationCode: "94-2006",
      },
    );

    expect(hit?.arrivalTime).toBe("10:26");
  });

  it("can match at the destination station without a destination-name filter", () => {
    const hit = findTrainStopInTimetable(
      {
        stationStops: [
          {
            trainNumber: 856,
            arrivalTime: "10:26",
            trainDestination: { code: "94-2006", designation: "Porto - Campanha" },
            trainOrigin: { code: "94-4002", designation: "Ermesinde" },
            trainService: { code: "IR", designation: "InterRegional" },
          },
        ],
      },
      "856",
      10 * 60,
      "Wrong Label",
      {
        atStationCode: "94-2006",
        destinationStationCode: "94-2006",
        requireDestinationMatch: false,
      },
    );

    expect(hit?.arrivalTime).toBe("10:26");
  });
});

describe("buildJourneyFromTimedStops", () => {
  it("orders and deduplicates stops by time", () => {
    const journey = buildJourneyFromTimedStops("542", "2026-06-30", "Urbano", [
      {
        sortMinutes: 17 * 60 + 15,
        stop: {
          stationCode: "94-39172",
          stationName: "General Torres",
          arrivalTime: "17:14",
          departureTime: "17:15",
          platform: null,
        },
      },
      {
        sortMinutes: 17 * 60 + 10,
        stop: {
          stationCode: "94-2006",
          stationName: "Porto-Campanhã",
          arrivalTime: null,
          departureTime: "17:10",
          platform: "3",
        },
      },
      {
        sortMinutes: 17 * 60 + 10,
        stop: {
          stationCode: "94-2006",
          stationName: "Porto-Campanhã",
          arrivalTime: null,
          departureTime: "17:10",
          platform: "3",
        },
      },
    ]);

    expect(journey.stops.map((stop) => stop.stationCode)).toEqual([
      "94-2006",
      "94-39172",
    ]);
  });

  it("pins the boarding station first even when other stops sort earlier", () => {
    const journey = buildJourneyFromTimedStops(
      "15761",
      "2026-06-30",
      "Urbano",
      [
        {
          sortMinutes: 10 * 60 + 5,
          stop: {
            stationCode: "94-2006",
            stationName: "Porto-Campanhã",
            arrivalTime: "10:04",
            departureTime: "10:05",
            platform: null,
          },
        },
        {
          sortMinutes: 10 * 60 + 12,
          stop: {
            stationCode: "94-39149",
            stationName: "Coimbrões",
            arrivalTime: null,
            departureTime: "10:12",
            platform: "2",
          },
        },
      ],
      "94-39149",
    );

    expect(journey.stops.map((stop) => stop.stationCode)).toEqual([
      "94-39149",
      "94-2006",
    ]);
  });
});
