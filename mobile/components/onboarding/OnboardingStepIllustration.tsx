import { ComponentProps } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { brandTheme } from '@/constants/brandTheme';

type OnboardingStepId = 'welcome' | 'location' | 'notifications' | 'widgets';

type SymbolName = ComponentProps<typeof SymbolView>['name'];

type Props = {
  step: OnboardingStepId;
};

function StepSymbol({
  name,
  size,
  tintColor,
}: {
  name: SymbolName;
  size: number;
  tintColor: string;
}) {
  return (
    <SymbolView
      name={name}
      tintColor={tintColor}
      size={size}
      style={{ width: size, height: size }}
    />
  );
}

function WelcomeIllustration() {
  const stops = ['Lisboa', 'Coimbra', 'Porto'];
  const badges = ['426 stations', 'Rankings', 'Budget stays'];

  return (
    <View style={styles.frame}>
      <View style={styles.welcomeHeader}>
        <View style={styles.welcomeIconWrap}>
          <StepSymbol
            name={{ ios: 'tram.fill', android: 'train', web: 'train' }}
            size={28}
            tintColor={brandTheme.onOrange}
          />
        </View>
        <View style={styles.welcomeHeaderCopy}>
          <Text style={styles.welcomeRoute}>Lisboa Oriente → Porto-Campanhã</Text>
          <Text style={styles.welcomeMeta}>IC · Live departures</Text>
        </View>
      </View>

      <View style={styles.routeTrack}>
        {stops.map((stop, index) => (
          <View key={stop} style={styles.routeStop}>
            <View
              style={[
                styles.routeDot,
                index === 0
                  ? styles.routeDotGreen
                  : index === stops.length - 1
                    ? styles.routeDotOrange
                    : null,
              ]}
            />
            {index < stops.length - 1 ? <View style={styles.routeLine} /> : null}
          </View>
        ))}
      </View>
      <View style={styles.routeLabels}>
        {stops.map((stop) => (
          <Text key={stop} style={styles.routeLabel}>
            {stop}
          </Text>
        ))}
      </View>

      <View style={styles.badgeRow}>
        {badges.map((label, index) => (
          <View
            key={label}
            style={[styles.badge, index % 2 === 0 ? styles.badgeGreen : styles.badgeOrange]}
          >
            <Text style={styles.badgeText}>{label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function LocationIllustration() {
  const nearby = [
    { name: 'Porto-Campanhã', distance: '0.8 km' },
    { name: 'Porto-São Bento', distance: '1.4 km' },
    { name: 'Gaia-Devesas', distance: '2.3 km' },
  ];

  return (
    <View style={styles.frame}>
      <View style={styles.mapBackdrop}>
        <View style={styles.mapGridLineHorizontal} />
        <View style={styles.mapGridLineVertical} />
        <View style={styles.mapPulseOuter} />
        <View style={styles.mapPulseInner}>
          <StepSymbol
            name={{ ios: 'location.fill', android: 'location_on', web: 'location_on' }}
            size={22}
            tintColor={brandTheme.onGreen}
          />
        </View>
      </View>

      <View style={styles.nearbyList}>
        {nearby.map((station, index) => (
          <View
            key={station.name}
            style={[styles.nearbyRow, index === 0 ? styles.nearbyRowActive : null]}
          >
            <StepSymbol
              name={{ ios: 'mappin.circle.fill', android: 'place', web: 'place' }}
              size={18}
              tintColor={index === 0 ? brandTheme.green : brandTheme.textMuted}
            />
            <Text style={styles.nearbyName} numberOfLines={1}>
              {station.name}
            </Text>
            <Text style={styles.nearbyDistance}>{station.distance}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function NotificationsIllustration() {
  return (
    <View style={styles.frame}>
      <View style={styles.phoneShell}>
        <View style={styles.phoneIsland} />
        <View style={styles.notificationCard}>
          <View style={styles.notificationHeader}>
            <View style={styles.notificationAppIcon}>
              <Text style={styles.notificationAppIconText}>VS</Text>
            </View>
            <View style={styles.notificationHeaderCopy}>
              <Text style={styles.notificationAppName}>VeryStays</Text>
              <Text style={styles.notificationTime}>now</Text>
            </View>
          </View>
          <Text style={styles.notificationTitle}>Train leaves in 5 min</Text>
          <Text style={styles.notificationBody}>IC 521 · Lisboa Oriente · Platform 3</Text>
        </View>
        <View style={styles.notificationHintRow}>
          <StepSymbol
            name={{ ios: 'bell.badge.fill', android: 'notifications', web: 'notifications' }}
            size={16}
            tintColor={brandTheme.orange}
          />
          <Text style={styles.notificationHint}>Gentle reminder before departure</Text>
        </View>
      </View>
    </View>
  );
}

function WidgetsIllustration() {
  return (
    <View style={styles.frameCompact}>
      <View style={styles.deviceRow}>
        <View style={styles.devicePhone}>
          <View style={styles.deviceIsland} />
          <View style={styles.deviceWidgetTile}>
            <Text style={styles.deviceWidgetLabel}>LISBOA ORIENTE</Text>
            <Text style={styles.deviceWidgetCountdown}>18 min</Text>
            <Text style={styles.deviceWidgetRoute}>IC 521 → Porto</Text>
          </View>
          <View style={styles.deviceAppGrid}>
            {[0, 1, 2, 3, 4, 5].map((slot) => (
              <View key={slot} style={styles.deviceAppIcon} />
            ))}
          </View>
        </View>

        <View style={styles.deviceLock}>
          <Text style={styles.deviceLockCaption}>Lock Screen</Text>
          <View style={styles.deviceLockCard}>
            <Text style={styles.deviceLockStation}>LISBOA ORIENTE</Text>
            <Text style={styles.deviceLockCountdown}>18 min</Text>
            <Text style={styles.deviceLockFooter}>Departs 14:32 · Platform 3</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export function OnboardingStepIllustration({ step }: Props) {
  if (step === 'welcome') return <WelcomeIllustration />;
  if (step === 'location') return <LocationIllustration />;
  if (step === 'notifications') return <NotificationsIllustration />;
  return <WidgetsIllustration />;
}

const styles = StyleSheet.create({
  frame: {
    backgroundColor: brandTheme.surfaceRaised,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: brandTheme.border,
    padding: 16,
    gap: 14,
    overflow: 'hidden',
  },
  frameCompact: {
    backgroundColor: brandTheme.surfaceRaised,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: brandTheme.border,
    padding: 14,
    overflow: 'hidden',
  },
  welcomeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  welcomeIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: brandTheme.orange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeHeaderCopy: {
    flex: 1,
    gap: 2,
  },
  welcomeRoute: {
    fontSize: 15,
    fontWeight: '800',
    color: brandTheme.text,
  },
  welcomeMeta: {
    fontSize: 13,
    fontWeight: '600',
    color: brandTheme.textMuted,
  },
  routeTrack: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  routeStop: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.28)',
  },
  routeDotGreen: {
    backgroundColor: brandTheme.green,
    width: 12,
    height: 12,
  },
  routeDotOrange: {
    backgroundColor: brandTheme.orange,
    width: 12,
    height: 12,
  },
  routeLine: {
    flex: 1,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    marginHorizontal: 4,
  },
  routeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  routeLabel: {
    flex: 1,
    fontSize: 11,
    fontWeight: '700',
    color: brandTheme.textMuted,
    textAlign: 'center',
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  badgeGreen: {
    borderColor: brandTheme.green,
  },
  badgeOrange: {
    borderColor: brandTheme.orange,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: brandTheme.text,
  },
  mapBackdrop: {
    height: 110,
    borderRadius: 14,
    backgroundColor: brandTheme.backgroundDeep,
    borderWidth: 1,
    borderColor: brandTheme.border,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  mapGridLineHorizontal: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '50%',
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  mapGridLineVertical: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '50%',
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  mapPulseOuter: {
    position: 'absolute',
    width: 72,
    height: 72,
    borderRadius: 999,
    backgroundColor: 'rgba(62, 207, 142, 0.18)',
  },
  mapPulseInner: {
    width: 44,
    height: 44,
    borderRadius: 999,
    backgroundColor: brandTheme.greenDeep,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nearbyList: {
    gap: 8,
  },
  nearbyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: brandTheme.backgroundDeep,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: brandTheme.border,
  },
  nearbyRowActive: {
    borderColor: brandTheme.green,
    backgroundColor: 'rgba(62, 207, 142, 0.1)',
  },
  nearbyName: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: brandTheme.text,
  },
  nearbyDistance: {
    fontSize: 12,
    fontWeight: '700',
    color: brandTheme.orangeLight,
  },
  phoneShell: {
    alignItems: 'center',
    gap: 12,
  },
  phoneIsland: {
    width: 84,
    height: 22,
    borderRadius: 999,
    backgroundColor: brandTheme.backgroundDeep,
  },
  notificationCard: {
    alignSelf: 'stretch',
    backgroundColor: brandTheme.backgroundDeep,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: brandTheme.border,
    gap: 4,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  notificationAppIcon: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: brandTheme.orange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationAppIconText: {
    color: brandTheme.onOrange,
    fontSize: 10,
    fontWeight: '800',
  },
  notificationHeaderCopy: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  notificationAppName: {
    fontSize: 12,
    fontWeight: '700',
    color: brandTheme.textMuted,
  },
  notificationTime: {
    fontSize: 11,
    fontWeight: '600',
    color: brandTheme.textMuted,
  },
  notificationTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: brandTheme.text,
  },
  notificationBody: {
    fontSize: 13,
    fontWeight: '600',
    color: brandTheme.textMuted,
  },
  notificationHintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  notificationHint: {
    fontSize: 12,
    fontWeight: '600',
    color: brandTheme.textMuted,
  },
  deviceRow: {
    flexDirection: 'row',
    gap: 10,
  },
  devicePhone: {
    flex: 1.1,
    backgroundColor: brandTheme.backgroundDeep,
    borderRadius: 16,
    padding: 10,
    gap: 8,
    minHeight: 148,
    borderWidth: 1,
    borderColor: brandTheme.border,
  },
  deviceIsland: {
    alignSelf: 'center',
    width: 52,
    height: 14,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  deviceWidgetTile: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 8,
    gap: 2,
  },
  deviceWidgetLabel: {
    color: brandTheme.green,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  deviceWidgetCountdown: {
    color: brandTheme.text,
    fontSize: 18,
    fontWeight: '800',
  },
  deviceWidgetRoute: {
    color: brandTheme.textMuted,
    fontSize: 10,
    fontWeight: '700',
  },
  deviceAppGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 'auto',
  },
  deviceAppIcon: {
    width: 22,
    height: 22,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  deviceLock: {
    flex: 1,
    gap: 6,
    justifyContent: 'center',
  },
  deviceLockCaption: {
    fontSize: 10,
    fontWeight: '700',
    color: brandTheme.green,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  deviceLockCard: {
    backgroundColor: brandTheme.backgroundDeep,
    borderRadius: 12,
    padding: 8,
    gap: 2,
    borderWidth: 1,
    borderColor: brandTheme.border,
  },
  deviceLockStation: {
    color: brandTheme.green,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  deviceLockCountdown: {
    color: brandTheme.text,
    fontSize: 16,
    fontWeight: '800',
  },
  deviceLockFooter: {
    color: brandTheme.text,
    fontSize: 9,
    fontWeight: '700',
  },
});
