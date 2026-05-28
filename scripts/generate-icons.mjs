#!/usr/bin/env node
/**
 * Generate PWA / favicon PNGs from public/icon-source.png (preferred) or public/icon.svg.
 * Run: npm run icons
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { Resvg } from "@resvg/resvg-js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const publicDir = path.join(root, "public");

const OUTPUTS = [
  [512, "logo.png"],
  [192, "pwa-192.png"],
  [180, "apple-touch-icon.png"],
  [32, "favicon-32.png"],
];

async function fromRaster(sourcePath) {
  for (const [size, outName] of OUTPUTS) {
    await sharp(sourcePath)
      .resize(size, size, { fit: "cover", position: "centre" })
      .png({ compressionLevel: 9 })
      .toFile(path.join(publicDir, outName));
    console.log(`Wrote ${outName} (${size}×${size}) from raster`);
  }

  await sharp(sourcePath)
    .resize(32, 32, { fit: "cover", position: "centre" })
    .toFile(path.join(publicDir, "favicon.ico"));
  console.log("Wrote favicon.ico (32×32) from raster");
}

function fromSvg(svgPath) {
  const svg = fs.readFileSync(svgPath, "utf8");
  for (const [size, outName] of OUTPUTS) {
    const resvg = new Resvg(svg, {
      fitTo: { mode: "width", value: size },
      background: "#345846",
    });
    fs.writeFileSync(path.join(publicDir, outName), resvg.render().asPng());
    console.log(`Wrote ${outName} (${size}×${size}) from SVG`);
  }
}

const rasterPath = path.join(publicDir, "icon-source.png");
const svgPath = path.join(publicDir, "icon.svg");

if (fs.existsSync(rasterPath)) {
  await fromRaster(rasterPath);
} else if (fs.existsSync(svgPath)) {
  fromSvg(svgPath);
} else {
  console.error("Missing public/icon-source.png and public/icon.svg");
  process.exit(1);
}
