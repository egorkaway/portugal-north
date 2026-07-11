import { Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '@/constants/theme';
import type { HomeScope } from '@/lib/stationData';

type Props = {
  scope: HomeScope;
  onChange: (scope: HomeScope) => void;
};

const OPTIONS: { value: HomeScope; label: string }[] = [
  { value: 'pt', label: 'Portugal' },
  { value: 'es', label: 'Spain' },
  { value: 'all', label: 'All' },
];

export function ScopePicker({ scope, onChange }: Props) {
  return (
    <View style={styles.row}>
      {OPTIONS.map((option) => {
        const active = scope === option.value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            style={[styles.chip, active && styles.chipActive]}
          >
            <Text style={[styles.chipText, active && styles.chipTextActive]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: theme.border,
    backgroundColor: theme.card,
  },
  chipActive: {
    backgroundColor: theme.primary,
    borderColor: theme.primary,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.primaryMuted,
  },
  chipTextActive: {
    color: '#fff',
  },
});
