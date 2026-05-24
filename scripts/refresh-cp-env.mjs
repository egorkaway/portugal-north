#!/usr/bin/env node
/**
 * Pull CP travel-api credentials from cp.pt/fe-config.json into .env (VITE_CP_*).
 * Re-run when departures start failing with 401. Does not commit secrets.
 *
 *   node scripts/refresh-cp-env.mjs
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const envPath = join(root, ".env");

const cfg = await (await fetch("https://www.cp.pt/fe-config.json")).json();
const vars = {
  VITE_CP_TRAVEL_API_URL: cfg.travelApiUrl,
  VITE_CP_API_KEY: cfg.travelApiKey,
  VITE_CP_CONNECT_ID: cfg.xcck,
  VITE_CP_CONNECT_SECRET: cfg.xccs,
};

let lines = existsSync(envPath) ? readFileSync(envPath, "utf8").split("\n") : [];
const keys = Object.keys(vars);

for (const key of keys) {
  const value = vars[key];
  const line = `${key}=${value}`;
  const idx = lines.findIndex((l) => l.startsWith(`${key}=`));
  if (idx >= 0) lines[idx] = line;
  else lines.push(line);
}

while (lines.length > 0 && lines[lines.length - 1] === "") lines.pop();
lines.push("");
writeFileSync(envPath, lines.join("\n"));
console.log(`Updated ${keys.join(", ")} in .env`);
