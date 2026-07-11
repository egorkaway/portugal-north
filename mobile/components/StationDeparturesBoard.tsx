import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { fetchStationDepartures } from '@/lib/api';
import {
  formatDepartureCountdown,
  getMinutesUntilDeparture,
} from '@/lib/departureCountdown';
import { setActiveTripFromDeparture, writeActiveTrip } from '@/lib/tripStorage';
import { syncTripWidgets } from '@/lib/widgetSync';
import type { PlannedDeparture, StationDeparture } from '@/lib/types';
import { theme } from '@/constants/theme';

type Props = {
  stationName: string;
  activeTrip: PlannedDeparture | null;
  onTripChanged: (trip: PlannedDeparture | null) => void;
};

function buildDepartureId(dep: StationDeparture, stationName: string): string {
  return `${stationName}|${dep.trainNumber}|${dep.time}|${dep.destination}`;
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
    const id = buildDepartureId(dep, stationName);
    const isTaking = activeTrip?.id === id;

    if (isTaking) {
      await writeActiveTrip(null);
      onTripChanged(null);
      await syncTripWidgets();
      return;
    }

    const trip = await setActiveTripFromDeparture({
      stationName,
      trainNumber: dep.trainNumber,
      departureTime: dep.time,
      destination: dep.destination,
      serviceType: dep.serviceType,
      platform: dep.platform,
      delayMinutes: dep.delayMinutes,
    });
    onTripChanged(trip);
    await syncTripWidgets();
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
        const id = buildDepartureId(dep, stationName);
        const taking = activeTrip?.id === id;
        const minutes = taking
          ? getMinutesUntilDeparture(dep.time, dep.delayMinutes, now)
          : null;

        return (
          <View key={id} style={styles.row}>
            <View style={styles.rowMain}>
              <Text style={styles.time}>
                {dep.time}
                {minutes !== null ? (
                  <Text style={styles.countdown}> {formatDepartureCountdown(minutes)}</Text>
                ) : null}
              </Text>
              <Text style={styles.destination}>→ {dep.destination}</Text>
              <Text style={styles.meta}>
                {dep.serviceType} · Train {dep.trainNumber}
                {dep.platform ? ` · Platform ${dep.platform}` : ''}
              </Text>
              {dep.delayMinutes !== null ? (
                <Text style={styles.delay}>+{dep.delayMinutes} min delay</Text>
              ) : null}
            </View>
            <Pressable
              onPress={() => void toggleTake(dep)}
              style={[styles.takeButton, taking && styles.takeButtonActive]}
            >
              <Text style={[styles.takeText, taking && styles.takeTextActive]}>
                {taking ? 'Tracking' : 'Take'}
              </Text>
            </Pressable>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  loading: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  empty: {
    color: theme.primaryMuted,
    fontSize: 15,
  },
  list: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
    backgroundColor: theme.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
    padding: 12,
  },
  rowMain: {
    flex: 1,
    gap: 2,
  },
  time: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.primary,
  },
  countdown: {
    color: theme.primary,
    fontWeight: '700',
  },
  destination: {
    fontSize: 15,
    color: theme.primary,
  },
  meta: {
    fontSize: 12,
    color: theme.primaryMuted,
    marginTop: 2,
  },
  delay: {
    fontSize: 12,
    color: theme.danger,
    fontWeight: '600',
    marginTop: 2,
  },
  takeButton: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: theme.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: theme.background,
  },
  takeButtonActive: {
    backgroundColor: theme.primary,
    borderColor: theme.primary,
  },
  takeText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.primary,
  },
  takeTextActive: {
    color: '#fff',
  },
});
