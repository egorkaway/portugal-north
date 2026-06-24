import type { StationData } from "./stationTypes";

/**
 * Major Lisbon Metro stops: one terminus per line (Azul, Amarela, Verde, Vermelha).
 * Linha Circular omitted (ring line has no termini). Coordinates ≈ station entrances.
 */
export const metroLisboaStations: StationData[] = [
  {
    name: "Santa Apolónia (Metro)",
    lines: ["Metro Lisboa Linha Azul"],
    types: ["Metro"],
    lat: 38.7135,
    lng: -9.122,
  },
  {
    name: "Amadora Este",
    lines: ["Metro Lisboa Linha Azul"],
    types: ["Metro"],
    lat: 38.762,
    lng: -9.238,
  },
  {
    name: "Rato",
    lines: ["Metro Lisboa Linha Amarela"],
    types: ["Metro"],
    lat: 38.7165,
    lng: -9.1565,
  },
  {
    name: "Odivelas",
    lines: ["Metro Lisboa Linha Amarela"],
    types: ["Metro"],
    lat: 38.803,
    lng: -9.1835,
  },
  {
    name: "Cais do Sodré (Metro)",
    lines: ["Metro Lisboa Linha Verde"],
    types: ["Metro"],
    lat: 38.7065,
    lng: -9.1455,
  },
  {
    name: "Telheiras",
    lines: ["Metro Lisboa Linha Verde"],
    types: ["Metro"],
    lat: 38.758,
    lng: -9.169,
  },
  {
    name: "São Sebastião (Metro)",
    lines: ["Metro Lisboa Linha Vermelha"],
    types: ["Metro"],
    lat: 38.734,
    lng: -9.151,
  },
  {
    name: "Aeroporto (Metro Lisboa)",
    lines: ["Metro Lisboa Linha Vermelha"],
    types: ["Metro"],
    lat: 38.7683,
    lng: -9.1283,
  },
];
