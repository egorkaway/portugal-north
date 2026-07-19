import { getCpTravelConfig } from "../server/lib/cpConfig.js";
import {
  fetchCpTrainJourney,
  fetchCpTrainJourneyWithFallback,
} from "../server/lib/cpTrainJourney.js";

const train = process.argv[2] ?? "3305";
const origin = process.argv[3] ?? "94-2006"; // Porto-Campanhã
const departure = process.argv[4] ?? "08:00";
const destination = process.argv[5] ?? undefined;

function log(label, value) {
  console.log(`\n=== ${label} ===`);
  console.log(typeof value === "string" ? value : JSON.stringify(value, null, 2));
}

async function main() {
  try {
    const cfg = await getCpTravelConfig();
    log("travel config", { travelApiUrl: cfg.travelApiUrl });
  } catch (e) {
    log("travel config ERROR", String(e));
  }

  try {
    const j = await fetchCpTrainJourney(train);
    log("SIV primary journey (stops count)", j.stops.length);
    log("SIV primary journey", j);
  } catch (e) {
    log("SIV primary ERROR", String(e));
  }

  try {
    const j = await fetchCpTrainJourneyWithFallback({
      trainNumber: train,
      originStationCode: origin,
      departureTime: departure,
      destinationName: destination,
    });
    log("with-fallback journey stops", j.stops.map((s) => `${s.stationCode} ${s.stationName} arr=${s.arrivalTime} dep=${s.departureTime}`));
    log("with-fallback serviceType", j.serviceType);
  } catch (e) {
    log("with-fallback ERROR", String(e));
  }
}

main();
