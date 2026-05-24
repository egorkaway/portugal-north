#!/usr/bin/env node
/**
 * Copy api/agent-skills/* to public/.well-known/agent-skills/ and write
 * index.json with SHA-256 digests (Agent Skills Discovery v0.2.0).
 *
 *   node scripts/sync-agent-skills-public.mjs
 */
import { cpSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { buildSync } from "esbuild";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const cacheDir = join(root, "node_modules/.cache");
mkdirSync(cacheDir, { recursive: true });
const cacheFile = join(cacheDir, "agent-skills-index.mjs");

buildSync({
  entryPoints: [join(root, "api/lib/agentSkillsIndex.ts")],
  bundle: true,
  outfile: cacheFile,
  format: "esm",
  platform: "node",
});

const { buildAgentSkillsIndex } = await import(pathToFileURL(cacheFile).href);
const siteUrl = (process.env.VITE_SITE_URL ?? "https://www.verystays.com").replace(/\/$/, "");
const index = buildAgentSkillsIndex(siteUrl);

const srcRoot = join(root, "api/agent-skills");
const destRoot = join(root, "public/.well-known/agent-skills");
mkdirSync(destRoot, { recursive: true });

for (const skill of index.skills) {
  const name = skill.name;
  cpSync(join(srcRoot, name), join(destRoot, name), { recursive: true });
}

writeFileSync(join(destRoot, "index.json"), `${JSON.stringify(index, null, 2)}\n`);
console.log(`Wrote ${index.skills.length} skill(s) to public/.well-known/agent-skills/`);
