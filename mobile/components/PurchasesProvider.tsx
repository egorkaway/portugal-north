import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import {
  configurePurchases,
  getCustomerInfoSafe,
  isProEntitlementActive,
  isPurchasesReady,
  isPurchasesSupportedPlatform,
  presentProPaywall,
  presentProPaywallIfNeeded,
  restorePurchasesSafe,
  type CustomerInfo,
  Purchases,
} from '@/lib/revenueCat';

type PurchasesContextValue = {
  /** Bootstrap finished (success or soft-failure). Safe to navigate. */
  ready: boolean;
  /** SDK configured and usable for paywalls / entitlements. */
  available: boolean;
  customerInfo: CustomerInfo | null;
  isPro: boolean;
  refresh: () => Promise<CustomerInfo | null>;
  restore: () => Promise<CustomerInfo | null>;
  presentPaywall: () => Promise<boolean>;
  presentPaywallIfNeeded: () => Promise<boolean>;
};

const PurchasesContext = createContext<PurchasesContextValue | null>(null);

export function PurchasesProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(!isPurchasesSupportedPlatform());
  const [available, setAvailable] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);

  const applyInfo = useCallback((info: CustomerInfo | null) => {
    setCustomerInfo(info);
  }, []);

  const refresh = useCallback(async () => {
    if (!isPurchasesReady()) return null;
    const info = await getCustomerInfoSafe();
    applyInfo(info);
    return info;
  }, [applyInfo]);

  const restore = useCallback(async () => {
    if (!isPurchasesReady()) return null;
    const info = await restorePurchasesSafe();
    applyInfo(info);
    return info;
  }, [applyInfo]);

  const presentPaywall = useCallback(async () => {
    if (!isPurchasesReady()) return false;
    const unlocked = await presentProPaywall();
    await refresh();
    return unlocked;
  }, [refresh]);

  const presentPaywallIfNeeded = useCallback(async () => {
    if (!isPurchasesReady()) return false;
    const unlocked = await presentProPaywallIfNeeded();
    await refresh();
    return unlocked;
  }, [refresh]);

  useEffect(() => {
    let cancelled = false;

    const onCustomerInfo = (next: CustomerInfo) => {
      if (!cancelled) applyInfo(next);
    };

    const bootstrap = async () => {
      if (!isPurchasesSupportedPlatform()) {
        if (!cancelled) {
          setAvailable(false);
          setReady(true);
        }
        return;
      }

      try {
        const ok = await configurePurchases();
        if (cancelled) return;

        setAvailable(ok);

        if (ok) {
          Purchases.addCustomerInfoUpdateListener(onCustomerInfo);
          const info = await getCustomerInfoSafe();
          if (!cancelled) applyInfo(info);
        }
      } catch (error) {
        console.warn('[purchases] bootstrap failed', error);
        if (!cancelled) setAvailable(false);
      } finally {
        if (!cancelled) setReady(true);
      }
    };

    void bootstrap();

    const onAppState = (state: AppStateStatus) => {
      if (state === 'active') void refresh();
    };
    const appSub = AppState.addEventListener('change', onAppState);

    return () => {
      cancelled = true;
      appSub.remove();
    };
  }, [applyInfo, refresh]);

  const value = useMemo<PurchasesContextValue>(
    () => ({
      ready,
      available,
      customerInfo,
      isPro: isProEntitlementActive(customerInfo),
      refresh,
      restore,
      presentPaywall,
      presentPaywallIfNeeded,
    }),
    [ready, available, customerInfo, refresh, restore, presentPaywall, presentPaywallIfNeeded],
  );

  return (
    <PurchasesContext.Provider value={value}>{children}</PurchasesContext.Provider>
  );
}

export function usePurchases(): PurchasesContextValue {
  const ctx = useContext(PurchasesContext);
  if (!ctx) {
    throw new Error('usePurchases must be used within PurchasesProvider');
  }
  return ctx;
}
