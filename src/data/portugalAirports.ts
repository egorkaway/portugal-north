export type PortugalAirport = {
  iata: "LIS" | "OPO" | "FAO";
  lat: number;
  lng: number;
};

/** Main international airports in mainland Portugal. */
export const portugalAirports: PortugalAirport[] = [
  { iata: "LIS", lat: 38.7813, lng: -9.1359 },
  { iata: "OPO", lat: 41.2481, lng: -8.6814 },
  { iata: "FAO", lat: 37.0144, lng: -7.9659 },
];
