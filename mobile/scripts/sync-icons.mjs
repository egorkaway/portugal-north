import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const sharp = require(path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../node_modules/sharp",
));

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../..");
const sourcePath = path.join(repoRoot, "public/icon-source.png");
const svgPath = path.join(repoRoot, "public/icon.svg");

const targets = [
  path.join(__dirname, "../assets/images/icon.png"),
  path.join(
    __dirname,
    "../ios/VeryStays/Images.xcassets/AppIcon.appiconset/App-Icon-1024x1024@1x.png",
  ),
  path.join(__dirname, "../assets/images/android-icon-foreground.png"),
];

const splashIconPath = path.join(__dirname, "../assets/images/splash-icon.png");

/** ~iOS app-icon corner proportion on a square splash logo. */
const SPLASH_CORNER_RADIUS_RATIO = 0.22;

function roundedMaskSvg(size, radius) {
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
      <rect width="${size}" height="${size}" rx="${radius}" ry="${radius}" fill="white"/>
    </svg>`,
  );
}

async function writeRoundedSplashPng(input, size, target) {
  const radius = Math.round(size * SPLASH_CORNER_RADIUS_RATIO);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  await sharp(input)
    .resize(size, size, { fit: "cover", position: "centre" })
    .composite([{ input: roundedMaskSvg(size, radius), blend: "dest-in" }])
    .png({ compressionLevel: 9 })
    .toFile(target);
  console.log(`Wrote ${path.relative(repoRoot, target)}`);
}

const splashImagesetTargets = [
  { file: "image.png", size: 200 },
  { file: "image@2x.png", size: 400 },
  { file: "image@3x.png", size: 600 },
];

async function writeSplashImageset(input) {
  const imagesetDir = path.join(
    __dirname,
    "../ios/VeryStays/Images.xcassets/SplashScreenLogo.imageset",
  );
  fs.mkdirSync(imagesetDir, { recursive: true });

  for (const { file, size } of splashImagesetTargets) {
    const target = path.join(imagesetDir, file);
    await writeRoundedSplashPng(input, size, target);
  }
}

async function fromRaster(input) {
  for (const target of targets) {
    fs.mkdirSync(path.dirname(target), { recursive: true });
    await sharp(input)
      .resize(1024, 1024, { fit: "cover", position: "centre" })
      .png({ compressionLevel: 9 })
      .toFile(target);
    console.log(`Wrote ${path.relative(repoRoot, target)}`);
  }

  await writeRoundedSplashPng(input, 1024, splashIconPath);

  await writeSplashImageset(input);

  const androidBg = path.join(__dirname, "../assets/images/android-icon-background.png");
  await sharp({
    create: {
      width: 1024,
      height: 1024,
      channels: 4,
      background: "#012841",
    },
  })
    .png()
    .toFile(androidBg);
  console.log(`Wrote ${path.relative(repoRoot, androidBg)}`);
}

async function fromSvg() {
  const { Resvg } = await import("@resvg/resvg-js");
  const svg = fs.readFileSync(svgPath, "utf8");
  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: 1024 },
    background: "#012841",
  });
  const png = resvg.render().asPng();
  const tmp = path.join(__dirname, "../assets/images/.icon-tmp.png");
  fs.writeFileSync(tmp, png);
  await fromRaster(tmp);
  fs.unlinkSync(tmp);
}

async function main() {
  if (fs.existsSync(sourcePath)) {
    await fromRaster(sourcePath);
  } else if (fs.existsSync(svgPath)) {
    await fromSvg();
  } else {
    console.error("Missing public/icon-source.png and public/icon.svg");
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
