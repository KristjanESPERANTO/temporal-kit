/**
 * temporal-kit - Boundary Operations Examples
 *
 * Demonstrates startOf() and endOf() functions for finding time boundaries.
 */

import { endOf, startOf, Temporal } from "../dist/polyfilled.js";

console.log("=== Start/End of Time Units ===\n");

const now = Temporal.PlainDateTime.from("2025-11-30T15:45:30.123456789");
console.log(`Current time: ${now}`);
console.log();

// Start of various units
console.log("--- Start Of ---");
console.log(`Start of day:   ${startOf(now, "day")}`);
console.log(`Start of week:  ${startOf(now, "week")} (Monday)`);
console.log(`Start of month: ${startOf(now, "month")}`);
console.log(`Start of year:  ${startOf(now, "year")}`);
console.log();

// End of various units
console.log("--- End Of ---");
console.log(`End of day:   ${endOf(now, "day")}`);
console.log(`End of week:  ${endOf(now, "week")} (Sunday)`);
console.log(`End of month: ${endOf(now, "month")}`);
console.log(`End of year:  ${endOf(now, "year")}`);
console.log();

// PlainDate boundaries
console.log("=== PlainDate Boundaries ===\n");

const date = Temporal.PlainDate.from("2025-11-30");
console.log(`Date: ${date} (${date.dayOfWeek === 6 ? "Saturday" : "?"})`);
console.log();

console.log("--- Start/End of Week ---");
console.log(`Start of week: ${startOf(date, "week")} (Monday)`);
console.log(`End of week:   ${endOf(date, "week")} (Sunday)`);
console.log();

console.log("--- Start/End of Month ---");
console.log(`Start of month: ${startOf(date, "month")}`);
console.log(`End of month:   ${endOf(date, "month")} (30 days in November)`);
console.log();

console.log("--- Start/End of Year ---");
console.log(`Start of year: ${startOf(date, "year")}`);
console.log(`End of year:   ${endOf(date, "year")}`);
console.log();

// ZonedDateTime boundaries
console.log("=== ZonedDateTime Boundaries ===\n");

const zoned = Temporal.ZonedDateTime.from("2025-11-30T15:45:30+01:00[Europe/Berlin]");
console.log(`Zoned time: ${zoned}`);
console.log();

console.log("Start of day (Berlin): ", startOf(zoned, "day").toString());
console.log("End of day (Berlin):   ", endOf(zoned, "day").toString());
console.log();

// Practical examples
console.log("=== Practical Examples ===\n");

// Business day range
console.log("--- Business Day Range ---");
const businessDay = Temporal.PlainDateTime.from("2025-12-15T10:30:00");
const dayStart = startOf(businessDay, "day");
const dayEnd = endOf(businessDay, "day");
console.log(`Business day: ${businessDay.toPlainDate()}`);
console.log(`  Opens at:  ${dayStart}`);
console.log(`  Closes at: ${dayEnd}`);
console.log();

// Monthly report period
console.log("--- Monthly Report Period ---");
const reportDate = Temporal.PlainDate.from("2025-11-15");
const monthStart = startOf(reportDate, "month");
const monthEnd = endOf(reportDate, "month");
console.log(`Report for: ${reportDate.toLocaleString("en", { month: "long", year: "numeric" })}`);
console.log(`  Period: ${monthStart} to ${monthEnd}`);
console.log();

// Weekly schedule
console.log("--- Weekly Schedule ---");
const scheduleDate = Temporal.PlainDate.from("2025-12-03"); // Wednesday
const weekStart = startOf(scheduleDate, "week");
const weekEnd = endOf(scheduleDate, "week");
console.log(`Week containing: ${scheduleDate}`);
console.log(`  Monday:    ${weekStart}`);
console.log(`  Wednesday: ${scheduleDate}`);
console.log(`  Sunday:    ${weekEnd}`);
console.log();

// Year-to-date
console.log("--- Year-to-Date Range ---");
const ytdDate = Temporal.PlainDate.from("2025-11-30");
const yearStart = startOf(ytdDate, "year");
const yearEnd = endOf(ytdDate, "year");
console.log(`Year-to-date from: ${yearStart}`);
console.log(`Current date:      ${ytdDate}`);
console.log(`Year ends:         ${yearEnd}`);
console.log();

// Quarter boundaries (using month logic)
console.log("--- Quarter Boundaries (Q4 2025) ---");
const q4Start = Temporal.PlainDate.from("2025-10-01");
const q4End = Temporal.PlainDate.from("2025-12-31");
console.log(`Q4 starts: ${q4Start}`);
console.log(`Q4 ends:   ${q4End}`);
console.log();

// Time range for analytics
console.log("--- Analytics Time Range ---");
const analyticsTime = Temporal.Now.plainDateTimeISO();
const todayStart = startOf(analyticsTime, "day");
const todayEnd = endOf(analyticsTime, "day");
console.log(`Analytics range for today:`);
console.log(`  From: ${todayStart}`);
console.log(`  To:   ${todayEnd}`);

console.log("\n✅ All boundary operations working!");
