#!/usr/bin/env node
/**
 * Inject per-route <title> and meta tags into dist HTML so crawlers and
 * "View Source" see the correct SEO for each URL (not only the SPA shell).
 *
 *   node scripts/prerender-pages.mjs
 *
 * Runs automatically after `vite build`.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { buildSync } from "esbuild";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const distDir = join(root, "dist");
const siteUrl = (process.env.VITE_SITE_URL ?? "https://www.verystays.com").replace(/\/$/, "");

const cacheDir = join(root, "node_modules/.cache");
mkdirSync(cacheDir, { recursive: true });
const cacheFile = join(cacheDir, "prerender-lib.mjs");

buildSync({
  entryPoints: [join(root, "src/lib/prerenderRoutes.ts")],
  bundle: true,
  outfile: cacheFile,
  format: "esm",
  platform: "node",
  alias: { "@": join(root, "src") },
});

const { getPrerenderRoutes, buildSeoHeadHtml } = await import(pathToFileURL(cacheFile).href);

const templatePath = join(distDir, "index.html");
const template = readFileSync(templatePath, "utf8");
const seoRe = /<!--seo-->[\s\S]*?<!--\/seo-->/;

if (!seoRe.test(template)) {
  console.error("dist/index.html is missing <!--seo--> markers. Run vite build first.");
  process.exit(1);
}

const routes = getPrerenderRoutes();
let written = 0;

for (const route of routes) {
  const seoBlock = buildSeoHeadHtml(route.meta, siteUrl);
  const html = template.replace(seoRe, `<!--seo-->\n${seoBlock}\n    <!--/seo-->`);
  const outPath = join(distDir, route.outFile);
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, html);
  written++;
}

console.log(`Prerendered SEO for ${written} pages into dist/ (base ${siteUrl})`);
