import { StyleSheet, Text, View } from 'react-native';
import { brandTheme } from '@/constants/brandTheme';
import { getWidgetDisplayFields } from '@/lib/widgetDisplay';
import type { TripWidgetProps } from '@/lib/types';

type Props = {
  props: TripWidgetProps;
  label?: string;
};

export function OnboardingWidgetPreview({ props, label = 'Home-screen widget' }: Props) {
  const fields = getWidgetDisplayFields(props);

  return (
    <View style={styles.wrap}>
      <Text style={styles.caption}>{label}</Text>
      <View style={styles.card}>
        <Text
          style={[
            styles.label,
            fields.underlineStation ? styles.labelUnderline : null,
          ]}
        >
          {fields.label}
        </Text>
        <Text style={styles.title} numberOfLines={2}>
          {fields.title}
        </Text>
        {fields.showDestination ? (
          <Text style={styles.detailStrong} numberOfLines={2}>
            {fields.destinationLine}
          </Text>
        ) : (
          <Text style={styles.detail} numberOfLines={2}>
            {fields.detail}
          </Text>
        )}
        <Text style={styles.footer} numberOfLines={1}>
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
    color: brandTheme.green,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: brandTheme.border,
    backgroundColor: brandTheme.backgroundDeep,
    padding: 14,
    gap: 4,
    minHeight: 120,
  },
  label: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    color: brandTheme.green,
  },
  labelUnderline: {
    textDecorationLine: 'underline',
    textDecorationColor: brandTheme.orange,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: brandTheme.text,
  },
  detail: {
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '600',
    color: brandTheme.textMuted,
  },
  detailStrong: {
    fontSize: 14,
    fontWeight: '800',
    color: brandTheme.text,
  },
  footer: {
    fontSize: 14,
    fontWeight: '800',
    marginTop: 4,
    color: brandTheme.orangeLight,
  },
});
