/**
 * RevenueCat Web (Web Billing) settings for VeryStays / iberian.travel.
 *
 * This mirrors the mobile config in `mobile/constants/revenueCat.ts`, but the
 * web app uses the RevenueCat **Web SDK** (`@revenuecat/purchases-js`) which
 * needs its own *Web Billing* public API key — the `appl_…` / `goog_…` / native
 * `test_…` keys used on mobile will NOT work here.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * WHERE TO GET THE WEB KEY (paste into env, not here):
 *   RevenueCat dashboard → Project → Project Settings → API keys → look for the
 *   Web Billing app's *public* key (`rcb_…` production, `rcb_sb_…` sandbox).
 *   For local-only Test Store iteration you can use a `test_…` key in `npm run dev`
 *   (refused in production builds — unlike native, the Web SDK won't crash, but we
 *   skip configure so a stray test key never ships live).
 *
 *   Do NOT paste mobile native keys here (`appl_…`, `goog_…`, or the mobile
 *   `test_…` from `mobile/constants/revenueCat.ts`) — they are a different SDK.
 *   Put whichever valid web key you use into `VITE_REVENUECAT_WEB_API_KEY`
 *   (see `.env.example`). Leave unset to disable RevenueCat (safe for deploy).
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * The key is a *public* SDK key and is safe to ship in the client bundle, but we
 * still read it from env so prod/dev/preview can differ and so nothing lands in
 * git by default.
 */

/**
 * Web Billing public SDK key, injected at build time via Vite env.
 * Empty string when unset — `configureRevenueCat()` then soft-skips (no crash).
 */
export const REVENUECAT_WEB_API_KEY: string =
  import.meta.env.VITE_REVENUECAT_WEB_API_KEY ?? "";

/** Entitlement identifier — must match the RevenueCat dashboard exactly. */
export const PRO_ENTITLEMENT_ID = "iberian.travel Pro";

/** Preferred package identifier for the monthly product on the current offering. */
export const MONTHLY_PACKAGE_ID = "monthly";

/**
 * True for RevenueCat Test Store keys (`test_…`).
 *
 * The native mobile SDK *fatally aborts* on Test Store keys in Release builds.
 * The web SDK does not crash, but we mirror that philosophy and refuse to
 * configure with a Test Store key in production so a stray test key can never
 * leak into a live deployment. Use `npm run dev` locally, or a Web Billing
 * sandbox key (`rcb_sb_…`) on preview/production until you have `rcb_…`.
 */
export function isRevenueCatTestStoreKey(apiKey: string): boolean {
  return apiKey.trim().toLowerCase().startsWith("test_");
}

/**
 * True for native iOS/Android public SDK keys (`appl_…`, `goog_…`).
 * These belong to react-native-purchases, not `@revenuecat/purchases-js`.
 */
export function isRevenueCatNativeMobileKey(apiKey: string): boolean {
  const normalized = apiKey.trim().toLowerCase();
  return normalized.startsWith("appl_") || normalized.startsWith("goog_");
}
