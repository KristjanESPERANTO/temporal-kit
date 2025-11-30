/**
 * temporal-kit - Convert Module Examples
 * 
 * Demonstrates conversion and creation functions:
 * - now(): Get current date/time
 * - fromISO(): Parse ISO 8601 strings
 * - toPlainDate(), toPlainDateTime(), toZonedDateTime(): Type conversions
 */

import {
  now,
  fromISO,
  toPlainDate,
  toPlainDateTime,
  toZonedDateTime,
} from "../dist/polyfilled.js";

console.log("=== Current Time ===");
const currentTime = now();
console.log(`now():`, currentTime.toString());
console.log(`Timezone:`, currentTime.timeZoneId);
console.log();

console.log("=== Parsing ISO Strings ===");

// Different ISO formats parse to different types
const dateOnly = fromISO("2025-12-25");
console.log(`fromISO('2025-12-25'):`, dateOnly.toString());
console.log(`Type:`, dateOnly.constructor.name);

const dateTime = fromISO("2025-12-25T10:30:00");
console.log(`fromISO('2025-12-25T10:30:00'):`, dateTime.toString());
console.log(`Type:`, dateTime.constructor.name);

const zonedDateTime = fromISO("2025-12-25T10:30:00+01:00[Europe/Berlin]");
console.log(
  `fromISO('2025-12-25T10:30:00+01:00[Europe/Berlin]'):`,
  zonedDateTime.toString()
);
console.log(`Type:`, zonedDateTime.constructor.name);

const instant = fromISO("2025-12-25T09:30:00Z");
console.log(`fromISO('2025-12-25T09:30:00Z'):`, instant.toString());
console.log(`Type:`, instant.constructor.name);
console.log();

console.log("=== Type Conversions ===");

// Convert ZonedDateTime to PlainDate (lose time and timezone)
const zdt = fromISO("2025-12-25T15:30:00+01:00[Europe/Berlin]");
console.log(`Original ZonedDateTime:`, zdt.toString());
const plainDate = toPlainDate(zdt);
console.log(`toPlainDate():`, plainDate.toString());
console.log();

// Convert ZonedDateTime to PlainDateTime (lose timezone)
const plainDateTime = toPlainDateTime(zdt);
console.log(`toPlainDateTime():`, plainDateTime.toString());
console.log(`(Note: Time is preserved, timezone is lost)`);
console.log();

// Convert PlainDate to ZonedDateTime (requires timezone)
const date = fromISO("2025-12-25");
console.log(`Original PlainDate:`, date.toString());
const toZoned1 = toZonedDateTime(date, "Europe/Berlin");
console.log(`toZonedDateTime(..., 'Europe/Berlin'):`, toZoned1.toString());
const toZoned2 = toZonedDateTime(date, "America/New_York");
console.log(`toZonedDateTime(..., 'America/New_York'):`, toZoned2.toString());
console.log(
  `(Note: Same date, different timezones, different instants in time)`
);
console.log();

// Convert PlainDateTime to ZonedDateTime
const pdt = fromISO("2025-12-25T15:30:00");
console.log(`Original PlainDateTime:`, pdt.toString());
const toZoned3 = toZonedDateTime(pdt, "Europe/Berlin");
console.log(`toZonedDateTime(..., 'Europe/Berlin'):`, toZoned3.toString());
console.log();

// Change timezone of ZonedDateTime
console.log("=== Timezone Conversion ===");
const berlinTime = fromISO("2025-12-25T15:30:00+01:00[Europe/Berlin]");
console.log(`Berlin time:`, berlinTime.toString());
const nyTime = toZonedDateTime(berlinTime, "America/New_York");
console.log(
  `Same instant in New York:`,
  nyTime.toString(),
  `(${nyTime.hour}:${nyTime.minute})`
);
console.log(
  `(Note: Same instant, different wall clock time due to timezone)`
);
console.log();

console.log("=== Practical Example: Event Scheduling ===");

// Parse event from calendar invite (ISO string)
const eventString = "2025-12-25T14:00:00+01:00[Europe/Berlin]";
const event = fromISO(eventString);
console.log(`Event:`, event.toString());

// Get just the date for display
const eventDate = toPlainDate(event);
console.log(`Event date:`, eventDate.toString());

// Convert to attendee's timezone
const attendeeTimezone = "America/Los_Angeles";
const eventInAttendeeTime = toZonedDateTime(event, attendeeTimezone);
console.log(
  `Event in ${attendeeTimezone}:`,
  eventInAttendeeTime.toString(),
  `(${eventInAttendeeTime.hour}:${String(eventInAttendeeTime.minute).padStart(2, "0")})`
);

console.log("\n✅ All conversion functions working!");
