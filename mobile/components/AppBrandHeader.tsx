import { ComponentProps } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { brandTheme } from '@/constants/brandTheme';

type SymbolName = ComponentProps<typeof SymbolView>['name'];

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
          tintColor={brandTheme.onOrange}
          size={24}
          style={{ width: 24, height: 24 }}
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
    gap: 12,
  },
  iconBadge: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: brandTheme.orange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: brandTheme.text,
  },
  accentBar: {
    width: 56,
    height: 3,
    borderRadius: 999,
    backgroundColor: brandTheme.green,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 20,
    color: brandTheme.textMuted,
  },
});
