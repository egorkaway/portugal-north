export const theme = {
  primary: '#012841',
  primaryMuted: '#4A6274',
  background: '#F5F7F8',
  card: '#FFFFFF',
  border: '#E2E8EE',
  success: '#059669',
  warning: '#D97706',
  danger: '#DC2626',
  accent: '#7EC8E3',
} as const;

export const TRAIN_TYPE_ORDER = [
  'Alfa Pendular',
  'Intercidades',
  'Regional',
  'Urban',
  'Metro',
  'Airport',
  'Inactive / Historic',
] as const;

export function sortTrainTypes(types: string[]): string[] {
  return [...types].sort((a, b) => {
    const ai = TRAIN_TYPE_ORDER.indexOf(a as (typeof TRAIN_TYPE_ORDER)[number]);
    const bi = TRAIN_TYPE_ORDER.indexOf(b as (typeof TRAIN_TYPE_ORDER)[number]);
    const aRank = ai === -1 ? 99 : ai;
    const bRank = bi === -1 ? 99 : bi;
    return aRank - bRank || a.localeCompare(b);
  });
}

export const PAGE_SIZE = 30;
