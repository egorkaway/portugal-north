import { Image, Text, VStack } from '@expo/ui/swift-ui';
import {
  activityBackgroundTint,
  background,
  fixedSize,
  font,
  foregroundStyle,
  frame,
  lineLimit,
  monospacedDigit,
  multilineTextAlignment,
  padding,
} from '@expo/ui/swift-ui/modifiers';
import { createLiveActivity, type LiveActivityEnvironment } from 'expo-widgets';
import type { TripWidgetProps } from '@/lib/types';

const TrainTripLiveActivity = (props: TripWidgetProps, environment: LiveActivityEnvironment) => {
  'widget';

  function leftTextModifiers() {
    return [multilineTextAlignment('leading')];
  }

  const THEME = {
    primary: '#012841',
    onPrimary: '#FFFFFF',
    label: '#8FE3B8',
    detail: '#C5D3DC',
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

  function buildActiveFooter(
    departureTime: string,
    platform: string,
    delayMinutes: number | null,
  ): string {
    const parts: string[] = [];
    const time = departureTime.trim();
    if (time) parts.push(`Departs ${time}`);
    const platformLabel = platform.trim();
    if (platformLabel) parts.push(`Platform ${platformLabel}`);
    if (delayMinutes !== null && delayMinutes > 0) parts.push(`+${delayMinutes} min`);
    return parts.length > 0 ? parts.join(' · ') : 'Open VeryStays';
  }

  const mode =
    props.mode === 'active' ||
    props.mode === 'lastTaken' ||
    props.mode === 'nearest' ||
    props.mode === 'browse'
      ? props.mode
      : 'active';
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
      : '';
  const platform =
    typeof props.platform === 'string' && props.platform.trim()
      ? props.platform.trim()
      : '';
  const delayRaw = props.delayMinutes;
  const delayMinutes =
    typeof delayRaw === 'number' && delayRaw >= 0 ? Math.floor(delayRaw) : null;
  const countdownRaw = props.countdownMinutes;
  const countdownMinutes =
    typeof countdownRaw === 'number' && countdownRaw >= 0
      ? Math.floor(countdownRaw)
      : null;

  const departureAtMsRaw = props.departureAtMs;
  const departureAt =
    typeof departureAtMsRaw === 'number' && departureAtMsRaw > 0
      ? new Date(departureAtMsRaw)
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
    : '';
  const showDestination =
    destinationLine.length > 0 && (mode === 'active' || mode === 'lastTaken');
  const stationLabel = mode === 'active' ? stationName : mode === 'lastTaken' ? 'Last trip' : 'VeryStays';
  const footer =
    mode === 'active'
      ? buildActiveFooter(departureTime, platform, delayMinutes)
      : mode === 'lastTaken'
        ? departureTime
          ? `Departed ${departureTime}`
          : 'Last train taken'
        : 'Open VeryStays';

  /** Compact Island is narrow — size the timer to MM:SS or H:MM:SS, not a stretched slot. */
  function islandTimerWidth(): number {
    if (!departureAt) return 44;
    const remainingMs = Math.max(0, departureAt.getTime() - Date.now());
    return remainingMs >= 60 * 60 * 1000 ? 58 : 44;
  }

  function renderCountdownText(
    size: number,
    weight: 'bold' | 'semibold',
    color: string,
    options?: { islandCompact?: boolean },
  ) {
    const islandCompact = options?.islandCompact === true;
    const textMods = [
      ...(islandCompact
        ? [multilineTextAlignment('trailing' as const)]
        : leftTextModifiers()),
      font({ weight, size }),
      foregroundStyle(color),
      lineLimit(1),
      monospacedDigit(),
      ...(islandCompact
        ? [
            fixedSize({ horizontal: true, vertical: true }),
            frame({ width: islandTimerWidth(), alignment: 'trailing' as const }),
          ]
        : [fixedSize({ horizontal: true, vertical: true })]),
    ];

    if (departureAt) {
      const now = new Date();
      if (departureAt.getTime() <= now.getTime()) {
        return <Text modifiers={textMods}>Now</Text>;
      }

      return (
        <Text
          timerInterval={{ lower: now, upper: departureAt }}
          countsDown={true}
          showsHours={false}
          modifiers={textMods}
        />
      );
    }

    return <Text modifiers={textMods}>{compactCountdown}</Text>;
  }

  const backgroundColor = THEME.primary;
  const primary = THEME.onPrimary;
  const labelColor = environment.isLuminanceReduced ? '#A8E8C8' : THEME.label;
  const detailColor = environment.isLuminanceReduced ? '#D0D8DE' : THEME.detail;
  const accent = THEME.accent;
  const backgroundModifiers = [
    activityBackgroundTint(backgroundColor),
    background(backgroundColor),
  ] as const;

  return {
    banner: (
      <VStack
        alignment="leading"
        modifiers={[
          ...backgroundModifiers,
          padding({ all: 14 }),
        ]}
      >
        <Text
          modifiers={[
            ...leftTextModifiers(),
            font({ size: 12, weight: 'bold' }),
            foregroundStyle(labelColor),
            lineLimit(2),
          ]}
        >
          {stationLabel}
        </Text>
        {renderCountdownText(24, 'bold', primary)}
        {showDestination ? (
          <Text
            modifiers={[
              ...leftTextModifiers(),
              font({ size: 14, weight: 'semibold' }),
              foregroundStyle(detailColor),
              lineLimit(2),
            ]}
          >
            {destinationLine}
          </Text>
        ) : (
          <Text
            modifiers={[
              ...leftTextModifiers(),
              font({ size: 14, weight: 'semibold' }),
              foregroundStyle(detailColor),
              lineLimit(2),
            ]}
          >
            {subline}
          </Text>
        )}
        <Text
          modifiers={[
            ...leftTextModifiers(),
            font({ size: 13, weight: 'bold' }),
            foregroundStyle(primary),
            lineLimit(2),
          ]}
        >
          {footer}
        </Text>
      </VStack>
    ),
    compactLeading: (
      <VStack modifiers={[...backgroundModifiers, padding({ all: 4 })]}>
        <Image systemName="tram.fill" color={accent} />
      </VStack>
    ),
    compactTrailing: (
      <VStack
        alignment="trailing"
        modifiers={[...backgroundModifiers, padding({ trailing: 2, leading: 0, vertical: 2 })]}
      >
        {renderCountdownText(13, 'bold', accent, { islandCompact: true })}
      </VStack>
    ),
    minimal: (
      <VStack modifiers={[...backgroundModifiers, padding({ all: 4 })]}>
        <Image systemName="tram.fill" color={accent} />
      </VStack>
    ),
    expandedLeading: (
      <VStack alignment="leading" modifiers={[...backgroundModifiers, padding({ all: 8 })]}>
        <Image systemName="tram.fill" color={accent} />
        <Text
          modifiers={[
            ...leftTextModifiers(),
            font({ size: 11, weight: 'bold' }),
            foregroundStyle(labelColor),
            lineLimit(2),
          ]}
        >
          {stationLabel}
        </Text>
      </VStack>
    ),
    expandedTrailing: (
      <VStack alignment="trailing" modifiers={[...backgroundModifiers, padding({ all: 8 })]}>
        {renderCountdownText(22, 'bold', primary)}
        {departureTime ? (
          <Text
            modifiers={[
              multilineTextAlignment('trailing'),
              font({ size: 12, weight: 'semibold' }),
              foregroundStyle(detailColor),
              lineLimit(1),
            ]}
          >
            {departureTime}
          </Text>
        ) : null}
      </VStack>
    ),
    expandedBottom: (
      <VStack alignment="leading" modifiers={[...backgroundModifiers, padding({ all: 8 })]}>
        {showDestination ? (
          <Text
            modifiers={[
              ...leftTextModifiers(),
              font({ size: 13, weight: 'semibold' }),
              foregroundStyle(primary),
              lineLimit(2),
            ]}
          >
            {destinationLine}
          </Text>
        ) : (
          <Text
            modifiers={[
              ...leftTextModifiers(),
              font({ size: 13, weight: 'semibold' }),
              foregroundStyle(detailColor),
              lineLimit(2),
            ]}
          >
            {subline}
          </Text>
        )}
        <Text
          modifiers={[
            ...leftTextModifiers(),
            font({ size: 12, weight: 'bold' }),
            foregroundStyle(primary),
            lineLimit(2),
          ]}
        >
          {footer}
        </Text>
      </VStack>
    ),
  };
};

export default createLiveActivity('TrainTripLiveActivity', TrainTripLiveActivity);
