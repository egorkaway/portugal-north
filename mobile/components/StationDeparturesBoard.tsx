import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  Text,
  View,
} from 'react-native';
import { stationSectionStyles as styles } from '@/components/stationSectionStyles';
import { fetchStationDepartures } from '@/lib/api';
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
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(new Date());

  const load = useCallback(async () => {
    setLoading(true);
    const rows = await fetchStationDepartures(stationName, 8);
    setDepartures(rows);
    setLoading(false);
  }, [stationName]);

  useEffect(() => {
    void load();
    const timer = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(timer);
  }, [load]);

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
        const id = buildPlannedDepartureId(
          stationName,
          dep.trainNumber,
          dep.time,
          dep.destination,
        );
        const taking = activeTrip?.id === id;
        const minutes = taking
          ? getMinutesUntilDeparture(dep.time, dep.delayMinutes, now)
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
    </View>
  );
}
