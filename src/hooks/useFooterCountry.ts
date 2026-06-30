import { useLocation } from "react-router-dom";
import { DEFAULT_COUNTRY, readStoredCountry, type CountryCode } from "@/lib/countries";
import { parseHomeCanonicalPath } from "@/lib/homeRoute";

/** Country for footer promos: explicit override, home URL, then last home selection. */
export function useFooterCountry(override?: CountryCode): CountryCode {
  const { pathname } = useLocation();

  if (override) return override;

  const fromPath = parseHomeCanonicalPath(pathname);
  if (fromPath) return fromPath.country;

  return readStoredCountry() ?? DEFAULT_COUNTRY;
}
