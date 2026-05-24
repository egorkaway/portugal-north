import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

const siteUrl = (process.env.VITE_SITE_URL ?? "https://www.verystays.com").replace(
  /\/$/,
  "",
);

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
      transformIndexHtml(html) {
        return html.replaceAll("__SITE_URL__", siteUrl);
      },
      closeBundle() {
        if (!siteUrl) return;
        const outDir = path.resolve(__dirname, "dist");
        for (const file of ["robots.txt", "sitemap.xml"]) {
          const filePath = path.join(outDir, file);
          if (!fs.existsSync(filePath)) continue;
          const content = fs.readFileSync(filePath, "utf8").replaceAll("__SITE_URL__", siteUrl);
          fs.writeFileSync(filePath, content);
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
