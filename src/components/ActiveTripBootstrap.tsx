import { useNowMinute } from "@/hooks/useNowMinute";
import { useStationDepartures } from "@/hooks/useStationDepartures";
import { useTripDepartureRecord } from "@/hooks/useTripDepartureRecord";
import { useActiveTrip } from "@/lib/plannedDepartures";

/** Keeps active-trip side effects alive on every route (departure → history, etc.). */
export function ActiveTripBootstrap() {
  const trip = useActiveTrip();
  const now = useNowMinute();
  const { data: departures } = useStationDepartures(trip?.stationName ?? "", 10);

  const liveDeparture = departures?.find(
    (dep) =>
      dep.trainNumber === trip?.trainNumber &&
      dep.time === trip?.departureTime &&
      dep.destination === trip?.destination,
  );
  const delayMinutes = liveDeparture?.delayMinutes ?? trip?.delayMinutes ?? null;

  useTripDepartureRecord(trip, delayMinutes, now);

  return null;
}
