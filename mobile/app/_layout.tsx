import '@/widgets/TripWidget';
import '@/widgets/TrainTripLiveActivity';

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
import { LocaleProvider, useLocale } from '@/i18n/LocaleProvider';
import { isOnboardingComplete } from '@/lib/onboardingStorage';
import { seedWidgetTimeline } from '@/lib/widgetSync';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
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
      <RootLayoutNav />
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
    void isOnboardingComplete().then((complete) => {
      if (!complete) {
        router.replace('/onboarding');
      }
      setBootState('ready');
    });
  }, [router, ready]);

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
          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        </Stack>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
