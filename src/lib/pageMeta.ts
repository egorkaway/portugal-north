import type { Hotel } from "@/data/hotels";
import type { Station } from "@/data/stations";
import type { Locale, Translator } from "@/i18n";
import { createTranslator } from "@/i18n";
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

export function getHomePageMeta(locale: Locale = "en"): PageMeta {
  const { messages } = createTranslator(locale);
  return {
    title: messages.meta.home.title,
    description: messages.meta.home.description,
    canonicalPath: "/",
    ogImagePath: "/og-image.jpg",
  };
}

export function getRankingsPageMeta(locale: Locale = "en"): PageMeta {
  const { messages } = createTranslator(locale);
  return {
    title: messages.meta.rankings.title,
    description: messages.meta.rankings.description,
    canonicalPath: "/rankings",
    ogDescription: messages.meta.rankings.ogDescription,
    ogImagePath: "/og-image.jpg",
  };
}

export function getNotFoundPageMeta(locale: Locale = "en"): PageMeta {
  const { messages } = createTranslator(locale);
  return {
    title: messages.meta.notFound.title,
    description: messages.meta.notFound.description,
    canonicalPath: "/404",
    robots: "noindex",
    ogImagePath: "/og-image.jpg",
  };
}

/** @deprecated Use getHomePageMeta("en") — kept for prerender/tests */
export const HOME_PAGE_META = getHomePageMeta("en");
export const RANKINGS_PAGE_META = getRankingsPageMeta("en");
export const NOT_FOUND_PAGE_META = getNotFoundPageMeta("en");

export function buildStationPageMeta(
  station: Station,
  hotels: Hotel[],
  shareImageUrl: string | undefined,
  locale: Locale = "en",
): PageMeta {
  const tr = createTranslator(locale);
  return {
    title: getStationPageTitle(station, tr),
    description: getStationMetaDescription(station, hotels, tr),
    canonicalPath: `/stations/${stationToSlug(station.name)}`,
    ogDescription: getStationOgDescription(station, hotels, tr),
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
export function buildSeoHeadHtml(meta: PageMeta, siteUrl: string, siteName?: string): string {
  const base = siteUrl.replace(/\/$/, "");
  const canonical = `${base}${meta.canonicalPath}`;
  const ogTitle = escapeAttr(meta.ogTitle ?? meta.title);
  const ogDescription = escapeAttr(meta.ogDescription ?? meta.description);
  const ogImage = meta.ogImagePath?.startsWith("http")
    ? meta.ogImagePath
    : `${base}${meta.ogImagePath ?? "/og-image.jpg"}`;
  const name = escapeAttr(siteName ?? "Portugal by Train");

  const robots = meta.robots
    ? `\n    <meta name="robots" content="${escapeAttr(meta.robots)}" />`
    : "";

  return `    <title>${escapeHtml(meta.title)}</title>
    <meta name="description" content="${escapeAttr(meta.description)}" />${robots}
    <link rel="canonical" href="${escapeAttr(canonical)}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="${name}" />
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
