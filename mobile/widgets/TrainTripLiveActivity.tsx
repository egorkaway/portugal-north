import { Image, Text, VStack } from '@expo/ui/swift-ui';
import {
  activityBackgroundTint,
  background,
  font,
  foregroundStyle,
  lineLimit,
  padding,
} from '@expo/ui/swift-ui/modifiers';
import { createLiveActivity, type LiveActivityEnvironment } from 'expo-widgets';
import { widgetTheme } from '@/constants/widgetTheme';
import { formatWidgetCompactCountdown } from '@/lib/widgetTrip';
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
  const destination =
    typeof props.destination === 'string' && props.destination.trim()
      ? props.destination.trim()
      : '';
  const trainNumber =
    typeof props.trainNumber === 'string' && props.trainNumber.trim()
      ? props.trainNumber.trim()
      : '';
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

  const compactCountdown =
    countdownMinutes !== null
      ? formatWidgetCompactCountdown(countdownMinutes)
      : typeof props.headline === 'string' && props.headline.trim()
        ? props.headline.trim()
        : 'Now';

  const destinationLine = destination
    ? trainNumber
      ? `${trainNumber} → ${destination}`
      : destination
    : subline;

  const background = widgetTheme.primary;
  const primary = environment.isLuminanceReduced ? widgetTheme.onPrimary : widgetTheme.onPrimary;
  const muted = environment.isLuminanceReduced ? '#D0D8DE' : widgetTheme.mutedOnPrimary;
  const accent = widgetTheme.accent;

  return {
    banner: (
      <VStack
        modifiers={[
          activityBackgroundTint(background),
          background(background),
          padding({ all: 12 }),
        ]}
      >
        <Text modifiers={[font({ size: 13, weight: 'semibold' }), foregroundStyle(muted), lineLimit(2)]}>
          {stationName}
        </Text>
        <Text modifiers={[font({ weight: 'bold', size: 20 }), foregroundStyle(primary), lineLimit(1)]}>
          {compactCountdown}
        </Text>
        <Text
          modifiers={[
            font({ size: 12, weight: 'semibold' }),
            foregroundStyle(primary),
            lineLimit(3),
          ]}
        >
          {destinationLine}
        </Text>
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
        <Text modifiers={[font({ size: 11 }), foregroundStyle(muted), lineLimit(2)]}>
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
        <Text modifiers={[font({ size: 13, weight: 'semibold' }), foregroundStyle(muted), lineLimit(2)]}>
          {stationName}
        </Text>
        <Text
          modifiers={[
            font({ size: 12, weight: 'semibold' }),
            foregroundStyle(primary),
            lineLimit(4),
          ]}
        >
          {destinationLine}
        </Text>
        <Text modifiers={[font({ size: 12 }), foregroundStyle(accent), lineLimit(1)]}>
          {platform ? `Platform ${platform}` : 'Open VeryStays'}
        </Text>
      </VStack>
    ),
  };
};

export default createLiveActivity('TrainTripLiveActivity', TrainTripLiveActivity);
