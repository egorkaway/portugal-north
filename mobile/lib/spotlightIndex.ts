import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import ExpoCoreSpotlight, { type CoreSpotlightItem } from 'expo-core-spotlight';
import {
  allStations,
  getSummaryForStation,
  stationToSlug,
  type Station,
} from '@/lib/stationData';

const DOMAIN = 'com.iberian.travel.stations';
const INDEX_VERSION_KEY = '@verystays/spotlight_stations_version';
/** Bump when indexed fields or URL shape change. */
const INDEX_PAYLOAD_VERSION = '1';
const INDEX_CHUNK_SIZE = 80;

function countryLabel(country: Station['country']): string {
  return country === 'es' ? 'Spain' : 'Portugal';
}

export function buildStationSpotlightItem(station: Station): CoreSpotlightItem {
  const slug = stationToSlug(station.name);
  const url = `verystays://station/${slug}`;
  const summary = getSummaryForStation(station.name);
  const lines = station.lines.join(', ');
  const contentDescription = summary
    ? summary.slice(0, 240)
    : `${lines || 'Train station'} · ${countryLabel(station.country)}`;

  const keywords = [
    station.name,
    ...station.lines,
    ...station.types,
    countryLabel(station.country),
    station.country === 'pt' ? 'Portugal' : 'España',
    'train',
    'station',
    'VeryStays',
  ].filter(Boolean);

  return {
    uniqueIdentifier: url,
    title: station.name,
    contentDescription,
    keywords: [...new Set(keywords)],
    url,
    domainIdentifier: DOMAIN,
    latitude: station.lat,
    longitude: station.lng,
  };
}

export function buildStationSpotlightItems(
  stations: readonly Station[] = allStations,
): CoreSpotlightItem[] {
  return stations.map(buildStationSpotlightItem);
}

function indexVersionToken(): string {
  return `${INDEX_PAYLOAD_VERSION}:${allStations.length}`;
}

async function indexInChunks(items: CoreSpotlightItem[]): Promise<void> {
  for (let i = 0; i < items.length; i += INDEX_CHUNK_SIZE) {
    await ExpoCoreSpotlight.indexItems(items.slice(i, i + INDEX_CHUNK_SIZE));
  }
}

/**
 * Indexes station names, lines, types, and summaries into iOS Spotlight
 * so users can find stations from system search and open them in-app.
 */
export async function ensureStationsSpotlightIndex(): Promise<void> {
  if (Platform.OS !== 'ios') return;

  try {
    const available = await ExpoCoreSpotlight.isAvailable();
    if (!available) return;

    const version = indexVersionToken();
    const previous = await AsyncStorage.getItem(INDEX_VERSION_KEY);
    if (previous === version) return;

    const items = buildStationSpotlightItems();
    await ExpoCoreSpotlight.removeAllItemsFromDomain(DOMAIN);
    await indexInChunks(items);
    await AsyncStorage.setItem(INDEX_VERSION_KEY, version);
  } catch (error) {
    console.warn('[spotlight] failed to index stations', error);
  }
}
