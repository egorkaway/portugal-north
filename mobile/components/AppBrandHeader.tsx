import { StyleSheet, Text, View } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { brandTheme } from '@/constants/brandTheme';

type Props = {
  title?: string;
  subtitle?: string;
};

export function AppBrandHeader({
  title = 'VeryStays',
  subtitle = 'Travel hubs across Iberian peninsula',
}: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.iconBadge}>
        <SymbolView
          name={{ ios: 'tram.fill', android: 'train', web: 'train' }}
          tintColor={brandTheme.onGreen}
          size={22}
          style={{ width: 22, height: 22 }}
        />
      </View>
      <View style={styles.copy}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.accentBar} />
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: brandTheme.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '800',
    color: brandTheme.text,
  },
  accentBar: {
    width: 36,
    height: 2,
    borderRadius: 999,
    backgroundColor: brandTheme.green,
  },
  subtitle: {
    fontSize: 12,
    lineHeight: 16,
    color: brandTheme.textMuted,
  },
});
