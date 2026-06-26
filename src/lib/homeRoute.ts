import { getStationsForCountry } from "@/data/stationRegistry";
import {
  COUNTRY_CODES,
  DEFAULT_COUNTRY,
  isCountryCode,
  type CountryCode,
} from "@/lib/countries";
import { HOME_STATIONS_PAGE_SIZE } from "@/lib/paginate";

/** `/pt`, `/es/2`, optional `?q=` search. Page 1 omits the page segment. */
export function buildHomePath(
  country: CountryCode,
  page = 1,
  searchParams?: URLSearchParams | Pick<URLSearchParams, "get" | "toString">,
): string {
  const base = page <= 1 ? `/${country}` : `/${country}/${page}`;
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
  for (const country of COUNTRY_CODES) {
    if (pathname === `/${country}`) return true;
    if (pathname.startsWith(`/${country}/`)) return true;
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
  const country = countryFromLegacySearchParams(params) ?? DEFAULT_COUNTRY;
  const page = pageFromLegacySearchParams(params);
  const q = params.get("q");
  const next = new URLSearchParams();
  if (q?.trim()) next.set("q", q);
  return buildHomePath(country, page, next);
}

export function homePageCountForCountry(country: CountryCode): number {
  const total = getStationsForCountry(country).length;
  return Math.max(1, Math.ceil(total / HOME_STATIONS_PAGE_SIZE));
}

export function getHomeSitemapPaths(): string[] {
  const paths: string[] = [];
  for (const country of COUNTRY_CODES) {
    const pages = homePageCountForCountry(country);
    for (let page = 1; page <= pages; page++) {
      paths.push(buildHomePath(country, page));
    }
  }
  return paths;
}

export function parseHomeCanonicalPath(
  pathname: string,
): { country: CountryCode; page: number } | null {
  const normalized = pathname.replace(/\/$/, "") || "/";
  if (normalized === "/") return { country: DEFAULT_COUNTRY, page: 1 };

  const match = normalized.match(/^\/(pt|es)(?:\/(\d+))?$/);
  if (!match) return null;

  const country = match[1] as CountryCode;
  const page = match[2] ? parseHomePageParam(match[2]) : 1;
  if (page < 1) return null;
  return { country, page };
}
