export const COUNTRY_CODES = ["pt", "es"] as const;

export type CountryCode = (typeof COUNTRY_CODES)[number];

export const COUNTRY_FLAGS: Record<CountryCode, string> = {
  pt: "🇵🇹",
  es: "🇪🇸",
};

export const DEFAULT_COUNTRY: CountryCode = "pt";

export const COUNTRY_STORAGE_KEY = "verystays-country";

export function isCountryCode(value: string | null | undefined): value is CountryCode {
  return value === "pt" || value === "es";
}

export function readStoredCountry(): CountryCode | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const stored = localStorage.getItem(COUNTRY_STORAGE_KEY);
    return isCountryCode(stored) ? stored : null;
  } catch {
    return null;
  }
}

export function writeStoredCountry(country: CountryCode): void {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(COUNTRY_STORAGE_KEY, country);
  } catch {
    // Safari private mode / blocked storage
  }
}

export function countrySearchLabel(country: CountryCode): string {
  return country === "es" ? "Spain" : "Portugal";
}
