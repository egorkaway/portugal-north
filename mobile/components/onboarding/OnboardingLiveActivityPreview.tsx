import { Platform, StyleSheet, Text, View } from 'react-native';
import { widgetTheme } from '@/constants/widgetTheme';

type Props = {
  stationName: string;
  countdown: string;
  routeLine: string;
  footer: string;
};

export function OnboardingLiveActivityPreview({
  stationName,
  countdown,
  routeLine,
  footer,
}: Props) {
  if (Platform.OS !== 'ios') {
    return (
      <View style={styles.wrap}>
        <Text style={styles.caption}>Live Activity</Text>
        <Text style={styles.unavailable}>
          Live Activities are available on iPhone. Android users can use the home-screen widget
          instead.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.wrap}>
      <Text style={styles.caption}>Lock Screen · Live Activity</Text>
      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.iconBadge}>
            <Text style={styles.iconText}>VS</Text>
          </View>
          <View style={styles.content}>
            <Text style={styles.station} numberOfLines={1}>
              {stationName}
            </Text>
            <Text style={styles.countdown}>{countdown}</Text>
            <Text style={styles.route} numberOfLines={1}>
              {routeLine}
            </Text>
            <Text style={styles.footer} numberOfLines={1}>
              {footer}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 8,
  },
  caption: {
    fontSize: 13,
    fontWeight: '700',
    color: '#8FE3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  unavailable: {
    fontSize: 14,
    lineHeight: 20,
    color: '#C5D3DC',
  },
  card: {
    backgroundColor: widgetTheme.primary,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    color: widgetTheme.onPrimary,
    fontSize: 13,
    fontWeight: '800',
  },
  content: {
    flex: 1,
    gap: 2,
  },
  station: {
    color: '#8FE3B8',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  countdown: {
    color: widgetTheme.onPrimary,
    fontSize: 24,
    fontWeight: '800',
  },
  route: {
    color: widgetTheme.mutedOnPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  footer: {
    color: widgetTheme.onPrimary,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
  },
});
