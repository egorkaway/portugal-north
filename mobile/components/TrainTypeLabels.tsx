import { StyleSheet, Text, View } from 'react-native';
import { TrainTypeDot } from '@/components/TrainTypeDot';
import { theme } from '@/constants/theme';
import { sortTrainTypes } from '@/constants/theme';
import { displayTrainType } from '@/lib/trainTypes';

type Props = {
  types: string[];
  /** Drop outer horizontal padding when nested in cards. */
  compact?: boolean;
  /** Prefer InterCity when Spain is in play (default: yes — mobile lists both countries). */
  interCity?: boolean;
  country?: string | null;
};

export function TrainTypeLabels({
  types,
  compact = false,
  interCity = true,
  country,
}: Props) {
  const sorted = sortTrainTypes(types);
  const context = country ? { country } : interCity;

  return (
    <View style={[styles.list, compact && styles.listCompact]}>
      {sorted.map((type) => (
        <View key={type} style={styles.item}>
          <TrainTypeDot type={type} />
          <Text style={styles.label}>{displayTrainType(type, context)}</Text>
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
  listCompact: {
    paddingHorizontal: 0,
    paddingTop: 0,
    gap: 8,
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
