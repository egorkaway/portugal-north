import type { Hotel } from "@/data/hotels";
import { stations, type Station, getAppleMapsUrl, getBookingSearchUrl, getOSMUrl } from "@/data/stations";
import {
  HOME_PAGE_META,
  RANKINGS_PAGE_META,
  buildStationPageMeta,
  type PageMeta,
} from "@/lib/pageMeta";
import { formatLineList, formatServiceTypes } from "@/lib/stationMeta";
import { getStationBySlug, stationToSlug } from "@/lib/stationSlug";
import type { PrerenderRoute } from "@/lib/prerenderRoutes";
import { buildHomeStructuredData, buildStationStructuredData } from "@/lib/structuredData";
import { getHotelsForStation } from "@/lib/stationHotels";
import { getStationShareImageUrl } from "@/lib/stationImage";

/** Rough token estimate (~4 chars per token for English prose). */
export function estimateMarkdownTokens(markdown: string): number {
  return Math.ceil(markdown.length / 4);
}

function yamlFrontmatter(fields: Record<string, string | undefined>): string {
  const lines = Object.entries(fields)
    .filter(([, value]) => value != null && value !== "")
    .map(([key, value]) => `${key}: ${JSON.stringify(value)}`);
  if (lines.length === 0) return "";
  return `---\n${lines.join("\n")}\n---\n\n`;
}

function appendJsonLdBlock(markdown: string, data: unknown): string {
  return `${markdown}\n\n\`\`\`json\n${JSON.stringify(data, null, 2)}\n\`\`\`\n`;
}

export function buildHomeMarkdown(meta: PageMeta, siteUrl: string): string {
  const base = siteUrl.replace(/\/$/, "");
  const body = `${yamlFrontmatter({
    title: meta.title,
    description: meta.description,
    image: meta.ogImagePath ? `${base}${meta.ogImagePath}` : undefined,
  })}# ${meta.title}

${meta.description}

- **${stations.length}** CP train stations from the Minho to the Algarve
- Line and service-type filters (Alfa Pendular, Intercidades, Regional, Urban)
- Budget hotel suggestions within walking distance of major stops
- Community upvote/downvote totals for stations and hotels

## Explore

- [All stations](${base}/)
- [Community rankings](${base}/rankings)
- [API documentation](${base}/docs/api)

## Discovery for agents

- [API catalog](${base}/.well-known/api-catalog) (RFC 9727)
- [OpenAPI](${base}/api/openapi.json)
- [Agent skills index](${base}/.well-known/agent-skills/index.json)
`;

  return appendJsonLdBlock(body, buildHomeStructuredData());
}

export function buildRankingsMarkdown(meta: PageMeta, siteUrl: string): string {
  const base = siteUrl.replace(/\/$/, "");
  const body = `${yamlFrontmatter({
    title: meta.title,
    description: meta.description,
    image: meta.ogImagePath ? `${base}${meta.ogImagePath}` : undefined,
  })}# ${meta.title}

${meta.description}

Vote on station and hotel listings across the site; rankings aggregate community up and down counts.

- [Return to all stations](${base}/)
- [API: global vote totals](${base}/api/votes)
`;

  return body;
}

export function buildStationMarkdown(
  station: Station,
  meta: PageMeta,
  hotels: Hotel[],
  siteUrl: string,
): string {
  const base = siteUrl.replace(/\/$/, "");
  const image = meta.ogImagePath?.startsWith("http")
    ? meta.ogImagePath
    : meta.ogImagePath
      ? `${base}${meta.ogImagePath}`
      : undefined;

  const hotelLines =
    hotels.length === 0
      ? "_No curated budget stays listed yet — use the Booking search link below._"
      : hotels
          .map(
            (h) =>
              `- **${h.name}** — from €${h.priceFrom}/night, ~${h.walkMinutes} min walk${h.bookingUrl ? ` — [Booking](${h.bookingUrl})` : ""}`,
          )
          .join("\n");

  const body = `${yamlFrontmatter({
    title: meta.title,
    description: meta.description,
    image,
  })}# ${station.name}

${meta.description}

## Lines

${station.lines.map((line) => `- ${line}`).join("\n")}

## Service types

${station.types.map((type) => `- ${type}`).join("\n")}

## Location

- Coordinates: ${station.lat.toFixed(4)}, ${station.lng.toFixed(4)}
- [Apple Maps](${getAppleMapsUrl(station)})
- [OpenStreetMap](${getOSMUrl(station)})

## Budget stays nearby

${hotelLines}

## Links

- [Search hotels on Booking](${getBookingSearchUrl(station)})
- [All stations](${base}/)
- [Live departures API](${base}/api/departures) (requires CP station code)

## Summary

${formatServiceTypes(station.types, "en")} at **${station.name}** on ${formatLineList(station.lines, "en")}.
`;

  const structured = buildStationStructuredData({
    station,
    slug: stationToSlug(station.name),
    hotels,
    imageUrl: getStationShareImageUrl(station.name),
  });

  return appendJsonLdBlock(body, structured);
}

export function buildNotFoundMarkdown(meta: PageMeta, siteUrl: string): string {
  const base = siteUrl.replace(/\/$/, "");
  return `${yamlFrontmatter({
    title: meta.title,
    description: meta.description,
  })}# ${meta.title}

${meta.description}

[Back to homepage](${base}/)
`;
}

export function buildMarkdownForRoute(route: PrerenderRoute, siteUrl: string): string {
  const { meta } = route;
  const slugMatch = meta.canonicalPath.match(/^\/stations\/([^/]+)$/);

  if (slugMatch) {
    const station = getStationBySlug(slugMatch[1]);
    if (station) {
      const hotels = getHotelsForStation(station.name);
      return buildStationMarkdown(station, meta, hotels, siteUrl);
    }
  }

  if (meta.canonicalPath === "/") {
    return buildHomeMarkdown(meta, siteUrl);
  }
  if (meta.canonicalPath === "/rankings") {
    return buildRankingsMarkdown(meta, siteUrl);
  }
  if (meta.canonicalPath === "/404") {
    return buildNotFoundMarkdown(meta, siteUrl);
  }

  return `${yamlFrontmatter({
    title: meta.title,
    description: meta.description,
  })}# ${meta.title}

${meta.description}
`;
}

export function buildMarkdownForPath(pathname: string, siteUrl: string): string | null {
  const normalized =
    pathname === "" || pathname === "/" ? "/" : pathname.replace(/\/$/, "") || "/";

  if (normalized === "/") {
    return buildHomeMarkdown(HOME_PAGE_META, siteUrl);
  }

  const slugMatch = normalized.match(/^\/stations\/([^/]+)$/);
  if (slugMatch) {
    const station = getStationBySlug(slugMatch[1]);
    if (!station) return null;
    const hotels = getHotelsForStation(station.name);
    const meta = buildStationPageMeta(station, hotels, getStationShareImageUrl(station.name));
    return buildStationMarkdown(station, meta, hotels, siteUrl);
  }

  if (normalized === "/rankings") {
    return buildRankingsMarkdown(RANKINGS_PAGE_META, siteUrl);
  }

  return null;
}
