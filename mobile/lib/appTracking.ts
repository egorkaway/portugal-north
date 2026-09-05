import { Platform } from 'react-native';
import { isStorePreview } from '@/lib/storePreview';
import { Purchases, isPurchasesReady, waitForPurchasesBootstrap } from '@/lib/revenueCat';
import { raceTimeout } from '@/lib/timeout';

/**
 * iOS App Tracking Transparency prompt. Call at the end of onboarding so it
 * is not stacked with location/notification dialogs. Never throws.
 */
export async function requestAppTrackingAtEndOfOnboarding(): Promise<void> {
  if (Platform.OS !== 'ios' || isStorePreview()) return;

  try {
    const TrackingTransparency = await import('expo-tracking-transparency');
    const current = await TrackingTransparency.getTrackingPermissionsAsync();
    if (current.status === 'undetermined') {
      await raceTimeout(
        TrackingTransparency.requestTrackingPermissionsAsync(),
        60_000,
        current,
        'att-permission',
      );
    }

    const next = await TrackingTransparency.getTrackingPermissionsAsync();
    if (next.status !== 'granted') return;

    await waitForPurchasesBootstrap(2500);
    if (isPurchasesReady()) {
      await Purchases.collectDeviceIdentifiers();
    }
  } catch (error) {
    console.warn('[att] request failed', error);
  }
}
