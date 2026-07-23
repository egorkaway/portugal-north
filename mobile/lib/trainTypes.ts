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

/** Matches web `typeColors` in StationCard / Station page. */
const TRAIN_TYPE_COLORS: Record<string, string> = {
  Airport: '#0284C7',
  'Airport Destination': '#0EA5E9',
  'Alfa Pendular': theme.primary,
  Intercidades: '#E89B3C',
  Regional: theme.accent,
  Urban: '#94A3B8',
  Metro: '#7C3AED',
  'Inactive / Historic': '#B8C4CE',
};

export function getTrainTypeAbbrev(type: string): string {
  return TRAIN_TYPE_ABBREV[type] ?? type;
}

export function getTrainTypeColor(type: string): string {
  return TRAIN_TYPE_COLORS[type] ?? theme.primaryMuted;
}
