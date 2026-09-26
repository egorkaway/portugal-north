import { Linking, Pressable, StyleSheet, Text } from 'react-native';
import { theme } from '@/constants/theme';
import { useLocale } from '@/i18n/LocaleProvider';

const SOVNIK_URL = 'https://sovnik.com';

export function SovnikPromoCard() {
  const { t } = useLocale();

  return (
    <Pressable
      style={styles.card}
      onPress={() => void Linking.openURL(SOVNIK_URL)}
      accessibilityRole="link"
      accessibilityLabel={t('sovnik.cta')}
    >
      <Text style={styles.title}>{t('sovnik.title')}</Text>
      <Text style={styles.body}>{t('sovnik.body')}</Text>
      <Text style={styles.cta}>{t('sovnik.cta')}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.card,
    borderRadius: 16,
    borderWidth: theme.buttonBorderWidth,
    borderColor: theme.buttonBorder,
    padding: 16,
    gap: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.primary,
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
    color: theme.primaryMuted,
  },
  cta: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: '700',
    color: theme.primary,
  },
});
