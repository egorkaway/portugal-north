import { useCallback, useEffect, useState } from 'react';
import { subscribeTripChanges } from '@/lib/tripEvents';
import { readActiveTrip } from '@/lib/tripStorage';
import type { PlannedDeparture } from '@/lib/types';

export function useActiveTrip(): PlannedDeparture | null {
  const [trip, setTrip] = useState<PlannedDeparture | null>(null);

  const refresh = useCallback(async () => {
    setTrip(await readActiveTrip());
  }, []);

  useEffect(() => {
    void refresh();
    return subscribeTripChanges(() => {
      void refresh();
    });
  }, [refresh]);

  return trip;
}
