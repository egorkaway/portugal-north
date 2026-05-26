import { useEffect } from "react";
import { trackStationViewed } from "@/lib/posthogEvents";

export function StationViewTracker({
  stationName,
  slug,
  hotelCount,
  lineCount,
}: {
  stationName: string;
  slug: string;
  hotelCount: number;
  lineCount: number;
}) {
  useEffect(() => {
    trackStationViewed({ stationName, slug, hotelCount, lineCount });
  }, [stationName, slug, hotelCount, lineCount]);

  return null;
}
