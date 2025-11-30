/**
 * Timezone Handling Examples
 * 
 * Demonstrates working with timezones, conversions, and DST.
 * 
 * Run with: node examples/09-timezones.js
 */

import { isZonedDateTime, isInstant } from '../dist/polyfilled.js';

// 🔜 Coming soon
// import { toTimezone, getOffset, isDST } from '../dist/polyfilled.js';

console.log('=== Timezone Handling (Coming Soon) ===\n');

// Example 1: Creating Zoned Times
console.log('--- Creating Zoned Times ---');
const berlinTime = Temporal.Now.zonedDateTimeISO('Europe/Berlin');
const newYorkTime = Temporal.Now.zonedDateTimeISO('America/New_York');
const tokyoTime = Temporal.Now.zonedDateTimeISO('Asia/Tokyo');

console.log('Berlin:', berlinTime.toString());
console.log('New York:', newYorkTime.toString());
console.log('Tokyo:', tokyoTime.toString());
console.log();

// Example 2: Converting Between Timezones
console.log('--- Timezone Conversions ---');
const meetingTime = Temporal.ZonedDateTime.from('2025-12-15T14:00:00+01:00[Europe/Berlin]');
console.log('Meeting scheduled in Berlin:', meetingTime.toString());

// Convert to other timezones
const meetingInNY = meetingTime.withTimeZone('America/New_York');
const meetingInTokyo = meetingTime.withTimeZone('Asia/Tokyo');

console.log('Same meeting in New York:', meetingInNY.toString());
console.log('Same meeting in Tokyo:', meetingInTokyo.toString());
console.log();

// Example 3: DST Transitions
console.log('--- DST Transitions ---');
// Spring forward (Europe: last Sunday in March)
const beforeDST = Temporal.ZonedDateTime.from('2025-03-30T01:30:00+01:00[Europe/Berlin]');
const afterDST = beforeDST.add({ hours: 2 }); // Crosses DST boundary

console.log('Before DST:', beforeDST.toString());
console.log('After DST:', afterDST.toString());
console.log('Offset before:', beforeDST.offset);
console.log('Offset after:', afterDST.offset);
console.log();

// Example 4: Instant vs Zoned
console.log('--- Instant (no timezone) vs Zoned ---');
const instant = Temporal.Now.instant();
console.log('Instant (UTC):', instant.toString());
console.log('isInstant:', isInstant(instant));

const zonedFromInstant = instant.toZonedDateTimeISO('Europe/Berlin');
console.log('As Berlin time:', zonedFromInstant.toString());
console.log('isZonedDateTime:', isZonedDateTime(zonedFromInstant));
console.log();

// Example 5: Handling Ambiguous Times
console.log('--- Ambiguous Times (DST Fall Back) ---');
// Fall back (Europe: last Sunday in October)
// 02:30 happens twice! Once in CEST, once in CET

try {
  const ambiguous = Temporal.ZonedDateTime.from(
    '2025-10-26T02:30:00[Europe/Berlin]',
    { disambiguation: 'earlier' } // or 'later'
  );
  console.log('Earlier occurrence:', ambiguous.toString());
  
  const later = Temporal.ZonedDateTime.from(
    '2025-10-26T02:30:00[Europe/Berlin]',
    { disambiguation: 'later' }
  );
  console.log('Later occurrence:', later.toString());
} catch (e) {
  console.log('Ambiguous time detected!');
}
console.log();

// Example 6: Common Timezone Operations
console.log('--- Common Operations ---');
const now = Temporal.Now.zonedDateTimeISO('Europe/Berlin');
console.log('Current time:', now.toString());
console.log('Timezone ID:', now.timeZoneId);
console.log('Offset:', now.offset);
console.log('Offset in seconds:', now.offsetNanoseconds / 1e9);
console.log();

// 🔜 Future Temporal Kit helpers
// console.log('Is DST?', isDST(now));
// console.log('Timezone name:', getTimezoneName(now, 'long')); // "Central European Time"
// console.log('Timezone abbr:', getTimezoneName(now, 'short')); // "CET"
console.log('⏳ Helper functions coming soon...\n');

console.log('💡 Tip: Temporal handles all timezone complexity natively');
console.log('Temporal Kit adds convenience helpers on top');
