/**
 * Comparison Examples
 *
 * Demonstrates date/time comparison functions.
 *
 * Run with: node examples/04-comparisons.js
 */

import { isAfter, isBefore, isSame, max, min } from "../dist/polyfilled.js";

console.log("=== Date Comparisons ===\n");

const today = Temporal.Now.plainDateISO();
const yesterday = today.subtract({ days: 1 });
const tomorrow = today.add({ days: 1 });

console.log("Dates:");
console.log("Yesterday:", yesterday.toString());
console.log("Today:    ", today.toString());
console.log("Tomorrow: ", tomorrow.toString());
console.log();

// Example 1: Basic Comparisons
console.log("--- Basic Comparisons ---");
console.log("isBefore(yesterday, today):", isBefore(yesterday, today)); // true
console.log("isAfter(tomorrow, today):", isAfter(tomorrow, today)); // true
console.log("isSame(today, today):", isSame(today, today)); // true
console.log("isBefore(today, yesterday):", isBefore(today, yesterday)); // false
console.log();

// Example 2: Finding Min/Max
console.log("--- Min/Max ---");
const dates = [yesterday, tomorrow, today];
console.log(
  "Dates:",
  dates.map((d) => d.toString()),
);
console.log("Min (earliest):", min(dates).toString()); // yesterday
console.log("Max (latest):  ", max(dates).toString()); // tomorrow
console.log();

// Example 3: Practical Use Cases
console.log("--- Practical Examples ---");

// Check if event is upcoming
const eventDate = Temporal.PlainDate.from("2025-12-25");
const isUpcoming = isAfter(eventDate, today);
console.log(`Christmas (${eventDate}) is upcoming:`, isUpcoming);

// Sort dates
const unsortedDates = [
  Temporal.PlainDate.from("2025-06-15"),
  Temporal.PlainDate.from("2025-01-01"),
  Temporal.PlainDate.from("2025-12-31"),
  Temporal.PlainDate.from("2025-03-20"),
];
const sortedDates = [...unsortedDates].sort((a, b) =>
  isBefore(a, b) ? -1 : isAfter(a, b) ? 1 : 0,
);
console.log("Sorted dates:", sortedDates.map((d) => d.toString()).join(", "));
console.log();

// Example 4: Working with DateTimes
console.log("--- DateTime Comparisons ---");
const now = Temporal.Now.plainDateTimeISO();
const oneHourAgo = now.subtract({ hours: 1 });
const oneHourLater = now.add({ hours: 1 });

console.log("One hour ago: ", oneHourAgo.toString());
console.log("Now:          ", now.toString());
console.log("One hour later:", oneHourLater.toString());
console.log("Is one hour ago before now?", isBefore(oneHourAgo, now));
console.log();

console.log("✅ All comparison functions working!");
