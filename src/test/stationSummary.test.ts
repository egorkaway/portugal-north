import { describe, expect, it } from "vitest";
import { hasStationSummary, getStationSummary } from "@/lib/stationSummary";
import { stationsNeedingSummaries } from "@/lib/stationSummaryQueue";
import { rankStationsByTrainVolume } from "@/lib/stationTrainVolume";

describe("station summaries batch 1", () => {
  it("covers the five busiest stations in departure stats", () => {
    const topFive = rankStationsByTrainVolume()
      .slice(0, 5)
      .map((entry) => entry.station.name);

    expect(topFive).toEqual([
      "Lisboa Oriente",
      "Agualva - Cacém",
      "Portela de Sintra",
      "Queluz - Belas",
      "Porto-Campanhã",
    ]);

    for (const name of topFive) {
      expect(getStationSummary(name)).toMatch(/\.\s*$/);
    }
  });

  it("lists the next five stations without summaries", () => {
    const next = stationsNeedingSummaries(5);
    expect(next).toEqual([
      "Massama - Barcarena",
      "Algueirão - Mem Martins",
      "Reboleira",
      "Campolide",
      "Contumil",
    ]);
  });
});

describe("station summaries batch 3", () => {
  it("covers stations ranked 11–15 by train volume", () => {
    const batchThree = rankStationsByTrainVolume()
      .slice(10, 15)
      .map((entry) => entry.station.name);

    expect(batchThree).toEqual([
      "Benfica",
      "Merces",
      "Amadora",
      "Vila Franca de Xira",
      "Roma - Areeiro",
    ]);

    for (const name of batchThree) {
      expect(getStationSummary(name)).toMatch(/\.\s*$/);
    }
  });
});

describe("station summaries batch 2", () => {
  it("covers stations ranked 6–10 by train volume", () => {
    const batchTwo = rankStationsByTrainVolume()
      .slice(5, 10)
      .map((entry) => entry.station.name);

    expect(batchTwo).toEqual([
      "Santa Cruz - Damaia",
      "Braco de Prata",
      "Monte Abraão",
      "Entrecampos",
      "Ermesinde",
    ]);

    for (const name of batchTwo) {
      expect(getStationSummary(name)).toMatch(/\.\s*$/);
    }
  });
});
