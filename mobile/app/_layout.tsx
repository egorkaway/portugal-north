import '@/widgets/TripWidget';
import '@/widgets/TrainTripLiveActivity';
// Define the geofence TaskManager task at startup (required before startGeofencingAsync).
import '@/lib/stationArrivalGeofence';

import { useFonts } from 'expo-font';
import * as Notifications from 'expo-notifications';
import { DefaultTheme, Stack, ThemeProvider, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect } from 'react';
import { Linking, View } from 'react-native';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import Colors from '@/constants/Colors';
import { WidgetSyncBootstrap } from '@/components/WidgetSyncBootstrap';
import { CatalogSyncBootstrap } from '@/components/CatalogSyncBootstrap';
import { LocaleProvider, useLocale } from '@/i18n/LocaleProvider';
import { PurchasesProvider } from '@/components/PurchasesProvider';
import { isLiveActivityEndNotification } from '@/lib/liveActivityEndSchedule';
import { isOnboardingComplete } from '@/lib/onboardingStorage';
import {
  enableStorePreview,
  isStorePreview,
  isStorePreviewUrl,
} from '@/lib/storePreview';
import { hydrateCatalogFromDisk } from '@/lib/catalogSync';
import { raceTimeout } from '@/lib/timeout';
import { endAllLiveActivities, onTripDeparted, seedWidgetTimeline } from '@/lib/widgetSync';
import { getStationSlugFromArrivalNotification } from '@/lib/stationArrivalNotifications';

try {
  Notifications.setNotificationHandler({
    handleNotification: async (notification) => {
      if (isLiveActivityEndNotification(notification)) {
        // End the Live Activity as soon as this fires while the app can run JS.
        void endAllLiveActivities().then(() => onTripDeparted());
        return {
          shouldShowBanner: false,
          shouldShowList: false,
          shouldPlaySound: false,
          shouldSetBadge: false,
        };
      }

      return {
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      };
    },
  });
} catch (error) {
  console.warn('[notifications] setNotificationHandler failed', error);
}

export {
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

void SplashScreen.preventAutoHideAsync().catch(() => {});

const SPLASH_FALLBACK_MS = 1_500;

function hideSplash() {
  void SplashScreen.hideAsync().catch(() => {
    // Already hidden, or the native splash dismissed itself.
  });
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const onRootLayout = useCallback(() => {
    hideSplash();
  }, []);

  useEffect(() => {
    if (error) {
      console.warn('[fonts] failed to load', error);
    }
  }, [error]);

  useEffect(() => {
    hideSplash();
    const fallback = setTimeout(hideSplash, SPLASH_FALLBACK_MS);
    return () => clearTimeout(fallback);
  }, []);

  useEffect(() => {
    if (loaded) hideSplash();
  }, [loaded]);

  useEffect(() => {
    void seedWidgetTimeline();
  }, []);

  return (
    <View style={{ flex: 1 }} onLayout={onRootLayout}>
      <LocaleProvider>
        <PurchasesProvider>
          <RootLayoutNav />
        </PurchasesProvider>
      </LocaleProvider>
    </View>
  );
}

function RootLayoutNav() {
  const light = Colors.light;
  const router = useRouter();
  const { t } = useLocale();

  useEffect(() => {
    void hydrateCatalogFromDisk().catch((error) => {
      console.warn('[catalog] hydrate failed', error);
    });
    void raceTimeout(isOnboardingComplete(), 800, true, 'onboarding-flag').then((complete) => {
      if (!complete && !isStorePreview()) {
        router.replace('/onboarding');
      }
    });
  }, [router]);

  useEffect(() => {
    const applyPreviewUrl = async (url: string | null) => {
      if (!isStorePreviewUrl(url)) return;
      await enableStorePreview();
      router.replace('/map');
    };
    void Linking.getInitialURL().then((url) => void applyPreviewUrl(url));
    const sub = Linking.addEventListener('url', (event) => {
      void applyPreviewUrl(event.url);
    });
    return () => sub.remove();
  }, [router]);

  useEffect(() => {
    const sub = Notifications.addNotificationResponseReceivedListener((response) => {
      const slug = getStationSlugFromArrivalNotification(response.notification);
      if (!slug) return;
      router.push(`/station/${slug}`);
    });
    return () => sub.remove();
  }, [router]);

  return (
    <SafeAreaProvider>
      <ThemeProvider value={DefaultTheme}>
        <StatusBar style="dark" />
        <WidgetSyncBootstrap />
        <CatalogSyncBootstrap />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: light.background },
            headerTintColor: light.tint,
            headerTitleStyle: { color: light.text },
            contentStyle: { backgroundColor: light.background },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding" options={{ headerShown: false, animation: 'fade' }} />
          <Stack.Screen
            name="station/[slug]"
            options={{
              title: t('nav.station'),
              headerBackTitle: t('nav.back'),
            }}
          />
          <Stack.Screen
            name="lines/index"
            options={{
              title: t('nav.lines'),
              headerBackTitle: t('nav.back'),
            }}
          />
          <Stack.Screen
            name="lines/[slug]"
            options={{
              title: t('nav.line'),
              headerBackTitle: t('nav.back'),
            }}
          />
          <Stack.Screen
            name="privacy"
            options={{
              title: t('nav.privacy'),
              headerBackTitle: t('nav.back'),
            }}
          />
          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        </Stack>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
