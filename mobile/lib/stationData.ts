import stationsFull from '@/data/stations-full.json';
import stationImages from '@/data/stationImages.json';
import hotels from '@/data/hotels.json';
import summariesEn from '@/data/summaries-en.json';
import reliabilityScores from '@/data/reliability-scores.json';
import cpStationCodes from '@/data/cpStationCodes.json';

export type CountryCode = 'pt' | 'es';

export type Station = {
  name: string;
  lines: string[];
  types: string[];
  lat: number;
  lng: number;
  /** Iberian hubs: pt/es. Europe destinations: ISO 3166-1 alpha-2 lowercase. */
  country: CountryCode | string;
};

export type Hotel = {
  name: string;
  distanceKm: number;
  priceFrom: number;
  bookingUrl: string;
};

export type HomeScope = 'pt' | 'es' | 'all';

export type ReliabilityScoresManifest = {
  generatedAt: string;
  runCount: number;
  stationCount: number;
  scores: Record<string, number>;
  movements: Record<string, number>;
};

export const allStations = stationsFull as Station[];
export const bakedStationImages = stationImages as Record<string, string>;
export const bakedHotels = hotels as Record<string, Hotel[]>;
export const bakedSummariesEn = summariesEn as Record<string, string>;
export const bakedReliabilityScores = reliabilityScores as ReliabilityScoresManifest;
export const bakedCpCodes = cpStationCodes as Record<string, string>;

const stationBySlug = new Map(
  allStations.map((station) => [stationToSlug(station.name), station]),
);

export function stationToSlug(name: string): string {
  return name
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[()]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function getStationBySlug(slug: string): Station | undefined {
  return stationBySlug.get(slug);
}

export function getStationsForScope(scope: HomeScope): Station[] {
  if (scope === 'all') return allStations;
  return allStations.filter((station) => station.country === scope);
}

export function getStationImageUrl(stationName: string): string | null {
  return bakedStationImages[stationName] ?? null;
}

export function getHotelsForStation(stationName: string): Hotel[] {
  return bakedHotels[stationName] ?? [];
}

export function getSummaryForStation(stationName: string): string | null {
  return bakedSummariesEn[stationName] ?? null;
}

export function getCpCode(stationName: string): string | null {
  return bakedCpCodes[stationName] ?? null;
}

export function getBookingSearchUrl(station: Station): string {
  const countryName = stationCountryDisplayName(station.country);
  return `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(station.name + ', ' + countryName)}&nflt=distance%3D2000%3Bprice%3DUSD-min-60-1&order=price`;
}

export function isAirportStation(station: Station): boolean {
  return stationHasAirportType(station);
}

function stationCountryDisplayName(country: string): string {
  if (country === 'es') return 'Spain';
  if (country === 'pt') return 'Portugal';
  const iso = country.trim().toUpperCase();
  if (/^[A-Z]{2}$/.test(iso)) {
    try {
      const name = new Intl.DisplayNames(['en'], { type: 'region' }).of(iso);
      if (name) return name;
    } catch {
      // fall through
    }
  }
  return country;
}

function stationHasAirportType(station: { types: string[] }): boolean {
  return station.types.includes('Airport') || station.types.includes('Airport Destination');
}
