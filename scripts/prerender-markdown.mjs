#!/usr/bin/env node
/**
 * Write index.md alongside each prerendered HTML page for Markdown for Agents.
 *
 *   node scripts/prerender-markdown.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { buildSync } from "esbuild";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const distDir = join(root, "dist");
const siteUrl = (process.env.VITE_SITE_URL ?? "https://www.verystays.com").replace(/\/$/, "");

const cacheDir = join(root, "node_modules/.cache");
mkdirSync(cacheDir, { recursive: true });

const runnerPath = join(cacheDir, "prerender-markdown-runner.mjs");
writeFileSync(
  runnerPath,
  `export { getPrerenderRoutes } from ${JSON.stringify(join(root, "src/lib/prerenderRoutes.ts"))};
export { buildMarkdownForRoute } from ${JSON.stringify(join(root, "src/lib/pageMarkdown.ts"))};
`,
);

buildSync({
  entryPoints: [runnerPath],
  bundle: true,
  outfile: join(cacheDir, "prerender-markdown-lib.mjs"),
  format: "esm",
  platform: "node",
  alias: { "@": join(root, "src") },
  define: {
    "import.meta.env.VITE_SITE_URL": JSON.stringify(siteUrl),
  },
});

const { getPrerenderRoutes, buildMarkdownForRoute } = await import(
  pathToFileURL(join(cacheDir, "prerender-markdown-lib.mjs")).href
);

const routes = getPrerenderRoutes();
let written = 0;

for (const route of routes) {
  const md = buildMarkdownForRoute(route, siteUrl);
  const outFile = route.outFile.replace(/index\.html$/, "index.md");
  const outPath = join(distDir, outFile);
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, md);
  written++;
}

console.log(`Prerendered markdown for ${written} pages into dist/`);
