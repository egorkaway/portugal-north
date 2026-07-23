/** Canonical order for filter chips and badges. */
export const TRAIN_TYPE_ORDER = [
  "Airport",
  "Airport Destination",
  "Alfa Pendular",
  "Intercidades",
  "Regional",
  "Urban",
  "Metro",
  "Inactive / Historic",
] as const;

const TRAIN_TYPE_ABBREV: Record<string, string> = {
  Airport: "Airport",
  "Airport Destination": "Airport",
  "Alfa Pendular": "AP",
  Intercidades: "IC",
  Regional: "R",
  Urban: "U",
  Metro: "Metro",
  "Inactive / Historic": "Historic",
};

export function getTrainTypeAbbrev(type: string): string {
  return TRAIN_TYPE_ABBREV[type] ?? type;
}

/** Badge colour classes per service type, shared across station and line pages. */
export const TRAIN_TYPE_BADGE_CLASSES: Record<string, string> = {
  Airport: "bg-sky-600 text-white",
  "Airport Destination": "bg-sky-500 text-white",
  "Alfa Pendular": "bg-primary text-primary-foreground",
  Intercidades: "bg-secondary text-secondary-foreground",
  Regional: "bg-accent text-accent-foreground",
  Urban: "bg-muted text-muted-foreground",
  Internacional: "bg-teal-600 text-white",
  Metro: "bg-violet-600 text-white",
  "Inactive / Historic": "bg-muted text-muted-foreground opacity-60",
};

export function getTrainTypeBadgeClass(type: string): string {
  return TRAIN_TYPE_BADGE_CLASSES[type] ?? "bg-muted text-muted-foreground";
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
