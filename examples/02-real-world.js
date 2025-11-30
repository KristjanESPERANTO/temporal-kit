/**
 * Real-World Usage: Current Time & User Timezone
 * 
 * Demonstrates practical patterns for working with user's current time and timezone.
 * Common use cases: displaying local times, scheduling, relative time calculations.
 * 
 * Run with: node examples/02-real-world.js
 */

import { isPlainDate, isZonedDateTime, isInstant } from '../dist/polyfilled.js';

console.log('=== Real-World Example: Working with Current Time ===\n');

// Get current time in different representations
const nowInstant = Temporal.Now.instant();
const nowZoned = Temporal.Now.zonedDateTimeISO();
const today = Temporal.Now.plainDateISO();

console.log('1. Current Moment (Instant):');
console.log('   Instant:', nowInstant.toString());
console.log('   isInstant:', isInstant(nowInstant));
console.log('   Epoch milliseconds:', nowInstant.epochMilliseconds);
console.log();

console.log('2. Current Time in System Timezone:');
console.log('   ZonedDateTime:', nowZoned.toString());
console.log('   Timezone:', nowZoned.timeZoneId);
console.log('   Offset:', nowZoned.offset);
console.log('   isZonedDateTime:', isZonedDateTime(nowZoned));
console.log();

console.log('3. Today\'s Date (no time):');
console.log('   PlainDate:', today.toString());
console.log('   isPlainDate:', isPlainDate(today));
console.log('   Day of week:', today.dayOfWeek, '(1=Monday, 7=Sunday)');
console.log('   Week number:', today.weekOfYear);
console.log();

// Common pattern: Get time in different timezone
const nowInTokyo = nowInstant.toZonedDateTimeISO('Asia/Tokyo');
const nowInNewYork = nowInstant.toZonedDateTimeISO('America/New_York');

console.log('4. Same Moment in Different Timezones:');
console.log('   Tokyo:', nowInTokyo.toString());
console.log('   New York:', nowInNewYork.toString());
console.log('   Time difference:', nowInTokyo.hour - nowInNewYork.hour, 'hours');
console.log();

// Common pattern: Working with dates relative to today
const tomorrow = today.add({ days: 1 });
const nextWeek = today.add({ weeks: 1 });
const nextMonth = today.add({ months: 1 });

console.log('5. Relative Dates:');
console.log('   Today:', today.toString());
console.log('   Tomorrow:', tomorrow.toString());
console.log('   Next week:', nextWeek.toString());
console.log('   Next month:', nextMonth.toString());
console.log();

console.log('✅ Real-world patterns demonstrated!');
