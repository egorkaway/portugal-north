/** Numeric Pexels photo id from a CDN or page URL, e.g. …/photos/953125/…. */
export function pexelsPhotoIdFromUrl(url: string): string | null {
  const match = url.match(/pexels\.com\/photos\/(\d+)\//i);
  return match?.[1] ?? null;
}
