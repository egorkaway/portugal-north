import { StyleSheet, Text, View } from 'react-native';
import { brandTheme } from '@/constants/brandTheme';

/** Footer stamped onto shared trip screenshots. */
export function TripShareBrandingFooter() {
  return (
    <View style={styles.footer} collapsable={false}>
      <View style={styles.accent} />
      <Text style={styles.url}>verystays.com/trip</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    backgroundColor: brandTheme.panel,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  accent: {
    width: 40,
    height: 3,
    borderRadius: 999,
    backgroundColor: brandTheme.orange,
    marginBottom: 10,
  },
  url: {
    fontSize: 18,
    fontWeight: '800',
    color: brandTheme.panelText,
  },
});
