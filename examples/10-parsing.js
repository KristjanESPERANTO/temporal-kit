/**
 * Parsing examples - Smart string-to-Temporal conversion
 *
 * The parse module provides intelligent format detection and conversion
 * from common string formats to appropriate Temporal types.
 *
 * Run with: node examples/10-parsing.js
 */

import { parse, parseDate, parseTime, parseDateTime } from "temporal-kit/polyfilled";

console.log("=== Auto-detection with parse() ===\n");

// ISO 8601 formats - most common standard
console.log("ISO dates:");
console.log("  '2025-11-30' →", parse("2025-11-30").toString());
console.log(
  "  '2025-11-30T15:30:00' →",
  parse("2025-11-30T15:30:00").toString(),
);
console.log(
  "  '2025-11-30T15:30:00Z' →",
  parse("2025-11-30T15:30:00Z").toString(),
);
console.log(
  "  '2025-11-30T15:30:00+01:00[Europe/Paris]' →",
  parse("2025-11-30T15:30:00+01:00[Europe/Paris]").toString(),
);
console.log();

// European format (DD.MM.YYYY)
console.log("European dates:");
console.log("  '30.11.2025' →", parse("30.11.2025").toString());
console.log(
  "  '30.11.2025 15:30' →",
  parse("30.11.2025 15:30").toString(),
);
console.log();

// US format (MM/DD/YYYY)
console.log("US dates:");
console.log("  '11/30/2025' →", parse("11/30/2025").toString());
console.log(
  "  '11/30/2025 3:30 PM' →",
  parse("11/30/2025 3:30 PM").toString(),
);
console.log();

// Alternative formats
console.log("Alternative formats:");
console.log("  '30-11-2025' →", parse("30-11-2025").toString());
console.log("  '2025/11/30' →", parse("2025/11/30").toString());
console.log();

// Time formats
console.log("Time formats:");
console.log("  '15:30' →", parse("15:30").toString());
console.log("  '15:30:45' →", parse("15:30:45").toString());
console.log("  '3:30 PM' →", parse("3:30 PM").toString());
console.log("  '9:00 AM' →", parse("9:00 AM").toString());
console.log();

// DateTime combinations
console.log("DateTime combinations:");
console.log(
  "  '2025-11-30 15:30' →",
  parse("2025-11-30 15:30").toString(),
);
console.log(
  "  '2025-11-30 3:30 PM' →",
  parse("2025-11-30 3:30 PM").toString(),
);
console.log();

console.log("=== Specific type parsing ===\n");

// Force parsing as date even if time component exists
console.log("parseDate() - always returns PlainDate:");
console.log("  '2025-11-30' →", parseDate("2025-11-30").toString());
console.log("  '11/30/2025' →", parseDate("11/30/2025").toString());
console.log("  '30.11.2025' →", parseDate("30.11.2025").toString());
console.log();

// Force parsing as time
console.log("parseTime() - always returns PlainTime:");
console.log("  '15:30' →", parseTime("15:30").toString());
console.log("  '15:30:45' →", parseTime("15:30:45").toString());
console.log("  '3:30 PM' →", parseTime("3:30 PM").toString());
console.log();

// Force parsing as datetime
console.log("parseDateTime() - always returns PlainDateTime:");
console.log(
  "  '2025-11-30T15:30:00' →",
  parseDateTime("2025-11-30T15:30:00").toString(),
);
console.log(
  "  '2025-11-30 15:30' →",
  parseDateTime("2025-11-30 15:30").toString(),
);
console.log(
  "  '11/30/2025 3:30 PM' →",
  parseDateTime("11/30/2025 3:30 PM").toString(),
);
console.log();

console.log("=== Whitespace handling ===\n");

// Automatic trimming
console.log("Whitespace is automatically trimmed:");
console.log("  '  2025-11-30  ' →", parse("  2025-11-30  ").toString());
console.log("  '  15:30  ' →", parse("  15:30  ").toString());
console.log();

console.log("=== Error handling ===\n");

// Invalid formats throw descriptive errors
try {
  parse("not a date");
} catch (error) {
  console.log("Invalid format:");
  console.log(" ", error.message);
  console.log();
}

// Invalid dates are rejected (not constrained)
try {
  parseDate("2025-13-01"); // Month 13 doesn't exist
} catch (error) {
  console.log("Invalid date values:");
  console.log(" ", error.message);
  console.log();
}

// Invalid times are rejected
try {
  parseTime("25:00"); // Hour 25 doesn't exist
} catch (error) {
  console.log("Invalid time values:");
  console.log(" ", error.message);
  console.log();
}

console.log("=== Practical use cases ===\n");

// User input parsing
function parseUserDateInput(input) {
  try {
    return parseDate(input);
  } catch (error) {
    return null; // or show error to user
  }
}

console.log("Flexible user input:");
console.log("  '2025-11-30' →", parseUserDateInput("2025-11-30")?.toString());
console.log("  '11/30/2025' →", parseUserDateInput("11/30/2025")?.toString());
console.log("  '30.11.2025' →", parseUserDateInput("30.11.2025")?.toString());
console.log("  'invalid' →", parseUserDateInput("invalid")?.toString() ?? "null");
console.log();

// API response parsing
const apiResponse = {
  createdAt: "2025-11-30T15:30:00Z",
  publishedAt: "2025-12-01T09:00:00+01:00[Europe/Paris]",
  date: "2025-11-30",
  time: "15:30:00",
};

console.log("Parsing API responses:");
console.log("  createdAt:", parse(apiResponse.createdAt).toString());
console.log("  publishedAt:", parse(apiResponse.publishedAt).toString());
console.log("  date:", parseDate(apiResponse.date).toString());
console.log("  time:", parseTime(apiResponse.time).toString());
console.log();

// Form data parsing
const formData = {
  birthDate: "11/30/2025", // US format
  appointmentTime: "3:30 PM", // 12-hour format
};

console.log("Parsing form data:");
const birthDate = parseDate(formData.birthDate);
const appointmentTime = parseTime(formData.appointmentTime);
console.log("  Birth date:", birthDate.toString(), "→", birthDate.toLocaleString());
console.log("  Appointment:", appointmentTime.toString(), "→", appointmentTime.toLocaleString());
console.log();

// International data
const internationalDates = [
  "30.11.2025", // European
  "11/30/2025", // US
  "2025-11-30", // ISO (universal)
];

console.log("Parsing international formats:");
internationalDates.forEach((dateStr) => {
  const date = parseDate(dateStr);
  console.log(`  '${dateStr}' → ${date.toString()} (${date.toLocaleString()})`);
});
