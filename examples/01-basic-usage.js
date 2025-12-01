/**
 * Basic Usage Examples
 *
 * This file demonstrates the fundamental patterns and API design
 * of Temporal Kit, even though most functions are not yet implemented.
 *
 * Run with: node examples/01-basic-usage.js
 */

// Example 1: Type Guards (✅ Already implemented)
import { isPlainDate, isPlainDateTime, isZonedDateTime } from "../dist/polyfilled.js";

const date = Temporal.PlainDate.from("2025-11-30");
const dateTime = Temporal.PlainDateTime.from("2025-11-30T15:30:00");
const zoned = Temporal.Now.zonedDateTimeISO();

console.log("=== Type Guards ===");
console.log("isPlainDate(date):", isPlainDate(date)); // true
console.log("isPlainDateTime(dateTime):", isPlainDateTime(dateTime)); // true
console.log("isZonedDateTime(zoned):", isZonedDateTime(zoned)); // true
console.log("isPlainDate(dateTime):", isPlainDate(dateTime)); // false
console.log();

// Example 2: Comparison Functions (🔜 Coming soon)
// import { isBefore, isAfter, isSame } from '../dist/index.js';
//
// const today = Temporal.Now.plainDateISO();
// const tomorrow = today.add({ days: 1 });
//
// console.log('=== Comparisons ===');
// console.log('isBefore(today, tomorrow):', isBefore(today, tomorrow)); // true
// console.log('isAfter(tomorrow, today):', isAfter(tomorrow, today)); // true
// console.log('isSame(today, today):', isSame(today, today)); // true
// console.log();

// Example 3: Date Arithmetic (🔜 Coming soon)
// import { add, subtract } from '../dist/index.js';
//
// const start = Temporal.PlainDate.from('2025-11-30');
// console.log('=== Arithmetic ===');
// console.log('Original:', start.toString());
// console.log('Add 7 days:', add(start, { days: 7 }).toString());
// console.log('Subtract 1 month:', subtract(start, { months: 1 }).toString());
// console.log();

// Example 4: Start/End of Period (🔜 Coming soon)
// import { startOf, endOf } from '../dist/index.js';
//
// const now = Temporal.Now.zonedDateTimeISO();
// console.log('=== Start/End of Period ===');
// console.log('Now:', now.toString());
// console.log('Start of day:', startOf(now, 'day').toString());
// console.log('End of day:', endOf(now, 'day').toString());
// console.log('Start of month:', startOf(now, 'month').toString());
// console.log();

// Example 5: Functional Composition (🔜 Coming soon)
// import { pipe } from '../dist/index.js';
//
// const result = pipe(
//   Temporal.Now.plainDateISO(),
//   d => startOf(d, 'month'),
//   d => add(d, { weeks: 2 }),
//   d => endOf(d, 'week')
// );
//
// console.log('=== Functional Composition ===');
// console.log('Piped result:', result.toString());

console.log("✅ Basic examples completed!");
console.log("🔜 More examples coming as features are implemented.");
