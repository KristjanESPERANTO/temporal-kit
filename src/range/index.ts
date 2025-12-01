/**
 * Range operations for Temporal types
 * @module range
 */

import { Temporal } from "temporal-polyfill";
import { isAfter, isBefore } from "../compare/index.js";
import type { DateLike } from "../types/index.js";

/**
 * Represents a time interval with a start and end
 */
export interface Interval<T extends DateLike> {
  start: T;
  end: T;
}

/**
 * Checks if two time intervals overlap.
 *
 * @param range1 - First interval
 * @param range2 - Second interval
 * @returns true if the intervals overlap
 *
 * @example
 * ```ts
 * const start1 = Temporal.PlainDate.from('2025-01-01');
 * const end1 = Temporal.PlainDate.from('2025-01-10');
 * const start2 = Temporal.PlainDate.from('2025-01-05');
 * const end2 = Temporal.PlainDate.from('2025-01-15');
 *
 * rangesOverlap({ start: start1, end: end1 }, { start: start2, end: end2 }); // true
 * ```
 */
export function rangesOverlap<T extends DateLike>(
  range1: Interval<T>,
  range2: Interval<T>,
): boolean {
  // Two ranges overlap if (StartA < EndB) and (EndA > StartB)
  return isBefore(range1.start, range2.end) && isAfter(range1.end, range2.start);
}

/**
 * Generator that yields each step in an interval.
 *
 * @param interval - The interval to iterate over
 * @param duration - The duration to step by (e.g. { days: 1 })
 * @returns Generator yielding dates
 */
export function* stepInterval<T extends DateLike>(
  interval: Interval<T>,
  duration: Temporal.DurationLike,
): Generator<T> {
  const { start, end } = interval;
  let current = start;

  // Determine if we should stop (current > end)
  while (!isAfter(current, end)) {
    yield current;

    // Add duration. We need to cast because .add is generic on the instance
    // but TypeScript doesn't know 'current' has .add method from DateLike union strictly without narrowing
    // However, all DateLike types (PlainDate, PlainDateTime, ZonedDateTime) have .add
    if (current instanceof Temporal.PlainDate) {
      current = current.add(duration) as T;
    } else if (current instanceof Temporal.PlainDateTime) {
      current = current.add(duration) as T;
    } else if (current instanceof Temporal.ZonedDateTime) {
      current = current.add(duration) as T;
    } else {
      throw new TypeError("Unsupported Temporal type");
    }
  }
}

/**
 * Returns an array of days within the specified interval.
 *
 * @param interval - The interval (start and end dates)
 * @returns Array of PlainDate objects
 *
 * @example
 * ```ts
 * const start = Temporal.PlainDate.from('2025-01-01');
 * const end = Temporal.PlainDate.from('2025-01-03');
 * eachDayOfInterval({ start, end });
 * // [2025-01-01, 2025-01-02, 2025-01-03]
 * ```
 */
export function eachDayOfInterval<T extends DateLike>(interval: Interval<T>): T[] {
  return Array.from(stepInterval(interval, { days: 1 }));
}

/**
 * Returns an array of weeks within the specified interval.
 *
 * @param interval - The interval
 * @returns Array of dates separated by 1 week
 */
export function eachWeekOfInterval<T extends DateLike>(interval: Interval<T>): T[] {
  return Array.from(stepInterval(interval, { weeks: 1 }));
}
