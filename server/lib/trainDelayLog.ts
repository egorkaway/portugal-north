import { appendFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import type { TrainDelayObservation } from "./cpDeparturesParse.js";

export type TrainDelayLogEntry = {
  recordedAt: string;
  station: string;
  cpCode: string;
  trainNumber: string;
  serviceType: string;
  delayMinutes: number;
  arrivalTime: string | null;
  departureTime: string | null;
  /** Arrival-focused sample; `both` when departure is also in the next hour. */
  movement: "arrival" | "both";
};

export function appendTrainDelayLog(
  logPath: string,
  entries: TrainDelayLogEntry[],
): void {
  if (!entries.length) return;
  mkdirSync(dirname(logPath), { recursive: true });
  const chunk = `${entries.map((entry) => JSON.stringify(entry)).join("\n")}\n`;
  appendFileSync(logPath, chunk, "utf8");
}

export function readTrainDelayLog(logPath: string): TrainDelayLogEntry[] {
  try {
    const text = readFileSync(logPath, "utf8");
    return text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => JSON.parse(line) as TrainDelayLogEntry);
  } catch {
    return [];
  }
}

/** Rewrite the log (tests / compaction). */
export function writeTrainDelayLog(logPath: string, entries: TrainDelayLogEntry[]): void {
  mkdirSync(dirname(logPath), { recursive: true });
  if (!entries.length) {
    writeFileSync(logPath, "", "utf8");
    return;
  }
  writeFileSync(
    logPath,
    `${entries.map((entry) => JSON.stringify(entry)).join("\n")}\n`,
    "utf8",
  );
}

export function trainDelayEntriesFromObservations(options: {
  station: string;
  cpCode: string;
  observations: TrainDelayObservation[];
  recordedAt?: string;
}): TrainDelayLogEntry[] {
  const recordedAt = options.recordedAt ?? new Date().toISOString();
  return options.observations
    .filter((observation) => observation.hasArrival)
    .map((observation) => ({
      recordedAt,
      station: options.station,
      cpCode: options.cpCode,
      trainNumber: observation.trainNumber,
      serviceType: observation.serviceType,
      delayMinutes: observation.delayMinutes,
      arrivalTime: observation.arrivalTime,
      departureTime: observation.departureTime,
      movement: observation.hasDeparture ? "both" : "arrival",
    }));
}
