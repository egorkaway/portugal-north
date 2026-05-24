import type { Hotel } from "@/data/hotels";
import type { Station } from "@/data/stations";
import {
  getStationMetaDescription,
  getStationOgDescription,
  getStationPageTitle,
} from "@/lib/stationMeta";
import { stationToSlug } from "@/lib/stationSlug";

export type PageMeta = {
  title: string;
  description: string;
  canonicalPath: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImagePath?: string;
  robots?: string;
};

export const HOME_PAGE_META: PageMeta = {
  title: "Portugal by Train: Stations & Budget Hotels",
  description:
    "Discover major train stations across Portugal, from the Minho to the Algarve, with line info and recommended budget hotels within walking distance.",
  canonicalPath: "/",
  ogImagePath: "/og-image.jpg",
};

export const RANKINGS_PAGE_META: PageMeta = {
  title: "Community Rankings | Portugal by Train",
  description:
    "See which CP train stations and budget hotels visitors rate highest and lowest across Portugal.",
  canonicalPath: "/rankings",
  ogDescription: "Community rankings for CP stations and budget hotels across Portugal.",
  ogImagePath: "/og-image.jpg",
};

export const NOT_FOUND_PAGE_META: PageMeta = {
  title: "Page Not Found | Portugal by Train",
  description:
    "The page you were looking for could not be found. Return to the homepage to explore train stations across Portugal.",
  canonicalPath: "/404",
  robots: "noindex",
  ogImagePath: "/og-image.jpg",
};

export function buildStationPageMeta(
  station: Station,
  hotels: Hotel[],
  shareImageUrl?: string,
): PageMeta {
  return {
    title: getStationPageTitle(station),
    description: getStationMetaDescription(station, hotels),
    canonicalPath: `/stations/${stationToSlug(station.name)}`,
    ogDescription: getStationOgDescription(station, hotels),
    ogImagePath: shareImageUrl,
  };
}

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function escapeAttr(text: string): string {
  return escapeHtml(text).replace(/"/g, "&quot;");
}

/** HTML injected into each prerendered page and mirrored by PageHead at runtime. */
export function buildSeoHeadHtml(meta: PageMeta, siteUrl: string): string {
  const base = siteUrl.replace(/\/$/, "");
  const canonical = `${base}${meta.canonicalPath}`;
  const ogTitle = escapeAttr(meta.ogTitle ?? meta.title);
  const ogDescription = escapeAttr(meta.ogDescription ?? meta.description);
  const ogImage = meta.ogImagePath?.startsWith("http")
    ? meta.ogImagePath
    : `${base}${meta.ogImagePath ?? "/og-image.jpg"}`;

  const robots = meta.robots
    ? `\n    <meta name="robots" content="${escapeAttr(meta.robots)}" />`
    : "";

  return `    <title>${escapeHtml(meta.title)}</title>
    <meta name="description" content="${escapeAttr(meta.description)}" />${robots}
    <link rel="canonical" href="${escapeAttr(canonical)}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Portugal by Train" />
    <meta property="og:url" content="${escapeAttr(canonical)}" />
    <meta property="og:title" content="${ogTitle}" />
    <meta property="og:description" content="${ogDescription}" />
    <meta property="og:image" content="${escapeAttr(ogImage)}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@egorkaway" />
    <meta name="twitter:title" content="${ogTitle}" />
    <meta name="twitter:description" content="${ogDescription}" />
    <meta name="twitter:image" content="${escapeAttr(ogImage)}" />`;
}
