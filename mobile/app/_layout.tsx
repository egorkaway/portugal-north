import '@/widgets/TripWidget';
import '@/widgets/TrainTripLiveActivity';
// Define the geofence TaskManager task at startup (required before startGeofencingAsync).
import '@/lib/stationArrivalGeofence';

import { useFonts } from 'expo-font';
import * as Notifications from 'expo-notifications';
import { DefaultTheme, Stack, ThemeProvider, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import Colors from '@/constants/Colors';
import { theme } from '@/constants/theme';
import { WidgetSyncBootstrap } from '@/components/WidgetSyncBootstrap';
import { CatalogSyncBootstrap } from '@/components/CatalogSyncBootstrap';
import { LocaleProvider, useLocale } from '@/i18n/LocaleProvider';
import { PurchasesProvider } from '@/components/PurchasesProvider';
import { isLiveActivityEndNotification } from '@/lib/liveActivityEndSchedule';
import { isOnboardingComplete } from '@/lib/onboardingStorage';
import { hydrateCatalogFromDisk } from '@/lib/catalogSync';
import { endAllLiveActivities, onTripDeparted, seedWidgetTimeline } from '@/lib/widgetSync';
import { getStationSlugFromArrivalNotification } from '@/lib/stationArrivalNotifications';

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

export {
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    void seedWidgetTimeline();
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <LocaleProvider>
      <PurchasesProvider>
        <RootLayoutNav />
      </PurchasesProvider>
    </LocaleProvider>
  );
}

function RootLayoutNav() {
  const light = Colors.light;
  const router = useRouter();
  const { t, ready } = useLocale();
  const [bootState, setBootState] = useState<'loading' | 'ready'>('loading');

  useEffect(() => {
    if (!ready) return;
    void Promise.all([
      isOnboardingComplete(),
      hydrateCatalogFromDisk().catch((error) => {
        console.warn('[catalog] hydrate failed', error);
      }),
    ]).then(([complete]) => {
      if (!complete) {
        router.replace('/onboarding');
      }
      setBootState('ready');
    });
  }, [router, ready]);

  useEffect(() => {
    const sub = Notifications.addNotificationResponseReceivedListener((response) => {
      const slug = getStationSlugFromArrivalNotification(response.notification);
      if (!slug) return;
      router.push(`/station/${slug}`);
    });
    return () => sub.remove();
  }, [router]);

  if (bootState === 'loading' || !ready) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.background,
        }}
      >
        <ActivityIndicator color={theme.primary} size="large" />
      </View>
    );
  }

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
