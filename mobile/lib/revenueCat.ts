import { Platform } from 'react-native';
import Purchases, {
  LOG_LEVEL,
  type CustomerInfo,
  type PurchasesOffering,
  type PurchasesPackage,
} from 'react-native-purchases';
import RevenueCatUI, { PAYWALL_RESULT } from 'react-native-purchases-ui';
import {
  MONTHLY_PACKAGE_ID,
  PRO_ENTITLEMENT_ID,
  REVENUECAT_API_KEYS,
  isRevenueCatTestStoreKey,
} from '@/constants/revenueCat';
import { withTimeout } from '@/lib/timeout';

/** Soft timeout so paywalls never block onboarding / navigation forever. */
const PAYWALL_TIMEOUT_MS = 20_000;

let configureAttempted = false;
let configureSucceeded = false;

export function isPurchasesSupportedPlatform(): boolean {
  return Platform.OS === 'ios' || Platform.OS === 'android';
}

export function isPurchasesReady(): boolean {
  return configureSucceeded;
}

/** True once configure was attempted (success or failure). */
export function isPurchasesBootstrapFinished(): boolean {
  return configureAttempted;
}

/**
 * Wait until configure finishes or `ms` elapses. Always resolves — never throws.
 */
export async function waitForPurchasesBootstrap(ms = 2500): Promise<boolean> {
  if (!isPurchasesSupportedPlatform()) return false;
  if (configureAttempted) return configureSucceeded;

  const started = Date.now();
  while (!configureAttempted && Date.now() - started < ms) {
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  return configureSucceeded;
}

export function isProEntitlementActive(info: CustomerInfo | null | undefined): boolean {
  if (!info) return false;
  return Boolean(info.entitlements.active[PRO_ENTITLEMENT_ID]);
}

function serializePurchasesError(error: unknown): Record<string, unknown> {
  if (!error || typeof error !== 'object') {
    return { message: String(error) };
  }
  const err = error as Record<string, unknown> & { message?: string; code?: unknown };
  const info =
    err.userInfo && typeof err.userInfo === 'object'
      ? (err.userInfo as Record<string, unknown>)
      : undefined;
  return {
    message: err.message ?? String(error),
    code: err.code,
    readableErrorCode: err.readableErrorCode ?? info?.readableErrorCode,
    underlyingErrorMessage: err.underlyingErrorMessage ?? info?.underlyingErrorMessage,
    readable_error_code: info?.readable_error_code,
    NSUnderlyingError: info?.NSUnderlyingError ?? info?.underlyingError,
  };
}

const CUSTOMER_INFO_TIMEOUT_MS = 5_000;

/**
 * Configure RevenueCat once. Never throws — failures leave purchases unavailable
 * so the rest of the app keeps working on simulators, offline devices, etc.
 *
 * Important: Test Store keys (`test_…`) must never be passed to
 * Purchases.configure in Release — the native SDK calls fatalError and kills
 * the process (not a catchable JS exception).
 */
export async function configurePurchases(): Promise<boolean> {
  if (configureSucceeded) return true;
  if (!isPurchasesSupportedPlatform()) {
    configureAttempted = true;
    return false;
  }

  configureAttempted = true;

  try {
    Purchases.setLogLevel(__DEV__ ? LOG_LEVEL.DEBUG : LOG_LEVEL.INFO);

    const apiKey =
      Platform.OS === 'ios' ? REVENUECAT_API_KEYS.ios : REVENUECAT_API_KEYS.android;

    if (!apiKey || apiKey.trim().length === 0) {
      if (__DEV__) {
        console.warn('[purchases] missing API key — skipping configure');
      }
      return false;
    }

    // Native SDK aborts the process if a Test Store key is used in Release.
    // Skip configure entirely so TestFlight/Release builds stay stable.
    if (isRevenueCatTestStoreKey(apiKey) && !__DEV__) {
      console.warn(
        '[purchases] skipping configure: Test Store key is not allowed in Release. Use appl_/goog_ keys.',
      );
      return false;
    }

    Purchases.configure({ apiKey });
    configureSucceeded = true;

    // Play Billing / identifier collection can hang on some Android devices.
    // Never await them during bootstrap — the rest of the app must stay usable.
    void Purchases.collectDeviceIdentifiers().catch((error) => {
      console.warn('[purchases] collectDeviceIdentifiers failed', error);
    });
    void Purchases.getOfferings()
      .then((offerings) => {
        const current = offerings.current;
        console.log('[purchases] offerings', {
          keyPrefix: apiKey.slice(0, 5),
          currentId: current?.identifier ?? null,
          packageCount: current?.availablePackages.length ?? 0,
          packageIds: current?.availablePackages.map((pkg) => pkg.identifier) ?? [],
          productIds:
            current?.availablePackages.map((pkg) => pkg.product.identifier) ?? [],
        });
      })
      .catch((error) => {
        console.warn(
          '[purchases] getOfferings failed after configure',
          serializePurchasesError(error),
        );
      });

    return true;
  } catch (error) {
    configureSucceeded = false;
    console.warn('[purchases] configure failed', error);
    return false;
  }
}

export async function getCustomerInfoSafe(): Promise<CustomerInfo | null> {
  if (!configureSucceeded) return null;
  try {
    const configured = await withTimeout(
      Purchases.isConfigured(),
      CUSTOMER_INFO_TIMEOUT_MS,
      'purchases.isConfigured',
    );
    if (!configured) return null;
    return await withTimeout(
      Purchases.getCustomerInfo(),
      CUSTOMER_INFO_TIMEOUT_MS,
      'purchases.getCustomerInfo',
    );
  } catch (error) {
    console.warn('[purchases] getCustomerInfo failed', error);
    return null;
  }
}

export async function getCustomerInfo(): Promise<CustomerInfo> {
  const info = await getCustomerInfoSafe();
  if (!info) {
    throw new Error('[purchases] not configured or customer info unavailable');
  }
  return info;
}

export async function getCurrentOffering(): Promise<PurchasesOffering | null> {
  if (!configureSucceeded) return null;
  try {
    const offerings = await Purchases.getOfferings();
    return offerings.current ?? null;
  } catch (error) {
    console.warn('[purchases] getOfferings failed', error);
    return null;
  }
}

export function findMonthlyPackage(
  offering: PurchasesOffering | null,
): PurchasesPackage | null {
  if (!offering) return null;
  return (
    offering.availablePackages.find((pkg) => pkg.identifier === MONTHLY_PACKAGE_ID) ??
    offering.availablePackages.find((pkg) => pkg.identifier === '$rc_monthly') ??
    offering.monthly ??
    null
  );
}

export async function restorePurchasesSafe(): Promise<CustomerInfo | null> {
  if (!configureSucceeded) return null;
  try {
    return await Purchases.restorePurchases();
  } catch (error) {
    console.warn('[purchases] restore failed', error);
    return null;
  }
}

export async function restorePurchases(): Promise<CustomerInfo> {
  const info = await restorePurchasesSafe();
  if (!info) {
    throw new Error('[purchases] restore unavailable');
  }
  return info;
}

function paywallUnlockedPro(result: PAYWALL_RESULT): boolean {
  return result === PAYWALL_RESULT.PURCHASED || result === PAYWALL_RESULT.RESTORED;
}

/**
 * Always present the current offering paywall (Tickets CTA).
 * Returns true if the user purchased or restored Pro. Never throws.
 */
export async function presentProPaywall(): Promise<boolean> {
  if (!configureSucceeded) return false;
  try {
    const result = await withTimeout(
      RevenueCatUI.presentPaywall({ displayCloseButton: true }),
      PAYWALL_TIMEOUT_MS,
      'presentPaywall',
    );
    return paywallUnlockedPro(result);
  } catch (error) {
    console.warn('[purchases] presentPaywall failed', serializePurchasesError(error));
    return false;
  }
}

/**
 * Present the paywall only when `iberian.travel Pro` is not active
 * (post-onboarding flow). Never throws; times out so finish() always continues.
 */
export async function presentProPaywallIfNeeded(): Promise<boolean> {
  if (!configureSucceeded) return false;
  try {
    const result = await withTimeout(
      RevenueCatUI.presentPaywallIfNeeded({
        requiredEntitlementIdentifier: PRO_ENTITLEMENT_ID,
        displayCloseButton: true,
      }),
      PAYWALL_TIMEOUT_MS,
      'presentPaywallIfNeeded',
    );
    return paywallUnlockedPro(result);
  } catch (error) {
    console.warn('[purchases] presentPaywallIfNeeded failed', serializePurchasesError(error));
    return false;
  }
}

export {
  Purchases,
  PAYWALL_RESULT,
  PRO_ENTITLEMENT_ID,
};
export type { CustomerInfo, PurchasesOffering, PurchasesPackage };
