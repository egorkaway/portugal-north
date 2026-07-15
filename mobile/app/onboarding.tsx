import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { OnboardingLiveActivityPreview } from '@/components/onboarding/OnboardingLiveActivityPreview';
import { OnboardingStepIllustration } from '@/components/onboarding/OnboardingStepIllustration';
import { OnboardingWidgetPreview } from '@/components/onboarding/OnboardingWidgetPreview';
import { brandTheme } from '@/constants/brandTheme';
import { completeOnboarding, isOnboardingComplete } from '@/lib/onboardingStorage';
import { ensureTripNotificationPermission } from '@/lib/tripNotifications';
import { writeLastCoords } from '@/lib/tripStorage';
import type { TripWidgetProps } from '@/lib/types';

const STEPS = ['welcome', 'location', 'notifications', 'widgets'] as const;

const EXAMPLE_TRIP: TripWidgetProps = {
  mode: 'active',
  headline: '18 min',
  subline: 'IC 521 → Porto',
  countdownMinutes: 18,
  stationName: 'Lisboa Oriente',
  trainNumber: 'IC 521',
  departureTime: '14:32',
  destination: 'Porto-Campanhã',
  delayMinutes: null,
  platform: '3',
  departureAtMs: null,
};

export default function OnboardingScreen() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [busy, setBusy] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    void isOnboardingComplete().then((complete) => {
      if (complete) {
        router.replace('/(tabs)');
        return;
      }
      setChecking(false);
    });
  }, [router]);

  const advance = () => {
    if (stepIndex >= STEPS.length - 1) return;
    setStepIndex((current) => current + 1);
  };

  const finish = async () => {
    setBusy(true);
    try {
      await completeOnboarding();
      router.replace('/(tabs)');
    } finally {
      setBusy(false);
    }
  };

  const requestLocation = async () => {
    setBusy(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        try {
          const position = await Location.getCurrentPositionAsync({});
          await writeLastCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        } catch {
          // Permission granted but fix unavailable — still continue.
        }
      }
      advance();
    } finally {
      setBusy(false);
    }
  };

  const requestNotifications = async () => {
    setBusy(true);
    try {
      await ensureTripNotificationPermission();
      advance();
    } finally {
      setBusy(false);
    }
  };

  if (checking) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={brandTheme.green} size="large" />
      </View>
    );
  }

  const step = STEPS[stepIndex];

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.dots}>
          {STEPS.map((id, index) => (
            <View
              key={id}
              style={[styles.dot, index === stepIndex ? styles.dotActive : null]}
            />
          ))}
        </View>

        {step === 'welcome' ? (
          <View style={styles.stepBody}>
            <OnboardingStepIllustration step="welcome" />
            <Text style={styles.eyebrow}>Welcome</Text>
            <Text style={styles.title}>Plan train travel across Iberia</Text>
            <Text style={styles.body}>
              VeryStays helps you browse stations and airports, check live departures, track your
              trip with a countdown, explore reliability rankings, and find budget stays near hubs.
            </Text>
            <View style={styles.bulletList}>
              <Text style={styles.bullet}>· 426 stations across Portugal and Spain</Text>
              <Text style={styles.bullet}>· Live CP departures and trip tracking</Text>
              <Text style={styles.bullet}>· Maps, rankings, and ticket guidance</Text>
            </View>
          </View>
        ) : null}

        {step === 'location' ? (
          <View style={styles.stepBody}>
            <OnboardingStepIllustration step="location" />
            <Text style={styles.eyebrow}>Location</Text>
            <Text style={styles.title}>Find stations near you</Text>
            <Text style={styles.body}>
              Location is optional, but it lets VeryStays sort stations by distance and show your
              nearest hub on the home-screen widget when you do not have an active trip.
            </Text>
          </View>
        ) : null}

        {step === 'notifications' ? (
          <View style={styles.stepBody}>
            <OnboardingStepIllustration step="notifications" />
            <Text style={styles.eyebrow}>Notifications</Text>
            <Text style={styles.title}>Gentle trip reminders</Text>
            <Text style={styles.body}>
              When you tap Take on a departure, we can remind you a few minutes before the train
              leaves so you have time to reach the platform.
            </Text>
          </View>
        ) : null}

        {step === 'widgets' ? (
          <View style={styles.stepBody}>
            <OnboardingStepIllustration step="widgets" />
            <Text style={styles.eyebrow}>At a glance</Text>
            <Text style={styles.title}>Widgets & Live Activity</Text>
            <Text style={styles.body}>
              Add the Train countdown widget to your Home Screen. On iPhone, tracking a trip can
              also show a Live Activity on your Lock Screen and Dynamic Island.
            </Text>
            <OnboardingWidgetPreview props={EXAMPLE_TRIP} />
            <OnboardingLiveActivityPreview props={EXAMPLE_TRIP} />
            <Text style={styles.hint}>
              Long-press your Home Screen, tap +, search for VeryStays, and choose Train countdown.
            </Text>
          </View>
        ) : null}
      </ScrollView>

      <View style={styles.footer}>
        {step === 'welcome' ? (
          <Pressable style={styles.primaryButton} onPress={advance} disabled={busy}>
            <Text style={styles.primaryButtonText}>Continue</Text>
          </Pressable>
        ) : null}

        {step === 'location' ? (
          <Pressable
            style={[styles.primaryButton, busy ? styles.buttonDisabled : null]}
            onPress={() => void requestLocation()}
            disabled={busy}
          >
            <Text style={styles.primaryButtonText}>
              {busy ? 'Requesting…' : 'Continue'}
            </Text>
          </Pressable>
        ) : null}

        {step === 'notifications' ? (
          <Pressable
            style={[styles.primaryButton, busy ? styles.buttonDisabled : null]}
            onPress={() => void requestNotifications()}
            disabled={busy}
          >
            <Text style={styles.primaryButtonText}>
              {busy ? 'Requesting…' : 'Continue'}
            </Text>
          </Pressable>
        ) : null}

        {step === 'widgets' ? (
          <Pressable
            style={[styles.primaryButton, busy ? styles.buttonDisabled : null]}
            onPress={() => void finish()}
            disabled={busy}
          >
            <Text style={styles.primaryButtonText}>
              {busy ? 'Starting…' : 'Get started'}
            </Text>
          </Pressable>
        ) : null}

        {step === 'location' ? (
          <Text style={styles.footerNote}>
            Optional. You can change location access later in Settings.
          </Text>
        ) : null}

        {step === 'notifications' ? (
          <Text style={styles.footerNote}>
            Optional. You can change notification settings later in Settings.
          </Text>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: brandTheme.background,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: brandTheme.background,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 24,
    gap: 20,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: brandTheme.border,
  },
  dotActive: {
    backgroundColor: brandTheme.orange,
    width: 22,
  },
  stepBody: {
    gap: 16,
  },
  eyebrow: {
    fontSize: 13,
    fontWeight: '700',
    color: brandTheme.green,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: brandTheme.text,
    lineHeight: 36,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    color: brandTheme.textMuted,
  },
  bulletList: {
    gap: 8,
    marginTop: 4,
  },
  bullet: {
    fontSize: 15,
    lineHeight: 22,
    color: brandTheme.text,
  },
  hint: {
    fontSize: 14,
    lineHeight: 20,
    color: brandTheme.textMuted,
    marginTop: 4,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: brandTheme.border,
    backgroundColor: brandTheme.background,
  },
  primaryButton: {
    backgroundColor: brandTheme.orange,
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: brandTheme.onOrange,
    fontSize: 16,
    fontWeight: '800',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  footerNote: {
    textAlign: 'center',
    fontSize: 12,
    color: brandTheme.textMuted,
  },
});
