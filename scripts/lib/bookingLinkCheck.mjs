/** Validate Booking.com property URLs (requires Playwright + Chromium). */

const NOT_FOUND_TEXT =
  /page not found|couldn't find|can't find|cannot find|no longer available|property.*not available|doesn't exist|404 error|sorry.*can't find|this property is no longer|we can't find/i;

const GENERIC_BOOKING_TITLE =
  /^Booking\.com(?: Online Hotel Reservations| reservas de hot[eé]is on-line)?$/i;

const HOTEL_PAGE_BODY =
  /select (your )?dates|check availability|see availability|search\s*$|check-in date|reserve now|book now/i;

export function isDirectBookingHotelUrl(url) {
  try {
    const { hostname, pathname } = new URL(url);
    return /(^|\.)booking\.com$/i.test(hostname) && /\/hotel\//i.test(pathname);
  } catch {
    return false;
  }
}

export function isBookingSearchUrl(url) {
  try {
    const { hostname, pathname } = new URL(url);
    return /(^|\.)booking\.com$/i.test(hostname) && /searchresults/i.test(pathname);
  } catch {
    return false;
  }
}

/**
 * @param {string} title
 * @param {string} body
 * @param {string} finalUrl
 */
export function classifyBookingHotelPage(title, body, finalUrl) {
  if (!isDirectBookingHotelUrl(finalUrl)) {
    return { ok: false, reason: "redirected_off_hotel_path" };
  }

  const combined = `${title}\n${body.slice(0, 8000)}`;
  if (NOT_FOUND_TEXT.test(combined)) {
    return { ok: false, reason: "page_not_found_text" };
  }

  if (GENERIC_BOOKING_TITLE.test(title.trim())) {
    return { ok: false, reason: "generic_booking_title" };
  }

  if (title.length > 20 && title.includes(",")) {
    return { ok: true, reason: "descriptive_title" };
  }

  if (
    title.length > 15 &&
    /hotel|hostel|guest|apart|resid|aloj|pens[aã]o|inn|suites|rooms|house|lodge|quinta|pousada/i.test(
      title,
    )
  ) {
    return { ok: true, reason: "property_title" };
  }

  if (HOTEL_PAGE_BODY.test(body.slice(0, 12000))) {
    return { ok: true, reason: "hotel_page_content" };
  }

  return { ok: false, reason: "ambiguous_page" };
}

/**
 * @param {import('@playwright/test').Page} page
 * @param {string} url
 */
export async function checkBookingHotelUrl(page, url) {
  if (!isDirectBookingHotelUrl(url)) {
    return { ok: true, skipped: true, reason: "not_direct_hotel_url", url };
  }

  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45_000 });
    await page.waitForTimeout(2500);

    const title = await page.title();
    const body = await page.locator("body").innerText().catch(() => "");
    const finalUrl = page.url();
    const result = classifyBookingHotelPage(title, body, finalUrl);

    return {
      ...result,
      url,
      finalUrl,
      title: title.slice(0, 160),
    };
  } catch (error) {
    return {
      ok: false,
      reason: "navigation_error",
      url,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * @returns {Promise<import('@playwright/test').Browser>}
 */
export async function launchBookingCheckerBrowser() {
  const { chromium } = await import("@playwright/test");
  return chromium.launch({ headless: true });
}
