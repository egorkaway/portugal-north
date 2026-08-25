import { theme } from '@/constants/theme';

const TRAIN_TYPE_ABBREV: Record<string, string> = {
  Airport: 'Airport',
  'Airport Destination': 'Airport',
  'Alfa Pendular': 'AP',
  Intercidades: 'IC',
  Regional: 'R',
  Urban: 'U',
  Metro: 'Metro',
  'Inactive / Historic': 'Historic',
};

/**
 * High-contrast colours for dots and service-type labels on light surfaces
 * (white cards + muted zebra stripes). Hue-separated so types stay distinct.
 */
const TRAIN_TYPE_COLORS: Record<string, string> = {
  Airport: '#0369A1',
  'Airport Destination': '#0284C7',
  /** Brand teal — premium long-distance */
  'Alfa Pendular': '#0F5C4E',
  /** Burnt orange — intercity */
  Intercidades: '#B45309',
  /** Forest green — regional / IR (not the pale sky accent) */
  Regional: '#166534',
  Urban: '#475569',
  Metro: '#6D28D9',
  Internacional: '#0F766E',
  'Inactive / Historic': '#64748B',
};

export function getTrainTypeAbbrev(type: string): string {
  return TRAIN_TYPE_ABBREV[type] ?? type;
}

export function getTrainTypeColor(type: string): string {
  return TRAIN_TYPE_COLORS[type] ?? theme.primaryMuted;
}

/**
 * Text colour for a live/history service-type label.
 * Same palette as dots so history, departures, and station chips stay consistent.
 */
export function getServiceTypeTextColor(serviceType: string | null | undefined): string {
  if (!serviceType) return '#475569';
  if (serviceType.includes('Alfa')) return TRAIN_TYPE_COLORS['Alfa Pendular'];
  if (serviceType.includes('Intercidades') || serviceType.includes('Celta')) {
    return TRAIN_TYPE_COLORS.Intercidades;
  }
  if (serviceType.includes('Regional') || serviceType.includes('InterRegional')) {
    return TRAIN_TYPE_COLORS.Regional;
  }
  if (serviceType.includes('Urban') || serviceType.includes('Urbano')) {
    return TRAIN_TYPE_COLORS.Urban;
  }
  if (serviceType.includes('Metro')) return TRAIN_TYPE_COLORS.Metro;
  if (serviceType.includes('Internacional')) return TRAIN_TYPE_COLORS.Internacional;
  return '#475569';
}

/** Catalog tags that should not appear as home-list filter chips. */
const TRAIN_TYPE_FILTER_EXCLUSIONS = new Set(['Internacional']);

export function isTrainTypeFilterChip(type: string): boolean {
  return !TRAIN_TYPE_FILTER_EXCLUSIONS.has(type);
}
