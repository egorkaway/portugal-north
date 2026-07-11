import { Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '@/constants/theme';
import type { Vote } from '@/lib/voteStorage';

type Props = {
  vote: Vote;
  onVote: (direction: 'up' | 'down') => void;
  compact?: boolean;
};

export function VoteButtons({ vote, onVote, compact = false }: Props) {
  return (
    <View style={[styles.row, compact && styles.rowCompact]}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ selected: vote === 'up' }}
        onPress={() => onVote('up')}
        style={[styles.button, vote === 'up' && styles.buttonUpActive]}
      >
        <Text style={[styles.label, vote === 'up' && styles.labelActive]}>▲</Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ selected: vote === 'down' }}
        onPress={() => onVote('down')}
        style={[styles.button, vote === 'down' && styles.buttonDownActive]}
      >
        <Text style={[styles.label, vote === 'down' && styles.labelActive]}>▼</Text>
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
  buttonUpActive: {
    backgroundColor: theme.success,
    borderColor: theme.success,
  },
  buttonDownActive: {
    backgroundColor: theme.danger,
    borderColor: theme.danger,
  },
  label: {
    fontSize: 14,
    color: theme.primaryMuted,
    fontWeight: '700',
  },
  labelActive: {
    color: '#fff',
  },
});
