/** Read a JSON object stored in a document cookie (SameSite=Lax, path=/). */
export function readCookieJson<T extends Record<string, unknown>>(
  cookieName: string,
): T {
  if (typeof document === "undefined") return {} as T;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${cookieName}=`));
  if (!match) return {} as T;
  try {
    return (JSON.parse(decodeURIComponent(match.split("=")[1])) as T) || ({} as T);
  } catch {
    return {} as T;
  }
}

export function writeCookieJson(cookieName: string, value: Record<string, unknown>) {
  const encoded = encodeURIComponent(JSON.stringify(value));
  document.cookie = `${cookieName}=${encoded}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
}
