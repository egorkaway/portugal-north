#!/usr/bin/env node
/**
 * Stage all changes, commit with a stats-oriented message, and push to origin.
 *
 * Usage:
 *   node scripts/ship-stats.mjs
 *   node scripts/ship-stats.mjs "Custom commit subject"
 *
 * npm aliases:
 *   npm run ship          — commit + push (after departures already ran)
 *   npm run stats:ship    — departures sample, then commit + push
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function run(cmd) {
  execSync(cmd, { cwd: root, stdio: "inherit" });
}

function readRunCount() {
  try {
    const statsPath = path.join(root, "data/departure-stats.json");
    const data = JSON.parse(fs.readFileSync(statsPath, "utf8"));
    return typeof data.runCount === "number" ? data.runCount : null;
  } catch {
    return null;
  }
}

const customSubject = process.argv.slice(2).join(" ").trim();
const runCount = readRunCount();
const subject =
  customSubject ||
  (runCount != null
    ? `Refresh departure run #${runCount} snapshots and bundled data.`
    : "Refresh stats snapshots and bundled data.");

const body =
  customSubject.length > 0
    ? ""
    : "Includes latest reliability scores, Spain catalog updates, and mobile/public data sync.";

const message = body ? `${subject}\n\n${body}` : subject;

const status = execSync("git status --porcelain", { cwd: root, encoding: "utf8" }).trim();
if (!status) {
  console.log("Nothing to commit.");
  process.exit(0);
}

run("git add -A");
run(`git commit -m ${JSON.stringify(message)}`);
run("git push origin HEAD");
console.log("Shipped.");
