import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { stationSectionStyles as styles, STATION_SECTION_PADDING } from '@/components/stationSectionStyles';
import { theme } from '@/constants/theme';
import { useLocale } from '@/i18n/LocaleProvider';
import { fetchStationArrivals } from '@/lib/api';
import {
  canLoadMoreDepartures,
  INITIAL_DEPARTURES_LIMIT,
  nextDeparturesLimit,
} from '@/lib/departureLimits';
import {
  formatArrivalCountdown,
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
import type { PlannedDeparture, StationArrival } from '@/lib/types';

type Props = {
  stationName: string;
  activeTrip: PlannedDeparture | null;
  onTripChanged: (trip: PlannedDeparture | null) => void;
};

function trackTimeFor(arr: StationArrival): string {
  return arr.terminatesHere ? arr.time : (arr.departureTime ?? arr.time);
}

function buildOptimisticTrip(
  arr: StationArrival,
  stationName: string,
): PlannedDeparture {
  const { date } = lisbonDateAndTime();
  const trackTime = trackTimeFor(arr);
  const purpose = arr.terminatesHere ? ('meet' as const) : ('take' as const);
  const destination = arr.terminatesHere ? arr.origin : arr.destination;
  return {
    id: buildPlannedDepartureId(
      stationName,
      arr.trainNumber,
      trackTime,
      destination,
      date,
    ),
    stationName,
    trainNumber: arr.trainNumber,
    departureTime: trackTime,
    destination,
    serviceType: arr.serviceType,
    platform: arr.platform,
    delayMinutes: arr.delayMinutes,
    timetableDate: date,
    selectedAt: new Date().toISOString(),
    purpose,
  };
}

export function StationArrivalsBoard({
  stationName,
  activeTrip,
  onTripChanged,
}: Props) {
  const { t } = useLocale();
  const [arrivals, setArrivals] = useState<StationArrival[]>([]);
  const [limit, setLimit] = useState(INITIAL_DEPARTURES_LIMIT);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [now, setNow] = useState(new Date());

  const load = useCallback(
    async (nextLimit: number, mode: 'initial' | 'more') => {
      if (mode === 'initial') setLoading(true);
      else setLoadingMore(true);

      try {
        const rows = await fetchStationArrivals(stationName, nextLimit);
        setArrivals(rows);
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

  const showLoadMore = !loading && canLoadMoreDepartures(limit, arrivals.length);

  const handleLoadMore = () => {
    if (loadingMore) return;
    void load(nextDeparturesLimit(limit), 'more');
  };

  const toggleAction = async (arr: StationArrival) => {
    const optimisticTrip = buildOptimisticTrip(arr, stationName);
    const isCurrentlyActive = activeTrip?.id === optimisticTrip.id;

    if (isCurrentlyActive) {
      onTripChanged(null);
      await clearActiveTrip();
      return;
    }

    onTripChanged(optimisticTrip);

    try {
      const trip = await takeActiveTrip({
        stationName,
        trainNumber: arr.trainNumber,
        departureTime: optimisticTrip.departureTime,
        destination: optimisticTrip.destination,
        serviceType: arr.serviceType,
        platform: arr.platform,
        delayMinutes: arr.delayMinutes,
        purpose: optimisticTrip.purpose,
      });
      onTripChanged(trip);
    } catch (error) {
      console.warn('[trip] meet/take arrival failed', error);
      const stored = await readActiveTrip();
      onTripChanged(stored?.id === optimisticTrip.id ? stored : null);
    }
  };

  if (loading || arrivals.length === 0) {
    return null;
  }

  return (
    <View>
      <Text style={localStyles.sectionTitle}>{t('arrivals.title')}</Text>
      <View style={styles.list}>
      {arrivals.map((arr) => {
        const { date } = lisbonDateAndTime(now);
        const trackTime = trackTimeFor(arr);
        const destination = arr.terminatesHere ? arr.origin : arr.destination;
        const id = buildPlannedDepartureId(
          stationName,
          arr.trainNumber,
          trackTime,
          destination,
          date,
        );
        const active = activeTrip?.id === id;
        const minutes = active
          ? getMinutesUntilDeparture(
              trackTime,
              arr.delayMinutes,
              now,
              activeTrip?.timetableDate ?? date,
            )
          : null;
        const countdown =
          minutes !== null
            ? arr.terminatesHere
              ? formatArrivalCountdown(minutes, t)
              : formatDepartureCountdown(minutes, t)
            : null;

        return (
          <View key={id} style={styles.card}>
            <View style={styles.cardMain}>
              <Text style={styles.cardTitle}>
                {arr.departureTime && arr.departureTime !== arr.time
                  ? `${arr.time} → ${arr.departureTime}`
                  : arr.time}
                {countdown ? <Text> {countdown}</Text> : null}
              </Text>
              <Text style={styles.cardSubtitle} numberOfLines={1}>
                {arr.terminatesHere
                  ? t('arrivals.fromOrigin', { origin: arr.origin })
                  : t('arrivals.continuesTo', {
                      origin: arr.origin,
                      destination: arr.destination,
                    })}
              </Text>
              <Text style={styles.cardMeta}>
                {arr.serviceType} · {t('departures.train')} {arr.trainNumber}
                {arr.platform ? ` · ${t('departures.platform')} ${arr.platform}` : ''}
                {arr.terminatesHere ? ` · ${t('arrivals.terminates')}` : ''}
              </Text>
              {arr.delayMinutes !== null ? (
                <Text style={[styles.cardMeta, { color: theme.danger, fontWeight: '600' }]}>
                  {t('departures.delayMin', { minutes: arr.delayMinutes })}
                </Text>
              ) : null}
            </View>
            <View style={styles.cardAside}>
              <Pressable
                onPress={() => void toggleAction(arr)}
                style={[
                  styles.actionButton,
                  active && { backgroundColor: theme.primary, borderColor: theme.primary },
                ]}
              >
                <Text
                  style={[
                    styles.actionButtonText,
                    active && { color: '#fff' },
                  ]}
                >
                  {arr.terminatesHere
                    ? active
                      ? t('arrivals.meeting')
                      : t('arrivals.meet')
                    : active
                      ? t('departures.taking')
                      : t('departures.take')}
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
          accessibilityLabel={t('departures.loadMore')}
        >
          {loadingMore ? (
            <ActivityIndicator color={theme.primary} />
          ) : (
            <Text style={localStyles.loadMoreText}>{t('departures.loadMore')}</Text>
          )}
        </Pressable>
      ) : null}
      </View>
    </View>
  );
}

const localStyles = StyleSheet.create({
  sectionTitle: {
    paddingHorizontal: STATION_SECTION_PADDING,
    paddingTop: 20,
    paddingBottom: 8,
    fontSize: 18,
    fontWeight: '700',
    color: theme.primary,
  },
  loadMore: {
    marginTop: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
    backgroundColor: theme.background,
    paddingVertical: 12,
    alignItems: 'center',
  },
  loadMoreDisabled: {
    opacity: 0.6,
  },
  loadMoreText: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.primary,
  },
});
