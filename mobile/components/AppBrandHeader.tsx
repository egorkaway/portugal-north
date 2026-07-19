import { StyleSheet, Text, View } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { brandTheme } from '@/constants/brandTheme';
import { useLocale } from '@/i18n/LocaleProvider';

type Props = {
  title?: string;
  subtitle?: string;
};

export function AppBrandHeader({ title, subtitle }: Props) {
  const { t } = useLocale();

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
      <View style={styles.copy} pointerEvents="none">
        <Text style={styles.title}>{title ?? t('brand.name')}</Text>
        <View style={styles.accentBar} />
        <Text style={styles.subtitle}>{subtitle ?? t('brand.subtitle')}</Text>
      </View>
      {/* Balance the left icon so title + subtitle stay visually centered */}
      <View style={styles.iconSpacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: brandTheme.green,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  iconSpacer: {
    width: 44,
    height: 44,
  },
  copy: {
    flex: 1,
    gap: 2,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '800',
    color: brandTheme.text,
    textAlign: 'center',
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
    textAlign: 'center',
  },
});
