import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import ViewShot from 'react-native-view-shot';
import { WidgetPreviewCard } from '@/components/WidgetPreviewCard';
import { GetMapaPromoCard } from '@/components/GetMapaPromoCard';
import { BuildFooter } from '@/components/BuildFooter';
import { TripShareBrandingFooter } from '@/components/TripShareBrandingFooter';
import { theme } from '@/constants/theme';
import { useLocale } from '@/i18n/LocaleProvider';
import {
  fetchStationDepartures,
  fetchTrainJourney,
  getCpStationCode,
  matchLiveDeparture,
} from '@/lib/api';
import { getStationNameByCpCode } from '@/lib/cpStationLookup';
import {
  formatArrivalCountdown,
  formatDepartureCountdown,
  formatDepartureTimeAgo,
  getEffectiveDepartureClock,
  getMinutesSinceDeparture,
  getMinutesUntilTime,
} from '@/lib/departureCountdown';
import { downstreamStopsFrom } from '@/lib/trainJourney';
import { shareCapturedView } from '@/lib/shareMapImage';
import { stationToSlug } from '@/lib/stationData';
import {
  clearActiveTrip,
  deleteTripHistoryRecord,
  readActiveTrip,
  readTripHistory,
} from '@/lib/tripStorage';
import { subscribeTripChanges } from '@/lib/tripEvents';
import { useTripCompletion } from '@/lib/useTripCompletion';
import { useTripDepartureRecord } from '@/lib/useTripDepartureRecord';
import { DEFAULT_WIDGET_PROPS } from '@/lib/widgetDefaults';
import { syncTripWidgets } from '@/lib/widgetSync';
import type { CompletedTripRecord, PlannedDeparture, TripWidgetProps } from '@/lib/types';
import type { TrainJourneyStop } from '@/lib/api';

const TRIP_SHARE_URL = 'https://www.verystays.com/trip';

function TripStopRow({
  stop,
  isOrigin,
  delayMinutes,
  timetableDate,
  now,
  onPressStation,
  t,
}: {
  stop: TrainJourneyStop;
  isOrigin: boolean;
  delayMinutes: number | null;
  timetableDate: string;
  now: Date;
  onPressStation: (stationName: string) => void;
  t: (path: string, params?: Record<string, string | number>) => string;
}) {
  const stationName = getStationNameByCpCode(stop.stationCode) ?? stop.stationName;
  const clockTime = isOrigin
    ? (stop.departureTime ?? stop.arrivalTime)
    : (stop.arrivalTime ?? stop.departureTime);
  const minutesUntil =
    clockTime !== null
      ? getMinutesUntilTime(clockTime, delayMinutes, now, timetableDate)
      : null;
  const countdownLabel =
    minutesUntil !== null
      ? isOrigin
        ? formatDepartureCountdown(minutesUntil, t)
        : formatArrivalCountdown(minutesUntil, t)
      : null;

  return (
    <Pressable style={styles.stopRow} onPress={() => onPressStation(stationName)}>
      <Text style={styles.stopName}>{stationName}</Text>
      <Text style={styles.stopMeta}>
        {clockTime ?? '—'}
        {stop.platform ? ` · ${t('trip.platform', { platform: stop.platform })}` : ''}
      </Text>
      {countdownLabel ? <Text style={styles.stopCountdown}>{countdownLabel}</Text> : null}
    </Pressable>
  );
}

export default function TripScreen() {
  const router = useRouter();
  const { t } = useLocale();
  const [activeTrip, setActiveTrip] = useState<PlannedDeparture | null>(null);
  const [history, setHistory] = useState<CompletedTripRecord[]>([]);
  const [journey, setJourney] = useState<Awaited<ReturnType<typeof fetchTrainJourney>>>(null);
  const [journeyLoading, setJourneyLoading] = useState(false);
  const [journeyError, setJourneyError] = useState(false);
  const [delayMinutes, setDelayMinutes] = useState<number | null>(null);
  const [platform, setPlatform] = useState<string | null>(null);
  const [serviceType, setServiceType] = useState<string>('—');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [widgetPreviewProps, setWidgetPreviewProps] = useState<TripWidgetProps>(DEFAULT_WIDGET_PROPS);
  const [now, setNow] = useState(new Date());
  const shareViewRef = useRef<ViewShot>(null);

  const reload = useCallback(async () => {
    const trip = await readActiveTrip();
    setActiveTrip(trip);
    setHistory(await readTripHistory());

    if (!trip) {
      setJourney(null);
      setDelayMinutes(null);
      setPlatform(null);
      setServiceType('—');
      return;
    }

    const departures = await fetchStationDepartures(trip.stationName, 10);
    const live = matchLiveDeparture(trip, departures);
    const nextDelay = live?.delayMinutes ?? trip.delayMinutes ?? null;
    const nextPlatform = live?.platform ?? trip.platform ?? null;
    const nextServiceType = live?.serviceType ?? trip.serviceType ?? '—';
    setDelayMinutes(nextDelay);
    setPlatform(nextPlatform);
    setServiceType(nextServiceType);

    const originCode = getCpStationCode(trip.stationName);
    if (!originCode) {
      setJourney(null);
      setJourneyError(false);
      return;
    }

    setJourneyLoading(true);
    setJourneyError(false);
    try {
      const nextJourney = await fetchTrainJourney({
        trainNumber: trip.trainNumber,
        timetableDate: trip.timetableDate,
        origin: originCode,
        departure: trip.departureTime,
        destination: trip.destination,
      });
      setJourney(nextJourney);
      if (!nextJourney) setJourneyError(true);
    } catch {
      setJourney(null);
      setJourneyError(true);
    } finally {
      setJourneyLoading(false);
    }
  }, []);

  const refreshWidgetPreview = useCallback(async () => {
    const props = await syncTripWidgets(now);
    setWidgetPreviewProps(props);
  }, [now]);

  useEffect(() => {
    void reload().finally(() => setLoading(false));
    void refreshWidgetPreview();
    const timer = setInterval(() => setNow(new Date()), 60_000);
    const unsubscribe = subscribeTripChanges(() => {
      void reload();
      void refreshWidgetPreview();
    });
    return () => {
      clearInterval(timer);
      unsubscribe();
    };
  }, [reload, refreshWidgetPreview]);

  useFocusEffect(
    useCallback(() => {
      void reload();
      void refreshWidgetPreview();
    }, [reload, refreshWidgetPreview]),
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await reload();
    await refreshWidgetPreview();
    setRefreshing(false);
  }, [reload, refreshWidgetPreview]);

  const onTripCompleted = useCallback(() => {
    void reload();
  }, [reload]);

  const originCode = activeTrip ? getCpStationCode(activeTrip.stationName) : null;
  const downstreamStops = useMemo(() => {
    if (!journey || !originCode || !activeTrip) return [];
    return downstreamStopsFrom(journey, originCode, {
      stationName: activeTrip.stationName,
      departureTime: activeTrip.departureTime,
      platform: platform ?? activeTrip.platform ?? null,
    });
  }, [journey, originCode, activeTrip, platform]);

  useTripDepartureRecord(activeTrip, delayMinutes, now, onTripCompleted);
  useTripCompletion(activeTrip, downstreamStops, delayMinutes, now, onTripCompleted);

  const pastTrips = useMemo(() => {
    if (!activeTrip) return history;
    const minutesSinceDeparture = getMinutesSinceDeparture(
      activeTrip.departureTime,
      delayMinutes,
      now,
      activeTrip.timetableDate,
    );
    if (minutesSinceDeparture === null) {
      return history.filter((record) => record.id !== activeTrip.id);
    }
    return history;
  }, [history, activeTrip, delayMinutes, now]);

  const clearTrip = async () => {
    await clearActiveTrip();
    setActiveTrip(null);
    setJourney(null);
    await reload();
  };

  const shareTrip = useCallback(async () => {
    if (sharing) return;
    setSharing(true);
    try {
      await shareCapturedView(shareViewRef, {
        dialogTitle: t('trip.shareTrip'),
        unavailableTitle: t('trip.shareFailedTitle'),
        unavailableBody: t('trip.sharingUnavailable'),
        message: TRIP_SHARE_URL,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : t('trip.shareFailedBody');
      Alert.alert(t('trip.shareFailedTitle'), message);
    } finally {
      setSharing(false);
    }
  }, [sharing, t]);

  const deleteHistory = async (tripId: string) => {
    await deleteTripHistoryRecord(tripId);
    setHistory(await readTripHistory());
  };

  const openStation = (stationName: string) => {
    router.push(`/station/${stationToSlug(stationName)}`);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={theme.primary} />
      </View>
    );
  }

  const departureMinutesUntil = activeTrip
    ? getMinutesUntilTime(
        activeTrip.departureTime,
        delayMinutes,
        now,
        activeTrip.timetableDate,
      )
    : null;
  const departureCountdown =
    departureMinutesUntil !== null && departureMinutesUntil > 0
      ? formatDepartureCountdown(departureMinutesUntil, t)
      : null;
  const effectiveDepartureTime = activeTrip
    ? getEffectiveDepartureClock(activeTrip.departureTime, delayMinutes)
    : null;
  const minutesSinceDeparture = activeTrip
    ? getMinutesSinceDeparture(
        activeTrip.departureTime,
        delayMinutes,
        now,
        activeTrip.timetableDate,
      )
    : null;
  const hasDeparted = minutesSinceDeparture !== null;
  const hasConfirmedUpcomingStops =
    !journeyLoading && !journeyError && Boolean(journey) && downstreamStops.length > 1;
  const showDepartedWithoutStops = hasDeparted && !hasConfirmedUpcomingStops;
  const departureTimeAgoLabel =
    minutesSinceDeparture !== null
      ? formatDepartureTimeAgo(minutesSinceDeparture, t)
      : null;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => void onRefresh()} />}
    >
      {!activeTrip ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>{t('trip.emptyTitle')}</Text>
          <Text style={styles.emptyBody}>{t('trip.emptyBody')}</Text>
        </View>
      ) : (
        <View style={styles.activeSection}>
          <ViewShot
            ref={shareViewRef}
            style={styles.shareCanvas}
            options={{ format: 'png', quality: 1 }}
          >
            <View
              style={[styles.card, sharing ? styles.cardSharing : null]}
              collapsable={false}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardLabel}>
                  {showDepartedWithoutStops ? t('trip.departed') : t('nav.trip')}
                </Text>
                {!sharing ? (
                  <View style={styles.cardActions}>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={t('trip.shareA11y')}
                      onPress={() => void shareTrip()}
                      style={styles.shareButton}
                    >
                      <SymbolView
                        name={{ ios: 'square.and.arrow.up', android: 'share', web: 'share' }}
                        tintColor={theme.primary}
                        size={18}
                      />
                    </Pressable>
                    <Pressable style={styles.stopButton} onPress={() => void clearTrip()}>
                      <Text style={styles.stopButtonText}>{t('trip.stopTracking')}</Text>
                    </Pressable>
                  </View>
                ) : null}
              </View>

              <Pressable onPress={() => openStation(activeTrip.stationName)}>
                <Text style={styles.stationLink}>{activeTrip.stationName}</Text>
              </Pressable>

              {showDepartedWithoutStops ? (
                <>
                  <Text style={styles.countdown}>
                    {t('trip.departedAt', {
                      time: effectiveDepartureTime ?? activeTrip.departureTime,
                    })}
                  </Text>
                  {departureTimeAgoLabel ? (
                    <Text style={styles.timeAgo}>{departureTimeAgoLabel}</Text>
                  ) : null}
                </>
              ) : (
                <>
                  <Text style={styles.countdown}>
                    {departureCountdown ??
                      (hasDeparted
                        ? t('trip.departedAt', {
                            time: effectiveDepartureTime ?? activeTrip.departureTime,
                          })
                        : activeTrip.departureTime)}
                  </Text>
                  <Text style={styles.meta}>
                    {activeTrip.departureTime}
                    {delayMinutes !== null && delayMinutes > 0
                      ? ` · ${t('trip.delayMin', { minutes: delayMinutes })}`
                      : ''}
                  </Text>
                  {effectiveDepartureTime &&
                  delayMinutes !== null &&
                  delayMinutes > 0 &&
                  effectiveDepartureTime !== activeTrip.departureTime ? (
                    <Text style={styles.meta}>
                      {t('trip.expectedDeparture', { time: effectiveDepartureTime })}
                    </Text>
                  ) : null}
                </>
              )}

              <Text style={styles.trainLine}>
                {activeTrip.trainNumber} → {activeTrip.destination}
              </Text>
              <Text style={styles.meta}>
                {serviceType}
                {platform ? ` · ${t('trip.platform', { platform })}` : ''}
              </Text>
            </View>
            {sharing ? <TripShareBrandingFooter /> : null}
          </ViewShot>

          {journeyLoading ? (
            <ActivityIndicator color={theme.primary} style={styles.journeyLoading} />
          ) : null}

          {hasConfirmedUpcomingStops ? (
            <View style={styles.stopsSection}>
              <Text style={styles.sectionTitle}>{t('trip.upcomingStops')}</Text>
              {downstreamStops.map((stop, index) => (
                <TripStopRow
                  key={`${stop.stationCode}-${index}`}
                  stop={stop}
                  isOrigin={index === 0}
                  delayMinutes={delayMinutes}
                  timetableDate={activeTrip.timetableDate}
                  now={now}
                  onPressStation={openStation}
                  t={t}
                />
              ))}
            </View>
          ) : null}
        </View>
      )}

      <View style={styles.historySection}>
        <Text style={styles.sectionTitle}>{t('trip.pastTrips')}</Text>
        {pastTrips.length === 0 ? (
          <Text style={styles.historyEmpty}>{t('trip.emptyBody')}</Text>
        ) : (
          pastTrips.map((record) => (
            <View key={record.id} style={styles.historyCard}>
              <View style={styles.historyMain}>
                <Text style={styles.historyTitle}>
                  {record.trainNumber} · {record.stationName} → {record.finalStationName}
                </Text>
                <Text style={styles.historyMeta}>
                  {record.timetableDate} · {record.departureTime}
                </Text>
                <View style={styles.historyLinks}>
                  <Pressable onPress={() => openStation(record.stationName)}>
                    <Text style={styles.historyLink}>{t('trip.origin')}</Text>
                  </Pressable>
                  <Pressable onPress={() => openStation(record.finalStationName)}>
                    <Text style={styles.historyLink}>{t('trip.finalStop')}</Text>
                  </Pressable>
                </View>
              </View>
              <Pressable
                style={styles.deleteButton}
                onPress={() => void deleteHistory(record.id)}
              >
                <Text style={styles.deleteButtonText}>{t('common.delete')}</Text>
              </Pressable>
            </View>
          ))
        )}
      </View>

      <WidgetPreviewCard props={widgetPreviewProps} />
      {history.length > 0 ? <GetMapaPromoCard /> : null}
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
  emptyCard: {
    backgroundColor: theme.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.border,
    padding: 20,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.primary,
  },
  emptyBody: {
    fontSize: 15,
    lineHeight: 22,
    color: theme.primaryMuted,
  },
  activeSection: {
    gap: 12,
  },
  card: {
    backgroundColor: theme.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.border,
    padding: 16,
    gap: 6,
  },
  cardSharing: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomWidth: 0,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.primaryMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  shareButton: {
    width: 34,
    height: 34,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: theme.border,
    backgroundColor: theme.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareCanvas: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  stopButton: {
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: theme.background,
  },
  stopButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.primary,
  },
  stationLink: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.primary,
    marginTop: 4,
  },
  countdown: {
    fontSize: 34,
    fontWeight: '800',
    color: theme.primary,
    marginTop: 4,
  },
  timeAgo: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.primary,
  },
  trainLine: {
    fontSize: 16,
    color: theme.primary,
    marginTop: 8,
  },
  meta: {
    fontSize: 14,
    color: theme.primaryMuted,
  },
  journeyLoading: {
    marginVertical: 8,
  },
  stopsSection: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.primary,
  },
  stopRow: {
    backgroundColor: theme.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
    padding: 14,
    gap: 2,
  },
  stopName: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.primary,
  },
  stopMeta: {
    fontSize: 13,
    color: theme.primaryMuted,
  },
  stopCountdown: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.primary,
    marginTop: 2,
  },
  historySection: {
    gap: 10,
    marginTop: 4,
  },
  historyEmpty: {
    fontSize: 14,
    color: theme.primaryMuted,
  },
  historyCard: {
    backgroundColor: theme.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
    padding: 14,
    gap: 10,
  },
  historyMain: {
    gap: 4,
  },
  historyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.primary,
  },
  historyMeta: {
    fontSize: 13,
    color: theme.primaryMuted,
  },
  historyLinks: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 4,
  },
  historyLink: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.primary,
  },
  deleteButton: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  deleteButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.primary,
  },
});
