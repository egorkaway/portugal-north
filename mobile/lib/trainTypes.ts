const TRAIN_TYPE_ABBREV: Record<string, string> = {
  Airport: 'Airport',
  'Alfa Pendular': 'AP',
  Intercidades: 'IC',
  Regional: 'R',
  Urban: 'U',
  Metro: 'Metro',
  'Inactive / Historic': 'Historic',
};

export function getTrainTypeAbbrev(type: string): string {
  return TRAIN_TYPE_ABBREV[type] ?? type;
}
