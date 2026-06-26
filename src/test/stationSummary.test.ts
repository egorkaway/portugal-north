import { describe, expect, it } from "vitest";
import { LOCALES } from "@/i18n/types";
import { STATION_SUMMARY_NAMES } from "@/data/stationSummaries";
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
      "Cais do Sodré",
      "Cascais",
      "Hospital São João",
      "Moita",
      "Lamarosa",
    ]);
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

describe("station summaries batch 4", () => {
  it("covers stations ranked 16–20 by train volume", () => {
    const batchFour = rankStationsByTrainVolume()
      .slice(15, 20)
      .map((entry) => entry.station.name);

    expect(batchFour).toEqual([
      "Massama - Barcarena",
      "Algueirão - Mem Martins",
      "Reboleira",
      "Campolide",
      "Contumil",
    ]);

    for (const name of batchFour) {
      expect(getStationSummary(name)).toMatch(/\.\s*$/);
    }
  });
});

describe("station summaries batch 5", () => {
  it("covers stations ranked 21–25 by train volume", () => {
    const batchFive = rankStationsByTrainVolume()
      .slice(20, 25)
      .map((entry) => entry.station.name);

    expect(batchFive).toEqual([
      "Sete Rios",
      "Águas Santas - Palmilheira",
      "Alcantara - Mar",
      "Sacavem",
      "Vila Nova de Gaia-Devesas",
    ]);

    for (const name of batchFive) {
      expect(hasStationSummary(name)).toBe(true);
      expect(getStationSummary(name)).toMatch(/\.\s*$/);
    }
  });
});

describe("station summaries batch 6", () => {
  it("covers stations ranked 26–30 by train volume", () => {
    const batchSix = rankStationsByTrainVolume()
      .slice(25, 30)
      .map((entry) => entry.station.name);

    expect(batchSix).toEqual([
      "Parede",
      "Belém",
      "Oeiras",
      "Cruz Quebrada",
      "Granja",
    ]);

    for (const name of batchSix) {
      expect(hasStationSummary(name)).toBe(true);
      expect(getStationSummary(name)).toMatch(/\.\s*$/);
    }
  });
});

describe("station summaries batch 7", () => {
  it("covers stations ranked 31–35 by train volume", () => {
    const batchSeven = rankStationsByTrainVolume()
      .slice(30, 35)
      .map((entry) => entry.station.name);

    expect(batchSeven).toEqual([
      "Valadares",
      "Espinho",
      "Carcavelos",
      "Moscavide",
      "Paço de Arcos",
    ]);

    for (const name of batchSeven) {
      expect(hasStationSummary(name)).toBe(true);
      expect(getStationSummary(name)).toMatch(/\.\s*$/);
    }
  });
});

describe("station summaries batch 8", () => {
  it("covers stations ranked 36–40 by train volume", () => {
    const batchEight = rankStationsByTrainVolume()
      .slice(35, 40)
      .map((entry) => entry.station.name);

    expect(batchEight).toEqual([
      "Rio Tinto",
      "Monte Estoril",
      "Santa Iria",
      "Santo Amaro",
      "São Bento (Porto)",
    ]);

    for (const name of batchEight) {
      expect(hasStationSummary(name)).toBe(true);
      expect(getStationSummary(name)).toMatch(/\.\s*$/);
    }
  });
});

describe("station summaries batch 9", () => {
  it("covers stations ranked 41–45 by train volume", () => {
    const batchNine = rankStationsByTrainVolume()
      .slice(40, 45)
      .map((entry) => entry.station.name);

    expect(batchNine).toEqual([
      "Algés",
      "Rio de Mouro",
      "Alverca",
      "Bobadela",
      "Estoril",
    ]);

    for (const name of batchNine) {
      expect(hasStationSummary(name)).toBe(true);
      expect(getStationSummary(name)).toMatch(/\.\s*$/);
    }
  });
});

describe("station summaries batch 10", () => {
  it("covers stations ranked 46–50 by train volume", () => {
    const batchTen = rankStationsByTrainVolume()
      .slice(45, 50)
      .map((entry) => entry.station.name);

    expect(batchTen).toEqual([
      "Aveiro",
      "Coimbra-B",
      "Povoa",
      "Alhandra",
      "Caxias",
    ]);

    for (const name of batchTen) {
      expect(hasStationSummary(name)).toBe(true);
      expect(getStationSummary(name)).toMatch(/\.\s*$/);
    }
  });
});

describe("station summaries batch 11", () => {
  it("covers stations ranked 51–55 by train volume", () => {
    const batchEleven = rankStationsByTrainVolume()
      .slice(50, 55)
      .map((entry) => entry.station.name);

    expect(batchEleven).toEqual([
      "Nine",
      "Famalicão",
      "Trofa",
      "General Torres",
      "Sintra",
    ]);

    for (const name of batchEleven) {
      expect(hasStationSummary(name)).toBe(true);
      expect(getStationSummary(name)).toMatch(/\.\s*$/);
    }
  });
});

describe("station summaries batch 12", () => {
  it("covers stations ranked 56–60 by train volume", () => {
    const batchTwelve = rankStationsByTrainVolume()
      .slice(55, 60)
      .map((entry) => entry.station.name);

    expect(batchTwelve).toEqual([
      "Esmoriz",
      "Pinhal Novo",
      "Palmela",
      "Entroncamento",
      "Barreiro-A",
    ]);

    for (const name of batchTwelve) {
      expect(hasStationSummary(name)).toBe(true);
      expect(getStationSummary(name)).toMatch(/\.\s*$/);
    }
  });
});

describe("station summaries batch 13", () => {
  it("covers stations ranked 61–65 by train volume", () => {
    const batchThirteen = rankStationsByTrainVolume()
      .slice(60, 65)
      .map((entry) => entry.station.name);

    expect(batchThirteen).toEqual([
      "Paredes",
      "Lousado",
      "Lavradio",
      "Lisboa Santa Apolónia",
      "Penafiel",
    ]);

    for (const name of batchThirteen) {
      expect(hasStationSummary(name)).toBe(true);
      expect(getStationSummary(name)).toMatch(/\.\s*$/);
    }
  });
});

describe("station summaries batch 14", () => {
  it("covers stations ranked 66–70 by train volume", () => {
    const batchFourteen = rankStationsByTrainVolume()
      .slice(65, 70)
      .map((entry) => entry.station.name);

    expect(batchFourteen).toEqual([
      "Suzão",
      "São Romão",
      "Azambuja",
      "Caíde",
      "São Frutuoso",
    ]);

    for (const name of batchFourteen) {
      expect(hasStationSummary(name)).toBe(true);
      expect(getStationSummary(name)).toMatch(/\.\s*$/);
    }
  });
});

describe("station summaries batch 15", () => {
  it("covers stations ranked 71–75 by train volume", () => {
    const batchFifteen = rankStationsByTrainVolume()
      .slice(70, 75)
      .map((entry) => entry.station.name);

    expect(batchFifteen).toEqual([
      "Ovar",
      "Alfarelos",
      "Couto de Cambeses",
      "Santarém",
      "Travagem",
    ]);

    for (const name of batchFifteen) {
      expect(hasStationSummary(name)).toBe(true);
      expect(getStationSummary(name)).toMatch(/\.\s*$/);
    }
  });
});

describe("station summaries batch 16", () => {
  it("covers stations ranked 76–80 by train volume", () => {
    const batchSixteen = rankStationsByTrainVolume()
      .slice(75, 80)
      .map((entry) => entry.station.name);

    expect(batchSixteen).toEqual([
      "Santos",
      "Paramos",
      "Recarei-Sobreira",
      "São Mamede de Infesta",
      "Cete",
    ]);

    for (const name of batchSixteen) {
      expect(hasStationSummary(name)).toBe(true);
      expect(getStationSummary(name)).toMatch(/\.\s*$/);
    }
  });
});

describe("station summaries i18n", () => {
  it("has all 80 station keys in every locale", () => {
    expect(STATION_SUMMARY_NAMES).toHaveLength(80);

    for (const locale of LOCALES) {
      for (const name of STATION_SUMMARY_NAMES) {
        const summary = getStationSummary(name, locale);
        expect(summary, `${locale}: ${name}`).toBeDefined();
        expect(summary).toMatch(/\.\s*$/);
        expect(summary).not.toMatch(/\bAP\b|\bIC\b/);
      }
    }
  });

  it("falls back to English for unknown locale keys", () => {
    const en = getStationSummary("Lisboa Oriente", "en");
    // @ts-expect-error testing runtime fallback
    expect(getStationSummary("Lisboa Oriente", "xx")).toBe(en);
  });
});
