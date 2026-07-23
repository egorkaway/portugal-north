export const COUNTRY_CODES = ["pt", "es"] as const;

export type CountryCode = (typeof COUNTRY_CODES)[number];

/** Home listing scope: one country or both. */
export type HomeScope = CountryCode | "all";

export const COUNTRY_FLAGS: Record<CountryCode, string> = {
  pt: "🇵🇹",
  es: "🇪🇸",
};

export const DEFAULT_COUNTRY: CountryCode = "pt";

export const DEFAULT_HOME_SCOPE: HomeScope = "all";

export const COUNTRY_STORAGE_KEY = "verystays-country";

export function isCountryCode(value: string | null | undefined): value is CountryCode {
  return value === "pt" || value === "es";
}

export function isHomeScope(value: string | null | undefined): value is HomeScope {
  return value === "all" || isCountryCode(value);
}

export function countriesForHomeScope(scope: HomeScope): CountryCode[] {
  if (scope === "all") return [...COUNTRY_CODES];
  return [scope];
}

export function homeScopeFromCountries(countries: CountryCode[]): HomeScope {
  const hasPt = countries.includes("pt");
  const hasEs = countries.includes("es");
  if (hasPt && hasEs) return "all";
  if (hasEs) return "es";
  return "pt";
}

export function toggleCountrySelection(
  selected: CountryCode[],
  code: CountryCode,
): CountryCode[] {
  const has = selected.includes(code);
  const next = has ? selected.filter((entry) => entry !== code) : [...selected, code];
  if (next.length === 0) return selected;
  return next.sort(
    (a, b) => COUNTRY_CODES.indexOf(a) - COUNTRY_CODES.indexOf(b),
  );
}

export function readStoredHomeScope(): HomeScope | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const stored = localStorage.getItem(COUNTRY_STORAGE_KEY);
    if (stored === "both" || stored === "pt,es" || stored === "es,pt") return "all";
    return isHomeScope(stored) ? stored : null;
  } catch {
    return null;
  }
}

export function writeStoredHomeScope(scope: HomeScope): void {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(COUNTRY_STORAGE_KEY, scope);
  } catch {
    // Safari private mode / blocked storage
  }
}

/** @deprecated Use readStoredHomeScope */
export function readStoredCountry(): CountryCode | null {
  const scope = readStoredHomeScope();
  if (!scope || scope === "all") return null;
  return scope;
}

/** @deprecated Use writeStoredHomeScope */
export function writeStoredCountry(country: CountryCode): void {
  writeStoredHomeScope(country);
}

export function footerCountryFromHomeScope(scope: HomeScope): CountryCode {
  // When the user is browsing both countries (`all`), we promote Sovnik in the footer.
  return scope === "pt" ? "pt" : "es";
}

export function countrySearchLabel(country: CountryCode): string {
  return country === "es" ? "Spain" : "Portugal";
}

/** Home path scope for a station (Europe destinations fall back to `/all`). */
export function homeScopeForStationCountry(country: string): HomeScope {
  return isCountryCode(country) ? country : "all";
}

/** Display name for booking/maps queries (ISO codes → English region name). */
export function stationCountryDisplayName(country: string, locale = "en"): string {
  if (country === "pt") return "Portugal";
  if (country === "es") return "Spain";
  const iso = country.trim().toUpperCase();
  if (/^[A-Z]{2}$/.test(iso)) {
    try {
      const name = new Intl.DisplayNames([locale], { type: "region" }).of(iso);
      if (name) return name;
    } catch {
      // fall through
    }
  }
  return country;
}
