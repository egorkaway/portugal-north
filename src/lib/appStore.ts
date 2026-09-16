/** VeryStays iOS App Store listing (released). */
export const APP_STORE_APP_ID = "6789983242";

export const APP_STORE_URL =
  "https://apps.apple.com/pt/app/verystays-trains-in-iberia/id6789983242?l=en-GB";

/** Safari Smart App Banner content value. */
export const APPLE_ITUNES_APP_META = `app-id=${APP_STORE_APP_ID}`;

const BADGE_LOCALE: Record<string, string> = {
  en: "en-us",
  pt: "pt-pt",
  es: "es-es",
  gl: "es-es",
  ca: "es-es",
};

/** Official white App Store badge (for dark backgrounds). */
export function appStoreBadgeSrc(locale: string): string {
  const badgeLocale = BADGE_LOCALE[locale] ?? "en-us";
  return `https://toolbox.marketingtools.apple.com/api/badges/download-on-the-app-store/white/${badgeLocale}?size=250x83`;
}
