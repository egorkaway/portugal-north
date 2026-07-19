import { Linking, Pressable, StyleSheet, Text } from 'react-native';
import { theme } from '@/constants/theme';
import { useLocale } from '@/i18n/LocaleProvider';
import {
  attributionForImageUrl,
  shouldShowStationImageCredit,
} from '@/lib/imageAttribution';

type Props = {
  imageUrl: string;
};

export function StationImageCredit({ imageUrl }: Props) {
  const { t } = useLocale();

  if (!shouldShowStationImageCredit(imageUrl)) return null;

  const attribution = attributionForImageUrl(imageUrl);
  const label =
    attribution.creator.type === 'Person'
      ? t('station.photoCreditBy', { author: attribution.creator.name })
      : attribution.creditText;
  const href = attribution.authorUrl ?? attribution.sourceUrl;

  if (!href) {
    return <Text style={styles.credit}>{label}</Text>;
  }

  return (
    <Pressable
      onPress={() => void Linking.openURL(href)}
      accessibilityRole="link"
      accessibilityLabel={label}
      hitSlop={8}
    >
      <Text style={[styles.credit, styles.link]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  credit: {
    marginHorizontal: 16,
    fontSize: 12,
    lineHeight: 16,
    color: theme.primaryMuted,
  },
  link: {
    textDecorationLine: 'underline',
  },
});
