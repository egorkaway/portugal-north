import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { fetchStationDepartures } from '@/lib/api';
import {
  formatDepartureCountdown,
  getEffectiveDepartureClock,
  getMinutesUntilDeparture,
} from '@/lib/departureCountdown';
import {
  clearTripWidgets,
  syncTripWidgets,
} from '@/lib/widgetSync';
import {
  readActiveTrip,
  setActiveTripFromDeparture,
  writeActiveTrip,
} from '@/lib/tripStorage';
import type { PlannedDeparture, StationDeparture } from '@/lib/types';

export default function TripScreen() {
  const [activeTrip, setActiveTrip] = useState<PlannedDeparture | null>(null);
  const [departures, setDepartures] = useState<StationDeparture[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [now, setNow] = useState(new Date());

  const load = useCallback(async () => {
    const trip = await readActiveTrip();
    setActiveTrip(trip);

    if (trip) {
      const rows = await fetchStationDepartures(trip.stationName, 8);
      setDepartures(rows);
    } else {
      setDepartures([]);
    }
  }, []);

  useEffect(() => {
    void load().finally(() => setLoading(false));
    const timer = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(timer);
  }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    await syncTripWidgets();
    setRefreshing(false);
  }, [load]);

  const takeDeparture = async (dep: StationDeparture) => {
    if (!activeTrip) return;
    const trip = await setActiveTripFromDeparture({
      stationName: activeTrip.stationName,
      trainNumber: dep.trainNumber,
      departureTime: dep.time,
      destination: dep.destination,
      serviceType: dep.serviceType,
      platform: dep.platform,
      delayMinutes: dep.delayMinutes,
    });
    setActiveTrip(trip);
    await syncTripWidgets();
  };

  const clearTrip = async () => {
    await writeActiveTrip(null);
    setActiveTrip(null);
    setDepartures([]);
    await clearTripWidgets();
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color="#012841" />
      </View>
    );
  }

  if (!activeTrip) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>No active trip</Text>
        <Text style={styles.body}>
          Open a station, pick a departure, and tap Take. The home-screen widget and Live Activity
          will show the countdown here.
        </Text>
        <Pressable style={styles.secondaryButton} onPress={() => void syncTripWidgets()}>
          <Text style={styles.secondaryButtonText}>Refresh widget</Text>
        </Pressable>
      </View>
    );
  }

  const minutes = getMinutesUntilDeparture(
    activeTrip.departureTime,
    activeTrip.delayMinutes,
    now,
  );
  const effectiveTime =
    getEffectiveDepartureClock(activeTrip.departureTime, activeTrip.delayMinutes) ??
    activeTrip.departureTime;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.station}>{activeTrip.stationName}</Text>
        <Text style={styles.countdown}>
          {minutes === null ? effectiveTime : formatDepartureCountdown(minutes)}
        </Text>
        <Text style={styles.meta}>
          {activeTrip.trainNumber} → {activeTrip.destination}
        </Text>
        <Text style={styles.meta}>
          Departs {effectiveTime}
          {activeTrip.platform ? ` · Platform ${activeTrip.platform}` : ''}
        </Text>
        <Pressable style={styles.clearButton} onPress={() => void clearTrip()}>
          <Text style={styles.clearButtonText}>Clear trip</Text>
        </Pressable>
      </View>

      <Text style={styles.sectionTitle}>Other departures</Text>
      <FlatList
        data={departures}
        keyExtractor={(item) => `${item.trainNumber}-${item.time}-${item.destination}`}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => void onRefresh()} />}
        renderItem={({ item }) => (
          <Pressable style={styles.row} onPress={() => void takeDeparture(item)}>
            <View>
              <Text style={styles.rowTitle}>
                {item.time} · {item.trainNumber}
              </Text>
              <Text style={styles.rowMeta}>{item.destination}</Text>
            </View>
            <Text style={styles.rowAction}>Take</Text>
          </Pressable>
        )}
        ListEmptyComponent={<Text style={styles.body}>No live departures for this station.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f7f8',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f7f8',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#012841',
    marginBottom: 8,
  },
  body: {
    fontSize: 16,
    lineHeight: 22,
    color: '#4A6274',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    gap: 6,
  },
  station: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A6274',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  countdown: {
    fontSize: 40,
    fontWeight: '700',
    color: '#012841',
  },
  meta: {
    fontSize: 15,
    color: '#4A6274',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#012841',
    marginBottom: 8,
  },
  row: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#012841',
  },
  rowMeta: {
    fontSize: 14,
    color: '#4A6274',
    marginTop: 2,
  },
  rowAction: {
    fontSize: 15,
    fontWeight: '700',
    color: '#012841',
  },
  clearButton: {
    marginTop: 12,
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: '#E8EEF2',
  },
  clearButtonText: {
    color: '#012841',
    fontWeight: '600',
  },
  secondaryButton: {
    marginTop: 16,
    alignSelf: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: '#012841',
  },
  secondaryButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});
