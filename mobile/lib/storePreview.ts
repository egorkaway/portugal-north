import { Settings } from 'react-native';
import { completeOnboarding } from '@/lib/onboardingStorage';
import type { StationDeparture } from '@/lib/types';

const SETTINGS_KEY = 'goldiePreview';
const PREVIEW_SCHEME = 'verystays://goldie-preview';

const LONG_DISTANCE_TYPES = new Set(['Alfa Pendular', 'Intercidades']);

/** App Store capture only — Goldie opens this URL after a fresh install. */
export function isStorePreviewUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  return url.startsWith(PREVIEW_SCHEME) || url.includes('goldie-preview');
}

export function isStorePreview(): boolean {
  const value = Settings.get(SETTINGS_KEY);
  return value === true || value === '1' || value === 1;
}

export async function enableStorePreview(): Promise<void> {
  Settings.set({ [SETTINGS_KEY]: true });
  await completeOnboarding();
}

export function isLongDistanceDeparture(departure: StationDeparture): boolean {
  return LONG_DISTANCE_TYPES.has(departure.serviceType);
}

/** Keep live trains; put Alfa / InterCity first so Take hits a real long-distance row. */
export function withStorePreviewDepartures(
  stationName: string,
  departures: StationDeparture[],
): StationDeparture[] {
  if (!isStorePreview() || stationName !== 'Lisboa Oriente') return departures;
  const longDistance = departures.filter(isLongDistanceDeparture);
  if (longDistance.length === 0) return departures;
  const rest = departures.filter((row) => !isLongDistanceDeparture(row));
  return [...longDistance, ...rest];
}
