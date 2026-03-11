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

/**
 * Checks if a string is a valid ISO 8601 instant string (UTC timestamp).
 *
 * @param instantString - The string to validate
 * @returns true if the string is a valid instant
 *
 * @example
 * ```ts
 * import { isValidInstantString } from 'temporal-kit';
 *
 * isValidInstantString('2025-12-31T15:30:00Z'); // true
 * isValidInstantString('2025-12-31T15:30:00+02:00'); // true
 * isValidInstantString('2025-12-31'); // false
 * ```
 */
export function isValidInstantString(instantString: string): boolean {
  try {
    Temporal.Instant.from(instantString);
    return true;
  } catch {
    return false;
  }
}

/**
 * Checks if a string is a valid RFC 9557 zoned date-time string.
 *
 * @param zonedString - The string to validate
 * @returns true if the string is a valid zoned date-time
 *
 * @example
 * ```ts
 * import { isValidZonedString } from 'temporal-kit';
 *
 * isValidZonedString('2025-12-31T15:30:00+01:00[Europe/Berlin]'); // true
 * isValidZonedString('2025-12-31T15:30:00Z'); // false (no IANA identifier)
 * isValidZonedString('invalid'); // false
 * ```
 */
export function isValidZonedString(zonedString: string): boolean {
  try {
    Temporal.ZonedDateTime.from(zonedString);
    return true;
  } catch {
    return false;
  }
}
