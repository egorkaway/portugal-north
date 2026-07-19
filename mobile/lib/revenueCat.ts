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

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`[purchases] ${label} timed out after ${ms}ms`));
    }, ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

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
      return false;
    }

    Purchases.configure({ apiKey });
    configureSucceeded = true;

    try {
      await Purchases.collectDeviceIdentifiers();
    } catch (error) {
      // Device IDs are optional — never fail startup for attribution helpers.
      console.warn('[purchases] collectDeviceIdentifiers failed', error);
    }

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
    const configured = await Purchases.isConfigured();
    if (!configured) return null;
    return await Purchases.getCustomerInfo();
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
    console.warn('[purchases] presentPaywall failed', error);
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
    console.warn('[purchases] presentPaywallIfNeeded failed', error);
    return false;
  }
}

export {
  Purchases,
  PAYWALL_RESULT,
  PRO_ENTITLEMENT_ID,
};
export type { CustomerInfo, PurchasesOffering, PurchasesPackage };
