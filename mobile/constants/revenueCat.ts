/**
 * RevenueCat project settings for VeryStays / iberian.travel.
 *
 * Dashboard setup (must match these identifiers):
 * - Entitlement: `iberian.travel Pro`
 * - Product: Monthly subscription
 * - Package identifier on the current Offering: `monthly` (or `$rc_monthly`)
 * - Attach a Paywall to the current Offering in the RevenueCat dashboard
 *
 * API keys are public SDK keys (safe in the client).
 *
 * `test_…` keys are RevenueCat Test Store keys. The native SDK **fatally
 * aborts** if they are used in a Release build (TestFlight / App Store).
 * We only configure the SDK with test keys in Debug (`__DEV__`); Release
 * builds skip purchases until you paste real `appl_…` / `goog_…` keys here.
 */
export const REVENUECAT_API_KEYS = {
  /** Debug-only Test Store key until an App Store (`appl_…`) key is set. */
  ios: 'test_SUliVovThJXraTvMAywLjwjCczj',
  /** Debug-only Test Store key until a Play (`goog_…`) key is set. */
  android: 'test_SUliVovThJXraTvMAywLjwjCczj',
} as const;

/** True for RevenueCat Test Store keys (`test_…`). Unsafe in Release. */
export function isRevenueCatTestStoreKey(apiKey: string): boolean {
  return apiKey.trim().toLowerCase().startsWith('test_');
}

/** Entitlement identifier — must match RevenueCat dashboard exactly. */
export const PRO_ENTITLEMENT_ID = 'iberian.travel Pro';

/** Preferred package identifier for the monthly product on the current offering. */
export const MONTHLY_PACKAGE_ID = 'monthly';
