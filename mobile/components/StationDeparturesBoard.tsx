import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { stationSectionStyles as styles } from '@/components/stationSectionStyles';
import { fetchStationDepartures } from '@/lib/api';
import {
  canLoadMoreDepartures,
  INITIAL_DEPARTURES_LIMIT,
  nextDeparturesLimit,
} from '@/lib/departureLimits';
import {
  formatDepartureCountdown,
  getMinutesUntilDeparture,
} from '@/lib/departureCountdown';
import { lisbonDateAndTime } from '@/lib/lisbonTime';
import {
  buildPlannedDepartureId,
  clearActiveTrip,
  readActiveTrip,
  takeActiveTrip,
} from '@/lib/tripStorage';
import type { PlannedDeparture, StationDeparture } from '@/lib/types';
import { theme } from '@/constants/theme';

type Props = {
  stationName: string;
  activeTrip: PlannedDeparture | null;
  onTripChanged: (trip: PlannedDeparture | null) => void;
};

function buildOptimisticTrip(
  dep: StationDeparture,
  stationName: string,
): PlannedDeparture {
  const { date } = lisbonDateAndTime();
  return {
    id: buildPlannedDepartureId(
      stationName,
      dep.trainNumber,
      dep.time,
      dep.destination,
      date,
    ),
    stationName,
    trainNumber: dep.trainNumber,
    departureTime: dep.time,
    destination: dep.destination,
    serviceType: dep.serviceType,
    platform: dep.platform,
    delayMinutes: dep.delayMinutes,
    timetableDate: date,
    selectedAt: new Date().toISOString(),
  };
}

export function StationDeparturesBoard({
  stationName,
  activeTrip,
  onTripChanged,
}: Props) {
  const [departures, setDepartures] = useState<StationDeparture[]>([]);
  const [limit, setLimit] = useState(INITIAL_DEPARTURES_LIMIT);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [now, setNow] = useState(new Date());

  const load = useCallback(
    async (nextLimit: number, mode: 'initial' | 'more') => {
      if (mode === 'initial') setLoading(true);
      else setLoadingMore(true);

      try {
        const rows = await fetchStationDepartures(stationName, nextLimit);
        setDepartures(rows);
        setLimit(nextLimit);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [stationName],
  );

  useEffect(() => {
    setLimit(INITIAL_DEPARTURES_LIMIT);
    void load(INITIAL_DEPARTURES_LIMIT, 'initial');
    const timer = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(timer);
  }, [load]);

  const showLoadMore = !loading && canLoadMoreDepartures(limit, departures.length);

  const handleLoadMore = () => {
    if (loadingMore) return;
    void load(nextDeparturesLimit(limit), 'more');
  };

  const toggleTake = async (dep: StationDeparture) => {
    const optimisticTrip = buildOptimisticTrip(dep, stationName);
    const isCurrentlyTaking = activeTrip?.id === optimisticTrip.id;

    if (isCurrentlyTaking) {
      onTripChanged(null);
      await clearActiveTrip();
      return;
    }

    onTripChanged(optimisticTrip);

    try {
      const trip = await takeActiveTrip({
        stationName,
        trainNumber: dep.trainNumber,
        departureTime: dep.time,
        destination: dep.destination,
        serviceType: dep.serviceType,
        platform: dep.platform,
        delayMinutes: dep.delayMinutes,
      });
      onTripChanged(trip);
    } catch (error) {
      console.warn('[trip] take failed', error);
      const stored = await readActiveTrip();
      onTripChanged(stored?.id === optimisticTrip.id ? stored : null);
    }
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={theme.primary} />
      </View>
    );
  }

  if (departures.length === 0) {
    return <Text style={styles.empty}>No live departures for this station.</Text>;
  }

  return (
    <View style={styles.list}>
      {departures.map((dep) => {
        const { date } = lisbonDateAndTime(now);
        const id = buildPlannedDepartureId(
          stationName,
          dep.trainNumber,
          dep.time,
          dep.destination,
          date,
        );
        const taking = activeTrip?.id === id;
        const minutes = taking
          ? getMinutesUntilDeparture(
              dep.time,
              dep.delayMinutes,
              now,
              activeTrip?.timetableDate ?? date,
            )
          : null;

        return (
          <View key={id} style={styles.card}>
            <View style={styles.cardMain}>
              <Text style={styles.cardTitle}>
                {dep.time}
                {minutes !== null ? (
                  <Text> {formatDepartureCountdown(minutes)}</Text>
                ) : null}
              </Text>
              <Text style={styles.cardSubtitle} numberOfLines={1}>
                → {dep.destination}
              </Text>
              <Text style={styles.cardMeta}>
                {dep.serviceType} · Train {dep.trainNumber}
                {dep.platform ? ` · Platform ${dep.platform}` : ''}
              </Text>
              {dep.delayMinutes !== null ? (
                <Text style={[styles.cardMeta, { color: theme.danger, fontWeight: '600' }]}>
                  +{dep.delayMinutes} min delay
                </Text>
              ) : null}
            </View>
            <View style={styles.cardAside}>
              <Pressable
                onPress={() => void toggleTake(dep)}
                style={[
                  styles.actionButton,
                  taking && { backgroundColor: theme.primary, borderColor: theme.primary },
                ]}
              >
                <Text
                  style={[
                    styles.actionButtonText,
                    taking && { color: '#fff' },
                  ]}
                >
                  {taking ? 'Taking' : 'Take'}
                </Text>
              </Pressable>
            </View>
          </View>
        );
      })}

      {showLoadMore ? (
        <Pressable
          onPress={handleLoadMore}
          disabled={loadingMore}
          style={[localStyles.loadMore, loadingMore && localStyles.loadMoreDisabled]}
          accessibilityRole="button"
          accessibilityLabel="Show more trains"
        >
          {loadingMore ? (
            <ActivityIndicator color={theme.primary} />
          ) : (
            <Text style={localStyles.loadMoreText}>Show more trains</Text>
          )}
        </Pressable>
      ) : null}
    </View>
  );
}

const localStyles = StyleSheet.create({
  loadMore: {
    marginTop: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
    backgroundColor: theme.background,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  loadMoreDisabled: {
    opacity: 0.65,
  },
  loadMoreText: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.primary,
  },
});
