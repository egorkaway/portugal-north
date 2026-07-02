import { getStationsForHomeScope } from "../data/stationRegistry";
import {
  COUNTRY_CODES,
  DEFAULT_HOME_SCOPE,
  isCountryCode,
  type CountryCode,
  type HomeScope,
} from "./countries";
import { HOME_STATIONS_PAGE_SIZE } from "./paginate";

export function defaultHomePath(page = 1): string {
  return buildHomePath(DEFAULT_HOME_SCOPE, page);
}

/** `/pt`, `/es`, `/all`, optional page segment and `?q=` search. Page 1 omits the page segment. */
export function buildHomePath(
  scope: HomeScope,
  page = 1,
  searchParams?: URLSearchParams | Pick<URLSearchParams, "get" | "toString">,
): string {
  const base = page <= 1 ? `/${scope}` : `/${scope}/${page}`;
  if (!searchParams) return base;

  const q = new URLSearchParams();
  const query = searchParams.get("q");
  if (query?.trim()) q.set("q", query);
  const qs = q.toString();
  return qs ? `${base}?${qs}` : base;
}

export function parseHomePageParam(value: string | undefined): number {
  if (!value) return 1;
  const raw = Number.parseInt(value, 10);
  if (!Number.isFinite(raw) || raw < 1 || String(raw) !== value) return -1;
  return raw;
}

export function homePathToOutFile(canonicalPath: string): string {
  return `${canonicalPath.replace(/^\//, "")}/index.html`;
}

export function isHomePath(pathname: string): boolean {
  if (pathname === "/") return true;
  for (const scope of [...COUNTRY_CODES, "all"] as HomeScope[]) {
    if (pathname === `/${scope}`) return true;
    if (pathname.startsWith(`/${scope}/`)) return true;
  }
  return false;
}

export function countryFromLegacySearchParams(params: URLSearchParams): CountryCode | null {
  const value = params.get("country");
  return isCountryCode(value) ? value : null;
}

export function pageFromLegacySearchParams(params: URLSearchParams): number {
  const raw = Number.parseInt(params.get("page") ?? "1", 10);
  return Number.isFinite(raw) && raw > 0 ? raw : 1;
}

export function resolveLegacyHomePath(params: URLSearchParams): string {
  const country = countryFromLegacySearchParams(params);
  const scope: HomeScope = country ?? DEFAULT_HOME_SCOPE;
  const page = pageFromLegacySearchParams(params);
  const q = params.get("q");
  const next = new URLSearchParams();
  if (q?.trim()) next.set("q", q);
  return buildHomePath(scope, page, next);
}

export function homePageCountForHomeScope(scope: HomeScope): number {
  const total = getStationsForHomeScope(scope).length;
  return Math.max(1, Math.ceil(total / HOME_STATIONS_PAGE_SIZE));
}

/** @deprecated Use homePageCountForHomeScope */
export function homePageCountForCountry(country: CountryCode): number {
  return homePageCountForHomeScope(country);
}

export function getHomeSitemapPaths(): string[] {
  const paths: string[] = [];
  const scopes: HomeScope[] = ["all", ...COUNTRY_CODES];
  for (const scope of scopes) {
    const pages = homePageCountForHomeScope(scope);
    for (let page = 1; page <= pages; page++) {
      paths.push(buildHomePath(scope, page));
    }
  }
  return paths;
}

export function parseHomeCanonicalPath(
  pathname: string,
): { scope: HomeScope; page: number } | null {
  const normalized = pathname.replace(/\/$/, "") || "/";
  if (normalized === "/") return { scope: DEFAULT_HOME_SCOPE, page: 1 };

  const match = normalized.match(/^\/(pt|es|all)(?:\/(\d+))?$/);
  if (!match) return null;

  const scope = match[1] as HomeScope;
  const page = match[2] ? parseHomePageParam(match[2]) : 1;
  if (page < 1) return null;
  return { scope, page };
}
