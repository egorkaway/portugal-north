import { Text, VStack } from '@expo/ui/swift-ui';
import {
  font,
  foregroundStyle,
  lineLimit,
  padding,
  underline,
} from '@expo/ui/swift-ui/modifiers';
import { createWidget, type WidgetEnvironment } from 'expo-widgets';
import type { TripWidgetProps } from '@/lib/types';

const TripWidget = (rawProps: TripWidgetProps, environment: WidgetEnvironment) => {
  'widget';

  // Helpers must live inside the widget function — the layout is evaluated in an
  // isolated JS runtime that does not retain module-level closures.
  function widgetColors(colorScheme: 'light' | 'dark') {
    if (colorScheme === 'dark') {
      return {
        background: '#012841',
        primary: '#FFFFFF',
        label: '#8FE3B8',
        detail: '#C5D3DC',
        footer: '#FFFFFF',
      };
    }
    return {
      background: '#FFFFFF',
      primary: '#012841',
      label: '#059669',
      detail: '#2D4A5E',
      footer: '#012841',
    };
  }

  function compactCountdownLabel(countdownMinutes: number | null): string {
    if (countdownMinutes === null) return '';
    if (countdownMinutes <= 0) return 'Now';
    if (countdownMinutes < 60) return `${countdownMinutes} min`;
    const hours = Math.floor(countdownMinutes / 60);
    const remainder = countdownMinutes % 60;
    return remainder === 0 ? `${hours}h` : `${hours}h ${remainder}m`;
  }

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
  const colors = widgetColors(isDark ? 'dark' : 'light');
  const compact = environment.widgetFamily === 'systemSmall';
  const accessory =
    environment.widgetFamily === 'accessoryInline' ||
    environment.widgetFamily === 'accessoryRectangular';

  const compactCountdown =
    countdownMinutes !== null ? compactCountdownLabel(countdownMinutes) : headline;

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
  const underlineStation = mode === 'active';
  const labelSize = compact ? 11 : 12;
  const titleSize = compact ? 22 : 28;
  const detailSize = compact ? 12 : 14;
  const destinationFontSize = compact ? 12 : 14;
  const footerSize = compact ? 12 : 14;
  const destinationLineLimit = compact ? 4 : 5;

  if (accessory) {
    const accessoryText =
      mode === 'active'
        ? destination
          ? `${compactCountdown} · ${destination}`
          : `${compactCountdown} · ${stationName}`
        : title;

    return (
      <VStack modifiers={[padding({ all: environment.widgetFamily === 'accessoryRectangular' ? 8 : 0 })]}>
        <Text
          modifiers={[
            font({ weight: 'bold', size: 13 }),
            foregroundStyle(colors.primary),
            lineLimit(environment.widgetFamily === 'accessoryInline' ? 1 : 2),
          ]}
        >
          {accessoryText}
        </Text>
      </VStack>
    );
  }

  return (
    <VStack modifiers={[padding({ all: compact ? 10 : 14 })]}>
      <Text
        modifiers={[
          font({ size: labelSize, weight: 'bold' }),
          foregroundStyle(colors.label),
          lineLimit(2),
          ...(underlineStation
            ? [underline({ isActive: true, pattern: 'solid', color: colors.label })]
            : []),
        ]}
      >
        {label}
      </Text>
      <Text
        modifiers={[
          font({ weight: 'bold', size: titleSize }),
          foregroundStyle(colors.primary),
          lineLimit(mode === 'active' ? 1 : 2),
        ]}
      >
        {title}
      </Text>
      {showDestination ? (
        <Text
          modifiers={[
            font({ size: destinationFontSize, weight: 'bold' }),
            foregroundStyle(colors.primary),
            lineLimit(destinationLineLimit),
          ]}
        >
          {destinationLine}
        </Text>
      ) : (
        <Text
          modifiers={[
            font({ size: detailSize, weight: 'semibold' }),
            foregroundStyle(colors.detail),
            lineLimit(compact ? 3 : 4),
          ]}
        >
          {detail}
        </Text>
      )}
      <Text
        modifiers={[
          font({ size: footerSize, weight: 'bold' }),
          foregroundStyle(colors.footer),
          lineLimit(2),
        ]}
      >
        {footer}
      </Text>
    </VStack>
  );
};

export default createWidget('TripWidget', TripWidget);
