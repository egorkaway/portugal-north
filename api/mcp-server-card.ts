import type { VercelRequest, VercelResponse } from "@vercel/node";
import { buildMcpServerCard } from "./lib/mcpServerCard.js";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.setHeader("Allow", "GET, HEAD");
    return res.status(405).end();
  }

  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.method === "HEAD") {
    return res.status(200).end();
  }

  return res.status(200).send(JSON.stringify(buildMcpServerCard(), null, 2));
}
