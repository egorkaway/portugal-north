import { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '@/constants/theme';
import { STATION_SECTION_PADDING } from '@/components/stationSectionStyles';
import { useLocale } from '@/i18n/LocaleProvider';
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

function formatCommunityLine(
  up: number,
  down: number,
  yesLabel: string,
  noLabel: string,
): string | null {
  if (up === 0 && down === 0) return null;
  const parts: string[] = [];
  if (up > 0) parts.push(`${up} ${yesLabel}`);
  if (down > 0) parts.push(`${down} ${noLabel}`);
  return parts.join(' · ');
}

/**
 * Compact photo-quality feedback near the bottom of the station screen.
 * Copy assumes the hero photo is scrolled out of view.
 */
export function StationImageVoteSection({ stationName, imageUrl }: Props) {
  const { t } = useLocale();
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
      setCommunityLine(
        totals
          ? formatCommunityLine(totals.up, totals.down, t('common.yes'), t('common.no'))
          : null,
      );
    } catch {
      setCommunityLine(null);
    }
  }, [imageUrl, stationName, t]);

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
        {t('station.photoQuestion', { name: stationName })}
      </Text>
      <View
        style={styles.row}
        accessibilityRole="radiogroup"
        accessibilityLabel={t('station.ratePhotoA11y')}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ selected: vote === 'up' }}
          accessibilityLabel={t('station.photoYesA11y')}
          onPress={() => void handleVote('up')}
          style={[styles.chip, vote === 'up' && styles.chipGoodActive]}
        >
          <Text style={[styles.chipText, vote === 'up' && styles.chipTextActive]}>
            {t('station.photoYes')}
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ selected: vote === 'down' }}
          accessibilityLabel={t('station.photoNoA11y')}
          onPress={() => void handleVote('down')}
          style={[styles.chip, vote === 'down' && styles.chipBadActive]}
        >
          <Text style={[styles.chipText, vote === 'down' && styles.chipTextActive]}>
            {t('station.photoNo')}
          </Text>
        </Pressable>
      </View>
      {communityLine ? (
        <Text style={styles.community}>
          {t('station.photoCommunity', { summary: communityLine })}
        </Text>
      ) : (
        <Text style={styles.hint}>{t('station.photoHint')}</Text>
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
