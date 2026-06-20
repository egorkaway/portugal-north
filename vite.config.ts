import fs from "node:fs";
import path from "node:path";
import type { IncomingMessage, ServerResponse } from "node:http";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";
import { buildSitemapXml } from "./src/lib/sitemap";
import { createBuildVersion } from "./scripts/buildVersion";

async function handleApiCatalogDev(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<boolean> {
  if (req.url !== "/.well-known/api-catalog") return false;

  const { buildApiCatalogLinkset } = await import("./server/lib/apiCatalog.ts");
  res.statusCode = 200;
  res.setHeader(
    "Content-Type",
    'application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727"',
  );
  res.end(JSON.stringify(buildApiCatalogLinkset(siteUrl), null, 2));
  return true;
}

async function handleMcpServerCardDev(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<boolean> {
  if (req.url !== "/.well-known/mcp/server-card.json") return false;

  const { buildMcpServerCard } = await import("./server/lib/mcpServerCard.ts");
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.end(JSON.stringify(buildMcpServerCard(siteUrl), null, 2));
  return true;
}

async function handleAgentSkillsIndexDev(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<boolean> {
  if (req.url !== "/.well-known/agent-skills/index.json") return false;

  const { buildAgentSkillsIndex } = await import("./server/lib/agentSkillsIndex.ts");
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.end(JSON.stringify(buildAgentSkillsIndex(siteUrl), null, 2));
  return true;
}

async function handleDeparturesDevApi(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<boolean> {
  if (!req.url?.startsWith("/api/departures")) return false;

  const url = new URL(req.url, "http://localhost");
  const code = url.searchParams.get("code") ?? "";
  const limitRaw = Number(url.searchParams.get("limit") ?? "3");
  const limit = Number.isFinite(limitRaw) ? Math.min(10, Math.max(1, limitRaw)) : 3;

  try {
    const { fetchCpStationDepartures } = await import("./server/lib/cpDeparturesServer.ts");
    const departures = await fetchCpStationDepartures(code, limit);
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ departures, configured: true }));
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown";
    const status = message === "invalid_station_code" ? 400 : 502;
    res.statusCode = status;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: message, departures: [], configured: true }));
  }

  return true;
}

function writeVersionJson(filePath: string, bump = false) {
  fs.writeFileSync(
    filePath,
    `${JSON.stringify(createBuildVersion({ bump }), null, 2)}\n`,
  );
}

const siteUrl = (process.env.VITE_SITE_URL ?? "https://www.verystays.com").replace(
  /\/$/,
  "",
);

function writeSitemap(filePath: string) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, buildSitemapXml(siteUrl));
}

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    "import.meta.env.VITE_SITE_URL": JSON.stringify(siteUrl),
  },
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "favicon-32.png",
        "favicon.ico",
        "favicon-32.png",
        "apple-touch-icon.png",
        "pwa-192.png",
        "logo.png",
        "icon.svg",
      ],
      manifest: {
        name: "Portugal by Train",
        short_name: "VeryStays",
        description:
          "CP train stations across Portugal with budget hotels nearby and community ratings.",
        theme_color: "#012841",
        background_color: "#f5f7f8",
        display: "standalone",
        scope: "/",
        start_url: "/",
        lang: "en",
        icons: [
          {
            src: "pwa-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "logo.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "logo.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "apple-touch-icon.png",
            sizes: "180x180",
            type: "image/png",
          },
        ],
      },
      workbox: {
        navigateFallback: "/index.html",
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        globPatterns: ["**/*.{js,css,html,ico,png,svg,jpg,webp,woff2,txt,xml}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/pagead2\.googlesyndication\.com\/.*/i,
            handler: "NetworkOnly",
          },
          {
            urlPattern: /\/api\//i,
            handler: "NetworkOnly",
          },
        ],
      },
      devOptions: {
        enabled: false,
      },
    }),
    {
      name: "departures-dev-api",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          void handleApiCatalogDev(req, res)
            .then((handled) => (handled ? true : handleMcpServerCardDev(req, res)))
            .then((handled) => (handled ? true : handleAgentSkillsIndexDev(req, res)))
            .then((handled) => (handled ? true : handleDeparturesDevApi(req, res)))
            .then((handled) => {
              if (!handled) next();
            });
        });
      },
    },
    {
      name: "site-url",
      buildStart() {
        writeSitemap(path.resolve(__dirname, "public/sitemap.xml"));
        writeVersionJson(path.resolve(__dirname, "public/version.json"));
      },
      transformIndexHtml(html) {
        return html.replaceAll("__SITE_URL__", siteUrl);
      },
      closeBundle() {
        if (!siteUrl) return;
        const outDir = path.resolve(__dirname, "dist");
        writeSitemap(path.join(outDir, "sitemap.xml"));
        const robotsPath = path.join(outDir, "robots.txt");
        if (fs.existsSync(robotsPath)) {
          const content = fs.readFileSync(robotsPath, "utf8").replaceAll("__SITE_URL__", siteUrl);
          fs.writeFileSync(robotsPath, content);
        }
        writeVersionJson(path.join(outDir, "version.json"), true);
        writeVersionJson(path.resolve(__dirname, "public/version.json"), false);
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
});
