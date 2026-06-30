import type { VercelRequest, VercelResponse } from "@vercel/node";
import { fetchCpTrainJourney } from "../server/lib/cpTrainJourney.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "method_not_allowed" });
  }

  const train =
    typeof req.query.train === "string" ? req.query.train.trim() : "";
  const date =
    typeof req.query.date === "string" ? req.query.date.trim() : undefined;

  if (!train) {
    return res.status(400).json({ error: "missing_train", journey: null });
  }

  try {
    const journey = await fetchCpTrainJourney(train, date);
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=120");
    return res.status(200).json({ journey, configured: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown";
    const status =
      message === "invalid_train_number" || message === "invalid_timetable_date"
        ? 400
        : 502;
    return res.status(status).json({
      error: message,
      journey: null,
      configured: true,
    });
  }
}
