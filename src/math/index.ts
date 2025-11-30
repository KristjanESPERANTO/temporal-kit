import { Temporal } from "temporal-polyfill";
import type { DateLike, DateUnit, DurationInput } from "../types/index.js";

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
  if (unit === "day") {
    // For PlainDate, it's already at start of day
    if (date instanceof Temporal.PlainDate) {
      return date;
    }
    // For DateTime/ZonedDateTime, set time to 00:00:00
    return date.with({
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
      microsecond: 0,
      nanosecond: 0,
    }) as T;
  }

  if (unit === "week") {
    // Monday is day 1, Sunday is day 7
    const daysToSubtract = date.dayOfWeek - 1;
    const startOfWeek = date.subtract({ days: daysToSubtract });

    // If it has time, set to start of day
    if ("hour" in startOfWeek) {
      return startOfWeek.with({
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
        microsecond: 0,
        nanosecond: 0,
      }) as T;
    }

    return startOfWeek as T;
  }

  if (unit === "month") {
    const startOfMonth = date.with({ day: 1 });

    // If it has time, set to start of day
    if ("hour" in startOfMonth) {
      return startOfMonth.with({
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
        microsecond: 0,
        nanosecond: 0,
      }) as T;
    }

    return startOfMonth as T;
  }

  if (unit === "year") {
    const startOfYear = date.with({ month: 1, day: 1 });

    // If it has time, set to start of day
    if ("hour" in startOfYear) {
      return startOfYear.with({
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
        microsecond: 0,
        nanosecond: 0,
      }) as T;
    }

    return startOfYear as T;
  }

  throw new TypeError(`Invalid unit: ${unit}`);
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
  if (unit === "day") {
    // For PlainDate, it's already representing the whole day
    if (date instanceof Temporal.PlainDate) {
      return date;
    }
    // For DateTime/ZonedDateTime, set time to 23:59:59.999999999
    return date.with({
      hour: 23,
      minute: 59,
      second: 59,
      millisecond: 999,
      microsecond: 999,
      nanosecond: 999,
    }) as T;
  }

  if (unit === "week") {
    // Sunday is day 7
    const daysToAdd = 7 - date.dayOfWeek;
    const endOfWeek = date.add({ days: daysToAdd });

    // If it has time, set to end of day
    if ("hour" in endOfWeek) {
      return endOfWeek.with({
        hour: 23,
        minute: 59,
        second: 59,
        millisecond: 999,
        microsecond: 999,
        nanosecond: 999,
      }) as T;
    }

    return endOfWeek as T;
  }

  if (unit === "month") {
    const lastDay = date.with({ day: date.daysInMonth });

    // If it has time, set to end of day
    if ("hour" in lastDay) {
      return lastDay.with({
        hour: 23,
        minute: 59,
        second: 59,
        millisecond: 999,
        microsecond: 999,
        nanosecond: 999,
      }) as T;
    }

    return lastDay as T;
  }

  if (unit === "year") {
    const endOfYear = date.with({ month: 12, day: 31 });

    // If it has time, set to end of day
    if ("hour" in endOfYear) {
      return endOfYear.with({
        hour: 23,
        minute: 59,
        second: 59,
        millisecond: 999,
        microsecond: 999,
        nanosecond: 999,
      }) as T;
    }

    return endOfYear as T;
  }

  throw new TypeError(`Invalid unit: ${unit}`);
}
