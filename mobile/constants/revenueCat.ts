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
 * Currently using RevenueCat *test* keys so StoreKit / billing failures must
 * never crash the app. Swap to App Store / Play production keys before release.
 */
export const REVENUECAT_API_KEYS = {
  ios: 'test_SUliVovThJXraTvMAywLjwjCczj',
  /** Replace with the Google Play public SDK key when Android billing is enabled. */
  android: 'test_SUliVovThJXraTvMAywLjwjCczj',
} as const;

/** Entitlement identifier — must match RevenueCat dashboard exactly. */
export const PRO_ENTITLEMENT_ID = 'iberian.travel Pro';

/** Preferred package identifier for the monthly product on the current offering. */
export const MONTHLY_PACKAGE_ID = 'monthly';
