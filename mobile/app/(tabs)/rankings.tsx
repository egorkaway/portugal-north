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
import { theme } from '@/constants/theme';
import { fetchGlobalRatings } from '@/lib/api';
import { getTopDownvotedHotels, getTopUpvotedHotels } from '@/lib/rankHotels';
import { getTopDownvoted, getTopUpvoted } from '@/lib/rankVotes';
import {
  getBottomReliabilityStations,
  getTopReliabilityStations,
  reliabilityScoreColor,
} from '@/lib/reliabilityScore';
import { bakedReliabilityScores, stationToSlug } from '@/lib/stationData';

export default function RankingsScreen() {
  const router = useRouter();
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
      station: global.ratings,
      hotel: global.hotelRatings,
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

  const reliability = bakedReliabilityScores;
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
      <Text style={styles.title}>Rankings</Text>
      <Text style={styles.subtitle}>
        On-time reliability from CP data, plus community votes for stations and hotels.
      </Text>

      <RankingSection title="Most reliable stations">
        {topReliability.map((item, index) => (
          <RankingRow
            key={item.name}
            rank={index + 1}
            title={item.name}
            value={`${item.score}/10`}
            valueColor={reliabilityScoreColor(item.score)}
            onPress={() => router.push(`/station/${stationToSlug(item.name)}`)}
          />
        ))}
      </RankingSection>

      <RankingSection title="Least reliable stations">
        {bottomReliability.map((item, index) => (
          <RankingRow
            key={item.name}
            rank={index + 1}
            title={item.name}
            value={`${item.score}/10`}
            valueColor={reliabilityScoreColor(item.score)}
            onPress={() => router.push(`/station/${stationToSlug(item.name)}`)}
          />
        ))}
      </RankingSection>

      {!ratings.configured ? (
        <Text style={styles.note}>Community votes are unavailable right now.</Text>
      ) : (
        <>
          <RankingSection title="Most upvoted stations">
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

          <RankingSection title="Most downvoted stations">
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

          <RankingSection title="Most upvoted hotels">
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

          <RankingSection title="Most downvoted hotels">
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
    </ScrollView>
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
  rowValue: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.primary,
  },
});
