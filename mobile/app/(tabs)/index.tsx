import { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppBrandHeader } from '@/components/AppBrandHeader';
import { StationCard } from '@/components/StationCard';
import { BuildFooter } from '@/components/BuildFooter';
import { StationFilters } from '@/components/StationFilters';
import { PAGE_SIZE, sortTrainTypes, theme } from '@/constants/theme';
import { fetchGlobalRatings } from '@/lib/api';
import { orderStationsForHome, stationDistancesKm } from '@/lib/rankStations';
import { stationMatchesSearch } from '@/lib/searchText';
import { allStations, stationToSlug, type Station } from '@/lib/stationData';
import {
  castStationVote,
  readStationVotes,
  readVisitedMap,
  toggleVisited,
} from '@/lib/voteStorage';
import { syncStationVoteToServer } from '@/lib/api';
import { writeLastCoords } from '@/lib/tripStorage';

type VoteFilter = 'up' | 'down' | 'none';
type VisitedFilter = 'visited' | 'notVisited';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [voteFilter, setVoteFilter] = useState<VoteFilter | null>(null);
  const [visitedFilter, setVisitedFilter] = useState<VisitedFilter | null>(null);
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

  const countryStations = allStations;
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
      const isVisited = Boolean(visitedMap[station.name]);
      const matchesVisited =
        !visitedFilter ||
        (visitedFilter === 'visited' && isVisited) ||
        (visitedFilter === 'notVisited' && !isVisited);
      return matchesSearch && matchesType && matchesVote && matchesVisited;
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
    visitedFilter,
    votes,
    visitedMap,
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
          <View style={[styles.header, { paddingTop: insets.top + 4 }]}>
            <AppBrandHeader />

            <StationFilters
              searchQuery={searchQuery}
              onSearchChange={(text) => {
                setSearchQuery(text);
                setPage(1);
              }}
              trainTypes={allTypes}
              typeFilter={typeFilter}
              onTypeToggle={(type) => {
                setTypeFilter(typeFilter === type ? null : type);
                setPage(1);
              }}
              voteFilter={voteFilter}
              onVoteFilterToggle={(filter) => {
                setVoteFilter(voteFilter === filter ? null : filter);
                setPage(1);
              }}
              visitedFilter={visitedFilter}
              onVisitedFilterToggle={(filter) => {
                setVisitedFilter(visitedFilter === filter ? null : filter);
                setPage(1);
              }}
              sortByDistance={sortByDistance}
              loadingLocation={loadingLocation}
              onRequestLocation={requestLocation}
            />

            <Text style={styles.count}>
              {filtered.length} stations
              {visible.length < filtered.length ? ` · showing ${visible.length}` : ''}
            </Text>
          </View>
        }
        ListFooterComponent={<BuildFooter />}
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
    paddingBottom: 12,
    gap: 12,
  },
  count: {
    fontSize: 13,
    color: theme.primaryMuted,
  },
});
