import type { TripWidgetProps } from '@/lib/types';

export const DEFAULT_WIDGET_PROPS: TripWidgetProps = {
  mode: 'browse',
  headline: 'Porto-Campanhã',
  subline: 'VeryStays · 426 stations',
  countdownMinutes: null,
  stationName: 'Porto-Campanhã',
  trainNumber: '',
  departureTime: '',
  destination: '',
  delayMinutes: null,
  platform: null,
  departureAtMs: null,
};

export function normalizeWidgetProps(
  props: Partial<TripWidgetProps> | null | undefined,
): TripWidgetProps {
  if (!props || typeof props !== 'object') {
    return DEFAULT_WIDGET_PROPS;
  }

  return {
    mode: props.mode ?? DEFAULT_WIDGET_PROPS.mode,
    headline: props.headline?.trim() || DEFAULT_WIDGET_PROPS.headline,
    subline: props.subline?.trim() || DEFAULT_WIDGET_PROPS.subline,
    countdownMinutes:
      props.countdownMinutes === undefined || props.countdownMinutes < 0
        ? null
        : props.countdownMinutes,
    stationName: props.stationName?.trim() || DEFAULT_WIDGET_PROPS.stationName,
    trainNumber: props.trainNumber ?? '',
    departureTime: props.departureTime ?? '',
    destination: props.destination ?? '',
    delayMinutes:
      props.delayMinutes === undefined || props.delayMinutes < 0 ? null : props.delayMinutes,
    platform: props.platform?.trim() ? props.platform : null,
    departureAtMs:
      props.departureAtMs === undefined || props.departureAtMs <= 0
        ? null
        : props.departureAtMs,
  };
}
