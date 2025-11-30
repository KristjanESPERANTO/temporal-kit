/**
 * temporal-kit - Arithmetic Operations Examples
 * 
 * Demonstrates add() and subtract() functions for date/time arithmetic.
 */

import { Temporal } from "../dist/polyfilled.js";
import { add, subtract } from "../dist/polyfilled.js";

console.log("=== Date Arithmetic ===\n");

// Basic date arithmetic
const today = Temporal.PlainDate.from("2025-11-30");
console.log(`Starting date: ${today}`);
console.log();

// Adding durations
console.log("--- Adding Durations ---");
console.log(`Add 5 days: ${add(today, { days: 5 })}`);
console.log(`Add 2 weeks: ${add(today, { weeks: 2 })}`);
console.log(`Add 3 months: ${add(today, { months: 3 })}`);
console.log(`Add 1 year: ${add(today, { years: 1 })}`);
console.log();

// Subtracting durations
console.log("--- Subtracting Durations ---");
console.log(`Subtract 5 days: ${subtract(today, { days: 5 })}`);
console.log(`Subtract 2 weeks: ${subtract(today, { weeks: 2 })}`);
console.log(`Subtract 3 months: ${subtract(today, { months: 3 })}`);
console.log(`Subtract 1 year: ${subtract(today, { years: 1 })}`);
console.log();

// Combined operations
console.log("--- Combined Operations ---");
const combined = add(today, { months: 2, days: 15 });
console.log(`Add 2 months and 15 days: ${combined}`);

const deadline = subtract(today, { days: 7 });
console.log(`Deadline (7 days ago): ${deadline}`);
console.log();

// DateTime arithmetic
console.log("=== DateTime Arithmetic ===\n");

const now = Temporal.Now.plainDateTimeISO();
console.log(`Current time: ${now}`);
console.log();

console.log("--- Time Operations ---");
console.log(`Add 3 hours: ${add(now, { hours: 3 })}`);
console.log(`Add 30 minutes: ${add(now, { minutes: 30 })}`);
console.log(`Subtract 2 hours: ${subtract(now, { hours: 2 })}`);
console.log();

console.log("--- Mixed Date & Time ---");
const future = add(now, { days: 1, hours: 6, minutes: 30 });
console.log(`Tomorrow + 6.5 hours: ${future}`);
console.log();

// ZonedDateTime arithmetic (respects DST)
console.log("=== ZonedDateTime Arithmetic ===\n");

const zoned = Temporal.Now.zonedDateTimeISO("Europe/Berlin");
console.log(`Current (Berlin): ${zoned}`);
console.log();

const zonedFuture = add(zoned, { days: 7 });
console.log(`7 days later: ${zonedFuture}`);

const zonedPast = subtract(zoned, { months: 1 });
console.log(`1 month ago: ${zonedPast}`);
console.log();

// Practical examples
console.log("=== Practical Examples ===\n");

// Project timeline
const projectStart = Temporal.PlainDate.from("2025-12-01");
const phase1End = add(projectStart, { weeks: 2 });
const phase2End = add(phase1End, { weeks: 3 });
const projectEnd = add(phase2End, { weeks: 2 });

console.log("Project Timeline:");
console.log(`  Start: ${projectStart}`);
console.log(`  Phase 1 ends: ${phase1End} (2 weeks)`);
console.log(`  Phase 2 ends: ${phase2End} (3 weeks)`);
console.log(`  Project ends: ${projectEnd} (2 weeks)`);
console.log();

// Meeting scheduler
const meeting = Temporal.PlainDateTime.from("2025-12-15T14:00:00");
const reminderTime = subtract(meeting, { hours: 24 });
const followUpTime = add(meeting, { days: 3 });

console.log("Meeting Schedule:");
console.log(`  Meeting: ${meeting}`);
console.log(`  Reminder (24h before): ${reminderTime}`);
console.log(`  Follow-up (3 days after): ${followUpTime}`);
console.log();

// Age calculation
const birthday = Temporal.PlainDate.from("1990-03-15");
const nextBirthday = add(birthday, { years: 35 });
console.log(`Birthday: ${birthday}`);
console.log(`35th birthday: ${nextBirthday}`);

console.log("\n✅ All arithmetic operations working!");
