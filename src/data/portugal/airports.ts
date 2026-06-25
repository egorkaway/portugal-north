import type { Station } from "../stationTypes";

/** Main international airports in mainland Portugal (shown to end users). */
export const portugalAirports: Station[] = [
  {
    name: "Lisbon Airport (LIS)",
    country: "pt",
    lines: ["LIS"],
    types: ["Airport"],
    lat: 38.7813,
    lng: -9.1359,
  },
  {
    name: "Porto Airport (OPO)",
    country: "pt",
    lines: ["OPO"],
    types: ["Airport"],
    lat: 41.2481,
    lng: -8.6814,
  },
  {
    name: "Faro Airport (FAO)",
    country: "pt",
    lines: ["FAO"],
    types: ["Airport"],
    lat: 37.0144,
    lng: -7.9659,
  },
];
