import type { Hotel } from "@/data/hotels";
import type { Station } from "@/data/stations";

const SITE_NAME = "Portugal by Train";
const MAX_DESCRIPTION = 158;

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trimEnd()}…`;
}

export function formatLineList(lines: string[]): string {
  if (lines.length === 0) return "CP network";
  if (lines.length === 1) return lines[0];
  if (lines.length === 2) return `${lines[0]} and ${lines[1]}`;
  return `${lines.slice(0, -1).join(", ")}, and ${lines[lines.length - 1]}`;
}

export function formatServiceTypes(types: string[]): string {
  const active = types.filter((t) => t !== "Inactive / Historic");
  if (active.length === 0) return "CP trains";
  if (active.length <= 3) return active.join(", ");
  return `${active.slice(0, 2).join(", ")}, and more`;
}

function hotelSummary(hotels: Hotel[]): string {
  if (hotels.length === 0) {
    return "Maps, community votes, and station details.";
  }
  const minPrice = Math.min(...hotels.map((h) => h.priceFrom));
  const countLabel = hotels.length === 1 ? "1 budget stay" : `${hotels.length} budget stays`;
  return `${countLabel} from €${minPrice}/night within 2 km, plus maps and community votes.`;
}

export function getStationPageTitle(station: Station): string {
  return `${station.name} Train Station — Hotels & Lines | ${SITE_NAME}`;
}

export function getStationMetaDescription(station: Station, hotels: Hotel[]): string {
  const services = formatServiceTypes(station.types);
  const lines = formatLineList(station.lines);
  const stays = hotelSummary(hotels);

  const description = `${services} at ${station.name} (${lines}). ${stays}`;
  return truncate(description, MAX_DESCRIPTION);
}

export function getStationOgDescription(station: Station, hotels: Hotel[]): string {
  const services = formatServiceTypes(station.types);
  const lines = formatLineList(station.lines);

  if (hotels.length === 0) {
    return truncate(
      `${station.name}: ${services} on ${lines}. Explore maps and vote on this station.`,
      MAX_DESCRIPTION,
    );
  }

  const minPrice = Math.min(...hotels.map((h) => h.priceFrom));
  const names = hotels
    .slice(0, 2)
    .map((h) => h.name)
    .join(", ");
  const more = hotels.length > 2 ? ` and ${hotels.length - 2} more` : "";

  return truncate(
    `${station.name} (${lines}): ${services}. Stays from €${minPrice}/night — ${names}${more}.`,
    MAX_DESCRIPTION,
  );
}
