import type { TripWidgetProps } from '@/lib/types';

export function compactCountdownLabel(countdownMinutes: number | null): string {
  if (countdownMinutes === null) return '';
  if (countdownMinutes <= 0) return 'Now';
  if (countdownMinutes < 60) return `${countdownMinutes} min`;
  const hours = Math.floor(countdownMinutes / 60);
  const remainder = countdownMinutes % 60;
  return remainder === 0 ? `${hours}h` : `${hours}h ${remainder}m`;
}

export type WidgetDisplayFields = {
  label: string;
  title: string;
  detail: string;
  footer: string;
  destinationLine: string;
  showDestination: boolean;
  underlineStation: boolean;
};

/** Mirrors TripWidget.tsx copy rules for the in-app preview. */
export function getWidgetDisplayFields(props: TripWidgetProps): WidgetDisplayFields {
  const mode = props.mode;
  const headline = props.headline;
  const subline = props.subline;
  const stationName = props.stationName;
  const departureTime = props.departureTime;
  const destination = props.destination;
  const trainNumber = props.trainNumber;
  const countdownMinutes = props.countdownMinutes;

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

  return {
    label,
    title,
    detail,
    footer,
    destinationLine,
    showDestination:
      destinationLine.length > 0 && (mode === 'active' || mode === 'lastTaken'),
    underlineStation: mode === 'active',
  };
}
