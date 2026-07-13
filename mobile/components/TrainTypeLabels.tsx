import { StyleSheet, Text, View } from 'react-native';
import { TrainTypeDot } from '@/components/TrainTypeDot';
import { theme } from '@/constants/theme';
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
          <TrainTypeDot type={type} />
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
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.primary,
  },
});
