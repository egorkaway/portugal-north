import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { StationDeparturesBoard } from '@/components/StationDeparturesBoard';
import { AirportConnectionsSection } from '@/components/AirportConnectionsSection';
import { BuildFooter } from '@/components/BuildFooter';
import { StationHotelList } from '@/components/StationHotelList';
import { StationImageCredit } from '@/components/StationImageCredit';
import { StationImageVoteSection } from '@/components/StationImageVoteSection';
import { TrainTypeLabels } from '@/components/TrainTypeLabels';
import { STATION_SECTION_PADDING } from '@/components/stationSectionStyles';
import { VoteButtons } from '@/components/VoteButtons';
import { theme } from '@/constants/theme';
import { getReliabilityForStation, reliabilityScoreColor, formatReliabilityScore } from '@/lib/reliabilityScore';
import { getAirportConnectionsEntry } from '@/lib/airportConnections';
import {
  bakedReliabilityScores,
  getHotelsForStation,
  getStationBySlug,
  getStationImageUrl,
  getSummaryForStation,
  getCpCode,
  getBookingSearchUrl,
  isAirportStation,
} from '@/lib/stationData';
import {
  castStationVote,
  readStationVotes,
  readVisitedMap,
  toggleVisited,
} from '@/lib/voteStorage';
import { syncStationVoteToServer } from '@/lib/api';
import { readActiveTrip } from '@/lib/tripStorage';
import { subscribeTripChanges } from '@/lib/tripEvents';
import type { PlannedDeparture } from '@/lib/types';

export default function StationDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const station = slug ? getStationBySlug(slug) : undefined;

  const [vote, setVote] = useState<'up' | 'down' | null>(null);
  const [visited, setVisited] = useState(false);
  const [activeTrip, setActiveTrip] = useState<PlannedDeparture | null>(null);
  const [loadingMeta, setLoadingMeta] = useState(true);

  const loadMeta = useCallback(async () => {
    const [votes, visitedMap, trip] = await Promise.all([
      readStationVotes(),
      readVisitedMap(),
      readActiveTrip(),
    ]);
    if (station) {
      setVote(votes[station.name] ?? null);
      setVisited(Boolean(visitedMap[station.name]));
    }
    setActiveTrip(trip);
    setLoadingMeta(false);
  }, [station]);

  useEffect(() => {
    void loadMeta();
  }, [loadMeta]);

  useEffect(() => {
    return subscribeTripChanges(() => {
      void readActiveTrip().then(setActiveTrip);
    });
  }, []);

  if (!station) {
    return (
      <View style={styles.centered}>
        <Text style={styles.title}>Station not found</Text>
        <Pressable style={styles.button} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  const imageUrl = getStationImageUrl(station.name);
  const summary = getSummaryForStation(station.name);
  const hotels = getHotelsForStation(station.name);
  const reliability = getReliabilityForStation(bakedReliabilityScores, station.name);
  const hasCpCode = Boolean(getCpCode(station.name));
  const airport = isAirportStation(station);
  const airportConnections = airport ? getAirportConnectionsEntry(station) : null;

  const handleVote = async (direction: 'up' | 'down') => {
    const { previous, next } = await castStationVote(station.name, direction);
    setVote(next);
    void syncStationVoteToServer(station.name, previous, next);
  };

  const handleVisited = async () => {
    const next = await toggleVisited(station.name);
    setVisited(next);
  };

  const handleTripChanged = (trip: PlannedDeparture | null) => {
    setActiveTrip(trip);
  };

  const openMaps = () => {
    const url = `https://maps.apple.com/?ll=${station.lat},${station.lng}&q=${encodeURIComponent(station.name)}`;
    void Linking.openURL(url);
  };

  const openBookingSearch = () => {
    void Linking.openURL(getBookingSearchUrl(station));
  };

  if (loadingMeta) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={theme.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.hero} resizeMode="cover" />
      ) : (
        <View style={[styles.hero, styles.heroPlaceholder]}>
          <Text style={styles.heroPlaceholderText}>No photo yet</Text>
        </View>
      )}

      <View style={styles.headerRow}>
        <View style={styles.headerMain}>
          <Text style={styles.title}>{station.name}</Text>
          <Text style={styles.lines}>{station.lines.join(' · ')}</Text>
        </View>
        <VoteButtons vote={vote} onVote={(direction) => void handleVote(direction)} />
      </View>

      <TrainTypeLabels types={station.types} />

      <Pressable
        onPress={() => void handleVisited()}
        style={[styles.visitedButton, visited && styles.visitedButtonActive]}
      >
        <Text style={[styles.visitedButtonText, visited && styles.visitedButtonTextActive]}>
          {visited ? 'Visited' : 'Mark as visited'}
        </Text>
      </Pressable>

      {summary ? <Text style={styles.summary}>{summary}</Text> : null}

      {!airport && hasCpCode ? (
        <>
          <Text style={styles.sectionTitle}>Live departures</Text>
          <StationDeparturesBoard
            stationName={station.name}
            activeTrip={activeTrip}
            onTripChanged={(trip) => void handleTripChanged(trip)}
          />
        </>
      ) : null}

      {!airport && reliability.score !== null ? (
        <>
          <Text style={styles.sectionTitle}>On-time reliability</Text>
          <View style={styles.reliabilityCard}>
            <Text style={[styles.reliabilityScore, { color: reliabilityScoreColor(reliability.score) }]}>
              {formatReliabilityScore(reliability.score)}/10
            </Text>
            <Text style={styles.reliabilityMeta}>
              Based on cumulative delays from live departure data.
            </Text>
          </View>
        </>
      ) : null}

      {airportConnections ? (
        <AirportConnectionsSection entry={airportConnections} stationName={station.name} />
      ) : null}

      {hotels.length > 0 ? (
        <>
          <Text style={styles.sectionTitle}>Budget stays nearby</Text>
          <Text style={styles.sectionIntro}>
            Curated budget hotels within walking distance of the station.
          </Text>
          <StationHotelList hotels={hotels.slice(0, 5)} />
        </>
      ) : null}

      {imageUrl ? (
        <View style={styles.photoFeedback}>
          <StationImageVoteSection stationName={station.name} imageUrl={imageUrl} />
          <StationImageCredit imageUrl={imageUrl} />
        </View>
      ) : null}

      <Pressable style={styles.mapsButton} onPress={openMaps}>
        <Text style={styles.mapsButtonText}>Open in Apple Maps</Text>
      </Pressable>

      <Pressable style={styles.bookingButton} onPress={openBookingSearch}>
        <Text style={styles.bookingButtonText}>Search on Booking</Text>
      </Pressable>

      <Text style={styles.coords}>
        {station.lat.toFixed(5)}, {station.lng.toFixed(5)}
      </Text>
      <BuildFooter />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  content: {
    paddingBottom: 32,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.background,
    padding: 24,
    gap: 12,
  },
  hero: {
    width: '100%',
    height: 220,
    backgroundColor: '#DDE4EA',
  },
  heroPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroPlaceholderText: {
    color: theme.primaryMuted,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  headerMain: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: theme.primary,
  },
  lines: {
    fontSize: 14,
    color: theme.primaryMuted,
  },
  visitedButton: {
    marginHorizontal: 16,
    marginTop: 12,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: theme.card,
  },
  visitedButtonActive: {
    borderColor: theme.success,
    backgroundColor: '#E8F5EE',
  },
  visitedButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.primaryMuted,
  },
  visitedButtonTextActive: {
    color: theme.success,
  },
  summary: {
    paddingHorizontal: 16,
    paddingTop: 16,
    fontSize: 15,
    lineHeight: 22,
    color: theme.primary,
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
    paddingBottom: 8,
    fontSize: 13,
    lineHeight: 18,
    color: theme.primaryMuted,
  },
  reliabilityCard: {
    marginHorizontal: STATION_SECTION_PADDING,
    backgroundColor: theme.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
    padding: 14,
    gap: 4,
    alignItems: 'flex-start',
  },
  reliabilityScore: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'left',
  },
  reliabilityMeta: {
    fontSize: 13,
    color: theme.primaryMuted,
    textAlign: 'left',
  },
  photoFeedback: {
    marginTop: 20,
    gap: 10,
  },
  mapsButton: {
    marginHorizontal: STATION_SECTION_PADDING,
    marginTop: 16,
    backgroundColor: theme.primary,
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: 'center',
  },
  mapsButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  bookingButton: {
    marginHorizontal: STATION_SECTION_PADDING,
    marginTop: 10,
    backgroundColor: theme.card,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: theme.border,
    paddingVertical: 12,
    alignItems: 'center',
  },
  bookingButtonText: {
    color: theme.primary,
    fontWeight: '700',
    fontSize: 15,
  },
  coords: {
    paddingHorizontal: 16,
    paddingTop: 12,
    fontSize: 12,
    color: theme.primaryMuted,
  },
  button: {
    backgroundColor: theme.primary,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
});
