/**
 * Date Arithmetic Examples
 * 
 * Demonstrates adding and subtracting durations.
 * 
 * Run with: node examples/05-arithmetic.js
 */

import { isPlainDate } from '../dist/polyfilled.js';

// 🔜 Coming soon
// import { add, subtract } from '../dist/polyfilled.js';

console.log('=== Date Arithmetic (Coming Soon) ===\n');

const start = Temporal.PlainDate.from('2025-11-30');

console.log('Starting date:', start.toString());
console.log();

// Example 1: Simple Additions
console.log('--- Adding Time ---');
// console.log('Add 1 day:', add(start, { days: 1 }).toString());
// console.log('Add 1 week:', add(start, { weeks: 1 }).toString());
// console.log('Add 1 month:', add(start, { months: 1 }).toString());
// console.log('Add 1 year:', add(start, { years: 1 }).toString());
console.log('⏳ Functions coming soon...\n');

// Example 2: Complex Durations
console.log('--- Complex Durations ---');
// console.log('Add 2 weeks + 3 days:', add(start, { weeks: 2, days: 3 }).toString());
// console.log('Add 1 year - 2 months:', subtract(add(start, { years: 1 }), { months: 2 }).toString());
console.log('⏳ Functions coming soon...\n');

// Example 3: Time Arithmetic on DateTime
console.log('--- DateTime Arithmetic ---');
const now = Temporal.Now.plainDateTimeISO();
console.log('Now:', now.toString());
// console.log('In 2 hours:', add(now, { hours: 2 }).toString());
// console.log('30 minutes ago:', subtract(now, { minutes: 30 }).toString());
console.log('⏳ Functions coming soon...\n');

// Example 4: Timezone-Aware Arithmetic
console.log('--- Timezone-Aware (ZonedDateTime) ---');
const zonedNow = Temporal.Now.zonedDateTimeISO('Europe/Berlin');
console.log('Zoned now:', zonedNow.toString());
// Note: add() handles DST transitions correctly
// console.log('Add 1 day (calendar):', add(zonedNow, { days: 1 }).toString());
// console.log('Add 24 hours (duration):', add(zonedNow, { hours: 24 }).toString());
console.log('⏳ DST-aware arithmetic coming soon...\n');

console.log('💡 Tip: Use native .add()/.subtract() methods for now');
console.log('Example:', start.add({ days: 7 }).toString());
