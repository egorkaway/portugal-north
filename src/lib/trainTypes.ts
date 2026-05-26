/** Canonical order for filter chips and badges. */
export const TRAIN_TYPE_ORDER = [
  "Alfa Pendular",
  "Intercidades",
  "Regional",
  "Urban",
  "Inactive / Historic",
] as const;

const TRAIN_TYPE_ABBREV: Record<string, string> = {
  "Alfa Pendular": "AP",
  Intercidades: "IC",
  Regional: "R",
  Urban: "U",
  "Inactive / Historic": "Historic",
};

export function getTrainTypeAbbrev(type: string): string {
  return TRAIN_TYPE_ABBREV[type] ?? type;
}

export function sortTrainTypes(types: string[]): string[] {
  const order = new Map(TRAIN_TYPE_ORDER.map((t, i) => [t, i]));
  return [...types].sort((a, b) => {
    const ia = order.get(a) ?? TRAIN_TYPE_ORDER.length;
    const ib = order.get(b) ?? TRAIN_TYPE_ORDER.length;
    if (ia !== ib) return ia - ib;
    return a.localeCompare(b);
  });
}
