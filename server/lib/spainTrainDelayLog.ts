import { appendFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import type { SpainDelayObservation } from "../../src/lib/spainTripUpdates.js";

export type SpainTrainDelayLogEntry = {
  recordedAt: string;
  kind: SpainDelayObservation["kind"];
  station: string | null;
  stopId: string;
  trainNumber: string;
  serviceType: string;
  tripId: string;
  delayMinutes: number;
  estimatedArrivalAt: string | null;
};

export function appendSpainTrainDelayLog(
  logPath: string,
  entries: SpainTrainDelayLogEntry[],
): void {
  if (!entries.length) return;
  mkdirSync(dirname(logPath), { recursive: true });
  const chunk = `${entries.map((entry) => JSON.stringify(entry)).join("\n")}\n`;
  appendFileSync(logPath, chunk, "utf8");
}

export function readSpainTrainDelayLog(logPath: string): SpainTrainDelayLogEntry[] {
  try {
    const text = readFileSync(logPath, "utf8");
    return text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => JSON.parse(line) as SpainTrainDelayLogEntry);
  } catch {
    return [];
  }
}

export function writeSpainTrainDelayLog(
  logPath: string,
  entries: SpainTrainDelayLogEntry[],
): void {
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

export function spainTrainDelayEntriesFromObservations(options: {
  observations: SpainDelayObservation[];
  recordedAt?: string;
}): SpainTrainDelayLogEntry[] {
  const recordedAt = options.recordedAt ?? new Date().toISOString();
  return options.observations.map((observation) => ({
    recordedAt,
    kind: observation.kind,
    station: observation.station,
    stopId: observation.stopId,
    trainNumber: observation.trainNumber,
    serviceType: observation.serviceType,
    tripId: observation.tripId,
    delayMinutes: observation.delayMinutes,
    estimatedArrivalAt: observation.estimatedArrivalAt,
  }));
}
