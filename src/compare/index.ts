/**
 * Comparison functions for Temporal date/time types
 * @module compare
 */

import { Temporal } from "temporal-polyfill";
import type { DateLike } from "../types/index.js";

/**
 * Checks if the first date/time is before the second.
 *
 * Uses the appropriate compare method based on the type.
 *
 * @param a - First date/time to compare
 * @param b - Second date/time to compare
 * @returns true if a is before b
 *
 * @example
 * ```ts
 * import { isBefore } from 'temporal-kit';
 *
 * const date1 = Temporal.PlainDate.from('2025-01-01');
 * const date2 = Temporal.PlainDate.from('2025-12-31');
 *
 * isBefore(date1, date2); // true
 * ```
 */
export function isBefore(a: DateLike, b: DateLike): boolean {
  return compare(a, b) < 0;
}

/**
 * Checks if the first date/time is after the second.
 *
 * Uses the appropriate compare method based on the type.
 *
 * @param a - First date/time to compare
 * @param b - Second date/time to compare
 * @returns true if a is after b
 *
 * @example
 * ```ts
 * import { isAfter } from 'temporal-kit';
 *
 * const date1 = Temporal.PlainDate.from('2025-12-31');
 * const date2 = Temporal.PlainDate.from('2025-01-01');
 *
 * isAfter(date1, date2); // true
 * ```
 */
export function isAfter(a: DateLike, b: DateLike): boolean {
  return compare(a, b) > 0;
}

/**
 * Checks if two date/times are equal.
 *
 * Uses the appropriate compare method based on the type.
 *
 * @param a - First date/time to compare
 * @param b - Second date/time to compare
 * @returns true if a equals b
 *
 * @example
 * ```ts
 * import { isSame } from 'temporal-kit';
 *
 * const date1 = Temporal.PlainDate.from('2025-11-30');
 * const date2 = Temporal.PlainDate.from('2025-11-30');
 *
 * isSame(date1, date2); // true
 * ```
 */
export function isSame(a: DateLike, b: DateLike): boolean {
  return compare(a, b) === 0;
}

/**
 * Compares two date/time values.
 *
 * Returns:
 * - -1 if a is before b
 * - 0 if a equals b
 * - 1 if a is after b
 *
 * @param a - First date/time to compare
 * @param b - Second date/time to compare
 * @returns The comparison result (-1, 0, or 1)
 */
export function compare(a: DateLike, b: DateLike): number {
  // Check if both have time components (PlainDateTime or ZonedDateTime)
  if ("hour" in a && "hour" in b) {
    // Check if both have timezone (ZonedDateTime)
    if ("timeZoneId" in a && "timeZoneId" in b) {
      // For ZonedDateTime, convert to Instant for reliable comparison across timezones
      const instantA = (a as Temporal.ZonedDateTime).toInstant();
      const instantB = (b as Temporal.ZonedDateTime).toInstant();
      return Temporal.Instant.compare(instantA, instantB);
    }
    return Temporal.PlainDateTime.compare(a, b);
  }
  return Temporal.PlainDate.compare(a, b);
}

/**
 * Returns the earliest (minimum) date/time from the provided values.
 *
 * @param dates - Array of dates to compare
 * @returns The earliest date
 * @throws {TypeError} If the array is empty
 *
 * @example
 * ```ts
 * import { min } from 'temporal-kit';
 *
 * const dates = [
 *   Temporal.PlainDate.from('2025-03-15'),
 *   Temporal.PlainDate.from('2025-01-01'),
 *   Temporal.PlainDate.from('2025-12-31')
 * ];
 *
 * min(dates); // 2025-01-01
 * ```
 */
export function min<T extends DateLike>(dates: T[]): T {
  if (dates.length === 0) {
    throw new TypeError("Cannot find min of empty array");
  }

  return dates.reduce((earliest, current) => (compare(current, earliest) < 0 ? current : earliest));
}

/**
 * Returns the latest (maximum) date/time from the provided values.
 *
 * @param dates - Array of dates to compare
 * @returns The latest date
 * @throws {TypeError} If the array is empty
 *
 * @example
 * ```ts
 * import { max } from 'temporal-kit';
 *
 * const dates = [
 *   Temporal.PlainDate.from('2025-03-15'),
 *   Temporal.PlainDate.from('2025-01-01'),
 *   Temporal.PlainDate.from('2025-12-31')
 * ];
 *
 * max(dates); // 2025-12-31
 * ```
 */
export function max<T extends DateLike>(dates: T[]): T {
  if (dates.length === 0) {
    throw new TypeError("Cannot find max of empty array");
  }

  return dates.reduce((latest, current) => (compare(current, latest) > 0 ? current : latest));
}

/**
 * Checks if two dates are in the same year.
 *
 * @param a - First date
 * @param b - Second date
 * @returns true if both dates are in the same year
 *
 * @example
 * ```ts
 * import { isSameYear } from 'temporal-kit';
 *
 * isSameYear(
 *   Temporal.PlainDate.from('2025-01-01'),
 *   Temporal.PlainDate.from('2025-12-31')
 * ); // true
 * ```
 */
export function isSameYear(a: DateLike, b: DateLike): boolean {
  return a.year === b.year;
}

/**
 * Checks if two dates are in the same month (and year).
 *
 * @param a - First date
 * @param b - Second date
 * @returns true if both dates are in the same month and year
 *
 * @example
 * ```ts
 * import { isSameMonth } from 'temporal-kit';
 *
 * isSameMonth(
 *   Temporal.PlainDate.from('2025-01-01'),
 *   Temporal.PlainDate.from('2025-01-31')
 * ); // true
 * ```
 */
export function isSameMonth(a: DateLike, b: DateLike): boolean {
  return a.year === b.year && a.month === b.month;
}

/**
 * Checks if two dates are in the same week (and year).
 * Uses ISO week numbering by default (Monday start).
 *
 * @param a - First date
 * @param b - Second date
 * @returns true if both dates are in the same week and year
 *
 * @example
 * ```ts
 * import { isSameWeek } from 'temporal-kit';
 *
 * isSameWeek(
 *   Temporal.PlainDate.from('2025-01-01'), // Wednesday
 *   Temporal.PlainDate.from('2025-01-05')  // Sunday
 * ); // true
 * ```
 */
export function isSameWeek(a: DateLike, b: DateLike): boolean {
  return a.yearOfWeek === b.yearOfWeek && a.weekOfYear === b.weekOfYear;
}

/**
 * Checks if two dates are on the same day (year, month, and day).
 *
 * @param a - First date
 * @param b - Second date
 * @returns true if both dates are on the same day
 *
 * @example
 * ```ts
 * import { isSameDay } from 'temporal-kit';
 *
 * isSameDay(
 *   Temporal.PlainDate.from('2025-01-01'),
 *   Temporal.PlainDateTime.from('2025-01-01T15:00')
 * ); // true
 * ```
 */
export function isSameDay(a: DateLike, b: DateLike): boolean {
  return a.year === b.year && a.month === b.month && a.day === b.day;
}

/**
 * Checks if a date is between two other dates (inclusive).
 *
 * @param date - The date to check
 * @param start - The start of the range
 * @param end - The end of the range
 * @returns true if date is between start and end (inclusive)
 *
 * @example
 * ```ts
 * import { isBetween } from 'temporal-kit';
 *
 * const date = Temporal.PlainDate.from('2025-01-15');
 * const start = Temporal.PlainDate.from('2025-01-01');
 * const end = Temporal.PlainDate.from('2025-01-31');
 *
 * isBetween(date, start, end); // true
 * ```
 */
export function isBetween(date: DateLike, start: DateLike, end: DateLike): boolean {
  return compare(date, start) >= 0 && compare(date, end) <= 0;
}

/**
 * Clamps a date within a range.
 *
 * @param date - The date to clamp
 * @param minDate - The minimum allowed date
 * @param maxDate - The maximum allowed date
 * @returns The clamped date
 *
 * @example
 * ```ts
 * import { clamp } from 'temporal-kit';
 *
 * const date = Temporal.PlainDate.from('2025-02-01');
 * const min = Temporal.PlainDate.from('2025-01-01');
 * const max = Temporal.PlainDate.from('2025-01-31');
 *
 * clamp(date, min, max); // 2025-01-31
 * ```
 */
export function clamp<T extends DateLike>(date: T, minDate: T, maxDate: T): T {
  if (compare(date, minDate) < 0) return minDate;
  if (compare(date, maxDate) > 0) return maxDate;
  return date;
}
