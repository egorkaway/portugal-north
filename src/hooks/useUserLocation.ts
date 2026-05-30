import { useCallback, useEffect, useRef, useState } from "react";
import {
  readDistanceSortEnabled,
  writeDistanceSortEnabled,
} from "@/lib/distanceSortStorage";

export type UserCoords = { lat: number; lng: number };

export type UserLocationState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; coords: UserCoords }
  | { status: "denied" }
  | { status: "unsupported" }
  | { status: "error" };

export function useUserLocation() {
  const [distanceSortOn, setDistanceSortOn] = useState(() => readDistanceSortEnabled());
  const [state, setState] = useState<UserLocationState>({ status: "idle" });
  /** Bumps when user retries after denied/error so the effect runs again while sort stays on. */
  const [locateAttempt, setLocateAttempt] = useState(0);
  const requestGenerationRef = useRef(0);
  const inFlightRef = useRef(false);

  const cancelRequest = useCallback(() => {
    requestGenerationRef.current += 1;
    inFlightRef.current = false;
    setDistanceSortOn(false);
    writeDistanceSortEnabled(false);
    setState({ status: "idle" });
  }, []);

  const startLocate = useCallback(() => {
    setLocateAttempt((n) => n + 1);
  }, []);

  const requestLocation = useCallback(() => {
    if (distanceSortOn) {
      if (state.status === "loading") return;
      if (state.status === "ready") {
        cancelRequest();
        return;
      }
      // denied / error / unsupported — retry without turning sort off
      startLocate();
      return;
    }
    setDistanceSortOn(true);
    writeDistanceSortEnabled(true);
    startLocate();
  }, [distanceSortOn, state.status, cancelRequest, startLocate]);

  useEffect(() => {
    if (!distanceSortOn) {
      inFlightRef.current = false;
      return;
    }

    if (inFlightRef.current) return;

    if (!navigator.geolocation) {
      setState({ status: "unsupported" });
      return;
    }

    const generation = ++requestGenerationRef.current;
    inFlightRef.current = true;
    setState({ status: "loading" });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        inFlightRef.current = false;
        if (generation !== requestGenerationRef.current) return;
        setState({
          status: "ready",
          coords: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
        });
      },
      (error) => {
        inFlightRef.current = false;
        if (generation !== requestGenerationRef.current) return;
        if (error.code === error.PERMISSION_DENIED) {
          setState({ status: "denied" });
          return;
        }
        setState({ status: "error" });
      },
      { enableHighAccuracy: false, timeout: 20_000, maximumAge: 300_000 },
    );

    return () => {
      requestGenerationRef.current += 1;
      inFlightRef.current = false;
    };
  }, [distanceSortOn, locateAttempt]);

  const coords = state.status === "ready" ? state.coords : null;

  return {
    state,
    coords,
    isActive: distanceSortOn,
    requestLocation,
    cancelRequest,
  };
}
