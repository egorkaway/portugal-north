import { StyleSheet, View, type ViewStyle } from 'react-native';
import { getTrainTypeColor } from '@/lib/trainTypes';

type Props = {
  type: string;
  size?: number;
  style?: ViewStyle;
};

export function TrainTypeDot({ type, size = 8, style }: Props) {
  return (
    <View
      style={[
        styles.dot,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: getTrainTypeColor(type),
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  dot: {
    flexShrink: 0,
  },
});
