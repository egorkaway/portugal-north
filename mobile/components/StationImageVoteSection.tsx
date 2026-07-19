import { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '@/constants/theme';
import { STATION_SECTION_PADDING } from '@/components/stationSectionStyles';
import { fetchGlobalRatings, syncStationImageVoteToServer } from '@/lib/api';
import {
  castStationImageVote,
  clearStationImageVote,
  getStaleStationImageVote,
  getStationImageVoteForUrl,
  readStationImageVotes,
  type ImageVoteDirection,
} from '@/lib/stationImageVoteStorage';

type Props = {
  stationName: string;
  imageUrl: string;
};

function formatCommunityLine(up: number, down: number): string | null {
  if (up === 0 && down === 0) return null;
  const parts: string[] = [];
  if (up > 0) parts.push(`${up} yes`);
  if (down > 0) parts.push(`${down} no`);
  return parts.join(' · ');
}

/**
 * Compact photo-quality feedback near the bottom of the station screen.
 * Copy assumes the hero photo is scrolled out of view.
 */
export function StationImageVoteSection({ stationName, imageUrl }: Props) {
  const [vote, setVote] = useState<ImageVoteDirection | null>(null);
  const [communityLine, setCommunityLine] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  const load = useCallback(async () => {
    const votes = await readStationImageVotes();
    const stale = getStaleStationImageVote(votes, stationName, imageUrl);
    if (stale) {
      await clearStationImageVote(stationName);
      void syncStationImageVoteToServer(stationName, stale, null);
      setVote(null);
    } else {
      setVote(getStationImageVoteForUrl(votes, stationName, imageUrl));
    }
    setReady(true);

    try {
      const global = await fetchGlobalRatings();
      const totals = global.imageRatings[stationName];
      setCommunityLine(totals ? formatCommunityLine(totals.up, totals.down) : null);
    } catch {
      setCommunityLine(null);
    }
  }, [imageUrl, stationName]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleVote = async (direction: ImageVoteDirection) => {
    const { previous, next } = await castStationImageVote(stationName, imageUrl, direction);
    setVote(next);
    void syncStationImageVoteToServer(stationName, previous, next);
  };

  if (!ready) return null;

  return (
    <View style={styles.wrap}>
      <Text style={styles.question}>
        Does the photo at the top of this page represent {stationName}?
      </Text>
      <View
        style={styles.row}
        accessibilityRole="radiogroup"
        accessibilityLabel="Rate whether the station photo at the top represents the station"
      >
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ selected: vote === 'up' }}
          accessibilityLabel="Yes, the photo represents the station"
          onPress={() => void handleVote('up')}
          style={[styles.chip, vote === 'up' && styles.chipGoodActive]}
        >
          <Text style={[styles.chipText, vote === 'up' && styles.chipTextActive]}>Yes</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ selected: vote === 'down' }}
          accessibilityLabel="No, the photo does not represent the station"
          onPress={() => void handleVote('down')}
          style={[styles.chip, vote === 'down' && styles.chipBadActive]}
        >
          <Text style={[styles.chipText, vote === 'down' && styles.chipTextActive]}>No</Text>
        </Pressable>
      </View>
      {communityLine ? (
        <Text style={styles.community}>Community: {communityLine}</Text>
      ) : (
        <Text style={styles.hint}>Helps us pick better station photos.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginHorizontal: STATION_SECTION_PADDING,
    paddingTop: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.border,
    gap: 8,
  },
  question: {
    fontSize: 13,
    lineHeight: 18,
    color: theme.primaryMuted,
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: theme.card,
  },
  chipGoodActive: {
    backgroundColor: theme.success,
    borderColor: theme.success,
  },
  chipBadActive: {
    backgroundColor: theme.danger,
    borderColor: theme.danger,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.primaryMuted,
  },
  chipTextActive: {
    color: '#fff',
  },
  community: {
    fontSize: 12,
    lineHeight: 16,
    color: theme.primaryMuted,
  },
  hint: {
    fontSize: 12,
    lineHeight: 16,
    color: theme.primaryMuted,
    opacity: 0.85,
  },
});
