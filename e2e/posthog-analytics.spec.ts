import { expect, test } from "@playwright/test";

async function waitForPostHogCapture(
  page: import("@playwright/test").Page,
  timeoutMs = 15_000,
) {
  return page.waitForResponse(
    (response) => {
      const url = response.url();
      return (
        url.includes("i.posthog.com") &&
        (url.includes("/e/") || url.includes("/e?") || url.includes("/batch")) &&
        response.request().method() === "POST" &&
        response.status() < 400
      );
    },
    { timeout: timeoutMs },
  );
}

test.describe("PostHog analytics (local)", () => {
  test("sends pageview, station_viewed, and vote_cast", async ({ page }) => {
    await page.goto("/");
    await waitForPostHogCapture(page);

    await page.goto("/stations/aveiro");
    await waitForPostHogCapture(page);

    const upvote = page.getByRole("button", { name: /upvote aveiro/i }).first();
    await upvote.click();
    await waitForPostHogCapture(page);
  });
});
