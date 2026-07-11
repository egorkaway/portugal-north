import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useRouter } from 'expo-router';
import { theme } from '@/constants/theme';
import { reliabilityScoreColor } from '@/lib/reliabilityScore';
import {
  allStations,
  bakedReliabilityScores,
  stationToSlug,
} from '@/lib/stationData';

const IBERIAN_REGION = {
  latitude: 39.9,
  longitude: -3.1,
  latitudeDelta: 8,
  longitudeDelta: 10,
};

function markerSize(movements: number): number {
  if (movements >= 500) return 14;
  if (movements >= 200) return 11;
  if (movements >= 50) return 9;
  return 7;
}

export default function MapScreen() {
  const router = useRouter();
  const [selectedName, setSelectedName] = useState<string | null>(null);

  const markers = useMemo(
    () =>
      allStations.map((station) => {
        const score = bakedReliabilityScores.scores[station.name] ?? null;
        const movements = bakedReliabilityScores.movements[station.name] ?? 0;
        return {
          station,
          score,
          movements,
          color:
            score !== null
              ? reliabilityScoreColor(score)
              : station.types.includes('Airport')
                ? '#0284C7'
                : '#94A3B8',
          size: markerSize(movements),
        };
      }),
    [],
  );

  const selected = markers.find((item) => item.station.name === selectedName);

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={IBERIAN_REGION}>
        {markers.map(({ station, color, size }) => (
          <Marker
            key={station.name}
            coordinate={{ latitude: station.lat, longitude: station.lng }}
            onPress={() => setSelectedName(station.name)}
          >
            <View
              style={[
                styles.dot,
                {
                  width: size,
                  height: size,
                  borderRadius: size / 2,
                  backgroundColor: color,
                },
              ]}
            />
          </Marker>
        ))}
      </MapView>

      <View style={styles.legend}>
        <Text style={styles.legendTitle}>Reliability</Text>
        <View style={styles.legendRow}>
          <LegendSwatch color={reliabilityScoreColor(9)} label="8–10" />
          <LegendSwatch color={reliabilityScoreColor(6)} label="5–7" />
          <LegendSwatch color={reliabilityScoreColor(3)} label="0–4" />
          <LegendSwatch color="#0284C7" label="Airport" />
        </View>
      </View>

      {selected ? (
        <View style={styles.sheet}>
          <Text style={styles.sheetTitle}>{selected.station.name}</Text>
          <Text style={styles.sheetMeta}>
            {selected.station.lines.join(' · ')}
          </Text>
          {selected.score !== null ? (
            <Text style={styles.sheetScore}>
              Reliability {selected.score}/10 · {selected.movements} movements/day
            </Text>
          ) : (
            <Text style={styles.sheetScore}>No CP reliability score</Text>
          )}
          <Pressable
            style={styles.sheetButton}
            onPress={() => router.push(`/station/${stationToSlug(selected.station.name)}`)}
          >
            <Text style={styles.sheetButtonText}>Open station</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

function LegendSwatch({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.legendLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  map: {
    flex: 1,
  },
  dot: {
    borderWidth: 1,
    borderColor: '#fff',
  },
  legend: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: theme.border,
  },
  legendTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.primary,
    marginBottom: 8,
  },
  legendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendLabel: {
    fontSize: 12,
    color: theme.primaryMuted,
  },
  sheet: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 12,
    backgroundColor: theme.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.border,
    gap: 6,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.primary,
  },
  sheetMeta: {
    fontSize: 13,
    color: theme.primaryMuted,
  },
  sheetScore: {
    fontSize: 14,
    color: theme.primary,
  },
  sheetButton: {
    marginTop: 8,
    alignSelf: 'flex-start',
    backgroundColor: theme.primary,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  sheetButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
});
