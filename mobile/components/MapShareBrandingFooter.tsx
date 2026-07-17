import { StyleSheet, Text, View } from 'react-native';
import { brandTheme } from '@/constants/brandTheme';

/** Footer stamped onto shared map screenshots. */
export function MapShareBrandingFooter() {
  return (
    <View style={styles.footer} collapsable={false}>
      <View style={styles.accent} />
      <Text style={styles.eyebrow}>Station reliability</Text>
      <Text style={styles.brand}>VeryStays</Text>
      <Text style={styles.url}>verystays.com/map</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    backgroundColor: brandTheme.panel,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    gap: 4,
  },
  accent: {
    width: 40,
    height: 3,
    borderRadius: 999,
    backgroundColor: brandTheme.orange,
    marginBottom: 8,
  },
  eyebrow: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.4,
    color: brandTheme.orange,
    textTransform: 'uppercase',
  },
  brand: {
    fontSize: 22,
    fontWeight: '800',
    color: brandTheme.panelText,
  },
  url: {
    marginTop: 4,
    fontSize: 15,
    fontWeight: '700',
    color: brandTheme.panelMuted,
  },
});
