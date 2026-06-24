import type { Station } from "@/data/stationTypes";

/**
 * Spanish stations reachable on timetabled passenger services from Portugal.
 * Other cross-border candidates (e.g. Badajoz via Entroncamento) can be added here later.
 */
export const spainStations: Station[] = [
  {
    name: "Vigo-Guixar",
    country: "es",
    lines: ["Celta (Porto–Vigo)"],
    types: ["Internacional"],
    lat: 42.2314,
    lng: -8.7126,
  },
];
