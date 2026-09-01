import { describe, expect, it } from "vitest";
import {
  displayPortugalStopName,
  foldPortugalStationName,
  isGtfsAliasOfCatalog,
  pickNextPortugalStations,
  PORTUGAL_EXPAND_BATCH_SIZE,
} from "@/lib/portugalStationCandidates";

const stops = [
  {
    id: "94_69237",
    code: "94-69237",
    name: "Sao Joao do Estoril",
    lat: 38.7013,
    lng: -9.3861,
    scheduledStops: 341,
    routeShortNames: ["Linha de Cascais"],
  },
  {
    id: "94_38356",
    code: "94-38356",
    name: "Carvalheira - Maceda",
    lat: 40.95,
    lng: -8.64,
    scheduledStops: 78,
    routeShortNames: ["Linha de Aveiro"],
  },
  {
    id: "94_10009",
    code: "94-10009",
    name: "Regua",
    lat: 41.1636,
    lng: -7.787,
    scheduledStops: 52,
    routeShortNames: ["IR", "R"],
  },
  {
    id: "94_74005",
    code: "94-74005",
    name: "Casa Branca",
    lat: 38.53,
    lng: -8.0,
    scheduledStops: 48,
    routeShortNames: ["IC"],
  },
];

const existing = [
  { name: "Estoril", lat: 38.7032, lng: -9.3987, country: "pt", lines: ["Linha de Cascais"] },
  { name: "Peso da Régua", lat: 41.1636, lng: -7.7894, country: "pt", lines: ["Linha do Douro"] },
  { name: "Cortegaça", lat: 40.9408, lng: -8.6356, country: "pt", lines: ["Linha do Norte"] },
  { name: "Évora", lat: 38.5707, lng: -7.9047, country: "pt", lines: ["Linha de Évora"] },
];

describe("portugal station expand picker", () => {
  it("maps GTFS ASCII names to catalog spelling", () => {
    expect(displayPortugalStopName("Sao Joao do Estoril")).toBe("São João do Estoril");
    expect(displayPortugalStopName("Formoselha - Santo Varao")).toBe("Formoselha – Santo Varão");
    expect(foldPortugalStationName("Peso da Régua")).toBe("peso regua");
    expect(isGtfsAliasOfCatalog("Regua", "Peso da Régua")).toBe(true);
    expect(isGtfsAliasOfCatalog("Sao Joao do Estoril", "Estoril")).toBe(false);
  });

  it("defaults to one station per expand batch", () => {
    expect(PORTUGAL_EXPAND_BATCH_SIZE).toBe(1);
    const picked = pickNextPortugalStations({ stops, existing });
    expect(picked).toHaveLength(1);
    expect(picked[0]?.name).toBe("São João do Estoril");
    expect(picked[0]?.types).toEqual(["Urban"]);
    expect(picked[0]?.lines).toEqual(["Linha de Cascais"]);
  });

  it("skips Régua as an alias of Peso da Régua and ranks leftover by GTFS volume", () => {
    const picked = pickNextPortugalStations({
      stops,
      existing: [...existing, { name: "São João do Estoril", lat: 38.7013, lng: -9.3861, country: "pt" }],
      existingCodes: ["94-69237"],
      limit: 3,
    });

    expect(picked.map((row) => row.name)).toEqual(["Carvalheira - Maceda", "Casa Branca"]);
    expect(picked[0]?.scheduledStops).toBe(78);
    expect(picked[0]?.lines).toEqual(["Linha do Norte"]);
    expect(picked[1]?.types).toEqual(["Intercidades"]);
  });

  it("skips a GTFS code that is already in the CP map", () => {
    const picked = pickNextPortugalStations({
      stops,
      existing,
      existingCodes: ["94-69237", "94-38356", "94-74005", "94-10009"],
    });
    expect(picked).toEqual([]);
  });
});
