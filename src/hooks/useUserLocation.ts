import { useCallback, useRef, useState } from "react";
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

const GEO_OPTIONS: PositionOptions = {
  enableHighAccuracy: false,
  timeout: 20_000,
  maximumAge: 300_000,
};

export function useUserLocation() {
  const [distanceSortOn, setDistanceSortOn] = useState(() => readDistanceSortEnabled());
  const [state, setState] = useState<UserLocationState>({ status: "idle" });
  const requestGenerationRef = useRef(0);

  const cancelRequest = useCallback(() => {
    requestGenerationRef.current += 1;
    setDistanceSortOn(false);
    writeDistanceSortEnabled(false);
    setState({ status: "idle" });
  }, []);

  const locateNow = useCallback(() => {
    if (!navigator.geolocation) {
      setState({ status: "unsupported" });
      return;
    }

    const generation = ++requestGenerationRef.current;
    setState({ status: "loading" });

    navigator.geolocation.getCurrentPosition(
      (position) => {
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
        if (generation !== requestGenerationRef.current) return;
        if (error.code === error.PERMISSION_DENIED) {
          setState({ status: "denied" });
          return;
        }
        setState({ status: "error" });
      },
      GEO_OPTIONS,
    );
  }, []);

  const requestLocation = useCallback(() => {
    if (distanceSortOn) {
      if (state.status === "loading" || state.status === "ready") {
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
      // Restored preference (idle) — locate inside the user gesture (required on iOS Safari).
      locateNow();
      return;
    }

    setDistanceSortOn(true);
    writeDistanceSortEnabled(true);
    locateNow();
  }, [distanceSortOn, state.status, cancelRequest, locateNow]);

  const coords = state.status === "ready" ? state.coords : null;

  return {
    state,
    coords,
    isActive: distanceSortOn,
    requestLocation,
    cancelRequest,
  };
};
