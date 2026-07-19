import { Linking, Pressable, StyleSheet, Text } from 'react-native';
import { theme } from '@/constants/theme';
import { useLocale } from '@/i18n/LocaleProvider';

const GETMAPA_APP_STORE_URL =
  'https://apps.apple.com/pt/app/map-your-travel-by-getmapa-com/id6756547572?l=en-GB';

export function GetMapaPromoCard() {
  const { t } = useLocale();

  return (
    <Pressable
      style={styles.card}
      onPress={() => void Linking.openURL(GETMAPA_APP_STORE_URL)}
      accessibilityRole="link"
      accessibilityLabel={t('mapa.cta')}
    >
      <Text style={styles.title}>{t('mapa.title')}</Text>
      <Text style={styles.body}>{t('mapa.body')}</Text>
      <Text style={styles.cta}>{t('mapa.cta')}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.border,
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
