/** Production site origin, no trailing slash. Defaults to https://www.verystays.com at build time. */
export const SITE_URL = (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(
  /\/$/,
  "",
) ?? "";

export function absoluteUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return SITE_URL ? `${SITE_URL}${normalized}` : normalized;
}
