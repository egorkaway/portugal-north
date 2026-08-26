import { useCallback, useEffect, useState, type ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { BuildFooter } from '@/components/BuildFooter';
import { theme } from '@/constants/theme';
import { useLocale } from '@/i18n/LocaleProvider';
import { fetchGlobalRatings } from '@/lib/api';
import { getTopDownvotedHotels, getTopUpvotedHotels } from '@/lib/rankHotels';
import { getTopDownvoted, getTopUpvoted } from '@/lib/rankVotes';
import {
  getBottomReliabilityStations,
  getTopReliabilityStations,
  reliabilityScoreColor,
  formatReliabilityScore,
} from '@/lib/reliabilityScore';
import { getReliabilityScores, getTrainReliabilitySpotlight, pickPublicHotelRatings, pickPublicStationRatings, stationToSlug } from '@/lib/stationData';
import { useCatalogRevision } from '@/lib/useCatalogRevision';
import { getServiceTypeTextColor } from '@/lib/trainTypes';
import {
  formatTrainSpotlightDelay,
  trainSpotlightDelayColor,
} from '@/lib/trainReliabilitySpotlight';

export default function RankingsScreen() {
  const router = useRouter();
  const { t } = useLocale();
  useCatalogRevision();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [ratings, setRatings] = useState<{
    station: Record<string, { up: number; down: number }>;
    hotel: Record<string, { up: number; down: number }>;
    configured: boolean;
  }>({ station: {}, hotel: {}, configured: false });

  const load = useCallback(async () => {
    const global = await fetchGlobalRatings();
    setRatings({
      station: pickPublicStationRatings(global.ratings),
      hotel: pickPublicHotelRatings(global.hotelRatings),
      configured: global.configured,
    });
  }, []);

  useEffect(() => {
    void load().finally(() => setLoading(false));
  }, [load]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const reliability = getReliabilityScores();
  const trainSpotlight = getTrainReliabilitySpotlight();
  const topReliability = getTopReliabilityStations(
    reliability.scores,
    reliability.movements,
    10,
  );
  const bottomReliability = getBottomReliabilityStations(
    reliability.scores,
    reliability.movements,
    10,
  );
  const topStations = getTopUpvoted(ratings.station, 10);
  const bottomStations = getTopDownvoted(ratings.station, 10);
  const topHotels = getTopUpvotedHotels(ratings.hotel, 10);
  const bottomHotels = getTopDownvotedHotels(ratings.hotel, 10);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={theme.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => void onRefresh()} />}
    >
      <Text style={styles.title}>{t('rankings.title')}</Text>
      <Text style={styles.subtitle}>{t('rankings.subtitle')}</Text>

      <RankingSection title={t('rankings.mostReliable')}>
        {topReliability.map((item, index) => (
          <RankingRow
            key={item.name}
            rank={index + 1}
            title={item.name}
            value={`${formatReliabilityScore(item.score)}/10`}
            valueColor={reliabilityScoreColor(item.score)}
            onPress={() => router.push(`/station/${stationToSlug(item.name)}`)}
          />
        ))}
      </RankingSection>

      <RankingSection title={t('rankings.leastReliable')}>
        {bottomReliability.map((item, index) => (
          <RankingRow
            key={item.name}
            rank={index + 1}
            title={item.name}
            value={`${formatReliabilityScore(item.score)}/10`}
            valueColor={reliabilityScoreColor(item.score)}
            onPress={() => router.push(`/station/${stationToSlug(item.name)}`)}
          />
        ))}
      </RankingSection>

      {/* Spain reliability rankings hidden for now — data still collecting */}

      {(trainSpotlight.mostReliable || trainSpotlight.mostDelayed) && (
        <RankingSection title={t('rankings.trainSpotlightTitle')}>
          {trainSpotlight.mostReliable ? (
            <TrainSpotlightRow
              label={t('rankings.mostReliableTrain')}
              trainNumber={trainSpotlight.mostReliable.trainNumber}
              serviceType={trainSpotlight.mostReliable.serviceType}
              value={t('rankings.trainSpotlightAvgDelay', {
                avg: formatTrainSpotlightDelay(trainSpotlight.mostReliable.avgDelayMinutes),
              })}
              valueColor={trainSpotlightDelayColor(trainSpotlight.mostReliable.avgDelayMinutes)}
              majorStations={trainSpotlight.mostReliable.majorStations}
              onStationPress={(name) => router.push(`/station/${stationToSlug(name)}`)}
              subtitle={
                trainSpotlight.mostReliable.selectionMode === 'rotating'
                  ? t('rankings.trainSpotlightRotating', { runCount: trainSpotlight.runCount })
                  : undefined
              }
            />
          ) : null}
          {trainSpotlight.mostDelayed ? (
            <TrainSpotlightRow
              label={t('rankings.mostDelayedTrain')}
              trainNumber={trainSpotlight.mostDelayed.trainNumber}
              serviceType={trainSpotlight.mostDelayed.serviceType}
              value={t('rankings.trainSpotlightAvgDelay', {
                avg: formatTrainSpotlightDelay(trainSpotlight.mostDelayed.avgDelayMinutes),
              })}
              valueColor={trainSpotlightDelayColor(trainSpotlight.mostDelayed.avgDelayMinutes)}
              majorStations={trainSpotlight.mostDelayed.majorStations}
              onStationPress={(name) => router.push(`/station/${stationToSlug(name)}`)}
            />
          ) : null}
        </RankingSection>
      )}

      {!ratings.configured ? (
        <Text style={styles.note}>{t('rankings.votesUnavailable')}</Text>
      ) : (
        <>
          <RankingSection title={t('rankings.topUpvotedStations')}>
            {topStations.map((item, index) => (
              <RankingRow
                key={item.id}
                rank={index + 1}
                title={item.name}
                value={`${item.up} ▲`}
                onPress={() => router.push(`/station/${stationToSlug(item.name)}`)}
              />
            ))}
          </RankingSection>

          <RankingSection title={t('rankings.mostDownvotedStations')}>
            {bottomStations.map((item, index) => (
              <RankingRow
                key={item.id}
                rank={index + 1}
                title={item.name}
                value={`${item.down} ▼`}
                onPress={() => router.push(`/station/${stationToSlug(item.name)}`)}
              />
            ))}
          </RankingSection>

          <RankingSection title={t('rankings.topUpvotedHotels')}>
            {topHotels.map((item, index) => (
              <RankingRow
                key={item.id}
                rank={index + 1}
                title={item.hotelName}
                subtitle={item.stationName}
                value={`${item.up} ▲`}
                onPress={() => router.push(`/station/${stationToSlug(item.stationName)}`)}
              />
            ))}
          </RankingSection>

          <RankingSection title={t('rankings.mostDownvotedHotels')}>
            {bottomHotels.map((item, index) => (
              <RankingRow
                key={item.id}
                rank={index + 1}
                title={item.hotelName}
                subtitle={item.stationName}
                value={`${item.down} ▼`}
                onPress={() => router.push(`/station/${stationToSlug(item.stationName)}`)}
              />
            ))}
          </RankingSection>
        </>
      )}
      <BuildFooter />
    </ScrollView>
  );
}

function TrainSpotlightRow({
  label,
  trainNumber,
  serviceType,
  value,
  valueColor,
  subtitle,
  majorStations,
  onStationPress,
}: {
  label: string;
  trainNumber: string;
  serviceType: string;
  value: string;
  valueColor: string;
  subtitle?: string;
  majorStations?: string[];
  onStationPress?: (stationName: string) => void;
}) {
  const { t } = useLocale();

  return (
    <View style={styles.row}>
      <View style={styles.rowMain}>
        <Text style={styles.rowSubtitle}>{label}</Text>
        <Text style={styles.rowTitle}>
          {trainNumber} ·{' '}
          <Text style={{ color: getServiceTypeTextColor(serviceType), fontWeight: '600' }}>
            {serviceType}
          </Text>
        </Text>
        {subtitle ? <Text style={styles.rowSubtitle}>{subtitle}</Text> : null}
        {majorStations && majorStations.length > 0 ? (
          <Text style={styles.rowSubtitle}>
            {t('rankings.trainSpotlightMajorStations')}{' '}
            {majorStations.map((name, index) => (
              <Text key={name}>
                {index > 0 ? ', ' : ''}
                {onStationPress ? (
                  <Text style={styles.stationLink} onPress={() => onStationPress(name)}>
                    {name}
                  </Text>
                ) : (
                  name
                )}
              </Text>
            ))}
          </Text>
        ) : null}
      </View>
      <Text style={[styles.rowValue, { color: valueColor }]}>{value}</Text>
    </View>
  );
}

function RankingSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.card}>{children}</View>
    </View>
  );
}

function RankingRow({
  rank,
  title,
  subtitle,
  value,
  valueColor,
  onPress,
}: {
  rank: number;
  title: string;
  subtitle?: string;
  value: string;
  valueColor?: string;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.row} onPress={onPress}>
      <View style={styles.rowMain}>
        <Text style={styles.rowTitle}>
          <Text style={styles.rank}>{rank}. </Text>
          {title}
        </Text>
        {subtitle ? <Text style={styles.rowSubtitle}>{subtitle}</Text> : null}
      </View>
      <Text style={[styles.rowValue, valueColor ? { color: valueColor } : null]}>{value}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
    gap: 16,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.background,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.primary,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: theme.primaryMuted,
  },
  note: {
    fontSize: 14,
    color: theme.primaryMuted,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.primary,
  },
  card: {
    backgroundColor: theme.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.border,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  rowMain: {
    flex: 1,
    gap: 2,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.primary,
  },
  rank: {
    color: theme.primaryMuted,
  },
  rowSubtitle: {
    fontSize: 13,
    color: theme.primaryMuted,
  },
  stationLink: {
    color: theme.primary,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  rowValue: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.primary,
  },
});
