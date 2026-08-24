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

/**
 * High-contrast filled badges on light surfaces (station cards, filters).
 * Hue-separated: teal / orange / forest / slate / violet / sky.
 */
export const TRAIN_TYPE_BADGE_CLASSES: Record<string, string> = {
  Airport: "bg-sky-700 text-white",
  "Airport Destination": "bg-sky-600 text-white",
  "Alfa Pendular": "bg-[#0F5C4E] text-white",
  Intercidades: "bg-[#B45309] text-white",
  Regional: "bg-[#166534] text-white",
  Urban: "bg-slate-600 text-white",
  Internacional: "bg-teal-700 text-white",
  Metro: "bg-violet-700 text-white",
  "Inactive / Historic": "bg-slate-400 text-white opacity-80",
};

export function getTrainTypeBadgeClass(type: string): string {
  return TRAIN_TYPE_BADGE_CLASSES[type] ?? "bg-muted text-muted-foreground";
}

/** Inline text colour classes for departures / arrivals / trip history. */
export function getServiceTypeTextClass(serviceType: string | null | undefined): string {
  if (!serviceType) return "font-medium text-foreground/70";
  if (serviceType.includes("Alfa")) return "font-semibold text-[#0F5C4E]";
  if (serviceType.includes("Intercidades") || serviceType.includes("Celta")) {
    return "font-semibold text-[#B45309]";
  }
  if (serviceType.includes("Regional") || serviceType.includes("InterRegional")) {
    return "font-semibold text-[#166534]";
  }
  if (serviceType.includes("Urban") || serviceType.includes("Urbano")) {
    return "font-semibold text-slate-600";
  }
  if (serviceType.includes("Metro")) return "font-semibold text-violet-700";
  if (serviceType.includes("Internacional")) return "font-semibold text-teal-700";
  return "font-medium text-foreground/70";
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
