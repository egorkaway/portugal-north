import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { TrainTypeDot } from '@/components/TrainTypeDot';
import { VoteButtons } from '@/components/VoteButtons';
import { sortTrainTypes, theme } from '@/constants/theme';
import { formatDistance } from '@/lib/geo';
import { getStationImageUrl, type Station } from '@/lib/stationData';
import type { Vote } from '@/lib/voteStorage';

type Props = {
  station: Station;
  distanceKm?: number;
  vote: Vote;
  visited: boolean;
  onPress: () => void;
  onVote: (direction: 'up' | 'down') => void;
  onToggleVisited: () => void;
};

export function StationCard({
  station,
  distanceKm,
  vote,
  visited,
  onPress,
  onVote,
  onToggleVisited,
}: Props) {
  const imageUrl = getStationImageUrl(station.name);

  return (
    <Pressable style={styles.card} onPress={onPress}>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]}>
          <Text style={styles.placeholderText}>No photo</Text>
        </View>
      )}

      <View style={styles.body}>
        <View style={styles.headerRow}>
          <Text style={styles.title} numberOfLines={2}>
            {station.name}
          </Text>
          <VoteButtons vote={vote} onVote={onVote} compact />
        </View>

        <Text style={styles.lines} numberOfLines={1}>
          {station.lines.join(' · ')}
        </Text>

        <View style={styles.metaRow}>
          <View style={styles.typesRow}>
            {sortTrainTypes(station.types).map((type) => (
              <View key={type} style={styles.typeItem}>
                <TrainTypeDot type={type} size={7} />
                <Text style={styles.typeLabel}>{type}</Text>
              </View>
            ))}
          </View>
          {distanceKm !== undefined ? (
            <Text style={styles.distance}>{formatDistance(distanceKm)}</Text>
          ) : null}
        </View>

        <Pressable
          onPress={(event) => {
            event.preventDefault?.();
            onToggleVisited();
          }}
          style={[styles.visitedChip, visited && styles.visitedChipActive]}
        >
          <Text style={[styles.visitedText, visited && styles.visitedTextActive]}>
            {visited ? 'Visited' : 'Mark visited'}
          </Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.card,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.border,
  },
  image: {
    width: '100%',
    height: 160,
    backgroundColor: '#DDE4EA',
  },
  imagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: theme.primaryMuted,
    fontSize: 14,
  },
  body: {
    padding: 14,
    gap: 6,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: theme.primary,
  },
  lines: {
    fontSize: 13,
    color: theme.primaryMuted,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  typesRow: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    alignItems: 'center',
  },
  typeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  typeLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.primaryMuted,
  },
  distance: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.primary,
    flexShrink: 0,
  },
  visitedChip: {
    alignSelf: 'flex-start',
    marginTop: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: theme.border,
  },
  visitedChipActive: {
    backgroundColor: '#E8F5EE',
    borderColor: theme.success,
  },
  visitedText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.primaryMuted,
  },
  visitedTextActive: {
    color: theme.success,
  },
});
