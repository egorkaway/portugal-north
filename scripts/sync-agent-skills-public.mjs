#!/usr/bin/env node
/** @deprecated Use scripts/sync-discovery-public.mjs */
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const script = join(dirname(fileURLToPath(import.meta.url)), "sync-discovery-public.mjs");
const result = spawnSync(process.execPath, [script], { stdio: "inherit" });
process.exit(result.status ?? 1);
