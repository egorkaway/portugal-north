import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { buildSitemapXml } from "./src/lib/sitemap";

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
