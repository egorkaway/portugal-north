const ALLOWED_HOSTS = new Set([
  "upload.wikimedia.org",
  "commons.wikimedia.org",
]);

export const STATION_PHOTO_USER_AGENT =
  "VeryStays/1.0 (https://www.verystays.com; station-photo)";

/** Resolve an allowlisted Wikimedia photo URL, or null if the request is unsafe. */
export function resolveStationPhotoUrl(raw: string | undefined): URL | null {
  if (!raw) return null;
  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    return null;
  }
  if (parsed.protocol !== "https:") return null;
  if (!ALLOWED_HOSTS.has(parsed.hostname)) return null;
  return parsed;
}
