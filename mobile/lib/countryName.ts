const ISO_COUNTRY_CODE = /^[A-Z]{2}$/;

export function formatCountryName(country: string, locale = 'en'): string {
  const trimmed = country.trim();
  if (!trimmed) return '';

  if (ISO_COUNTRY_CODE.test(trimmed)) {
    try {
      const display = new Intl.DisplayNames([locale], { type: 'region' });
      const name = display.of(trimmed);
      if (name) return name;
    } catch {
      // fall through
    }
  }

  return trimmed;
}
