import { StyleSheet, Text, View } from 'react-native';
import { theme } from '@/constants/theme';
import { getWidgetColors } from '@/constants/widgetTheme';
import { getWidgetDisplayFields } from '@/lib/widgetDisplay';
import type { TripWidgetProps } from '@/lib/types';

type Props = {
  props: TripWidgetProps;
  label?: string;
};

export function OnboardingWidgetPreview({ props, label = 'Home-screen widget' }: Props) {
  const colors = getWidgetColors('light');
  const fields = getWidgetDisplayFields(props);

  return (
    <View style={styles.wrap}>
      <Text style={styles.caption}>{label}</Text>
      <View style={[styles.card, { backgroundColor: colors.background }]}>
        <Text
          style={[
            styles.label,
            { color: colors.label },
            fields.underlineStation ? styles.labelUnderline : null,
          ]}
        >
          {fields.label}
        </Text>
        <Text style={[styles.title, { color: colors.primary }]} numberOfLines={2}>
          {fields.title}
        </Text>
        {fields.showDestination ? (
          <Text style={[styles.detailStrong, { color: colors.primary }]} numberOfLines={2}>
            {fields.destinationLine}
          </Text>
        ) : (
          <Text style={[styles.detail, { color: colors.detail }]} numberOfLines={2}>
            {fields.detail}
          </Text>
        )}
        <Text style={[styles.footer, { color: colors.footer }]} numberOfLines={1}>
          {fields.footer}
        </Text>
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
    color: theme.primaryMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.border,
    padding: 14,
    gap: 4,
    minHeight: 120,
  },
  label: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  labelUnderline: {
    textDecorationLine: 'underline',
    textDecorationColor: '#059669',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
  },
  detail: {
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '600',
  },
  detailStrong: {
    fontSize: 14,
    fontWeight: '800',
  },
  footer: {
    fontSize: 14,
    fontWeight: '800',
    marginTop: 4,
  },
});
