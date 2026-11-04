/**
 * Collection helpers for working with arrays of Temporal objects
 * @module collection
 */

import { compare } from "../compare/index.js";
import { isZonedDateTime } from "../guards/index.js";
import type { DateLike } from "../types/index.js";

/**
 * Sorts an array of dates in ascending order.
 * Returns a new array, leaving the original array unchanged.
 *
 * @param dates - Array of dates to sort
 * @returns A new sorted array
 *
 * @example
 * ```ts
 * import { sortAsc } from 'temporal-kit';
 *
 * const dates = [
 *   Temporal.PlainDate.from('2025-12-31'),
 *   Temporal.PlainDate.from('2025-01-01')
 * ];
 *
 * const sorted = sortAsc(dates);
 * // [2025-01-01, 2025-12-31]
 * ```
 */
export function sortAsc<T extends DateLike>(dates: T[]): T[] {
  return [...dates].sort(compare);
}

/**
 * Sorts an array of dates in descending order.
 * Returns a new array, leaving the original array unchanged.
 *
 * @param dates - Array of dates to sort
 * @returns A new sorted array
 *
 * @example
 * ```ts
 * import { sortDesc } from 'temporal-kit';
 *
 * const dates = [
 *   Temporal.PlainDate.from('2025-01-01'),
 *   Temporal.PlainDate.from('2025-12-31')
 * ];
 *
 * const sorted = sortDesc(dates);
 * // [2025-12-31, 2025-01-01]
 * ```
 */
export function sortDesc<T extends DateLike>(dates: T[]): T[] {
  return [...dates].sort((a, b) => -compare(a, b));
}

/**
 * Returns the date from the array closest to the given date.
 *
 * @param dateToCompare - The target date
 * @param dates - Array of dates to search
 * @returns The closest date, or undefined if array is empty
 *
 * @example
 * ```ts
 * import { closestTo } from 'temporal-kit';
 *
 * const target = Temporal.PlainDate.from('2025-06-01');
 * const dates = [
 *   Temporal.PlainDate.from('2025-01-01'),
 *   Temporal.PlainDate.from('2025-12-31')
 * ];
 *
 * closestTo(target, dates); // 2025-01-01 (closer than Dec 31)
 * ```
 */
export function closestTo<T extends DateLike>(dateToCompare: T, dates: T[]): T | undefined {
  let closest: T | undefined;
  let closestDiff = 0n;

  for (const current of dates) {
    const diff = epochNanoseconds(dateToCompare) - epochNanoseconds(current);
    const absDiff = diff < 0n ? -diff : diff;
    if (closest === undefined || absDiff < closestDiff) {
      closest = current;
      closestDiff = absDiff;
    }
  }

  return closest;
}

/** Plain values are interpreted in UTC so mixed types can be measured on one timeline. */
function epochNanoseconds(date: DateLike): bigint {
  return (isZonedDateTime(date) ? date : date.toZonedDateTime("UTC")).epochNanoseconds;
}
