/**
 * Timezone examples - DST transitions and offset handling
 *
 * This example demonstrates how to work with timezones, handle DST transitions,
 * and understand offset behaviors in Temporal.
 *
 * Run with: node examples/11-timezones.js
 */

import { Temporal } from "temporal-polyfill";
import { now, toZonedDateTime, isBefore, isAfter } from "temporal-kit/polyfilled";

console.log("=== Working with Timezones ===\n");

// Get current time in different timezones
console.log("Current time in different timezones:");
const currentUTC = now();
console.log("  UTC:", currentUTC.toString());
console.log("  New York:", toZonedDateTime(currentUTC, "America/New_York").toString());
console.log("  London:", toZonedDateTime(currentUTC, "Europe/London").toString());
console.log("  Tokyo:", toZonedDateTime(currentUTC, "Asia/Tokyo").toString());
console.log("  Berlin:", toZonedDateTime(currentUTC, "Europe/Berlin").toString());
console.log();

console.log("=== DST Transitions ===\n");

// Spring forward - Clocks skip from 2:00 AM to 3:00 AM
console.log("Spring Forward (US - 2nd Sunday in March):");
console.log("In 2025, DST begins on March 9 at 2:00 AM");

// Before DST transition (Standard Time - EST)
const beforeDST = Temporal.ZonedDateTime.from("2025-03-09T01:30:00-05:00[America/New_York]");
console.log("  Before DST:", beforeDST.toString());
console.log("  Offset:", beforeDST.offset, "(EST)");
console.log("  Time:", beforeDST.toPlainTime().toString());

// After DST transition (Daylight Time - EDT)
const afterDST = Temporal.ZonedDateTime.from("2025-03-09T03:30:00-04:00[America/New_York]");
console.log("  After DST:", afterDST.toString());
console.log("  Offset:", afterDST.offset, "(EDT)");
console.log("  Time:", afterDST.toPlainTime().toString());

// The hour from 2:00 to 3:00 doesn't exist!
console.log("\n  What happens at 2:30 AM (the non-existent hour)?");
try {
	// Using 'reject' overflow will throw
	const nonExistent = Temporal.ZonedDateTime.from(
		"2025-03-09T02:30:00[America/New_York]",
		{ disambiguation: "reject" },
	);
	console.log("    Won't reach here");
} catch (error) {
	console.log("    'reject' throws:", error.message);
}

// Using 'compatible' (default) moves forward
const compatible = Temporal.ZonedDateTime.from("2025-03-09T02:30:00[America/New_York]");
console.log("    'compatible' (default):", compatible.toString());
console.log("    → Moves to:", compatible.toPlainTime().toString(), compatible.offset);

// Using 'earlier' uses the earlier offset
const earlier = Temporal.ZonedDateTime.from("2025-03-09T02:30:00[America/New_York]", {
	disambiguation: "earlier",
});
console.log("    'earlier':", earlier.toString());
console.log("    → Moves to:", earlier.toPlainTime().toString(), earlier.offset);

// Using 'later' uses the later offset
const later = Temporal.ZonedDateTime.from("2025-03-09T02:30:00[America/New_York]", {
	disambiguation: "later",
});
console.log("    'later':", later.toString());
console.log("    → Moves to:", later.toPlainTime().toString(), later.offset);

console.log("\n\nFall Back (US - 1st Sunday in November):");
console.log("In 2025, DST ends on November 2 at 2:00 AM");

// Before fall back (Daylight Time - EDT)
const beforeFallBack = Temporal.ZonedDateTime.from("2025-11-02T01:30:00-04:00[America/New_York]");
console.log("  Before fall back:", beforeFallBack.toString());
console.log("  Offset:", beforeFallBack.offset, "(EDT)");

// The hour from 1:00 to 2:00 occurs TWICE!
console.log("\n  The hour from 1:00-2:00 AM happens twice:");

// First occurrence (still EDT)
const firstOccurrence = Temporal.ZonedDateTime.from("2025-11-02T01:30:00-04:00[America/New_York]");
console.log("    First 1:30 AM (EDT):", firstOccurrence.toString());
console.log("    Offset:", firstOccurrence.offset);

// Second occurrence (now EST)
const secondOccurrence = Temporal.ZonedDateTime.from("2025-11-02T01:30:00-05:00[America/New_York]");
console.log("    Second 1:30 AM (EST):", secondOccurrence.toString());
console.log("    Offset:", secondOccurrence.offset);

// Without explicit offset, 'compatible' uses the earlier occurrence
const ambiguous = Temporal.ZonedDateTime.from("2025-11-02T01:30:00[America/New_York]");
console.log("    Default (compatible):", ambiguous.toString());
console.log("    → Uses earlier offset:", ambiguous.offset);

console.log();

console.log("=== Understanding Offsets ===\n");

// IANA timezone automatically adjusts offset for DST
console.log("Same timezone, different dates show different offsets:");
const winter = Temporal.ZonedDateTime.from("2025-01-15T12:00:00[America/New_York]");
const summer = Temporal.ZonedDateTime.from("2025-07-15T12:00:00[America/New_York]");

console.log("  Winter (January):", winter.toString());
console.log("    Offset:", winter.offset, "(EST - Standard Time)");
console.log("  Summer (July):", summer.toString());
console.log("    Offset:", summer.offset, "(EDT - Daylight Time)");
console.log("  Same timezone, offset changed by 1 hour due to DST");
console.log();

// Adding duration across DST boundary
console.log("Adding duration across DST boundary:");
const beforeSpring = Temporal.ZonedDateTime.from("2025-03-09T01:00:00[America/New_York]");
console.log("  Start:", beforeSpring.toString());
console.log("  Offset:", beforeSpring.offset);

const plus2Hours = beforeSpring.add({ hours: 2 });
console.log("  After +2 hours:", plus2Hours.toString());
console.log("  Offset:", plus2Hours.offset);
console.log("  Wall clock time jumped 3 hours (1 AM → 4 AM) due to DST");
console.log();

console.log("=== Converting Between Timezones ===\n");

// Same instant, different timezones
const instantNY = Temporal.ZonedDateTime.from("2025-06-15T12:00:00[America/New_York]");
console.log("Meeting at noon in New York:");
console.log("  New York:", instantNY.toString());
console.log("  → As Instant:", instantNY.toInstant().toString());

const instantLondon = instantNY.withTimeZone("Europe/London");
const instantTokyo = instantNY.withTimeZone("Asia/Tokyo");
const instantBerlin = instantNY.withTimeZone("Europe/Berlin");

console.log("  London:", instantLondon.toString());
console.log("  Tokyo:", instantTokyo.toString());
console.log("  Berlin:", instantBerlin.toString());
console.log();

console.log("=== Comparing Times Across Timezones ===\n");

const meeting1 = Temporal.ZonedDateTime.from("2025-06-15T14:00:00[America/New_York]");
const meeting2 = Temporal.ZonedDateTime.from("2025-06-15T20:00:00[Europe/Berlin]");

console.log("Which meeting is earlier?");
console.log("  Meeting 1 (NY):", meeting1.toString());
console.log("  Meeting 2 (Berlin):", meeting2.toString());

// Compare using native Temporal.ZonedDateTime.compare
const comparison = Temporal.ZonedDateTime.compare(meeting1, meeting2);
if (comparison < 0) {
	console.log("  → Meeting 1 (New York) is earlier");
} else if (comparison > 0) {
	console.log("  → Meeting 2 (Berlin) is earlier");
} else {
	console.log("  → They are at the same time!");
}

// Convert both to same timezone for clarity
console.log("\n  Both in UTC:");
console.log("    Meeting 1:", meeting1.withTimeZone("UTC").toString());
console.log("    Meeting 2:", meeting2.withTimeZone("UTC").toString());
console.log();

console.log("=== Practical Use Cases ===\n");

// Scheduling across timezones
console.log("1. Scheduling a meeting for 9 AM in each participant's timezone:");
const participants = [
	{ name: "Alice", timezone: "America/New_York" },
	{ name: "Bob", timezone: "Europe/London" },
	{ name: "Charlie", timezone: "Asia/Tokyo" },
];

const baseDate = Temporal.PlainDate.from("2025-06-15");
participants.forEach(({ name, timezone }) => {
	const meeting = baseDate.toZonedDateTime({
		timeZone: timezone,
		plainTime: Temporal.PlainTime.from("09:00:00"),
	});
	console.log(`  ${name} (${timezone}):`);
	console.log(`    Local: ${meeting.toString()}`);
	console.log(`    UTC: ${meeting.withTimeZone("UTC").toString()}`);
});
console.log();

// Handling user input with timezone
console.log("2. User enters date/time in their local timezone:");
const userInput = {
	date: "2025-12-25",
	time: "14:30",
	timezone: "America/Los_Angeles",
};

const userDateTime = Temporal.PlainDate.from(userInput.date)
	.toZonedDateTime({
		timeZone: userInput.timezone,
		plainTime: Temporal.PlainTime.from(userInput.time),
	});

console.log("  User input:", `${userInput.date} ${userInput.time} (${userInput.timezone})`);
console.log("  Parsed as:", userDateTime.toString());
console.log("  Store as Instant:", userDateTime.toInstant().toString());
console.log("  Display in Berlin:", userDateTime.withTimeZone("Europe/Berlin").toString());
console.log();

// Flight times (departure/arrival in different timezones)
console.log("3. Flight from New York to London:");
const departure = Temporal.ZonedDateTime.from("2025-07-15T20:00:00[America/New_York]");
const flightDuration = Temporal.Duration.from({ hours: 7, minutes: 30 });
const arrival = departure.add(flightDuration).withTimeZone("Europe/London");

console.log("  Departure (NY):", departure.toString());
console.log("  Flight duration:", flightDuration.toString());
console.log("  Arrival (London):", arrival.toString());
console.log("  Local times:");
console.log("    Depart at:", departure.toPlainTime().toString());
console.log("    Arrive at:", arrival.toPlainTime().toString());
console.log();

console.log("=== Best Practices ===\n");

console.log("1. Always use IANA timezone names (not abbreviations):");
console.log("   ✅ Good: 'America/New_York', 'Europe/London'");
console.log("   ❌ Bad: 'EST', 'GMT' (ambiguous and don't handle DST)");
console.log();

console.log("2. Store absolute times as Instant:");
console.log("   • For events that happen at a specific moment worldwide");
console.log("   • Convert to ZonedDateTime only for display");
console.log();

console.log("3. Store local times as PlainDateTime + timezone separately:");
console.log("   • For recurring events (daily 9 AM standup)");
console.log("   • Automatically adjusts for DST changes");
console.log();

console.log("4. Be explicit about disambiguation during DST transitions:");
console.log("   • Use 'earlier', 'later', or 'compatible' options");
console.log("   • Document your choice for business logic");
console.log();

console.log("5. Test around DST transition dates:");
console.log("   • Spring forward: 2nd Sunday in March (US)");
console.log("   • Fall back: 1st Sunday in November (US)");
console.log("   • Dates vary by country!");
