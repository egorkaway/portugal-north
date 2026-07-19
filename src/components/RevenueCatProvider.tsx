import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  configureRevenueCat,
  getCustomerInfoSafe,
  getStoredRevenueCatAppUserId,
  isProEntitlementActive,
  isRevenueCatReady,
  type CustomerInfo,
} from "@/lib/revenueCat";

type RevenueCatContextValue = {
  /** Bootstrap finished (success or soft-failure). */
  ready: boolean;
  /** SDK configured and usable (entitlements / future paywalls). */
  available: boolean;
  /** Stable anonymous App User ID for this browser, once created. */
  appUserId: string | null;
  customerInfo: CustomerInfo | null;
  isPro: boolean;
  refresh: () => Promise<CustomerInfo | null>;
};

const RevenueCatContext = createContext<RevenueCatContextValue | null>(null);

/**
 * Boots RevenueCat once, near the app root, so an anonymous Customer profile is
 * created/restored on first visit. Renders no UI and surfaces no paywall — it
 * only exposes entitlement state via context for future gated features.
 *
 * The heavy `@revenuecat/purchases-js` bundle is dynamically imported inside
 * `configureRevenueCat`, so mounting this provider does not block first paint.
 */
export function RevenueCatProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [available, setAvailable] = useState(false);
  const [appUserId, setAppUserId] = useState<string | null>(null);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);

  useEffect(() => {
    let cancelled = false;

    const bootstrap = async () => {
      try {
        const ok = await configureRevenueCat();
        if (cancelled) return;

        setAvailable(ok);
        setAppUserId(getStoredRevenueCatAppUserId());

        if (ok) {
          const info = await getCustomerInfoSafe();
          if (!cancelled) setCustomerInfo(info);
        }
      } catch (error) {
        console.warn("[revenuecat] bootstrap failed", error);
        if (!cancelled) setAvailable(false);
      } finally {
        if (!cancelled) setReady(true);
      }
    };

    void bootstrap();

    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo<RevenueCatContextValue>(
    () => ({
      ready,
      available,
      appUserId,
      customerInfo,
      isPro: isProEntitlementActive(customerInfo),
      refresh: async () => {
        if (!isRevenueCatReady()) return null;
        const info = await getCustomerInfoSafe();
        setCustomerInfo(info);
        return info;
      },
    }),
    [ready, available, appUserId, customerInfo],
  );

  return (
    <RevenueCatContext.Provider value={value}>
      {children}
    </RevenueCatContext.Provider>
  );
}

export function useRevenueCat(): RevenueCatContextValue {
  const ctx = useContext(RevenueCatContext);
  if (!ctx) {
    throw new Error("useRevenueCat must be used within RevenueCatProvider");
  }
  return ctx;
}
