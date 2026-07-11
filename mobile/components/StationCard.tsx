import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { VoteButtons } from '@/components/VoteButtons';
import { theme } from '@/constants/theme';
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
          <Text style={styles.types} numberOfLines={1}>
            {station.types.slice(0, 2).join(', ')}
          </Text>
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
    justifyContent: 'space-between',
    gap: 8,
  },
  types: {
    flex: 1,
    fontSize: 12,
    color: theme.primaryMuted,
  },
  distance: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.primary,
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
