import { useCallback, useState } from "react";

export type UserCoords = { lat: number; lng: number };

type UserLocationState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; coords: UserCoords }
  | { status: "denied" }
  | { status: "unsupported" }
  | { status: "error" };

export function useUserLocation() {
  const [state, setState] = useState<UserLocationState>({ status: "idle" });

  const requestLocation = useCallback(() => {
    if (state.status === "ready") {
      setState({ status: "idle" });
      return;
    }

    if (!navigator.geolocation) {
      setState({ status: "unsupported" });
      return;
    }

    setState({ status: "loading" });
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          status: "ready",
          coords: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
        });
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setState({ status: "denied" });
          return;
        }
        setState({ status: "error" });
      },
      { enableHighAccuracy: false, timeout: 10_000, maximumAge: 300_000 },
    );
  }, [state.status]);

  const coords = state.status === "ready" ? state.coords : null;
  const isActive = state.status === "ready";

  return { state, coords, isActive, requestLocation };
}
