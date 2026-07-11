import { Linking, Pressable, Text, View } from 'react-native';
import { stationSectionStyles as styles } from '@/components/stationSectionStyles';
import type { Hotel } from '@/lib/stationData';

type Props = {
  hotels: Hotel[];
};

export function StationHotelList({ hotels }: Props) {
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
              {hotel.distanceKm.toFixed(1)} km from station
            </Text>
            <Text style={styles.cardMeta}>from €{hotel.priceFrom}/night</Text>
          </View>
          <View style={styles.cardAside}>
            <Text style={styles.cardPrice}>€{hotel.priceFrom}</Text>
            <View style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Book</Text>
            </View>
          </View>
        </Pressable>
      ))}
    </View>
  );
}
