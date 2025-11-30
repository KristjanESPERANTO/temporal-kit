/**
 * Example: Formatting with Intl
 *
 * Demonstrates how to format Temporal dates and times using
 * Intl.DateTimeFormat and Intl.RelativeTimeFormat.
 *
 * Run: node examples/09-formatting.js
 */

import {
	Temporal,
	format,
	formatTime,
	formatDateTime,
	formatRelative,
} from "../dist/polyfilled.js";

console.log("=== Date Formatting ===\n");

const date = Temporal.PlainDate.from("2025-11-30");

// Default formatting (medium style, system locale)
console.log("Default:", format(date));

// Different styles
console.log("Short:", format(date, { dateStyle: "short" }));
console.log("Medium:", format(date, { dateStyle: "medium" }));
console.log("Long:", format(date, { dateStyle: "long" }));
console.log("Full:", format(date, { dateStyle: "full" }));

// Different locales
console.log("\nLocales:");
console.log("en-US:", format(date, { locale: "en-US" }));
console.log("de-DE:", format(date, { locale: "de-DE" }));
console.log("fr-FR:", format(date, { locale: "fr-FR" }));
console.log("ja-JP:", format(date, { locale: "ja-JP" }));

// Custom format options
console.log("\nCustom formats:");
console.log(
	"Year-Month:",
	format(date, {
		options: { year: "numeric", month: "long" },
	}),
);
console.log(
	"Weekday, Day:",
	format(date, {
		options: { weekday: "long", day: "numeric" },
	}),
);

console.log("\n=== Time Formatting ===\n");

const time = Temporal.PlainTime.from("15:30:45");

console.log("Default:", formatTime(time));
console.log("Short:", formatTime(time, { timeStyle: "short" }));
console.log("Medium:", formatTime(time, { timeStyle: "medium" }));
console.log("Long:", formatTime(time, { timeStyle: "long" }));

console.log("\nLocales:");
console.log("en-US:", formatTime(time, { locale: "en-US" }));
console.log("de-DE:", formatTime(time, { locale: "de-DE" }));
console.log("en-GB:", formatTime(time, { locale: "en-GB" }));

console.log("\n=== DateTime Formatting ===\n");

const dateTime = Temporal.PlainDateTime.from("2025-11-30T15:30:45");

console.log("Default:", formatDateTime(dateTime));
console.log(
	"Short date, short time:",
	formatDateTime(dateTime, { dateStyle: "short", timeStyle: "short" }),
);
console.log(
	"Long date, medium time:",
	formatDateTime(dateTime, { dateStyle: "long", timeStyle: "medium" }),
);
console.log(
	"Full:",
	formatDateTime(dateTime, { dateStyle: "full", timeStyle: "full" }),
);

console.log("\nWith ZonedDateTime:");
const zdt = Temporal.ZonedDateTime.from(
	"2025-11-30T15:30:45+01:00[Europe/Berlin]",
);
console.log("Berlin:", formatDateTime(zdt, { locale: "de-DE" }));
console.log(
	"Berlin (full):",
	formatDateTime(zdt, {
		locale: "de-DE",
		dateStyle: "full",
		timeStyle: "full",
	}),
);

console.log("\n=== Relative Time Formatting ===\n");

const today = Temporal.PlainDate.from("2025-11-30");

// Past dates
const yesterday = today.subtract({ days: 1 });
const lastWeek = today.subtract({ days: 7 });
const lastMonth = today.subtract({ days: 30 });
const lastYear = today.subtract({ days: 365 });

console.log("Yesterday:", formatRelative(yesterday, today));
console.log("Last week:", formatRelative(lastWeek, today));
console.log("Last month:", formatRelative(lastMonth, today));
console.log("Last year:", formatRelative(lastYear, today));

// Future dates
const tomorrow = today.add({ days: 1 });
const nextWeek = today.add({ days: 7 });
const nextMonth = today.add({ days: 30 });
const nextYear = today.add({ days: 365 });

console.log("\nTomorrow:", formatRelative(tomorrow, today));
console.log("Next week:", formatRelative(nextWeek, today));
console.log("Next month:", formatRelative(nextMonth, today));
console.log("Next year:", formatRelative(nextYear, today));

// Today
console.log("\nToday:", formatRelative(today, today));

// Different locales
console.log("\nLocales:");
console.log("en-US:", formatRelative(yesterday, today, { locale: "en-US" }));
console.log("de-DE:", formatRelative(yesterday, today, { locale: "de-DE" }));
console.log("fr-FR:", formatRelative(yesterday, today, { locale: "fr-FR" }));
console.log("es-ES:", formatRelative(yesterday, today, { locale: "es-ES" }));

console.log("\n=== Practical Examples ===\n");

// Event formatting
const event = {
	title: "Team Meeting",
	date: Temporal.ZonedDateTime.from(
		"2025-12-15T14:00:00+01:00[Europe/Berlin]",
	),
};

console.log(`${event.title}`);
console.log(`When: ${formatDateTime(event.date, { dateStyle: "full", timeStyle: "short" })}`);
console.log(
	`Relative: ${formatRelative(event.date.toPlainDate(), today)}`,
);

// Multi-locale display
console.log("\nMulti-locale event times:");
const locales = ["en-US", "de-DE", "ja-JP", "ar-EG"];
for (const loc of locales) {
	console.log(
		`${loc.padEnd(6)}: ${formatDateTime(event.date, { locale: loc, dateStyle: "long", timeStyle: "short" })}`,
	);
}
