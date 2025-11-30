/**
 * Comparison Examples
 * 
 * Demonstrates date/time comparison functions.
 * 
 * Run with: node examples/04-comparisons.js
 */

import { isPlainDate, isZonedDateTime } from '../dist/polyfilled.js';

// 🔜 Coming soon - these functions are not yet implemented
// import { isBefore, isAfter, isSame, min, max } from '../dist/polyfilled.js';

console.log('=== Date Comparisons (Coming Soon) ===\n');

const today = Temporal.Now.plainDateISO();
const yesterday = today.subtract({ days: 1 });
const tomorrow = today.add({ days: 1 });

console.log('Dates:');
console.log('Yesterday:', yesterday.toString());
console.log('Today:    ', today.toString());
console.log('Tomorrow: ', tomorrow.toString());
console.log();

// Example 1: Basic Comparisons
console.log('--- Basic Comparisons ---');
// console.log('isBefore(yesterday, today):', isBefore(yesterday, today)); // true
// console.log('isAfter(tomorrow, today):', isAfter(tomorrow, today)); // true
// console.log('isSame(today, today):', isSame(today, today)); // true
console.log('⏳ Functions coming soon...\n');

// Example 2: Finding Min/Max
console.log('--- Min/Max ---');
const dates = [yesterday, tomorrow, today];
// console.log('Dates:', dates.map(d => d.toString()));
// console.log('Min:', min(dates).toString()); // yesterday
// console.log('Max:', max(dates).toString()); // tomorrow
console.log('⏳ Functions coming soon...\n');

// Example 3: Comparing Different Types
console.log('--- Cross-Type Comparisons ---');
const plainDate = Temporal.PlainDate.from('2025-11-30');
const dateTime = Temporal.PlainDateTime.from('2025-11-30T15:30:00');
const zoned = Temporal.ZonedDateTime.from('2025-11-30T15:30:00+01:00[Europe/Berlin]');

console.log('PlainDate:', plainDate.toString());
console.log('DateTime:', dateTime.toString());
console.log('Zoned:', zoned.toString());
console.log();

// Note: Temporal Kit requires same types for comparison (type-safe)
// console.log('Same day?', isSame(plainDate, dateTime, 'day')); // true
// console.log('Same instant?', isSame(dateTime, zoned, 'instant')); // depends on timezone
console.log('⏳ Type-safe comparisons coming soon...\n');

console.log('💡 Tip: Use native Temporal.*.compare() for now');
console.log('Example:', Temporal.PlainDate.compare(yesterday, today)); // -1 (yesterday < today)
