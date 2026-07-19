import { Linking, Pressable, Text, View } from 'react-native';
import { stationSectionStyles as styles } from '@/components/stationSectionStyles';
import { useLocale } from '@/i18n/LocaleProvider';
import type { Hotel } from '@/lib/stationData';

type Props = {
  hotels: Hotel[];
};

export function StationHotelList({ hotels }: Props) {
  const { t } = useLocale();

  return (
    <View style={styles.list}>
      {hotels.map((hotel) => (
        <Pressable
          key={hotel.name}
          style={styles.card}
          onPress={() => void Linking.openURL(hotel.bookingUrl)}
        >
          <View style={styles.cardMain}>
            <Text style={styles.cardTitle} numberOfLines={2}>
              {hotel.name}
            </Text>
            <Text style={styles.cardMeta}>
              {t('hotel.kmFromStation', { km: hotel.distanceKm.toFixed(1) })}
            </Text>
            <Text style={styles.cardMeta}>
              {t('hotel.fromPerNight', { price: hotel.priceFrom })}
            </Text>
          </View>
          <View style={styles.cardAside}>
            <Text style={styles.cardPrice}>€{hotel.priceFrom}</Text>
            <View style={styles.actionButton}>
              <Text style={styles.actionButtonText}>{t('hotel.view')}</Text>
            </View>
          </View>
        </Pressable>
      ))}
    </View>
  );
}
