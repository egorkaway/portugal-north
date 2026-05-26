import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage();

page.on("console", (msg) => {
  if (msg.text().toLowerCase().includes("posthog")) {
    console.log("[browser]", msg.type(), msg.text());
  }
});

page.on("request", (req) => {
  const url = req.url();
  if (url.includes("i.posthog.com") && req.method() === "POST" && !url.includes("/flags")) {
    console.log("[POST]", url, req.postData()?.slice(0, 200) ?? "(no body)");
  }
});

await page.goto("http://localhost:8080/");
await page.waitForTimeout(8000);

const state = await page.evaluate(() => ({
  loaded: Boolean(window.posthog?.__loaded),
  persistence: window.posthog?.config?.persistence,
  optOut: window.posthog?.has_opted_out_capturing?.(),
}));

console.log("window.posthog state:", state);

await browser.close();
