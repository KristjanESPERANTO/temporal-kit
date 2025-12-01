/**
 * Validation helpers for Temporal strings
 * @module validation
 */

import { Temporal } from "temporal-polyfill";

/**
 * Checks if a string is a valid ISO 8601 date string (YYYY-MM-DD).
 *
 * @param dateString - The string to validate
 * @returns true if the string is a valid date
 *
 * @example
 * ```ts
 * import { isValidDateString } from 'temporal-kit';
 *
 * isValidDateString('2025-12-31'); // true
 * isValidDateString('2025-13-01'); // false
 * ```
 */
export function isValidDateString(dateString: string): boolean {
  try {
    Temporal.PlainDate.from(dateString);
    return true;
  } catch {
    return false;
  }
}

/**
 * Checks if a string is a valid ISO 8601 time string (HH:MM:SS).
 *
 * @param timeString - The string to validate
 * @returns true if the string is a valid time
 *
 * @example
 * ```ts
 * import { isValidTimeString } from 'temporal-kit';
 *
 * isValidTimeString('15:30:00'); // true
 * isValidTimeString('25:00:00'); // false
 * ```
 */
export function isValidTimeString(timeString: string): boolean {
  try {
    Temporal.PlainTime.from(timeString);
    return true;
  } catch {
    return false;
  }
}

/**
 * Checks if a string is a valid ISO 8601 date-time string.
 *
 * @param dateTimeString - The string to validate
 * @returns true if the string is a valid date-time
 *
 * @example
 * ```ts
 * import { isValidDateTimeString } from 'temporal-kit';
 *
 * isValidDateTimeString('2025-12-31T15:30:00'); // true
 * isValidDateTimeString('invalid'); // false
 * ```
 */
export function isValidDateTimeString(dateTimeString: string): boolean {
  try {
    Temporal.PlainDateTime.from(dateTimeString);
    return true;
  } catch {
    return false;
  }
}
