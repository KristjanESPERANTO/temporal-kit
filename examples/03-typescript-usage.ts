/**
 * TypeScript Usage Example
 *
 * Demonstrates TypeScript integration with full type safety.
 *
 * Compile: tsc examples/03-typescript-usage.ts --outDir examples/dist
 * Run: node examples/dist/03-typescript-usage.js
 */

import type { DateLike, PlainDate, ZonedDateTime } from "../dist/polyfilled.js";
import { isDateLike, isPlainDate, isZonedDateTime, Temporal } from "../dist/polyfilled.js";

// Type-safe function that accepts any DateLike
function processDate(date: DateLike): string {
  if (isPlainDate(date)) {
    // TypeScript knows this is PlainDate
    return `Plain date: ${date.year}-${date.month}-${date.day}`;
  }

  if (isZonedDateTime(date)) {
    // TypeScript knows this is ZonedDateTime
    return `Zoned: ${date.toString()} in ${date.timeZoneId}`;
  }

  // PlainDateTime case
  return `DateTime: ${date.toString()}`;
}

// Examples
const plainDate: PlainDate = Temporal.PlainDate.from("2025-11-30");
const zonedDate: ZonedDateTime = Temporal.Now.zonedDateTimeISO("Europe/Berlin");

console.log("=== TypeScript Type Safety ===");
console.log(processDate(plainDate));
console.log(processDate(zonedDate));
console.log();

// Type guards enable safe narrowing
function getYear(date: unknown): number | null {
  if (isDateLike(date)) {
    // TypeScript knows date has a 'year' property
    return date.year;
  }
  return null;
}

console.log("Year from plainDate:", getYear(plainDate)); // 2025
console.log("Year from invalid input:", getYear("not a date"), "(correctly rejected)"); // null
console.log();

console.log("✅ TypeScript types work perfectly!");
