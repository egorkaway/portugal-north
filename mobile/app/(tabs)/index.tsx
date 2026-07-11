import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { ScopePicker } from '@/components/ScopePicker';
import { StationCard } from '@/components/StationCard';
import { PAGE_SIZE, sortTrainTypes, theme } from '@/constants/theme';
import { fetchGlobalRatings } from '@/lib/api';
import { orderStationsForHome, stationDistancesKm } from '@/lib/rankStations';
import { stationMatchesSearch } from '@/lib/searchText';
import {
  getStationsForScope,
  type HomeScope,
  type Station,
} from '@/lib/stationData';
import {
  castStationVote,
  readStationVotes,
  readVisitedMap,
  toggleVisited,
} from '@/lib/voteStorage';
import { syncStationVoteToServer } from '@/lib/api';
import { writeLastCoords } from '@/lib/tripStorage';
import { stationToSlug } from '@/lib/stationData';

type VoteFilter = 'up' | 'down' | 'none';

export default function HomeScreen() {
  const router = useRouter();
  const [scope, setScope] = useState<HomeScope>('pt');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [voteFilter, setVoteFilter] = useState<VoteFilter | null>(null);
  const [sortByDistance, setSortByDistance] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [votes, setVotes] = useState<Record<string, 'up' | 'down'>>({});
  const [visitedMap, setVisitedMap] = useState<Record<string, boolean>>({});
  const [globalRatings, setGlobalRatings] = useState<{
    ratings: Record<string, { up: number; down: number }>;
    configured: boolean;
  }>({ ratings: {}, configured: false });
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);

  const countryStations = useMemo(() => getStationsForScope(scope), [scope]);
  const allTypes = useMemo(
    () => sortTrainTypes([...new Set(countryStations.flatMap((s) => s.types))]),
    [countryStations],
  );

  const loadMeta = useCallback(async () => {
    const [localVotes, visited, global] = await Promise.all([
      readStationVotes(),
      readVisitedMap(),
      fetchGlobalRatings(),
    ]);
    setVotes(localVotes);
    setVisitedMap(visited);
    setGlobalRatings({ ratings: global.ratings, configured: global.configured });
  }, []);

  useEffect(() => {
    void loadMeta();
  }, [loadMeta]);

  const filtered = useMemo(() => {
    const matches = countryStations.filter((station) => {
      const matchesSearch = stationMatchesSearch(station, searchQuery);
      const matchesType = !typeFilter || station.types.includes(typeFilter);
      const vote = votes[station.name];
      const matchesVote =
        !voteFilter ||
        (voteFilter === 'up' && vote === 'up') ||
        (voteFilter === 'down' && vote === 'down') ||
        (voteFilter === 'none' && !vote);
      return matchesSearch && matchesType && matchesVote;
    });

    return orderStationsForHome(matches, {
      distanceSortOn: sortByDistance,
      coords,
      globalRatings: globalRatings.ratings,
      votesConfigured: globalRatings.configured,
    });
  }, [
    countryStations,
    searchQuery,
    typeFilter,
    voteFilter,
    votes,
    sortByDistance,
    coords,
    globalRatings,
  ]);

  const visible = useMemo(
    () => filtered.slice(0, page * PAGE_SIZE),
    [filtered, page],
  );

  const distances = useMemo(
    () => (coords ? stationDistancesKm(countryStations, coords) : {}),
    [coords, countryStations],
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMeta();
    setRefreshing(false);
  };

  const requestLocation = async () => {
    if (sortByDistance && coords) {
      setSortByDistance(false);
      return;
    }

    setLoadingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setSortByDistance(false);
        return;
      }
      const position = await Location.getCurrentPositionAsync({});
      const next = { lat: position.coords.latitude, lng: position.coords.longitude };
      setCoords(next);
      setSortByDistance(true);
      await writeLastCoords(next);
    } finally {
      setLoadingLocation(false);
    }
  };

  const handleVote = async (stationName: string, direction: 'up' | 'down') => {
    const { previous, next } = await castStationVote(stationName, direction);
    setVotes(await readStationVotes());
    void syncStationVoteToServer(stationName, previous, next);
  };

  const handleVisited = async (stationName: string) => {
    await toggleVisited(stationName);
    setVisitedMap(await readVisitedMap());
  };

  const renderItem = ({ item }: { item: Station }) => (
    <StationCard
      station={item}
      distanceKm={sortByDistance && coords ? distances[item.name] : undefined}
      vote={votes[item.name] ?? null}
      visited={Boolean(visitedMap[item.name])}
      onVote={(direction) => void handleVote(item.name, direction)}
      onToggleVisited={() => void handleVisited(item.name)}
      onPress={() => router.push(`/station/${stationToSlug(item.name)}`)}
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={visible}
        keyExtractor={(item) => item.name}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => void onRefresh()} />
        }
        onEndReached={() => {
          if (visible.length < filtered.length) setPage((p) => p + 1);
        }}
        onEndReachedThreshold={0.4}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>VeryStays</Text>
            <Text style={styles.subtitle}>Train stations across Portugal & Spain</Text>

            <ScopePicker
              scope={scope}
              onChange={(next) => {
                setScope(next);
                setPage(1);
                setTypeFilter(null);
              }}
            />

            <TextInput
              value={searchQuery}
              onChangeText={(text) => {
                setSearchQuery(text);
                setPage(1);
              }}
              placeholder="Search stations or lines"
              placeholderTextColor={theme.primaryMuted}
              style={styles.search}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <View style={styles.filterRow}>
              <Pressable
                onPress={() => void requestLocation()}
                style={[styles.filterChip, sortByDistance && styles.filterChipActive]}
              >
                {loadingLocation ? (
                  <ActivityIndicator size="small" color={sortByDistance ? '#fff' : theme.primary} />
                ) : (
                  <Text
                    style={[styles.filterChipText, sortByDistance && styles.filterChipTextActive]}
                  >
                    Near me
                  </Text>
                )}
              </Pressable>
              {(['up', 'down', 'none'] as VoteFilter[]).map((filter) => (
                <Pressable
                  key={filter}
                  onPress={() => setVoteFilter(voteFilter === filter ? null : filter)}
                  style={[styles.filterChip, voteFilter === filter && styles.filterChipActive]}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      voteFilter === filter && styles.filterChipTextActive,
                    ]}
                  >
                    {filter === 'up' ? 'Upvoted' : filter === 'down' ? 'Downvoted' : 'No vote'}
                  </Text>
                </Pressable>
              ))}
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.typeScroller}
              contentContainerStyle={styles.typeScrollerContent}
            >
              {allTypes.map((item) => (
                <Pressable
                  key={item}
                  onPress={() => setTypeFilter(typeFilter === item ? null : item)}
                  style={[styles.typeChip, typeFilter === item && styles.typeChipActive]}
                >
                  <Text
                    style={[
                      styles.typeChipText,
                      typeFilter === item && styles.typeChipTextActive,
                    ]}
                  >
                    {item}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>

            <Text style={styles.count}>
              {filtered.length} stations
              {visible.length < filtered.length ? ` · showing ${visible.length}` : ''}
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  header: {
    paddingTop: 8,
    paddingBottom: 12,
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.primary,
  },
  subtitle: {
    fontSize: 15,
    color: theme.primaryMuted,
    marginBottom: 4,
  },
  search: {
    backgroundColor: theme.card,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: theme.primary,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: theme.border,
    backgroundColor: theme.card,
    minWidth: 72,
    alignItems: 'center',
  },
  filterChipActive: {
    backgroundColor: theme.primary,
    borderColor: theme.primary,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.primaryMuted,
  },
  filterChipTextActive: {
    color: '#fff',
  },
  typeScroller: {
    marginHorizontal: -16,
  },
  typeScrollerContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  typeChip: {
    marginRight: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: theme.border,
    backgroundColor: theme.card,
  },
  typeChipActive: {
    backgroundColor: '#E8EEF2',
    borderColor: theme.primary,
  },
  typeChipText: {
    fontSize: 13,
    color: theme.primaryMuted,
    fontWeight: '600',
  },
  typeChipTextActive: {
    color: theme.primary,
  },
  count: {
    fontSize: 13,
    color: theme.primaryMuted,
  },
});
