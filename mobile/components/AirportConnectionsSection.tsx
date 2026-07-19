import { useRouter } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { STATION_SECTION_PADDING } from '@/components/stationSectionStyles';
import { theme } from '@/constants/theme';
import { useLocale } from '@/i18n/LocaleProvider';
import { formatCountryName } from '@/lib/countryName';
import {
  getAirportConnectionsMapImageUrl,
  getAirportStationSlugByIata,
  getFlightLineColor,
  getFlightLineWeight,
  type AirportConnectionsEntry,
} from '@/lib/airportConnections';

type Props = {
  entry: AirportConnectionsEntry;
  stationName: string;
};

function DestinationName({
  name,
  lineColor,
  onPress,
}: {
  name: string;
  lineColor: string;
  onPress?: () => void;
}) {
  const text = (
    <Text
      style={[
        styles.destinationName,
        {
          textDecorationColor: lineColor,
        },
      ]}
    >
      {name}
    </Text>
  );

  if (!onPress) return text;

  return (
    <Pressable onPress={onPress} accessibilityRole="link">
      {text}
    </Pressable>
  );
}

export function AirportConnectionsSection({ entry, stationName }: Props) {
  const router = useRouter();
  const { t, plural } = useLocale();

  if (entry.topDestinations.length === 0) return null;

  const mapUrl = getAirportConnectionsMapImageUrl(entry.slug);
  const legend = [
    { key: 'busy', minFlights: 5, label: t('airport.legendBusy') },
    { key: 'moderate', minFlights: 3, label: t('airport.legendModerate') },
    { key: 'light', minFlights: 1, label: t('airport.legendLight') },
  ] as const;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{t('airport.title')}</Text>
      <Text style={styles.sectionIntro}>
        {t('airport.intro', { destinations: entry.connections.length })}
      </Text>

      <Image
        source={{ uri: mapUrl }}
        style={styles.mapImage}
        resizeMode="cover"
        accessibilityLabel={`${t('airport.title')} · ${stationName}`}
      />

      <Text style={styles.legendTitle}>{t('airport.legend')}</Text>
      <View style={styles.legendRow}>
        {legend.map((tier) => (
          <View key={tier.key} style={styles.legendItem}>
            <View
              style={[
                styles.legendSwatch,
                {
                  backgroundColor: getFlightLineColor(tier.minFlights),
                  height: getFlightLineWeight(tier.minFlights),
                },
              ]}
            />
            <Text style={styles.legendLabel}>{tier.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.list}>
        {entry.topDestinations.map((destination, index) => {
          const destinationSlug = getAirportStationSlugByIata(destination.iata);
          const lineColor = getFlightLineColor(destination.flightCount);

          return (
            <View key={destination.iata} style={styles.card}>
              <View style={styles.cardMain}>
                <View style={styles.nameRow}>
                  <Text style={styles.rank}>{index + 1}. </Text>
                  <DestinationName
                    name={destination.name}
                    lineColor={lineColor}
                    onPress={
                      destinationSlug
                        ? () => router.push(`/station/${destinationSlug}`)
                        : undefined
                    }
                  />
                  <Text style={styles.iata}> ({destination.iata})</Text>
                </View>
                {destination.country ? (
                  <Text style={styles.country}>
                    {formatCountryName(destination.country)}
                  </Text>
                ) : null}
              </View>
              <View style={styles.countBadge}>
                <Text style={styles.countText}>
                  {plural('airport.flights', destination.flightCount)}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingTop: 8,
  },
  sectionTitle: {
    paddingHorizontal: STATION_SECTION_PADDING,
    paddingTop: 20,
    paddingBottom: 8,
    fontSize: 18,
    fontWeight: '700',
    color: theme.primary,
  },
  sectionIntro: {
    paddingHorizontal: STATION_SECTION_PADDING,
    paddingBottom: 12,
    fontSize: 13,
    lineHeight: 18,
    color: theme.primaryMuted,
  },
  mapImage: {
    marginHorizontal: STATION_SECTION_PADDING,
    aspectRatio: 1,
    alignSelf: 'stretch',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
    backgroundColor: theme.card,
  },
  legendTitle: {
    paddingHorizontal: STATION_SECTION_PADDING,
    paddingTop: 12,
    fontSize: 12,
    fontWeight: '600',
    color: theme.primary,
  },
  legendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingHorizontal: STATION_SECTION_PADDING,
    paddingTop: 8,
    paddingBottom: 4,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendSwatch: {
    width: 28,
    borderRadius: 999,
  },
  legendLabel: {
    fontSize: 12,
    color: theme.primaryMuted,
  },
  list: {
    gap: 8,
    paddingHorizontal: STATION_SECTION_PADDING,
    paddingTop: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
    backgroundColor: theme.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
    padding: 12,
  },
  cardMain: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  nameRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  rank: {
    fontSize: 15,
    color: theme.primaryMuted,
    fontWeight: '600',
  },
  destinationName: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.primary,
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
  },
  iata: {
    fontSize: 13,
    fontWeight: '400',
    color: theme.primaryMuted,
  },
  country: {
    fontSize: 12,
    color: theme.primaryMuted,
    marginTop: 2,
  },
  countBadge: {
    borderRadius: 999,
    backgroundColor: theme.background,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexShrink: 0,
  },
  countText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.primary,
  },
});
