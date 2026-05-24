import type { VercelRequest, VercelResponse } from "@vercel/node";
import { buildApiCatalogLinkset } from "./lib/apiCatalog.js";

const CONTENT_TYPE =
  'application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727"';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.setHeader("Allow", "GET, HEAD");
    return res.status(405).end();
  }

  res.setHeader("Content-Type", CONTENT_TYPE);
  res.setHeader("Cache-Control", "public, max-age=3600");

  if (req.method === "HEAD") {
    return res.status(200).end();
  }

  return res.status(200).send(JSON.stringify(buildApiCatalogLinkset(), null, 2));
}
