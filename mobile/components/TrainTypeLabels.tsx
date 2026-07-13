import { StyleSheet, Text, View } from 'react-native';
import { theme } from '@/constants/theme';
import { getTrainTypeColor } from '@/lib/trainTypes';
import { sortTrainTypes } from '@/constants/theme';

type Props = {
  types: string[];
};

export function TrainTypeLabels({ types }: Props) {
  const sorted = sortTrainTypes(types);

  return (
    <View style={styles.list}>
      {sorted.map((type) => (
        <View key={type} style={styles.item}>
          <View style={[styles.dot, { backgroundColor: getTrainTypeColor(type) }]} />
          <Text style={styles.label}>{type}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.primary,
  },
});
