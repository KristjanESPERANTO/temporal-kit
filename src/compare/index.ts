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
  // Use PlainDateTime.compare for DateTime, ZonedDateTime.compare for ZonedDateTime, else PlainDate.compare
  if ("hour" in a && "hour" in b) {
    if ("timeZoneId" in a && "timeZoneId" in b) {
      // For ZonedDateTime, convert to Instant for reliable comparison across timezones
      const instantA = (a as Temporal.ZonedDateTime).toInstant();
      const instantB = (b as Temporal.ZonedDateTime).toInstant();
      return Temporal.Instant.compare(instantA, instantB) < 0;
    }
    return Temporal.PlainDateTime.compare(a, b) < 0;
  }
  return Temporal.PlainDate.compare(a, b) < 0;
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
  if ("hour" in a && "hour" in b) {
    if ("timeZoneId" in a && "timeZoneId" in b) {
      // For ZonedDateTime, convert to Instant for reliable comparison across timezones
      const instantA = (a as Temporal.ZonedDateTime).toInstant();
      const instantB = (b as Temporal.ZonedDateTime).toInstant();
      return Temporal.Instant.compare(instantA, instantB) > 0;
    }
    return Temporal.PlainDateTime.compare(a, b) > 0;
  }
  return Temporal.PlainDate.compare(a, b) > 0;
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
  if ("hour" in a && "hour" in b) {
    if ("timeZoneId" in a && "timeZoneId" in b) {
      // For ZonedDateTime, convert to Instant for reliable comparison across timezones
      const instantA = (a as Temporal.ZonedDateTime).toInstant();
      const instantB = (b as Temporal.ZonedDateTime).toInstant();
      return Temporal.Instant.compare(instantA, instantB) === 0;
    }
    return Temporal.PlainDateTime.compare(a, b) === 0;
  }
  return Temporal.PlainDate.compare(a, b) === 0;
}

/**
 * Helper function to compare two DateLike values using the appropriate compare method.
 * @internal
 */
function compareValues<T extends DateLike>(a: T, b: T): number {
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

  return dates.reduce((earliest, current) =>
    compareValues(current, earliest) < 0 ? current : earliest,
  );
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

  return dates.reduce((latest, current) => (compareValues(current, latest) > 0 ? current : latest));
}
