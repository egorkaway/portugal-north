import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { SymbolView } from 'expo-symbols';
import { useNavigation, useRouter } from 'expo-router';
import { useSystemColorScheme } from '@/components/useSystemColorScheme';
import { BuildFooter } from '@/components/BuildFooter';
import { theme } from '@/constants/theme';
import { reliabilityScoreColor } from '@/lib/reliabilityScore';
import {
  allStations,
  bakedReliabilityScores,
  stationToSlug,
} from '@/lib/stationData';
import { writeLastCoords } from '@/lib/tripStorage';

/** Fits Iberian peninsula (≈35.8°N–44°N, 10°W–4°E) on portrait phones. */
const IBERIAN_REGION = {
  latitude: 39.9,
  longitude: -3,
  latitudeDelta: 10,
  longitudeDelta: 18,
};

function markerSize(movements: number): number {
  if (movements >= 500) return 14;
  if (movements >= 200) return 11;
  if (movements >= 50) return 9;
  return 7;
}

export default function MapScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const mapRef = useRef<MapView>(null);
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);
  const [showsUserLocation, setShowsUserLocation] = useState(false);

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

  const locateUser = useCallback(async () => {
    setLocating(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      const position = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = position.coords;

      setShowsUserLocation(true);
      mapRef.current?.animateToRegion(
        {
          latitude,
          longitude,
          latitudeDelta: 0.45,
          longitudeDelta: 0.45,
        },
        500,
      );
      await writeLastCoords({ lat: latitude, lng: longitude });
    } finally {
      setLocating(false);
    }
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Locate me"
          onPress={() => void locateUser()}
          style={styles.locateButton}
        >
          {locating ? (
            <ActivityIndicator size="small" color={theme.primary} />
          ) : (
            <SymbolView
              name={{ ios: 'location.fill', android: 'my_location', web: 'my_location' }}
              tintColor={theme.primary}
              size={22}
            />
          )}
        </Pressable>
      ),
    });
  }, [navigation, locateUser, locating]);

  const selected = markers.find((item) => item.station.name === selectedName);
  const mapAppearance = useSystemColorScheme();

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={IBERIAN_REGION}
        userInterfaceStyle={mapAppearance}
        showsUserLocation={showsUserLocation}
        showsMyLocationButton={false}
        onPress={() => setSelectedName(null)}
      >
        {markers.map(({ station, color, size }) => (
          <Marker
            key={station.name}
            coordinate={{ latitude: station.lat, longitude: station.lng }}
            stopPropagation
            onPress={() => setSelectedName(station.name)}
          >
            <View style={styles.markerHitArea}>
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
            </View>
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
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle} numberOfLines={2}>
              {selected.station.name}
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close station card"
              onPress={() => setSelectedName(null)}
              style={styles.sheetClose}
              hitSlop={8}
            >
              <SymbolView
                name={{ ios: 'xmark', android: 'close', web: 'close' }}
                tintColor={theme.primaryMuted}
                size={16}
                weight="semibold"
              />
            </Pressable>
          </View>
          <Text style={styles.sheetMeta}>{selected.station.lines.join(' · ')}</Text>
          {selected.score !== null ? (
            <Text style={styles.sheetScore}>
              Reliability {selected.score}/10 · {selected.movements} movements/day
            </Text>
          ) : null}
          <Pressable
            style={styles.sheetButton}
            onPress={() => router.push(`/station/${stationToSlug(selected.station.name)}`)}
          >
            <Text style={styles.sheetButtonText}>Open station</Text>
          </Pressable>
        </View>
      ) : null}
      <BuildFooter fixed />
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
  locateButton: {
    marginRight: 4,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    borderWidth: 1,
    borderColor: '#fff',
  },
  markerHitArea: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
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
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  sheetTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: theme.primary,
  },
  sheetClose: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.background,
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
