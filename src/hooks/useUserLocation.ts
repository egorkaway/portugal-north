import { useCallback, useEffect, useRef, useState } from "react";
import {
  clearLastCoords,
  readDistanceSortEnabled,
  readLastCoords,
  writeDistanceSortEnabled,
  writeLastCoords,
} from "@/lib/distanceSortStorage";
import { startUserGeolocation, type UserCoords } from "@/lib/userGeolocation";

export type { UserCoords } from "@/lib/userGeolocation";

export type UserLocationState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "denied" }
  | { status: "unsupported" }
  | { status: "error" };

function initialCoords(): UserCoords | null {
  if (!readDistanceSortEnabled()) return null;
  const cached = readLastCoords();
  return cached ? { lat: cached.lat, lng: cached.lng } : null;
}

export function useUserLocation() {
  const [distanceSortOn, setDistanceSortOn] = useState(() => readDistanceSortEnabled());
  const [coords, setCoords] = useState<UserCoords | null>(initialCoords);
  const [state, setState] = useState<UserLocationState>({ status: "idle" });
  const requestGenerationRef = useRef(0);
  const activeRequestRef = useRef<{ cancel: () => void } | null>(null);
  const didBackgroundRefreshRef = useRef(false);

  const stopActiveRequest = useCallback(() => {
    activeRequestRef.current?.cancel();
    activeRequestRef.current = null;
  }, []);

  const cancelRequest = useCallback(() => {
    requestGenerationRef.current += 1;
    stopActiveRequest();
    setDistanceSortOn(false);
    writeDistanceSortEnabled(false);
    clearLastCoords();
    setCoords(null);
    setState({ status: "idle" });
  }, [stopActiveRequest]);

  const locateNow = useCallback(
    (options?: { background?: boolean }) => {
      stopActiveRequest();

      if (!navigator.geolocation) {
        if (!options?.background) {
          setState({ status: "unsupported" });
        }
        return;
      }

      const generation = ++requestGenerationRef.current;
      if (!options?.background) {
        setState({ status: "loading" });
      }

      const request = startUserGeolocation({
        isCancelled: () => generation !== requestGenerationRef.current,
        onSuccess: (nextCoords) => {
          if (generation !== requestGenerationRef.current) return;
          activeRequestRef.current = null;
          writeLastCoords(nextCoords);
          setCoords(nextCoords);
          setState({ status: "idle" });
        },
        onFailure: (reason) => {
          if (generation !== requestGenerationRef.current) return;
          activeRequestRef.current = null;
          if (options?.background && readLastCoords()) return;
          setState({ status: reason });
        },
      });

      activeRequestRef.current = request;
    },
    [stopActiveRequest],
  );

  const requestLocation = useCallback(() => {
    if (distanceSortOn) {
      if (state.status === "loading") {
        cancelRequest();
        return;
      }
      if (coords) {
        cancelRequest();
        return;
      }
      if (
        state.status === "denied" ||
        state.status === "error" ||
        state.status === "unsupported"
      ) {
        cancelRequest();
        return;
      }
      locateNow();
      return;
    }

    setDistanceSortOn(true);
    writeDistanceSortEnabled(true);
    locateNow();
  }, [distanceSortOn, state.status, coords, cancelRequest, locateNow]);

  useEffect(() => {
    if (didBackgroundRefreshRef.current) return;
    if (!distanceSortOn || !coords) return;
    didBackgroundRefreshRef.current = true;
    locateNow({ background: true });
  }, [distanceSortOn, coords, locateNow]);

  useEffect(() => () => stopActiveRequest(), [stopActiveRequest]);

  return {
    state,
    coords: distanceSortOn ? coords : null,
    isActive: distanceSortOn,
    requestLocation,
    cancelRequest,
  };
};
