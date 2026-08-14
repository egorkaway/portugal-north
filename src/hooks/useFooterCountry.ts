import { useLocation } from "react-router-dom";
import {
  DEFAULT_HOME_SCOPE,
  footerCountryFromHomeScope,
  readStoredHomeScope,
  type CountryCode,
  type HomeScope,
} from "@/lib/countries";
import { parseHomeCanonicalPath } from "@/lib/homeRoute";

function resolveHomeScope(pathname: string, override?: HomeScope): HomeScope {
  if (override) return override;

  const fromPath = parseHomeCanonicalPath(pathname);
  if (fromPath) return fromPath.scope;

  const stored = readStoredHomeScope();
  if (stored) return stored;

  return DEFAULT_HOME_SCOPE;
}

/** Home list scope for footer intro copy (PT / ES / both). */
export function useFooterHomeScope(override?: HomeScope): HomeScope {
  const { pathname } = useLocation();
  return resolveHomeScope(pathname, override);
}

/** Country for footer promos: explicit override, home URL, then last home selection. */
export function useFooterCountry(override?: CountryCode): CountryCode {
  const { pathname } = useLocation();

  if (override) return override;

  return footerCountryFromHomeScope(resolveHomeScope(pathname));
}

export function footerIntroMessageKeys(scope: HomeScope): {
  title: "footer.title" | "footer.titleSpain" | "footer.titleIberia";
  subtitle: "footer.subtitle" | "footer.subtitleSpain" | "footer.subtitleIberia";
} {
  if (scope === "es") {
    return { title: "footer.titleSpain", subtitle: "footer.subtitleSpain" };
  }
  if (scope === "pt") {
    return { title: "footer.title", subtitle: "footer.subtitle" };
  }
  return { title: "footer.titleIberia", subtitle: "footer.subtitleIberia" };
}
