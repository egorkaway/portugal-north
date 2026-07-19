import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { AppState, type AppStateStatus, Platform } from 'react-native';
import {
  configurePurchases,
  getCustomerInfo,
  isProEntitlementActive,
  presentProPaywall,
  presentProPaywallIfNeeded,
  restorePurchases,
  type CustomerInfo,
  Purchases,
} from '@/lib/revenueCat';

type PurchasesContextValue = {
  ready: boolean;
  customerInfo: CustomerInfo | null;
  isPro: boolean;
  refresh: () => Promise<CustomerInfo | null>;
  restore: () => Promise<CustomerInfo | null>;
  presentPaywall: () => Promise<boolean>;
  presentPaywallIfNeeded: () => Promise<boolean>;
};

const PurchasesContext = createContext<PurchasesContextValue | null>(null);

export function PurchasesProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(Platform.OS !== 'ios' && Platform.OS !== 'android');
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);

  const applyInfo = useCallback((info: CustomerInfo | null) => {
    setCustomerInfo(info);
  }, []);

  const refresh = useCallback(async () => {
    try {
      const info = await getCustomerInfo();
      applyInfo(info);
      return info;
    } catch (error) {
      console.warn('[purchases] refresh failed', error);
      return null;
    }
  }, [applyInfo]);

  const restore = useCallback(async () => {
    try {
      const info = await restorePurchases();
      applyInfo(info);
      return info;
    } catch (error) {
      console.warn('[purchases] restore failed', error);
      return null;
    }
  }, [applyInfo]);

  const presentPaywall = useCallback(async () => {
    const unlocked = await presentProPaywall();
    await refresh();
    return unlocked;
  }, [refresh]);

  const presentPaywallIfNeeded = useCallback(async () => {
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
      if (Platform.OS !== 'ios' && Platform.OS !== 'android') {
        setReady(true);
        return;
      }

      try {
        await configurePurchases();
        if (cancelled) return;

        Purchases.addCustomerInfoUpdateListener(onCustomerInfo);
        const info = await getCustomerInfo();
        if (!cancelled) applyInfo(info);
      } catch (error) {
        console.warn('[purchases] configure failed', error);
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
      customerInfo,
      isPro: isProEntitlementActive(customerInfo),
      refresh,
      restore,
      presentPaywall,
      presentPaywallIfNeeded,
    }),
    [ready, customerInfo, refresh, restore, presentPaywall, presentPaywallIfNeeded],
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
