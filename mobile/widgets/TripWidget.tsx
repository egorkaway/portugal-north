import { Text, VStack } from '@expo/ui/swift-ui';
import {
  containerBackground,
  font,
  foregroundStyle,
  lineLimit,
  padding,
} from '@expo/ui/swift-ui/modifiers';
import { createWidget, type WidgetEnvironment } from 'expo-widgets';
import { getWidgetColors } from '@/constants/widgetTheme';
import { formatWidgetCompactCountdown } from '@/lib/widgetTrip';
import type { TripWidgetProps } from '@/lib/types';

const TripWidget = (rawProps: TripWidgetProps, environment: WidgetEnvironment) => {
  'widget';

  const input = rawProps && typeof rawProps === 'object' ? rawProps : {};
  const mode =
    input.mode === 'active' ||
    input.mode === 'lastTaken' ||
    input.mode === 'nearest' ||
    input.mode === 'browse'
      ? input.mode
      : 'browse';
  const stationName =
    typeof input.stationName === 'string' && input.stationName.trim()
      ? input.stationName.trim()
      : 'Porto-Campanhã';
  const headline =
    typeof input.headline === 'string' && input.headline.trim()
      ? input.headline.trim()
      : stationName;
  const subline =
    typeof input.subline === 'string' && input.subline.trim()
      ? input.subline.trim()
      : 'VeryStays · 426 stations';
  const departureTime =
    typeof input.departureTime === 'string' ? input.departureTime : '';
  const destination =
    typeof input.destination === 'string' && input.destination.trim()
      ? input.destination.trim()
      : '';
  const trainNumber =
    typeof input.trainNumber === 'string' && input.trainNumber.trim()
      ? input.trainNumber.trim()
      : '';
  const countdownRaw = input.countdownMinutes;
  const countdownMinutes =
    typeof countdownRaw === 'number' && countdownRaw >= 0
      ? Math.floor(countdownRaw)
      : null;

  const isDark = environment.colorScheme === 'dark';
  const colors = getWidgetColors(isDark ? 'dark' : 'light');
  const compact = environment.widgetFamily === 'systemSmall';
  const accessory =
    environment.widgetFamily === 'accessoryInline' ||
    environment.widgetFamily === 'accessoryRectangular';

  const compactCountdown =
    countdownMinutes !== null ? formatWidgetCompactCountdown(countdownMinutes) : headline;

  const promptNext = headline === 'Take your next train';

  let label = 'VeryStays';
  let title = headline;
  let detail = subline;
  let footer = 'Open app to explore';

  if (mode === 'active') {
    label = stationName;
    title = compactCountdown;
    detail = subline;
    footer = departureTime ? `Departs ${departureTime}` : 'Open VeryStays';
  } else if (mode === 'lastTaken') {
    label = 'Last trip';
    title = stationName;
    detail = subline;
    footer = departureTime ? `Departed ${departureTime}` : 'Last train taken';
  } else if (mode === 'nearest') {
    label = 'Nearest';
    title = stationName;
    detail = subline;
    footer = 'Open app for departures';
  } else if (promptNext) {
    label = 'VeryStays';
    title = headline;
    detail = subline;
    footer = 'Tap Take on a departure';
  } else {
    label = 'VeryStays';
    title = headline;
    detail = subline;
  }

  const destinationLine = destination
    ? trainNumber
      ? `${trainNumber} → ${destination}`
      : destination
    : '';
  const showDestination = destinationLine.length > 0 && (mode === 'active' || mode === 'lastTaken');
  const destinationFontSize = compact ? 10 : 12;
  const destinationLineLimit = compact ? 4 : 5;

  if (accessory) {
    const accessoryText =
      mode === 'active'
        ? destination
          ? `${compactCountdown} · ${destination}`
          : `${compactCountdown} · ${stationName}`
        : title;
    return (
      <Text
        modifiers={[
          font({ weight: 'semibold', size: 12 }),
          foregroundStyle(colors.primary),
          lineLimit(2),
        ]}
      >
        {accessoryText}
      </Text>
    );
  }

  return (
    <VStack
      modifiers={[
        containerBackground(colors.background, 'widget'),
        padding({ all: compact ? 10 : 14 }),
      ]}
    >
      <Text
        modifiers={[
          font({ size: compact ? 10 : 11, weight: 'semibold' }),
          foregroundStyle(colors.muted),
          lineLimit(2),
        ]}
      >
        {label}
      </Text>
      <Text
        modifiers={[
          font({ weight: 'bold', size: compact ? 20 : 24 }),
          foregroundStyle(colors.primary),
          lineLimit(mode === 'active' ? 1 : 2),
        ]}
      >
        {title}
      </Text>
      {showDestination ? (
        <Text
          modifiers={[
            font({ size: destinationFontSize, weight: 'semibold' }),
            foregroundStyle(colors.primary),
            lineLimit(destinationLineLimit),
          ]}
        >
          {destinationLine}
        </Text>
      ) : (
        <Text
          modifiers={[
            font({ size: compact ? 11 : 13 }),
            foregroundStyle(colors.muted),
            lineLimit(compact ? 3 : 4),
          ]}
        >
          {detail}
        </Text>
      )}
      {!compact ? (
        <Text modifiers={[font({ size: 12 }), foregroundStyle(colors.accent), lineLimit(2)]}>
          {footer}
        </Text>
      ) : null}
    </VStack>
  );
};

export default createWidget('TripWidget', TripWidget);
