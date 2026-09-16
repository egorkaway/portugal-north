/** My Personal Camino de Santiago — App Store listing. */
export const CAMINO_APP_STORE_URL =
  "https://apps.apple.com/pt/app/my-personal-camino-de-santiago/id6761839093?l=en-GB";

/** My Personal Camino de Santiago — Google Play listing. */
export const CAMINO_PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.camino.tracker.santiago";

export function isAndroidUserAgent(ua: string): boolean {
  return /Android/i.test(ua);
}

/** Prefer Play Store on Android; App Store elsewhere (iOS + desktop). */
export function caminoStoreUrl(ua?: string): string {
  const agent =
    ua ?? (typeof navigator !== "undefined" ? navigator.userAgent : "");
  return isAndroidUserAgent(agent) ? CAMINO_PLAY_STORE_URL : CAMINO_APP_STORE_URL;
}
