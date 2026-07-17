import type { StationData } from "./stationTypes";

/**
 * Major Metro do Porto stops: one terminus per line (plus Estádio do Dragão on A & B).
 * Coordinates are approximate station entrances for maps / distance sort.
 */
export const metroPortoStations: StationData[] = [
  {
    name: "Estádio do Dragão",
    lines: ["Metro Linha A (Azul)", "Metro Linha B (Vermelha)"],
    types: ["Metro"],
    lat: 41.1617,
    lng: -8.5858,
  },
  {
    name: "Senhor de Matosinhos",
    lines: ["Metro Linha A (Azul)"],
    types: ["Metro"],
    lat: 41.1844,
    lng: -8.6892,
  },
  {
    name: "Póvoa de Varzim",
    lines: ["Metro Linha B (Vermelha)"],
    types: ["Metro"],
    lat: 41.377944,
    lng: -8.7583194,
  },
  {
    name: "Campanhã (Metro)",
    lines: ["Metro Linha C (Verde)"],
    types: ["Metro"],
    lat: 41.1505,
    lng: -8.585,
  },
  {
    name: "ISMAI",
    lines: ["Metro Linha C (Verde)"],
    types: ["Metro"],
    lat: 41.2688,
    lng: -8.6154,
  },
  {
    name: "Hospital São João (Metro)",
    lines: ["Metro Linha D (Amarela)"],
    types: ["Metro"],
    lat: 41.1801,
    lng: -8.599,
  },
  {
    name: "Vila d'Este",
    lines: ["Metro Linha D (Amarela)"],
    types: ["Metro"],
    lat: 41.0986,
    lng: -8.5885,
  },
  {
    name: "Trindade (Metro)",
    lines: ["Metro Linha E (Roxa)"],
    types: ["Metro"],
    lat: 41.152,
    lng: -8.61,
  },
  {
    name: "Estação Aeroporto",
    lines: ["Metro Linha E (Roxa)"],
    types: ["Metro"],
    lat: 41.2481,
    lng: -8.6796,
  },
  {
    name: "Fânzeres",
    lines: ["Metro Linha F (Laranja)"],
    types: ["Metro"],
    lat: 41.1713,
    lng: -8.5428,
  },
  {
    name: "Senhora da Hora",
    lines: ["Metro Linha F (Laranja)"],
    types: ["Metro"],
    lat: 41.1845,
    lng: -8.649,
  },
];
