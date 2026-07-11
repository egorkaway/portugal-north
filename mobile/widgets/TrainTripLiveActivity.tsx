import { Image, Text, VStack } from '@expo/ui/swift-ui';
import {
  containerBackground,
  font,
  foregroundStyle,
  lineLimit,
  padding,
} from '@expo/ui/swift-ui/modifiers';
import { createLiveActivity, type LiveActivityEnvironment } from 'expo-widgets';
import type { TripWidgetProps } from '@/lib/types';

const TrainTripLiveActivity = (props: TripWidgetProps, environment: LiveActivityEnvironment) => {
  'widget';

  const stationName =
    typeof props.stationName === 'string' && props.stationName.trim()
      ? props.stationName.trim()
      : 'Station';
  const subline =
    typeof props.subline === 'string' && props.subline.trim()
      ? props.subline.trim()
      : 'VeryStays';
  const departureTime =
    typeof props.departureTime === 'string' && props.departureTime.trim()
      ? props.departureTime.trim()
      : '—';
  const platform =
    typeof props.platform === 'string' && props.platform.trim()
      ? props.platform.trim()
      : '';
  const countdownRaw = props.countdownMinutes;
  const countdownMinutes =
    typeof countdownRaw === 'number' && countdownRaw >= 0
      ? Math.floor(countdownRaw)
      : null;

  let compactCountdown =
    typeof props.headline === 'string' && props.headline.trim()
      ? props.headline.trim()
      : 'Now';
  if (countdownMinutes !== null) {
    if (countdownMinutes <= 0) {
      compactCountdown = 'Now';
    } else if (countdownMinutes < 60) {
      compactCountdown = `${countdownMinutes} min`;
    } else {
      const hours = Math.floor(countdownMinutes / 60);
      const remainder = countdownMinutes % 60;
      compactCountdown = remainder === 0 ? `${hours}h` : `${hours}h ${remainder}m`;
    }
  }

  const background = '#012841';
  const primary = environment.isLuminanceReduced ? '#FFFFFF' : '#FFFFFF';
  const muted = environment.isLuminanceReduced ? '#D0D8DE' : '#B8C5CE';
  const accent = '#7EC8E3';

  return {
    banner: (
      <VStack modifiers={[containerBackground(background, 'widget'), padding({ all: 12 })]}>
        <Text modifiers={[font({ size: 13, weight: 'semibold' }), foregroundStyle(muted), lineLimit(1)]}>
          {stationName}
        </Text>
        <Text modifiers={[font({ weight: 'bold', size: 20 }), foregroundStyle(primary), lineLimit(1)]}>
          {compactCountdown}
        </Text>
        <Text modifiers={[font({ size: 14 }), foregroundStyle(muted), lineLimit(1)]}>{subline}</Text>
      </VStack>
    ),
    compactLeading: <Image systemName="tram.fill" color={accent} />,
    compactTrailing: (
      <Text modifiers={[font({ weight: 'bold', size: 14 }), foregroundStyle(accent), lineLimit(1)]}>
        {compactCountdown}
      </Text>
    ),
    minimal: <Image systemName="tram.fill" color={accent} />,
    expandedLeading: (
      <VStack modifiers={[padding({ all: 8 })]}>
        <Image systemName="tram.fill" color={accent} />
        <Text modifiers={[font({ size: 11 }), foregroundStyle(muted), lineLimit(1)]}>
          {stationName}
        </Text>
      </VStack>
    ),
    expandedTrailing: (
      <VStack modifiers={[padding({ all: 8 })]}>
        <Text modifiers={[font({ weight: 'bold', size: 24 }), foregroundStyle(primary), lineLimit(1)]}>
          {compactCountdown}
        </Text>
        <Text modifiers={[font({ size: 12 }), foregroundStyle(muted), lineLimit(1)]}>{departureTime}</Text>
      </VStack>
    ),
    expandedBottom: (
      <VStack modifiers={[padding({ all: 8 })]}>
        <Text modifiers={[font({ size: 13, weight: 'semibold' }), foregroundStyle(muted), lineLimit(1)]}>
          {stationName}
        </Text>
        <Text modifiers={[font({ size: 13 }), foregroundStyle(muted), lineLimit(1)]}>{subline}</Text>
        <Text modifiers={[font({ size: 12 }), foregroundStyle(muted), lineLimit(1)]}>
          {platform ? `Platform ${platform}` : 'Open VeryStays'}
        </Text>
      </VStack>
    ),
  };
};

export default createLiveActivity('TrainTripLiveActivity', TrainTripLiveActivity);
