import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getSiteUrl } from "../server/lib/apiCatalog.js";

/**
 * Transport endpoint advertised in the MCP Server Card.
 * Full Streamable HTTP MCP is not implemented; REST APIs are documented at /docs/api.
 */
export default function handler(req: VercelRequest, res: VercelResponse) {
  const base = getSiteUrl().replace(/\/$/, "");

  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Access-Control-Allow-Origin", "*");

  return res.status(501).json({
    jsonrpc: "2.0",
    error: {
      code: -32000,
      message:
        "MCP Streamable HTTP is not enabled on this host. Use the REST API (see /.well-known/api-catalog and /docs/api).",
    },
    meta: {
      apiCatalog: `${base}/.well-known/api-catalog`,
      openApi: `${base}/api/openapi.json`,
      documentation: `${base}/docs/api`,
    },
  });
}
