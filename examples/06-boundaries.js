/**
 * Start/End of Period Examples
 * 
 * Demonstrates finding boundaries of time periods.
 * 
 * Run with: node examples/06-boundaries.js
 */

import { isZonedDateTime } from '../dist/polyfilled.js';

// 🔜 Coming soon
// import { startOf, endOf } from '../dist/polyfilled.js';

console.log('=== Period Boundaries (Coming Soon) ===\n');

const now = Temporal.Now.zonedDateTimeISO('Europe/Berlin');
console.log('Current time:', now.toString());
console.log();

// Example 1: Day Boundaries
console.log('--- Day Boundaries ---');
// console.log('Start of day:', startOf(now, 'day').toString());
// console.log('End of day:', endOf(now, 'day').toString());
console.log('⏳ Functions coming soon...\n');

// Example 2: Week Boundaries
console.log('--- Week Boundaries ---');
// ISO 8601: Monday = start of week (default)
// console.log('Start of week:', startOf(now, 'week').toString());
// console.log('End of week:', endOf(now, 'week').toString());
console.log('⏳ Functions coming soon...\n');

// Example 3: Month Boundaries
console.log('--- Month Boundaries ---');
// console.log('Start of month:', startOf(now, 'month').toString());
// console.log('End of month:', endOf(now, 'month').toString());
console.log('⏳ Functions coming soon...\n');

// Example 4: Year Boundaries
console.log('--- Year Boundaries ---');
// console.log('Start of year:', startOf(now, 'year').toString());
// console.log('End of year:', endOf(now, 'year').toString());
console.log('⏳ Functions coming soon...\n');

// Example 5: Time Boundaries
console.log('--- Time Boundaries ---');
// console.log('Start of hour:', startOf(now, 'hour').toString());
// console.log('Start of minute:', startOf(now, 'minute').toString());
// console.log('End of hour:', endOf(now, 'hour').toString());
console.log('⏳ Functions coming soon...\n');

// Example 6: PlainDate vs ZonedDateTime
console.log('--- Different Types ---');
const plainDate = Temporal.Now.plainDateISO();
console.log('PlainDate:', plainDate.toString());
// console.log('Start of month (PlainDate):', startOf(plainDate, 'month').toString());

const zonedDate = Temporal.Now.zonedDateTimeISO('America/New_York');
console.log('ZonedDateTime:', zonedDate.toString());
// Note: startOf on ZonedDateTime handles DST correctly
// console.log('Start of day (Zoned):', startOf(zonedDate, 'day').toString());
console.log('⏳ Type-aware boundaries coming soon...\n');

console.log('💡 Tip: ZonedDateTime has native startOfDay() method');
console.log('Example:', now.startOfDay().toString());
