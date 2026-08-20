import { describe, expect, it } from "vitest";
import {
  displaySpainStopName,
  foldSpainStationName,
  pickNextSpainStations,
} from "@/lib/spainStationCandidates";

const stops = [
  { id: "04040", name: "Zaragoza Delicias", lat: 41.6587, lng: -0.9113, kind: "longDistance" as const },
  { id: "60000", name: "Madrid-Puerta de Atocha", lat: 40.4066, lng: -3.6895, kind: "longDistance" as const },
  { id: "71801", name: "Barcelona-Sants", lat: 41.3794, lng: 2.1403, kind: "longDistance" as const },
  { id: "94346", name: "Porto Campanhã", lat: 41.1496, lng: -8.5853, kind: "longDistance" as const },
  { id: "17000", name: "Madrid-Chamartín-Clara Campoamor", lat: 40.472, lng: -3.6823, kind: "longDistance" as const },
  { id: "05100", name: "Valencia-Estació del Nord", lat: 39.4667, lng: -0.3774, kind: "cercanias" as const },
];

const existing = [
  { name: "Barcelona-Sants", lat: 41.3794, lng: 2.1403, country: "es" },
  { name: "Madrid-Chamartín", lat: 40.472, lng: -3.6823, country: "es" },
  { name: "Porto-Campanhã", lat: 41.1495, lng: -8.585, country: "pt" },
];

describe("spain station expand picker", () => {
  it("title-cases all-caps names and strips Clara Campoamor", () => {
    expect(displaySpainStopName("MADRID PUERTA DE ATOCHA")).toBe("Madrid Puerta De Atocha");
    expect(displaySpainStopName("Madrid-Chamartín-Clara Campoamor")).toBe("Madrid-Chamartín");
    expect(displaySpainStopName("Madrid-Puerta de Atocha-Almudena Grandes")).toBe(
      "Madrid-Puerta de Atocha",
    );
    expect(foldSpainStationName(displaySpainStopName("Madrid-Chamartín-Clara Campoamor"))).toBe(
      foldSpainStationName("Madrid-Chamartín"),
    );
  });

  it("defaults to one station per expand batch", () => {
    const picked = pickNextSpainStations({
      stops,
      existing,
      observations: [
        ...Array.from({ length: 9 }, () => ({ stopId: "04040", kind: "longDistance" as const })),
        ...Array.from({ length: 4 }, () => ({ stopId: "60000", kind: "longDistance" as const })),
        ...Array.from({ length: 3 }, () => ({ stopId: "05100", kind: "cercanias" as const })),
      ],
    });

    expect(picked).toHaveLength(1);
    expect(picked[0]?.name).toBe("Zaragoza Delicias");
  });

  it("picks the busiest unmatched Spanish stops and skips catalog plus Portugal", () => {
    const picked = pickNextSpainStations({
      stops,
      existing,
      observations: [
        ...Array.from({ length: 9 }, () => ({ stopId: "04040", kind: "longDistance" as const })),
        ...Array.from({ length: 4 }, () => ({ stopId: "60000", kind: "longDistance" as const })),
        ...Array.from({ length: 3 }, () => ({ stopId: "05100", kind: "cercanias" as const })),
        ...Array.from({ length: 20 }, () => ({ stopId: "71801", kind: "longDistance" as const })),
        ...Array.from({ length: 8 }, () => ({ stopId: "94346", kind: "longDistance" as const })),
        ...Array.from({ length: 5 }, () => ({ stopId: "17000", kind: "longDistance" as const })),
      ],
      limit: 3,
    });

    expect(picked.map((row) => row.name)).toEqual([
      "Zaragoza Delicias",
      "Madrid-Puerta de Atocha",
      "Valencia-Estació del Nord",
    ]);
    expect(picked[0]?.observations).toBe(9);
    expect(picked[2]?.types).toEqual(["Urban"]);
  });
});
