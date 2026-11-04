/**
 * Validation helpers for Temporal strings
 * @module validation
 */

import { Temporal } from "../temporal.js";

function succeeds(parse: () => unknown): boolean {
  try {
    parse();
    return true;
  } catch {
    return false;
  }
}

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
  return succeeds(() => Temporal.PlainDate.from(dateString));
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
  return succeeds(() => Temporal.PlainTime.from(timeString));
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
  return succeeds(() => Temporal.PlainDateTime.from(dateTimeString));
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
  return succeeds(() => Temporal.Instant.from(instantString));
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
  return succeeds(() => Temporal.ZonedDateTime.from(zonedString));
}
