import { stationsNeedingSummaries } from "../src/lib/stationSummaryQueue.ts";
import { rankStationsByTrainVolume } from "../src/lib/stationTrainVolume.ts";

const limit = Number(process.argv.find((arg) => arg.startsWith("--limit="))?.split("=")[1] ?? 5);

console.log(`Next ${limit} stations needing summaries (by train volume):\n`);
for (const name of stationsNeedingSummaries(limit)) {
  const entry = rankStationsByTrainVolume().find((row) => row.station.name === name);
  const departures = entry?.departuresNextHour ?? 0;
  console.log(`- ${name} (${departures} cumulative dep/hr in stats)`);
}
