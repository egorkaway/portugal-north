#!/usr/bin/env node
/**
 * Run fetch-station-hotels.mjs in small batches with pauses to avoid Overpass 429s.
 *
 * Usage:
 *   node scripts/queue-station-hotels.mjs
 *   node scripts/queue-station-hotels.mjs --batch 8 --pause 300 --max-batches 50
 *   node scripts/queue-station-hotels.mjs --only-missing
 */
import { spawn } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fetchScript = join(root, "scripts/fetch-station-hotels.mjs");

function readFlagValue(name) {
  const eq = process.argv.find((a) => a.startsWith(`${name}=`));
  if (eq) return eq.split("=")[1];
  const idx = process.argv.indexOf(name);
  if (idx !== -1 && process.argv[idx + 1] && !process.argv[idx + 1].startsWith("-")) {
    return process.argv[idx + 1];
  }
  return undefined;
}

const batchSize = Number(readFlagValue("--batch") ?? 8);
const pauseSec = Number(readFlagValue("--pause") ?? 300);
const maxBatches = Number(readFlagValue("--max-batches") ?? 50);
const delayMs = Number(readFlagValue("--delay") ?? 5000);
const onlyMissing = process.argv.includes("--only-missing");
const logPath = readFlagValue("--log") ?? join(root, "tmp/hotel-fetch-queue.log");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function runNode(args) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, args, {
      cwd: root,
      stdio: ["ignore", "pipe", "pipe"],
    });
    let out = "";
    child.stdout.on("data", (chunk) => {
      const text = chunk.toString();
      out += text;
      process.stdout.write(text);
    });
    child.stderr.on("data", (chunk) => {
      const text = chunk.toString();
      out += text;
      process.stderr.write(text);
    });
    child.on("close", (code) => {
      if (code === 0) resolve(out);
      else reject(new Error(`exit ${code}`));
    });
  });
}

async function remainingCount() {
  const out = await runNode([fetchScript, "--report"]);
  const match = out.match(/Stations with fewer than \d+ curated hotels: (\d+)/);
  return match ? Number(match[1]) : 0;
}

async function appendLog(line) {
  const { appendFileSync, mkdirSync } = await import("node:fs");
  mkdirSync(join(root, "tmp"), { recursive: true });
  appendFileSync(logPath, `${new Date().toISOString()} ${line}\n`);
}

async function main() {
  const started = await remainingCount();
  console.log(
    `Hotel fetch queue: batch=${batchSize}, pause=${pauseSec}s, delay=${delayMs}ms, maxBatches=${maxBatches}`,
  );
  console.log(`Stations needing curated hotels: ${started}`);
  console.log(`Log: ${logPath}\n`);
  await appendLog(`queue start remaining=${started}`);

  let noProgressStreak = 0;

  for (let batch = 1; batch <= maxBatches; batch++) {
    const before = await remainingCount();
    if (before === 0) {
      console.log("\nAll stations have 3 curated hotels.");
      await appendLog("done all full");
      break;
    }

    console.log(`\n========== Batch ${batch}/${maxBatches} (${before} remaining) ==========\n`);
    await appendLog(`batch ${batch} start remaining=${before}`);

    const fetchArgs = [
      fetchScript,
      "--max",
      String(batchSize),
      "--delay",
      String(delayMs),
    ];
    if (onlyMissing) fetchArgs.push("--only-missing");

    try {
      await runNode(fetchArgs);
    } catch (error) {
      console.error(`Batch ${batch} exited with error:`, error.message);
      await appendLog(`batch ${batch} error ${error.message}`);
    }

    const after = await remainingCount();
    const progress = before - after;
    console.log(`\nBatch ${batch} done. Remaining: ${after} (${progress > 0 ? `−${progress}` : "no change"})`);
    await appendLog(`batch ${batch} end remaining=${after} progress=${progress}`);

    if (after === 0) break;

    if (progress <= 0) {
      noProgressStreak++;
      const extraPause = pauseSec * (1 + noProgressStreak);
      console.log(`No progress (${noProgressStreak}x). Waiting ${extraPause}s before next batch…`);
      await sleep(extraPause * 1000);
    } else {
      noProgressStreak = 0;
      if (batch < maxBatches) {
        console.log(`Waiting ${pauseSec}s before next batch…`);
        await sleep(pauseSec * 1000);
      }
    }
  }

  const final = await remainingCount();
  console.log(`\nQueue finished. ${final} station(s) still under 3 curated hotels.`);
  await appendLog(`queue end remaining=${final}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
