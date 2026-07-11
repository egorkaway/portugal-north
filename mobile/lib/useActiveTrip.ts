import { useCallback, useEffect, useState } from 'react';
import { readActiveTrip } from '@/lib/tripStorage';
import type { PlannedDeparture } from '@/lib/types';

export function useActiveTrip(): PlannedDeparture | null {
  const [trip, setTrip] = useState<PlannedDeparture | null>(null);

  const refresh = useCallback(async () => {
    setTrip(await readActiveTrip());
  }, []);

  useEffect(() => {
    void refresh();
    const timer = setInterval(() => void refresh(), 15_000);
    return () => clearInterval(timer);
  }, [refresh]);

  return trip;
}
