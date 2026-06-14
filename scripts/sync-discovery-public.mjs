#!/usr/bin/env node
/**
 * Write discovery artifacts to public/.well-known/ (static on Vercel, no serverless).
 *
 *   node scripts/sync-discovery-public.mjs
 */
import { cpSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { buildSync } from "esbuild";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const cacheDir = join(root, "node_modules/.cache");
mkdirSync(cacheDir, { recursive: true });
const cacheFile = join(cacheDir, "discovery-public.mjs");

buildSync({
  entryPoints: [join(root, "server/lib/discoveryPublic.ts")],
  bundle: true,
  outfile: cacheFile,
  format: "esm",
  platform: "node",
});

const {
  buildApiCatalogLinkset,
  buildMcpServerCard,
  buildAgentSkillsIndex,
} = await import(pathToFileURL(cacheFile).href);

const siteUrl = (process.env.VITE_SITE_URL ?? "https://www.verystays.com").replace(/\/$/, "");
const apiCatalog = buildApiCatalogLinkset(siteUrl);
const mcpCard = buildMcpServerCard(siteUrl);
const skillsIndex = buildAgentSkillsIndex(siteUrl);

mkdirSync(join(root, "public/.well-known/mcp"), { recursive: true });
mkdirSync(join(root, "public/.well-known/agent-skills"), { recursive: true });

writeFileSync(
  join(root, "public/.well-known/api-catalog"),
  `${JSON.stringify(apiCatalog, null, 2)}\n`,
);
writeFileSync(
  join(root, "public/.well-known/mcp/server-card.json"),
  `${JSON.stringify(mcpCard, null, 2)}\n`,
);

const srcRoot = join(root, "api/agent-skills");
const destRoot = join(root, "public/.well-known/agent-skills");
for (const skill of skillsIndex.skills) {
  cpSync(join(srcRoot, skill.name), join(destRoot, skill.name), { recursive: true });
}
writeFileSync(join(destRoot, "index.json"), `${JSON.stringify(skillsIndex, null, 2)}\n`);

console.log(
  `Wrote discovery files to public/.well-known/ (${skillsIndex.skills.length} skill(s))`,
);
