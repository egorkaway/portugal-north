import { useCallback, useEffect, useRef, useState } from "react";
import {
  readDistanceSortEnabled,
  readDistanceSortSessionOptOut,
  readLastCoords,
  writeDistanceSortEnabled,
  writeDistanceSortSessionOptOut,
  writeLastCoords,
} from "@/lib/distanceSortStorage";
import { getLocationPermissionStatus } from "@/lib/pwaPermissions";
import { startUserGeolocation, type UserCoords } from "@/lib/userGeolocation";

export type { UserCoords } from "@/lib/userGeolocation";

export type UserLocationState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "denied" }
  | { status: "unsupported" }
  | { status: "error" };

function initialDistanceSortOn(): boolean {
  if (readDistanceSortSessionOptOut()) return false;
  return readDistanceSortEnabled();
}

function initialCoords(): UserCoords | null {
  if (!initialDistanceSortOn()) return null;
  const cached = readLastCoords();
  return cached ? { lat: cached.lat, lng: cached.lng } : null;
}

export function useUserLocation() {
  const [distanceSortOn, setDistanceSortOn] = useState(initialDistanceSortOn);
  const [coords, setCoords] = useState<UserCoords | null>(initialCoords);
  const [state, setState] = useState<UserLocationState>({ status: "idle" });
  const requestGenerationRef = useRef(0);
  const activeRequestRef = useRef<{ cancel: () => void } | null>(null);
  const didBackgroundRefreshRef = useRef(false);
  const didAutoEnableRef = useRef(false);

  const stopActiveRequest = useCallback(() => {
    activeRequestRef.current?.cancel();
    activeRequestRef.current = null;
  }, []);

  const cancelRequest = useCallback(() => {
    requestGenerationRef.current += 1;
    stopActiveRequest();
    setDistanceSortOn(false);
    writeDistanceSortSessionOptOut(true);
    // Keep cached coords for the next cold start; only clear in-memory sort state.
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

  const enableDistanceSort = useCallback(
    (options?: { background?: boolean }) => {
      writeDistanceSortSessionOptOut(false);
      setDistanceSortOn(true);
      writeDistanceSortEnabled(true);
      const cached = readLastCoords();
      if (cached) {
        setCoords({ lat: cached.lat, lng: cached.lng });
        locateNow({ background: true });
        return;
      }
      locateNow({ background: options?.background });
    },
    [locateNow],
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

    enableDistanceSort();
  }, [
    distanceSortOn,
    state.status,
    coords,
    cancelRequest,
    locateNow,
    enableDistanceSort,
  ]);

  // When location is already granted, default to distance sort (unless opted out this session).
  useEffect(() => {
    if (didAutoEnableRef.current) return;
    didAutoEnableRef.current = true;

    if (readDistanceSortSessionOptOut()) return;
    if (readDistanceSortEnabled()) return;

    let cancelled = false;
    void getLocationPermissionStatus().then((status) => {
      if (cancelled || status !== "granted") return;
      if (readDistanceSortSessionOptOut()) return;
      enableDistanceSort({ background: true });
    });

    return () => {
      cancelled = true;
    };
  }, [enableDistanceSort]);

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
}
