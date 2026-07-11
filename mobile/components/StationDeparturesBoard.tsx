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
import { takeActiveTrip, clearActiveTrip } from '@/lib/tripStorage';
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
      await clearActiveTrip();
      onTripChanged(null);
      return;
    }

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
                  {taking ? 'Tracking' : 'Take'}
                </Text>
              </Pressable>
            </View>
          </View>
        );
      })}
    </View>
  );
}
