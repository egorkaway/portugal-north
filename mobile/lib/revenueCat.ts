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
} from '@/constants/revenueCat';

let configured = false;

export function isProEntitlementActive(info: CustomerInfo | null | undefined): boolean {
  if (!info) return false;
  return Boolean(info.entitlements.active[PRO_ENTITLEMENT_ID]);
}

export async function configurePurchases(): Promise<void> {
  if (configured) return;
  if (Platform.OS !== 'ios' && Platform.OS !== 'android') return;

  Purchases.setLogLevel(__DEV__ ? LOG_LEVEL.DEBUG : LOG_LEVEL.INFO);

  const apiKey =
    Platform.OS === 'ios' ? REVENUECAT_API_KEYS.ios : REVENUECAT_API_KEYS.android;

  Purchases.configure({ apiKey });
  configured = true;
}

export async function getCustomerInfo(): Promise<CustomerInfo> {
  return Purchases.getCustomerInfo();
}

export async function refreshCustomerInfo(): Promise<CustomerInfo> {
  return Purchases.getCustomerInfo();
}

export async function getCurrentOffering(): Promise<PurchasesOffering | null> {
  const offerings = await Purchases.getOfferings();
  return offerings.current ?? null;
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

export async function restorePurchases(): Promise<CustomerInfo> {
  return Purchases.restorePurchases();
}

function paywallUnlockedPro(result: PAYWALL_RESULT): boolean {
  return result === PAYWALL_RESULT.PURCHASED || result === PAYWALL_RESULT.RESTORED;
}

/**
 * Always present the current offering paywall (Tickets CTA).
 * Returns true if the user purchased or restored Pro.
 */
export async function presentProPaywall(): Promise<boolean> {
  try {
    const result = await RevenueCatUI.presentPaywall({ displayCloseButton: true });
    return paywallUnlockedPro(result);
  } catch (error) {
    console.warn('[purchases] presentPaywall failed', error);
    return false;
  }
}

/**
 * Present the paywall only when `iberian.travel Pro` is not active
 * (post-onboarding flow).
 */
export async function presentProPaywallIfNeeded(): Promise<boolean> {
  try {
    const result = await RevenueCatUI.presentPaywallIfNeeded({
      requiredEntitlementIdentifier: PRO_ENTITLEMENT_ID,
      displayCloseButton: true,
    });
    return paywallUnlockedPro(result);
  } catch (error) {
    console.warn('[purchases] presentPaywallIfNeeded failed', error);
    return false;
  }
}

export { Purchases, PAYWALL_RESULT, PRO_ENTITLEMENT_ID };
export type { CustomerInfo, PurchasesOffering, PurchasesPackage };
