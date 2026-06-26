import { spainAirports } from "@/data/spain/airports";
import { spainStations } from "@/data/spain/stations";

/** All Spanish train stations and peninsular airports that should have editorial summaries. */
export const SPAIN_SUMMARY_NAMES = [
  ...spainStations.map((station) => station.name),
  ...spainAirports.map((airport) => airport.name),
];
