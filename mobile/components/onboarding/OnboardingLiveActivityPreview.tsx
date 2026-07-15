import { Platform, StyleSheet, Text, View } from 'react-native';
import { brandTheme } from '@/constants/brandTheme';
import { getWidgetDisplayFields } from '@/lib/widgetDisplay';
import type { TripWidgetProps } from '@/lib/types';

type Props = {
  props: TripWidgetProps;
};

export function OnboardingLiveActivityPreview({ props }: Props) {
  const fields = getWidgetDisplayFields(props);

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
              {fields.label}
            </Text>
            <Text style={styles.countdown}>{fields.title}</Text>
            {fields.showDestination ? (
              <Text style={styles.route} numberOfLines={1}>
                {fields.destinationLine}
              </Text>
            ) : (
              <Text style={styles.route} numberOfLines={1}>
                {fields.detail}
              </Text>
            )}
            <Text style={styles.footer} numberOfLines={2}>
              {fields.footer}
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
    color: brandTheme.green,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  unavailable: {
    fontSize: 14,
    lineHeight: 20,
    color: brandTheme.textMuted,
  },
  card: {
    backgroundColor: brandTheme.backgroundDeep,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: brandTheme.border,
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
    backgroundColor: brandTheme.orange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    color: brandTheme.onOrange,
    fontSize: 13,
    fontWeight: '800',
  },
  content: {
    flex: 1,
    gap: 2,
  },
  station: {
    color: brandTheme.green,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  countdown: {
    color: brandTheme.text,
    fontSize: 24,
    fontWeight: '800',
  },
  route: {
    color: brandTheme.textMuted,
    fontSize: 14,
    fontWeight: '700',
  },
  footer: {
    color: brandTheme.orangeLight,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
  },
});
