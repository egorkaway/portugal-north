import type { NavigateFunction } from "react-router-dom";
import {
  getCommunityRankings,
  getStationDepartures,
  getStationDetails,
  searchStations,
} from "@/lib/webmcp/stationTools";
import type { ModelContextTool, NavigatorWithModelContext } from "@/lib/webmcp/types";

export function isWebMcpAvailable(): boolean {
  if (typeof navigator === "undefined") return false;
  const nav = navigator as NavigatorWithModelContext;
  return typeof nav.modelContext?.registerTool === "function";
}

function getModelContext() {
  return (navigator as NavigatorWithModelContext).modelContext!;
}

function register(
  tool: ModelContextTool,
  signal: AbortSignal,
): void {
  getModelContext().registerTool(tool, { signal });
}

export function buildWebMcpTools(navigate?: NavigateFunction): ModelContextTool[] {
  const tools: ModelContextTool[] = [
    {
      name: "search_stations",
      title: "Search CP stations",
      description:
        "Search Portugal by Train stations by name or railway line. Returns slugs, paths, lines, and CP codes for matching stops.",
      inputSchema: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Substring to match station name or line (empty lists all, capped by limit).",
          },
          limit: {
            type: "integer",
            minimum: 1,
            maximum: 50,
            description: "Maximum results (default 20).",
          },
        },
      },
      annotations: { readOnlyHint: true },
      execute: async (input) => {
        const query = typeof input.query === "string" ? input.query : "";
        const limit = typeof input.limit === "number" ? input.limit : 20;
        return { stations: searchStations(query, limit) };
      },
    },
    {
      name: "get_station",
      title: "Get station details",
      description:
        "Look up one station by URL slug or exact name. Returns lines, coordinates, path, and CP departures code when available.",
      inputSchema: {
        type: "object",
        properties: {
          slugOrName: {
            type: "string",
            description: "Station slug (e.g. porto-campanha) or display name.",
          },
        },
        required: ["slugOrName"],
      },
      annotations: { readOnlyHint: true },
      execute: async (input) => {
        const slugOrName =
          typeof input.slugOrName === "string" ? input.slugOrName : "";
        return getStationDetails(slugOrName);
      },
    },
    {
      name: "get_departures",
      title: "Live train departures",
      description:
        "Fetch upcoming CP departures for a station using its travel-api code, or resolve the code from slug/station name.",
      inputSchema: {
        type: "object",
        properties: {
          cpCode: {
            type: "string",
            description: "CP travel-api code (e.g. 94-1008).",
          },
          slug: { type: "string", description: "Station URL slug." },
          stationName: { type: "string", description: "Exact station display name." },
          limit: {
            type: "integer",
            minimum: 1,
            maximum: 10,
            description: "Number of departures (default 3).",
          },
        },
      },
      annotations: { readOnlyHint: true },
      execute: async (input) =>
        getStationDepartures({
          cpCode: typeof input.cpCode === "string" ? input.cpCode : undefined,
          slug: typeof input.slug === "string" ? input.slug : undefined,
          stationName:
            typeof input.stationName === "string" ? input.stationName : undefined,
          limit: typeof input.limit === "number" ? input.limit : undefined,
        }),
    },
    {
      name: "get_community_rankings",
      title: "Community station rankings",
      description:
        "Return top community upvoted and downvoted stations from aggregated votes.",
      inputSchema: {
        type: "object",
        properties: {
          limit: {
            type: "integer",
            minimum: 1,
            maximum: 20,
            description: "How many stations per list (default 5).",
          },
        },
      },
      annotations: { readOnlyHint: true },
      execute: async (input) => {
        const limit = typeof input.limit === "number" ? input.limit : 5;
        return getCommunityRankings(limit);
      },
    },
  ];

  if (navigate) {
    tools.push({
      name: "navigate_to_station",
      title: "Open station page",
      description:
        "Navigate the browser to a station guide page (/stations/{slug}) so the user can view hotels, votes, and departures.",
      inputSchema: {
        type: "object",
        properties: {
          slug: { type: "string", description: "Station URL slug." },
        },
        required: ["slug"],
      },
      execute: async (input) => {
        const slug = typeof input.slug === "string" ? input.slug.trim() : "";
        const station = getStationDetails(slug);
        if ("error" in station) {
          return station;
        }
        navigate(`/stations/${station.slug}`);
        return { navigated: true, path: station.path };
      },
    });
  }

  return tools;
}

/** Register WebMCP tools; abort the controller to unregister. */
export function registerWebMcpTools(navigate?: NavigateFunction): AbortController {
  const controller = new AbortController();
  if (!isWebMcpAvailable()) {
    return controller;
  }

  const { signal } = controller;
  for (const tool of buildWebMcpTools(navigate)) {
    register(tool, signal);
  }

  return controller;
}
