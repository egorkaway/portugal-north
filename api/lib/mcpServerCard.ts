/** SEP-1649 / SEP-2127 MCP Server Card for /.well-known/mcp/server-card.json */

import { getSiteUrl } from "./apiCatalog.js";

export type McpServerCard = {
  protocolVersion: string;
  serverInfo: {
    name: string;
    title: string;
    version: string;
    description: string;
  };
  transport: {
    type: "streamable-http";
    endpoint: string;
  };
  capabilities: {
    tools: Record<string, never>;
    resources: Record<string, never>;
    prompts: Record<string, never>;
  };
  authentication: {
    required: false;
  };
  documentationUrl: string;
};

const PROTOCOL_VERSION = "2025-06-18";
const SERVER_VERSION = "1.0.0";

export function buildMcpServerCard(siteUrl = getSiteUrl()): McpServerCard {
  const base = siteUrl.replace(/\/$/, "");

  return {
    protocolVersion: PROTOCOL_VERSION,
    serverInfo: {
      name: "com.verystays/portugal-by-train",
      title: "Portugal by Train",
      version: SERVER_VERSION,
      description:
        "CP train stations across Portugal with hotel suggestions, live departures, and community ratings.",
    },
    transport: {
      type: "streamable-http",
      endpoint: `${base}/api/mcp`,
    },
    capabilities: {
      tools: {},
      resources: {},
      prompts: {},
    },
    authentication: {
      required: false,
    },
    documentationUrl: `${base}/docs/api`,
  };
}
