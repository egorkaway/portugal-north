import { useEffect } from "react";
import { useNowMinute } from "@/hooks/useNowMinute";
import { useStationBoard } from "@/hooks/useStationDepartures";
import { useTripDepartureRecord } from "@/hooks/useTripDepartureRecord";
import { shouldClearActiveTrip } from "@/lib/departureCountdown";
import { clearActiveTrip, useActiveTrip } from "@/lib/plannedDepartures";

/** Keeps active-trip side effects alive on every route (departure → history, etc.). */
export function ActiveTripBootstrap() {
  const trip = useActiveTrip();
  const now = useNowMinute();
  const { data: board } = useStationBoard(trip?.stationName ?? "", 10);

  const liveDeparture = board?.departures?.find(
    (dep) =>
      dep.trainNumber === trip?.trainNumber &&
      dep.time === trip?.departureTime &&
      dep.destination === trip?.destination,
  );
  const liveArrival = board?.arrivals?.find(
    (arr) =>
      arr.trainNumber === trip?.trainNumber &&
      (arr.time === trip?.departureTime || arr.departureTime === trip?.departureTime),
  );
  const delayMinutes =
    liveDeparture?.delayMinutes ?? liveArrival?.delayMinutes ?? trip?.delayMinutes ?? null;

  useEffect(() => {
    if (trip && shouldClearActiveTrip(trip, now)) {
      clearActiveTrip();
    }
  }, [trip, now]);

  const platform =
    liveDeparture?.platform ?? liveArrival?.platform ?? trip?.platform ?? null;
  useTripDepartureRecord(trip, delayMinutes, now, platform);

  return null;
}
