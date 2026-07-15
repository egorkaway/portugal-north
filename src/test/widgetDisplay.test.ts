import { describe, expect, it } from 'vitest';
import {
  buildActiveTripFooter,
  buildLastTripFooter,
  getWidgetDisplayFields,
} from '../../mobile/lib/widgetDisplay';
import type { TripWidgetProps } from '../../mobile/lib/types';

describe('buildActiveTripFooter', () => {
  it('joins departure time and platform', () => {
    expect(buildActiveTripFooter('14:32', '3', null)).toBe('Departs 14:32 · Platform 3');
  });

  it('includes delay when present', () => {
    expect(buildActiveTripFooter('14:37', '3', 5)).toBe(
      'Departs 14:37 · Platform 3 · +5 min',
    );
  });

  it('falls back when nothing is known', () => {
    expect(buildActiveTripFooter('', null, null)).toBe('Open VeryStays');
  });
});

describe('buildLastTripFooter', () => {
  it('formats departed time', () => {
    expect(buildLastTripFooter('09:15')).toBe('Departed 09:15');
  });
});

describe('getWidgetDisplayFields', () => {
  it('includes platform in active trip footer', () => {
    const props: TripWidgetProps = {
      mode: 'active',
      headline: '18 min',
      subline: 'IC 521 → Porto',
      countdownMinutes: 18,
      stationName: 'Lisboa Oriente',
      trainNumber: 'IC 521',
      departureTime: '14:32',
      destination: 'Porto-Campanhã',
      delayMinutes: null,
      platform: '3',
      departureAtMs: null,
    };

    const fields = getWidgetDisplayFields(props);
    expect(fields.footer).toBe('Departs 14:32 · Platform 3');
    expect(fields.destinationLine).toBe('IC 521 → Porto-Campanhã');
    expect(fields.showDestination).toBe(true);
  });
});
