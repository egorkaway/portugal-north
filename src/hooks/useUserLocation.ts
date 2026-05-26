import { useCallback, useEffect, useRef, useState } from "react";

export type UserCoords = { lat: number; lng: number };

type UserLocationState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; coords: UserCoords }
  | { status: "denied" }
  | { status: "unsupported" }
  | { status: "error" };

export function useUserLocation() {
  /** User asked for distance sort (stays true while locating until success or failure). */
  const [distanceSortOn, setDistanceSortOn] = useState(false);
  const [state, setState] = useState<UserLocationState>({ status: "idle" });
  const requestGenerationRef = useRef(0);

  const cancelRequest = useCallback(() => {
    requestGenerationRef.current += 1;
    setDistanceSortOn(false);
    setState({ status: "idle" });
  }, []);

  const requestLocation = useCallback(() => {
    if (distanceSortOn) {
      cancelRequest();
      return;
    }
    setDistanceSortOn(true);
  }, [distanceSortOn, cancelRequest]);

  useEffect(() => {
    if (!distanceSortOn) return;

    if (!navigator.geolocation) {
      setState({ status: "unsupported" });
      setDistanceSortOn(false);
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
        setDistanceSortOn(false);
        if (error.code === error.PERMISSION_DENIED) {
          setState({ status: "denied" });
          return;
        }
        setState({ status: "error" });
      },
      { enableHighAccuracy: true, timeout: 15_000, maximumAge: 60_000 },
    );
  }, [distanceSortOn]);

  const coords = state.status === "ready" ? state.coords : null;

  return {
    state,
    coords,
    /** Distance sort requested (on while locating or when coords are ready). */
    isActive: distanceSortOn,
    requestLocation,
    cancelRequest,
  };
}
