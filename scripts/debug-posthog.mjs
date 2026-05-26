import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage();
const apiCalls = [];

page.on("request", (req) => {
  const url = req.url();
  if (!url.includes("i.posthog.com")) return;
  apiCalls.push({ url: url.split("?")[0], method: req.method() });
});

await page.goto("http://localhost:8080/");
await page.waitForTimeout(5000);

await page.goto("http://localhost:8080/stations/aveiro");
await page.waitForTimeout(3000);

await page.getByRole("button", { name: /upvote aveiro/i }).first().click();
await page.waitForTimeout(3000);

console.log("PostHog API calls:");
for (const call of apiCalls) {
  console.log(`  ${call.method} ${call.url}`);
}

const captureCalls = apiCalls.filter((c) => c.url.includes("/e") || c.url.includes("/batch"));
console.log("\nCapture/batch calls:", captureCalls.length);

await browser.close();
