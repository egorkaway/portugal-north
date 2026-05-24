import fs from "node:fs";
import path from "node:path";
import type { IncomingMessage, ServerResponse } from "node:http";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { buildSitemapXml } from "./src/lib/sitemap";

async function handleApiCatalogDev(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<boolean> {
  if (req.url !== "/.well-known/api-catalog") return false;

  const { buildApiCatalogLinkset } = await import("./api/lib/apiCatalog.ts");
  res.statusCode = 200;
  res.setHeader(
    "Content-Type",
    'application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727"',
  );
  res.end(JSON.stringify(buildApiCatalogLinkset(siteUrl), null, 2));
  return true;
}

async function handleDeparturesDevApi(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<boolean> {
  if (!req.url?.startsWith("/api/departures")) return false;

  const url = new URL(req.url, "http://localhost");
  const code = url.searchParams.get("code") ?? "";
  const limit = Number(url.searchParams.get("limit") ?? "3");

  try {
    const { fetchCpStationDepartures } = await import("./api/lib/cpDeparturesServer.ts");
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
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    {
      name: "departures-dev-api",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          void handleApiCatalogDev(req, res)
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
