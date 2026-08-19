/** Duplicate hotel names that should share one vote key and ranking row. */
export type HotelVoteAliasGroup = {
  stationName: string;
  canonicalName: string;
  aliases: string[];
};

/**
 * Live Blob votes are `station::hotelName`. There is no baked vote file, so
 * aliases combine leftover keys at read time and canonicalize new writes.
 */
export const hotelVoteAliasGroups: HotelVoteAliasGroup[] = [
  {
    stationName: "Vila Nova de Cerveira",
    canonicalName: "HI Vila Nova de Cerveira - Pousada de Juventude",
    aliases: [
      "Pousada de Juventude Vila Nova de Cerveira",
      "Pousada de Juventude de Vila Nova de Cerveira",
      "Pousada de Vila Nova de Cerveira",
    ],
  },
];

export function foldHotelName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function namesInGroup(group: HotelVoteAliasGroup): string[] {
  return [group.canonicalName, ...group.aliases];
}

export function canonicalHotelName(stationName: string, hotelName: string): string {
  const folded = foldHotelName(hotelName);
  if (!folded) return hotelName;

  for (const group of hotelVoteAliasGroups) {
    if (group.stationName !== stationName) continue;
    if (namesInGroup(group).some((name) => foldHotelName(name) === folded)) {
      return group.canonicalName;
    }
  }
  return hotelName;
}

export function canonicalHotelVoteKey(stationName: string, hotelName: string): string {
  return `${stationName}::${canonicalHotelName(stationName, hotelName)}`;
}

export function parseHotelKeyedRecord(key: string): { stationName: string; hotelName: string } {
  const sep = key.indexOf("::");
  if (sep <= 0) {
    return { stationName: "", hotelName: key };
  }
  return {
    stationName: key.slice(0, sep),
    hotelName: key.slice(sep + 2),
  };
}

export function mergeAliasedHotelKeyedRecords<T>(
  records: Record<string, T>,
  combine: (current: T, incoming: T) => T,
): Record<string, T> {
  const next: Record<string, T> = {};
  for (const [key, value] of Object.entries(records)) {
    const { stationName, hotelName } = parseHotelKeyedRecord(key);
    const canonical = stationName
      ? canonicalHotelVoteKey(stationName, hotelName)
      : key;
    const existing = next[canonical];
    next[canonical] = existing == null ? value : combine(existing, value);
  }
  return next;
}

export function mergeAliasedHotelRatings<T extends { up: number; down: number }>(
  ratings: Record<string, T>,
): Record<string, T> {
  return mergeAliasedHotelKeyedRecords(ratings, (current, incoming) => ({
    ...current,
    up: current.up + incoming.up,
    down: current.down + incoming.down,
  }));
}

export function mergeAliasedHotelClosedReports<T extends { reports: number }>(
  reports: Record<string, T>,
): Record<string, T> {
  return mergeAliasedHotelKeyedRecords(reports, (current, incoming) => ({
    ...current,
    reports: current.reports + incoming.reports,
  }));
}
