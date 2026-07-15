const ISO_COUNTRY_CODE = /^[A-Z]{2}$/;

/** Turn ISO 3166-1 alpha-2 codes (e.g. DE) into a display country name. */
export function formatCountryName(country: string, locale = "en"): string {
  const trimmed = country.trim();
  if (!trimmed) return "";

  if (ISO_COUNTRY_CODE.test(trimmed)) {
    try {
      const display = new Intl.DisplayNames([locale], { type: "region" });
      const name = display.of(trimmed);
      if (name) return name;
    } catch {
      // Intl unavailable or unknown code — fall through
    }
  }

  return trimmed;
}
