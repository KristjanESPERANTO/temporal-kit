import type { Temporal as TemporalTypes } from "temporal-spec";
import { Temporal } from "../temporal.js";
import type { DateLike, DateUnit, DurationInput } from "../types/index.js";

function constrainField(
  value: number,
  maximum: number,
  options?: TemporalTypes.OverflowOptions,
): number {
  const overflow = options?.overflow ?? "constrain";
  if (overflow !== "constrain" && overflow !== "reject") {
    throw new RangeError("Invalid overflow option");
  }
  if (!Number.isFinite(value)) {
    throw new RangeError("Field must be finite");
  }
  const integer = Math.trunc(value);
  if (overflow === "reject" && (integer < 1 || integer > maximum)) {
    throw new RangeError(`Field must be between 1 and ${maximum}`);
  }
  return Math.min(maximum, Math.max(1, integer));
}

/** Replace the day within the current calendar year, preserving local time and calendar. */
export function withDayOfYear<T extends DateLike>(
  date: T,
  dayOfYear: number,
  options?: TemporalTypes.OverflowOptions,
): T {
  const day = constrainField(dayOfYear, date.daysInYear, options);
  return date.add({ days: day - date.dayOfYear }) as T;
}

/** Replace the weekday within the current calendar week, preserving local time. */
export function withDayOfWeek<T extends DateLike>(
  date: T,
  dayOfWeek: number,
  options?: TemporalTypes.OverflowOptions,
): T {
  const day = constrainField(dayOfWeek, date.daysInWeek, options);
  return date.add({ days: day - date.dayOfWeek }) as T;
}

/** Replace the ISO week within the current ISO week-year, preserving weekday and local time. */
export function withWeekOfYear<T extends DateLike>(
  date: T,
  weekOfYear: number,
  options?: TemporalTypes.OverflowOptions,
): T {
  if (date.calendarId !== "iso8601") {
    throw new RangeError("withWeekOfYear requires the ISO 8601 calendar");
  }
  const maximum = Temporal.PlainDate.from({ year: date.yearOfWeek as number, month: 12, day: 28 })
    .weekOfYear as number;
  const week = constrainField(weekOfYear, maximum, options);
  return date.add({ weeks: week - (date.weekOfYear as number) }) as T;
}

const END_OF_DAY = {
  hour: 23,
  minute: 59,
  second: 59,
  millisecond: 999,
  microsecond: 999,
  nanosecond: 999,
};

/** Returns the 1-based position of the date within the unit and the unit's length in days. */
function position(date: DateLike, unit: DateUnit): [index: number, length: number] {
  switch (unit) {
    case "day":
      return [1, 1];
    case "week":
      return [date.dayOfWeek, date.daysInWeek];
    case "month":
      return [date.day, date.daysInMonth];
    case "year":
      return [date.dayOfYear, date.daysInYear];
    default:
      throw new TypeError(`Invalid unit: ${unit}`);
  }
}

function boundary<T extends DateLike>(date: T, unit: DateUnit, edge: "start" | "end"): T {
  const [index, length] = position(date, unit);
  const day: DateLike = date.add({ days: (edge === "start" ? 1 : length) - index });

  if (day instanceof Temporal.PlainDate) return day as T;
  if (edge === "end") return day.with(END_OF_DAY) as T;
  // startOfDay() picks the first instant of the day, even if midnight is skipped or repeated.
  return (
    day instanceof Temporal.ZonedDateTime ? day.startOfDay() : day.toPlainDate().toPlainDateTime()
  ) as T;
}

/**
 * Add a duration to a date/time value.
 *
 * @param date - The date to add to
 * @param duration - Duration to add (object with years, months, days, hours, etc.)
 * @returns New date with duration added
 *
 * @example
 * ```ts
 * import { add } from 'temporal-kit';
 *
 * const date = Temporal.PlainDate.from('2025-11-30');
 * add(date, { days: 5 }); // 2025-12-05
 * add(date, { months: 2, days: 3 }); // 2026-02-02
 * ```
 */
export function add<T extends DateLike>(date: T, duration: DurationInput): T {
  return date.add(duration) as T;
}

/**
 * Subtract a duration from a date/time value.
 *
 * @param date - The date to subtract from
 * @param duration - Duration to subtract (object with years, months, days, hours, etc.)
 * @returns New date with duration subtracted
 *
 * @example
 * ```ts
 * import { subtract } from 'temporal-kit';
 *
 * const date = Temporal.PlainDate.from('2025-11-30');
 * subtract(date, { days: 5 }); // 2025-11-25
 * subtract(date, { months: 2 }); // 2025-09-30
 * ```
 */
export function subtract<T extends DateLike>(date: T, duration: DurationInput): T {
  return date.subtract(duration) as T;
}

/**
 * Get the start of a time unit (e.g., start of day, start of month).
 *
 * @param date - The date to round down
 * @param unit - The time unit to round to
 * @returns New date at the start of the specified unit
 *
 * @example
 * ```ts
 * import { startOf } from 'temporal-kit';
 *
 * const dt = Temporal.PlainDateTime.from('2025-11-30T15:30:00');
 * startOf(dt, 'day');   // 2025-11-30T00:00:00
 * startOf(dt, 'month'); // 2025-11-01T00:00:00
 * startOf(dt, 'year');  // 2025-01-01T00:00:00
 * ```
 */
export function startOf<T extends DateLike>(date: T, unit: DateUnit): T {
  return boundary(date, unit, "start");
}

/**
 * Get the end of a time unit (e.g., end of day, end of month).
 *
 * @param date - The date to round up
 * @param unit - The time unit to round to
 * @returns New date at the end of the specified unit
 *
 * @example
 * ```ts
 * import { endOf } from 'temporal-kit';
 *
 * const dt = Temporal.PlainDateTime.from('2025-11-30T15:30:00');
 * endOf(dt, 'day');   // 2025-11-30T23:59:59.999999999
 * endOf(dt, 'month'); // 2025-11-30T23:59:59.999999999
 * endOf(dt, 'year');  // 2025-12-31T23:59:59.999999999
 * ```
 */
export function endOf<T extends DateLike>(date: T, unit: DateUnit): T {
  return boundary(date, unit, "end");
}

/**
 * Returns the next occurrence of a specific day of the week.
 *
 * @param date - The starting date
 * @param dayOfWeek - The day of the week (1-7, Monday is 1)
 * @returns The next date with the specified day of the week
 *
 * @example
 * ```ts
 * import { nextDay } from 'temporal-kit';
 *
 * const date = Temporal.PlainDate.from('2025-11-30'); // Sunday
 * nextDay(date, 5); // Next Friday (2025-12-05)
 * ```
 */
export function nextDay<T extends DateLike>(date: T, dayOfWeek: number): T {
  if (dayOfWeek < 1 || dayOfWeek > 7) {
    throw new RangeError("Day of week must be between 1 (Monday) and 7 (Sunday)");
  }

  const currentDay = date.dayOfWeek;
  let diff = dayOfWeek - currentDay;

  if (diff <= 0) {
    diff += 7;
  }

  return date.add({ days: diff }) as T;
}

/**
 * Returns the previous occurrence of a specific day of the week.
 *
 * @param date - The starting date
 * @param dayOfWeek - The day of the week (1-7, Monday is 1)
 * @returns The previous date with the specified day of the week
 *
 * @example
 * ```ts
 * import { previousDay } from 'temporal-kit';
 *
 * const date = Temporal.PlainDate.from('2025-11-30'); // Sunday
 * previousDay(date, 5); // Previous Friday (2025-11-28)
 * ```
 */
export function previousDay<T extends DateLike>(date: T, dayOfWeek: number): T {
  if (dayOfWeek < 1 || dayOfWeek > 7) {
    throw new RangeError("Day of week must be between 1 (Monday) and 7 (Sunday)");
  }

  const currentDay = date.dayOfWeek;
  let diff = dayOfWeek - currentDay;

  if (diff >= 0) {
    diff -= 7;
  }

  return date.add({ days: diff }) as T;
}
