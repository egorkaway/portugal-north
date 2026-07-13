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
import type { TripWidgetProps } from '@/lib/types';

const TrainTripLiveActivity = (props: TripWidgetProps, environment: LiveActivityEnvironment) => {
  'widget';

  const THEME = {
    primary: '#012841',
    onPrimary: '#FFFFFF',
    mutedOnPrimary: '#B8C5CE',
    accent: '#7EC8E3',
  } as const;

  function compactCountdownLabel(countdownMinutes: number | null): string {
    if (countdownMinutes === null) return '';
    if (countdownMinutes <= 0) return 'Now';
    if (countdownMinutes < 60) return `${countdownMinutes} min`;
    const hours = Math.floor(countdownMinutes / 60);
    const remainder = countdownMinutes % 60;
    return remainder === 0 ? `${hours}h` : `${hours}h ${remainder}m`;
  }

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
      ? compactCountdownLabel(countdownMinutes)
      : typeof props.headline === 'string' && props.headline.trim()
        ? props.headline.trim()
        : 'Now';

  const destinationLine = destination
    ? trainNumber
      ? `${trainNumber} → ${destination}`
      : destination
    : subline;

  const backgroundColor = THEME.primary;
  const primary = THEME.onPrimary;
  const muted = environment.isLuminanceReduced ? '#D0D8DE' : THEME.mutedOnPrimary;
  const accent = THEME.accent;

  return {
    banner: (
      <VStack
        modifiers={[
          activityBackgroundTint(backgroundColor),
          background(backgroundColor),
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
