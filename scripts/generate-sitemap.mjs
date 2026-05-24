#!/usr/bin/env node
/**
 * Write public/sitemap.xml with all routes (home, rankings, every station page).
 *
 *   node scripts/generate-sitemap.mjs
 *
 * Also runs automatically on vite dev/build via the site-url plugin.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { buildSync } from "esbuild";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const siteUrl = (process.env.VITE_SITE_URL ?? "https://www.verystays.com").replace(/\/$/, "");

const cacheDir = join(root, "node_modules/.cache");
mkdirSync(cacheDir, { recursive: true });
const cacheFile = join(cacheDir, "sitemap-lib.mjs");

buildSync({
  entryPoints: [join(root, "src/lib/sitemap.ts")],
  bundle: true,
  outfile: cacheFile,
  format: "esm",
  platform: "node",
  alias: { "@": join(root, "src") },
});

const { buildSitemapXml } = await import(pathToFileURL(cacheFile).href);

const xml = buildSitemapXml(siteUrl);
const outPath = join(root, "public/sitemap.xml");
writeFileSync(outPath, xml);

const count = (xml.match(/<url>/g) || []).length;
console.log(`Wrote ${outPath} (${count} URLs, base ${siteUrl})`);
