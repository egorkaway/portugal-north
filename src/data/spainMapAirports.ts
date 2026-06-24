import { spainAirports } from "./spain/airports";

/** Major peninsular Spain airports shown as permanent map labels. */
export const SPAIN_MAJOR_MAP_AIRPORT_IATAS = [
  "MAD",
  "BCN",
  "AGP",
  "ALC",
  "VLC",
  "SVQ",
  "BIO",
  "SCQ",
  "VGO",
  "OVD",
] as const;

export type SpainMajorMapAirportIata = (typeof SPAIN_MAJOR_MAP_AIRPORT_IATAS)[number];

export type MapAirportMarker = {
  iata: string;
  lat: number;
  lng: number;
};

export const spainMapAirports: MapAirportMarker[] = SPAIN_MAJOR_MAP_AIRPORT_IATAS.flatMap(
  (iata) => {
    const airport = spainAirports.find((entry) => entry.lines[0] === iata);
    if (!airport) return [];
    return [{ iata, lat: airport.lat, lng: airport.lng }];
  },
);
