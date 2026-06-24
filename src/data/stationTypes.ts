import type { CountryCode } from "@/lib/countries";

export type { CountryCode };

export interface StationData {
  name: string;
  lines: string[];
  types: string[];
  lat: number;
  lng: number;
}

export interface Station extends StationData {
  country: CountryCode;
}
