import { stationImages } from "@/data/stationImages";

/** Bundled fallback when no station photo is available. */
export const STATION_IMAGE_PLACEHOLDER = "/station-placeholder.svg";

const PLACEHOLDER_URL_MARKERS = ["Comboios_de_Portugal_logo.svg"];

export function isPlaceholderImageUrl(url: string | undefined): boolean {
  if (!url) return true;
  if (url === STATION_IMAGE_PLACEHOLDER) return true;
  return PLACEHOLDER_URL_MARKERS.some((marker) => url.includes(marker));
}

/** Image for cards and station pages (always returns a URL). */
export function getStationImageUrl(stationName: string): string {
  const url = stationImages[stationName];
  if (url && !isPlaceholderImageUrl(url)) return url;
  return STATION_IMAGE_PLACEHOLDER;
}

/** Cache-bust URL for a single client-side reload after a failed image load. */
export function getStationImageReloadUrl(url: string): string {
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}_r=1`;
}

/** True when we have a real station photo (not a generic placeholder). */
export function hasRepresentativeStationImage(stationName: string): boolean {
  const url = stationImages[stationName];
  return Boolean(url && !isPlaceholderImageUrl(url));
}

/** Photo URL for Open Graph / JSON-LD, or undefined to use site default. */
export function getStationShareImageUrl(stationName: string): string | undefined {
  if (!hasRepresentativeStationImage(stationName)) return undefined;
  return stationImages[stationName];
}
