import stationsFull from '@/data/stations-full.json';
import stationImages from '@/data/stationImages.json';
import hotels from '@/data/hotels.json';
import summariesEn from '@/data/summaries-en.json';
import summariesPt from '@/data/summaries-pt.json';
import summariesEs from '@/data/summaries-es.json';
import summariesCa from '@/data/summaries-ca.json';
import summariesGl from '@/data/summaries-gl.json';
import reliabilityScores from '@/data/reliability-scores.json';
import spainReliabilityScores from '@/data/spain-reliability-scores.json';
import trainReliabilitySpotlight from '@/data/train-reliability-spotlight.json';
import cpStationCodes from '@/data/cpStationCodes.json';
import { canonicalHotelName, mergeAliasedHotelRatings } from '@/lib/hotelVoteAliases';
import type { Locale } from '@/i18n/types';

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

/** Iberian hubs/stops only — Europe destination airports stay in `allStations` for maps. */
export const pageStations = allStations.filter(
  (station) => !station.types.includes('Airport Destination'),
);

const publicStationNames = new Set(pageStations.map((station) => station.name));

export function pickPublicStationRatings(
  ratings: Record<string, { up: number; down: number }>,
): Record<string, { up: number; down: number }> {
  const next: Record<string, { up: number; down: number }> = {};
  for (const [name, counts] of Object.entries(ratings)) {
    if (publicStationNames.has(name)) next[name] = counts;
  }
  return next;
}

export function pickPublicHotelRatings(
  ratings: Record<string, { up: number; down: number }>,
): Record<string, { up: number; down: number }> {
  const next: Record<string, { up: number; down: number }> = {};
  for (const [key, counts] of Object.entries(ratings)) {
    const sep = key.indexOf('::');
    const stationName = sep > 0 ? key.slice(0, sep) : '';
    if (publicStationNames.has(stationName)) next[key] = counts;
  }
  return mergeAliasedHotelRatings(next);
}

export const bakedStationImages = stationImages as Record<string, string>;
export const bakedHotels = hotels as Record<string, Hotel[]>;
export const bakedSummariesEn = summariesEn as Record<string, string>;

const bakedSummariesByLocale: Partial<Record<Locale, Record<string, string>>> = {
  en: bakedSummariesEn,
  pt: summariesPt as Record<string, string>,
  es: summariesEs as Record<string, string>,
  ca: summariesCa as Record<string, string>,
  gl: summariesGl as Record<string, string>,
};
export const bakedReliabilityScores = reliabilityScores as ReliabilityScoresManifest;
export const bakedSpainReliabilityScores = spainReliabilityScores as ReliabilityScoresManifest;

export type TrainSpotlightEntry = {
  trainNumber: string;
  serviceType: string;
  avgDelayMinutes: number;
  observations: number;
  stationsSampled: number;
  majorStations: string[];
};

export type TrainReliabilitySpotlightManifest = {
  generatedAt: string;
  runCount: number;
  mostDelayed: TrainSpotlightEntry | null;
  mostReliable: (TrainSpotlightEntry & {
    selectionMode: 'stable' | 'rotating';
    poolSize: number;
  }) | null;
};

export const bakedTrainReliabilitySpotlight =
  trainReliabilitySpotlight as TrainReliabilitySpotlightManifest;
export const bakedCpCodes = cpStationCodes as Record<string, string>;

const stationBySlug = new Map(
  pageStations.map((station) => [stationToSlug(station.name), station]),
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
  if (scope === 'all') return pageStations;
  return pageStations.filter((station) => station.country === scope);
}

export function getStationImageUrl(stationName: string): string | null {
  return bakedStationImages[stationName] ?? null;
}

export function getHotelsForStation(stationName: string): Hotel[] {
  const hotels = bakedHotels[stationName] ?? [];
  const seen = new Set<string>();
  const out: Hotel[] = [];
  for (const hotel of hotels) {
    const name = canonicalHotelName(stationName, hotel.name);
    if (seen.has(name)) continue;
    seen.add(name);
    out.push(name === hotel.name ? hotel : { ...hotel, name });
  }
  return out;
}

export function getSummaryForStation(
  stationName: string,
  locale: Locale = 'en',
): string | null {
  return (
    bakedSummariesByLocale[locale]?.[stationName] ??
    bakedSummariesEn[stationName] ??
    null
  );
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
