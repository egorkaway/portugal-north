import { useRouter, type Href } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { STATION_SECTION_PADDING } from '@/components/stationSectionStyles';
import { stationSectionStyles as styles } from '@/components/stationSectionStyles';
import { TrainTypeLabels } from '@/components/TrainTypeLabels';
import { theme } from '@/constants/theme';
import { useLocale } from '@/i18n/LocaleProvider';
import { formatDistance } from '@/lib/geo';
import {
  getLongDistanceTypes,
  getNearestLongDistanceStations,
  shouldShowNearestLongDistance,
} from '@/lib/nearestLongDistanceStations';
import { displayTrainType } from '@/lib/trainTypes';
import { stationToSlug, type Station } from '@/lib/stationData';

type Props = {
  station: Station;
};

export function NearestLongDistanceStations({ station }: Props) {
  const router = useRouter();
  const { t } = useLocale();
  const icService = displayTrainType('Intercidades', { country: station.country });

  if (!shouldShowNearestLongDistance(station)) {
    return null;
  }

  const nearest = getNearestLongDistanceStations(station);
  if (nearest.length === 0) {
    return null;
  }

  return (
    <View style={sectionStyles.section}>
      <Text style={sectionStyles.sectionTitle}>{t('station.longDistanceNearby')}</Text>
      <Text style={sectionStyles.sectionIntro}>
        {t('station.longDistanceIntro', { icService })}
      </Text>
      <View style={styles.list}>
        {nearest.map(({ station: candidate, distanceKm }) => (
          <Pressable
            key={candidate.name}
            style={[styles.card, cardStyles.cardColumn]}
            onPress={() => router.push(`/station/${stationToSlug(candidate.name)}` as Href)}
            accessibilityRole="link"
          >
            <View style={styles.cardMain}>
              <Text style={styles.cardTitle}>{candidate.name}</Text>
              <Text style={styles.cardMeta} numberOfLines={2}>
                {candidate.lines.join(' · ')}
              </Text>
              <Text style={cardStyles.distance}>{t('station.away', { distance: formatDistance(distanceKm) })}</Text>
              <TrainTypeLabels
                types={getLongDistanceTypes(candidate)}
                compact
                country={candidate.country}
              />
            </View>
            <Text style={cardStyles.chevron} accessibilityElementsHidden>
              ›
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const sectionStyles = {
  section: {
    marginTop: 4,
  },
  sectionTitle: {
    paddingHorizontal: STATION_SECTION_PADDING,
    paddingTop: 20,
    paddingBottom: 8,
    fontSize: 18,
    fontWeight: '700' as const,
    color: theme.primary,
  },
  sectionIntro: {
    paddingHorizontal: STATION_SECTION_PADDING,
    paddingBottom: 8,
    fontSize: 13,
    lineHeight: 18,
    color: theme.primaryMuted,
  },
};

const cardStyles = {
  cardColumn: {
    alignItems: 'flex-start' as const,
  },
  distance: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: theme.primary,
    marginTop: 4,
  },
  chevron: {
    position: 'absolute' as const,
    right: 12,
    top: 12,
    fontSize: 22,
    fontWeight: '300' as const,
    color: theme.primaryMuted,
  },
};
