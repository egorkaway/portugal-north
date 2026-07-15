import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '@/constants/theme';

const GETMAPA_APP_STORE_URL =
  'https://apps.apple.com/pt/app/map-your-travel-by-getmapa-com/id6756547572?l=en-GB';

export function GetMapaPromoCard() {
  return (
    <Pressable
      style={styles.card}
      onPress={() => void Linking.openURL(GETMAPA_APP_STORE_URL)}
      accessibilityRole="link"
      accessibilityLabel="Open GetMapa"
    >
      <Text style={styles.eyebrow}>Also from us</Text>
      <Text style={styles.title}>Map Your Travel</Text>
      <Text style={styles.body}>
        GetMapa's iPhone app tracks the places you visit and builds a personal travel map from
        your trips and photos.
      </Text>
      <Text style={styles.cta}>Open GetMapa</Text>
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
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.primaryMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
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
