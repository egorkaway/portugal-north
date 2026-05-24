import type { VercelRequest, VercelResponse } from "@vercel/node";
import { fetchCpStationDepartures } from "./lib/cpDeparturesServer.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "method_not_allowed" });
  }

  const code = typeof req.query.code === "string" ? req.query.code : "";
  const limitRaw = typeof req.query.limit === "string" ? Number(req.query.limit) : 3;
  const limit = Number.isFinite(limitRaw) ? Math.min(10, Math.max(1, limitRaw)) : 3;

  if (!code) {
    return res.status(400).json({ error: "missing_code", departures: [] });
  }

  try {
    const departures = await fetchCpStationDepartures(code, limit);
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=120");
    return res.status(200).json({ departures, configured: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown";
    const status = message === "invalid_station_code" ? 400 : 502;
    return res.status(status).json({
      error: message,
      departures: [],
      configured: true,
    });
  }
}
