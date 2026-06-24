import { allStations } from "../data/stationRegistry";
import { getStationPath } from "./stationSlug";

export type SitemapEntry = {
  path: string;
  changefreq: "daily" | "weekly" | "monthly";
  priority: string;
};

export function getSitemapEntries(): SitemapEntry[] {
  return [
    { path: "/", changefreq: "weekly", priority: "1.0" },
    { path: "/rankings", changefreq: "daily", priority: "0.8" },
    { path: "/tickets", changefreq: "monthly", priority: "0.7" },
    { path: "/map", changefreq: "weekly", priority: "0.75" },
    { path: "/privacy", changefreq: "monthly", priority: "0.5" },
    ...allStations.map((station) => ({
      path: getStationPath(station),
      changefreq: "weekly" as const,
      priority: "0.7",
    })),
  ];
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function buildSitemapXml(siteUrl: string, entries = getSitemapEntries()): string {
  const base = siteUrl.replace(/\/$/, "");
  const urls = entries
    .map(
      (entry) => `  <url>
    <loc>${escapeXml(`${base}${entry.path}`)}</loc>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}
