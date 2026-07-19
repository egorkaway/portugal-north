import { Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '@/constants/theme';
import { getWidgetColors } from '@/constants/widgetTheme';
import { useLocale } from '@/i18n/LocaleProvider';
import { getWidgetDisplayFields } from '@/lib/widgetDisplay';
import type { TripWidgetProps } from '@/lib/types';

type WidgetPreviewCardProps = {
  props: TripWidgetProps;
  onRefresh: () => void;
  refreshing?: boolean;
};

export function WidgetPreviewCard({ props, onRefresh, refreshing }: WidgetPreviewCardProps) {
  const { t } = useLocale();
  const colors = getWidgetColors('light');
  const fields = getWidgetDisplayFields(props);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{t('widget.title')}</Text>
      <Text style={styles.sectionBody}>{t('widget.howTo')}</Text>

      <View style={[styles.preview, { backgroundColor: colors.background }]}>
        <Text
          style={[
            styles.previewLabel,
            { color: colors.label },
            fields.underlineStation ? styles.previewLabelUnderline : null,
          ]}
        >
          {fields.label}
        </Text>
        <Text style={[styles.previewTitle, { color: colors.primary }]} numberOfLines={2}>
          {fields.title}
        </Text>
        {fields.showDestination ? (
          <Text style={[styles.previewDetailStrong, { color: colors.primary }]} numberOfLines={2}>
            {fields.destinationLine}
          </Text>
        ) : (
          <Text style={[styles.previewDetail, { color: colors.detail }]} numberOfLines={3}>
            {fields.detail}
          </Text>
        )}
        <Text style={[styles.previewFooter, { color: colors.footer }]} numberOfLines={2}>
          {fields.footer}
        </Text>
      </View>

      <View style={styles.instructions}>
        <Text style={styles.instructionsTitle}>{t('widget.howTo')}</Text>
        <Text style={styles.instructionStep}>1. {t('widget.step1')}</Text>
        <Text style={styles.instructionStep}>2. {t('widget.step2')}</Text>
        <Text style={styles.instructionStep}>3. {t('widget.step3')}</Text>
      </View>

      <Pressable
        style={[styles.refreshButton, refreshing ? styles.refreshButtonDisabled : null]}
        onPress={onRefresh}
        disabled={refreshing}
      >
        <Text style={styles.refreshButtonText}>
          {refreshing ? t('common.requesting') : t('trip.refreshWidget')}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 12,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.primary,
  },
  sectionBody: {
    fontSize: 14,
    lineHeight: 20,
    color: theme.primaryMuted,
  },
  preview: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.border,
    padding: 14,
    gap: 4,
    minHeight: 132,
    alignItems: 'flex-start',
  },
  previewLabel: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    textAlign: 'left',
    alignSelf: 'stretch',
  },
  previewLabelUnderline: {
    textDecorationLine: 'underline',
    textDecorationColor: '#059669',
  },
  previewTitle: {
    fontSize: 28,
    fontWeight: '800',
    marginTop: 2,
    textAlign: 'left',
    alignSelf: 'stretch',
  },
  previewDetail: {
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '600',
    marginTop: 2,
    textAlign: 'left',
    alignSelf: 'stretch',
  },
  previewDetailStrong: {
    fontSize: 14,
    fontWeight: '800',
    marginTop: 2,
    textAlign: 'left',
    alignSelf: 'stretch',
  },
  previewFooter: {
    fontSize: 14,
    fontWeight: '800',
    marginTop: 6,
    textAlign: 'left',
    alignSelf: 'stretch',
  },
  instructions: {
    backgroundColor: theme.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
    padding: 14,
    gap: 6,
  },
  instructionsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.primary,
    marginBottom: 2,
  },
  instructionStep: {
    fontSize: 13,
    lineHeight: 18,
    color: theme.primaryMuted,
  },
  refreshButton: {
    alignSelf: 'flex-start',
    backgroundColor: theme.primary,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  refreshButtonDisabled: {
    opacity: 0.7,
  },
  refreshButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
});
