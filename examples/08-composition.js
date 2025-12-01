/**
 * temporal-kit - Functional Composition Examples
 *
 * Demonstrates pipe() and compose() utilities for chaining operations.
 */

import {
  add,
  compose,
  endOf,
  isBefore,
  pipe,
  startOf,
  subtract,
  Temporal,
  toZonedDateTime,
} from "../dist/polyfilled.js";

console.log("=== Functional Composition with pipe() ===\n");

// Simple pipe example
const date = Temporal.PlainDateTime.from("2025-11-30T15:45:00");
console.log(`Starting date: ${date}`);
console.log();

// Pipe: left-to-right execution
const result1 = pipe(
  date,
  (d) => startOf(d, "day"),
  (d) => add(d, { hours: 12 }),
);
console.log("pipe(date, startOf('day'), add({hours: 12})):");
console.log(`  Result: ${result1}`);
console.log();

// More complex pipe chain
const result2 = pipe(
  date,
  (d) => startOf(d, "month"),
  (d) => add(d, { weeks: 2 }),
  (d) => endOf(d, "day"),
);
console.log("pipe(date, startOf('month'), add({weeks: 2}), endOf('day')):");
console.log(`  Result: ${result2}`);
console.log();

// Pipe with multiple operations
const today = Temporal.PlainDate.from("2025-11-30");
const nextWeekEnd = pipe(
  today,
  (d) => add(d, { weeks: 1 }),
  (d) => endOf(d, "week"),
);
console.log("Next week's end (Sunday):");
console.log(`  From: ${today}`);
console.log(`  To:   ${nextWeekEnd}`);
console.log();

console.log("=== Functional Composition with compose() ===\n");

// Compose: right-to-left execution
// Creates a reusable function
const noonOnStartOfDay = compose(
  (d) => add(d, { hours: 12 }),
  (d) => startOf(d, "day"),
);

console.log("Compose: add 12 hours to start of day");
const composedResult1 = noonOnStartOfDay(date);
console.log(`  Input:  ${date}`);
console.log(`  Output: ${composedResult1}`);
console.log();

// More complex composed function
const endOfNextMonth = compose(
  (d) => endOf(d, "month"),
  (d) => add(d, { months: 1 }),
  (d) => startOf(d, "month"),
);

console.log("Compose: end of next month");
const composedResult2 = endOfNextMonth(date);
console.log(`  Input:  ${date}`);
console.log(`  Output: ${composedResult2}`);
console.log();

console.log("=== Practical Examples ===\n");

// Business hours calculation
console.log("--- Business Hours Calculation ---");
const businessDayStart = compose(
  (d) => add(d, { hours: 9 }), // 9 AM
  (d) => startOf(d, "day"),
);

const businessDayEnd = compose(
  (d) => add(d, { hours: 17 }), // 5 PM
  (d) => startOf(d, "day"),
);

const someDate = Temporal.PlainDateTime.from("2025-12-15T14:30:00");
console.log(`Date: ${someDate}`);
console.log(`Business day starts: ${businessDayStart(someDate)}`);
console.log(`Business day ends:   ${businessDayEnd(someDate)}`);
console.log();

// Deadline calculator
console.log("--- Deadline Calculator (2 weeks from month start) ---");
const calculateDeadline = pipe(
  Temporal.PlainDate.from("2025-12-15"),
  (d) => startOf(d, "month"),
  (d) => add(d, { weeks: 2 }),
  (d) => subtract(d, { days: 1 }), // One day before
);
console.log(`Deadline: ${calculateDeadline}`);
console.log();

// Event scheduling with timezone
console.log("--- Event Scheduling with Timezone ---");
const scheduleEvent = (eventDate) =>
  pipe(
    eventDate,
    (d) => startOf(d, "day"),
    (d) => add(d, { hours: 14 }), // 2 PM
    (d) => toZonedDateTime(d, "Europe/Berlin"),
  );

const eventDay = Temporal.PlainDateTime.from("2025-12-25T00:00:00");
const scheduledEvent = scheduleEvent(eventDay);
console.log(`Event scheduled: ${scheduledEvent}`);
console.log();

// Data processing pipeline
console.log("--- Data Processing Pipeline ---");
const dates = [
  Temporal.PlainDate.from("2025-11-15"),
  Temporal.PlainDate.from("2025-12-01"),
  Temporal.PlainDate.from("2025-10-30"),
];

const processDate = (d) =>
  pipe(
    d,
    (date) => startOf(date, "month"),
    (date) => endOf(date, "month"),
  );

console.log("Process dates to get end of their months:");
dates.forEach((d) => {
  const processed = processDate(d);
  console.log(`  ${d} → ${processed}`);
});
console.log();

// Conditional pipeline
console.log("--- Conditional Date Pipeline ---");
const now = Temporal.Now.plainDateTimeISO();
const targetDate = Temporal.PlainDateTime.from("2025-12-25T10:00:00");

const adjustedDate = pipe(
  targetDate,
  (d) => (isBefore(d, now) ? add(d, { years: 1 }) : d),
  (d) => startOf(d, "day"),
  (d) => add(d, { hours: 10 }),
);

console.log(`Now:           ${now}`);
console.log(`Target:        ${targetDate}`);
console.log(`Adjusted:      ${adjustedDate}`);
console.log();

// Reusable transformation
console.log("--- Reusable Date Transformations ---");
const toQuarterEnd = compose(
  (d) => endOf(d, "month"),
  (d) => {
    const month = d.month;
    const quarterEndMonth = Math.ceil(month / 3) * 3;
    return d.with({ month: quarterEndMonth });
  },
);

const q4Date = Temporal.PlainDate.from("2025-11-15");
console.log(`Input (Q4):  ${q4Date}`);
console.log(`Quarter end: ${toQuarterEnd(q4Date)}`);
console.log();

console.log("=== Comparison: pipe vs compose ===\n");

const testDate = Temporal.PlainDateTime.from("2025-11-30T15:45:00");

// pipe: read operations in order (left-to-right)
const pipeResult = pipe(
  testDate,
  (d) => startOf(d, "day"),
  (d) => add(d, { hours: 12 }),
  (d) => add(d, { minutes: 30 }),
);

// compose: operations applied in reverse (right-to-left)
const composeFunc = compose(
  (d) => add(d, { minutes: 30 }),
  (d) => add(d, { hours: 12 }),
  (d) => startOf(d, "day"),
);
const composeResult = composeFunc(testDate);

console.log(`Input:          ${testDate}`);
console.log(`pipe result:    ${pipeResult}`);
console.log(`compose result: ${composeResult}`);
console.log(`(Both produce the same result)`);

console.log("\n✅ All composition utilities working!");
