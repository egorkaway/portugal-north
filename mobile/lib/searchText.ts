export function foldSearchText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase();
}

export function textIncludesSearch(haystack: string, needle: string): boolean {
  const foldedNeedle = foldSearchText(needle);
  if (!foldedNeedle) return true;
  return foldSearchText(haystack).includes(foldedNeedle);
}

export function stationMatchesSearch(
  station: { name: string; lines: string[] },
  query: string,
): boolean {
  const trimmed = query.trim();
  if (!trimmed) return true;
  if (textIncludesSearch(station.name, trimmed)) return true;
  return station.lines.some((line) => textIncludesSearch(line, trimmed));
}
