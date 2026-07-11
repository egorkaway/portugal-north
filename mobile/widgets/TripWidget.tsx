import { Text, VStack } from '@expo/ui/swift-ui';
import { font, foregroundStyle, lineLimit, padding } from '@expo/ui/swift-ui/modifiers';
import { createWidget, type WidgetEnvironment } from 'expo-widgets';
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
  const countdownRaw = input.countdownMinutes;
  const countdownMinutes =
    typeof countdownRaw === 'number' && countdownRaw >= 0
      ? Math.floor(countdownRaw)
      : null;

  const isDark = environment.colorScheme === 'dark';
  const primary = isDark ? '#FFFFFF' : '#012841';
  const muted = isDark ? '#B8C5CE' : '#4A6274';
  const accent = '#7EC8E3';
  const compact = environment.widgetFamily === 'systemSmall';
  const accessory =
    environment.widgetFamily === 'accessoryInline' ||
    environment.widgetFamily === 'accessoryRectangular';

  let compactCountdown = headline;
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
  } else {
    label = 'VeryStays';
    title = headline;
    detail = subline;
  }

  if (accessory) {
    return (
      <Text modifiers={[font({ weight: 'semibold', size: 12 }), foregroundStyle(primary), lineLimit(1)]}>
        {mode === 'active' ? `${compactCountdown} · ${stationName}` : title}
      </Text>
    );
  }

  return (
    <VStack modifiers={[padding({ all: compact ? 10 : 14 })]}>
      <Text
        modifiers={[
          font({ size: compact ? 10 : 11, weight: 'semibold' }),
          foregroundStyle(muted),
          lineLimit(1),
        ]}
      >
        {label}
      </Text>
      <Text
        modifiers={[
          font({ weight: 'bold', size: compact ? 22 : 24 }),
          foregroundStyle(primary),
          lineLimit(1),
        ]}
      >
        {title}
      </Text>
      <Text
        modifiers={[
          font({ size: compact ? 11 : 13 }),
          foregroundStyle(muted),
          lineLimit(compact ? 1 : 2),
        ]}
      >
        {detail}
      </Text>
      {!compact ? (
        <Text modifiers={[font({ size: 12 }), foregroundStyle(accent), lineLimit(1)]}>
          {footer}
        </Text>
      ) : null}
    </VStack>
  );
};

export default createWidget('TripWidget', TripWidget);
