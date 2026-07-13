import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { theme } from '@/constants/theme';
import type { Vote } from '@/lib/voteStorage';

type SymbolName = ComponentProps<typeof SymbolView>['name'];

const ICONS = {
  thumbsUp: { ios: 'hand.thumbsup.fill', android: 'thumb_up', web: 'thumb_up' },
  thumbsDown: { ios: 'hand.thumbsdown.fill', android: 'thumb_down', web: 'thumb_down' },
} as const satisfies Record<string, SymbolName>;

type Props = {
  vote: Vote;
  onVote: (direction: 'up' | 'down') => void;
  compact?: boolean;
};

export function VoteButtons({ vote, onVote, compact = false }: Props) {
  const iconSize = compact ? 14 : 16;

  return (
    <View style={[styles.row, compact && styles.rowCompact]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Upvote"
        accessibilityState={{ selected: vote === 'up' }}
        onPress={() => onVote('up')}
        style={[styles.button, compact && styles.buttonCompact, vote === 'up' && styles.buttonUpActive]}
      >
        <SymbolView
          name={ICONS.thumbsUp}
          size={iconSize}
          tintColor={vote === 'up' ? '#fff' : theme.primaryMuted}
          weight="semibold"
        />
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Downvote"
        accessibilityState={{ selected: vote === 'down' }}
        onPress={() => onVote('down')}
        style={[
          styles.button,
          compact && styles.buttonCompact,
          vote === 'down' && styles.buttonDownActive,
        ]}
      >
        <SymbolView
          name={ICONS.thumbsDown}
          size={iconSize}
          tintColor={vote === 'down' ? '#fff' : theme.primaryMuted}
          weight="semibold"
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 6,
  },
  rowCompact: {
    gap: 4,
  },
  button: {
    width: 34,
    height: 34,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: theme.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.card,
  },
  buttonCompact: {
    width: 30,
    height: 30,
  },
  buttonUpActive: {
    backgroundColor: theme.success,
    borderColor: theme.success,
  },
  buttonDownActive: {
    backgroundColor: theme.danger,
    borderColor: theme.danger,
  },
});
