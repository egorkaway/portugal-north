/**
 * Shared snapshot calendar: nine fixed open dates per year (Europe/Lisbon).
 *
 * Used for airport connection maps and reliability score archives.
 * On each open date the previous period’s artifacts are frozen.
 */

export const PERIOD_TIMEZONE = "Europe/Lisbon";

/** Month/day anchors (1-based month). Same calendar days every year. */
export const PERIOD_ANCHORS = [
  { month: 1, day: 1 },
  { month: 2, day: 7 },
  { month: 3, day: 16 },
  { month: 4, day: 22 },
  { month: 5, day: 29 },
  { month: 7, day: 5 },
  { month: 8, day: 11 },
  { month: 9, day: 17 },
  { month: 10, day: 24 },
];

/** @param {Date | string | number} [date] */
export function lisbonDateString(date = new Date()) {
  if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date;
  }
  const d = date instanceof Date ? date : new Date(date);
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: PERIOD_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

function pad2(value) {
  return String(value).padStart(2, "0");
}

/** @param {number} year @param {{ month: number, day: number }} anchor */
export function openDateForYear(year, anchor) {
  return `${year}-${pad2(anchor.month)}-${pad2(anchor.day)}`;
}

/** @param {number} year */
export function periodOpenDates(year) {
  return PERIOD_ANCHORS.map((anchor) => openDateForYear(year, anchor));
}

/**
 * @param {Date | string} [date]
 * @returns {{ id: string, start: string, endExclusive: string }}
 */
export function periodContaining(date = new Date()) {
  const dateStr = lisbonDateString(date);
  const year = Number.parseInt(dateStr.slice(0, 4), 10);
  /** @type {string[]} */
  const opens = [];
  for (const y of [year - 1, year, year + 1]) {
    for (const anchor of PERIOD_ANCHORS) {
      opens.push(openDateForYear(y, anchor));
    }
  }
  opens.sort();

  let start = opens[0];
  let endExclusive = opens[1];
  for (let i = 0; i < opens.length; i += 1) {
    if (opens[i] <= dateStr) {
      start = opens[i];
      endExclusive = opens[i + 1] ?? openDateForYear(year + 2, PERIOD_ANCHORS[0]);
    } else {
      break;
    }
  }

  return { id: start, start, endExclusive };
}

/**
 * @param {{ id: string, start: string, endExclusive: string }} period
 * @param {{ id: string }[]} frozenPeriods
 */
export function isPeriodFrozen(period, frozenPeriods) {
  return frozenPeriods.some((entry) => entry.id === period.id);
}

/**
 * Empty periods index for bootstrap.
 * @param {Date | string} [asOf]
 */
export function buildEmptyPeriodsIndex(asOf = new Date()) {
  const period = periodContaining(asOf);
  return {
    timezone: PERIOD_TIMEZONE,
    currentPeriodId: period.id,
    currentPeriodStart: period.start,
    currentPeriodEndExclusive: period.endExclusive,
    periods: /** @type {{ id: string, start: string, endExclusive: string, frozenAt: string }[]} */ ([]),
  };
}
