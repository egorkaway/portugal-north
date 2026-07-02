import { useLocation } from "react-router-dom";
import {
  DEFAULT_HOME_SCOPE,
  footerCountryFromHomeScope,
  readStoredHomeScope,
  type CountryCode,
} from "@/lib/countries";
import { parseHomeCanonicalPath } from "@/lib/homeRoute";

/** Country for footer promos: explicit override, home URL, then last home selection. */
export function useFooterCountry(override?: CountryCode): CountryCode {
  const { pathname } = useLocation();

  if (override) return override;

  const fromPath = parseHomeCanonicalPath(pathname);
  if (fromPath) return footerCountryFromHomeScope(fromPath.scope);

  const stored = readStoredHomeScope();
  if (stored) return footerCountryFromHomeScope(stored);

  return footerCountryFromHomeScope(DEFAULT_HOME_SCOPE);
}
