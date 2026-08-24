import { createPortal } from "react-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { CircleMarker, Tooltip, useMap } from "react-leaflet";
import { LocateFixed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/i18n/LocaleProvider";
import { readLastCoords } from "@/lib/distanceSortStorage";
import { getLocationPermissionStatus } from "@/lib/pwaPermissions";
import {
  startUserGeolocation,
  type GeolocationRequest,
  type UserCoords,
} from "@/lib/userGeolocation";

const USER_LOCATION_ZOOM = 11;

const USER_HALO_STYLE = {
  color: "transparent",
  fillColor: "#0f766e",
  fillOpacity: 0.2,
  weight: 0,
  className: "map-user-location-halo",
  interactive: false,
} as const;

const USER_MARKER_STYLE = {
  color: "#ffffff",
  fillColor: "#0f766e",
  fillOpacity: 1,
  weight: 3,
} as const;

export function MapLocateControl() {
  const map = useMap();
  const { t } = useLocale();
  const [userPos, setUserPos] = useState<UserCoords | null>(null);
  const [locating, setLocating] = useState(false);
  const requestRef = useRef<GeolocationRequest | null>(null);
  const generationRef = useRef(0);
  const autoLocatedRef = useRef(false);

  const centerOnUser = useCallback(
    (coords: UserCoords, options?: { initial?: boolean }) => {
      setUserPos(coords);
      const zoom = options?.initial
        ? USER_LOCATION_ZOOM
        : Math.max(map.getZoom(), USER_LOCATION_ZOOM);
      map.flyTo([coords.lat, coords.lng], zoom, {
        duration: options?.initial ? 0.5 : 0.8,
      });
    },
    [map],
  );

  const locate = useCallback(
    (options?: { initial?: boolean }) => {
      requestRef.current?.cancel();
      const generation = ++generationRef.current;
      setLocating(true);

      const request = startUserGeolocation({
        isCancelled: () => generation !== generationRef.current,
        onSuccess: (coords) => {
          if (generation !== generationRef.current) return;
          requestRef.current = null;
          setLocating(false);
          centerOnUser(coords, options);
        },
        onFailure: () => {
          if (generation !== generationRef.current) return;
          requestRef.current = null;
          setLocating(false);
        },
      });

      requestRef.current = request;
    },
    [centerOnUser],
  );

  useEffect(() => {
    if (autoLocatedRef.current) return;
    autoLocatedRef.current = true;

    void getLocationPermissionStatus().then((status) => {
      if (status !== "granted") return;

      const cached = readLastCoords();
      if (cached) {
        centerOnUser({ lat: cached.lat, lng: cached.lng }, { initial: true });
      }

      locate({ initial: true });
    });
  }, [centerOnUser, locate]);

  useEffect(() => () => requestRef.current?.cancel(), []);

  return (
    <>
      {createPortal(
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="absolute right-2 top-2 z-[1000] h-9 w-9 border-border bg-card text-foreground shadow-md hover:bg-card/90"
          onClick={() => locate()}
          disabled={locating}
          aria-label={t("map.locateMe")}
        >
          <LocateFixed
            className={locating ? "animate-pulse text-foreground" : "text-foreground"}
            aria-hidden="true"
          />
        </Button>,
        map.getContainer(),
      )}
      {userPos ? (
        <>
          <CircleMarker
            center={[userPos.lat, userPos.lng]}
            radius={16}
            pathOptions={USER_HALO_STYLE}
          />
          <CircleMarker
            center={[userPos.lat, userPos.lng]}
            radius={8}
            pathOptions={USER_MARKER_STYLE}
          >
            <Tooltip direction="top" offset={[0, -10]} className="map-hex-tooltip">
              <div className="map-hex-tooltip__station">
                <p className="font-semibold text-foreground">{t("map.yourLocation")}</p>
                <p className="text-xs text-muted-foreground">{t("map.yourLocationHint")}</p>
              </div>
            </Tooltip>
          </CircleMarker>
        </>
      ) : null}
    </>
  );
}
