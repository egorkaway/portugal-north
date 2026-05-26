/** Production site origin, no trailing slash (matches prerender scripts and Vercel default). */
export const DEFAULT_SITE_URL = "https://www.verystays.com";

/** Resolved site origin; never empty so JSON-LD and canonical URLs stay absolute. */
export const SITE_URL = (
  (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, "") ||
  DEFAULT_SITE_URL
);

export function absoluteUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}
