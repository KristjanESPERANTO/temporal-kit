import { Temporal } from "../temporal.js";

/**
 * Checks if a string is a valid IANA timezone identifier.
 *
 * @param timezone - The timezone string to check
 * @returns True if the timezone is valid, false otherwise
 *
 * @example
 * ```ts
 * isValidTimezone('Europe/Berlin'); // true
 * isValidTimezone('Invalid/Timezone'); // false
 * ```
 */
export function isValidTimezone(timezone: string): boolean {
  try {
    getTimezoneName(timezone);
    return true;
  } catch {
    return false;
  }
}

/**
 * Gets the timezone ID from a string or ZonedDateTime.
 * Throws a RangeError if the timezone is invalid.
 *
 * @param timezone - The timezone string or ZonedDateTime
 * @returns The timezone ID
 *
 * @example
 * ```ts
 * getTimezoneName('Europe/Berlin'); // 'Europe/Berlin'
 * getTimezoneName('UTC'); // 'UTC'
 * ```
 */
export function getTimezoneName(
  timezone: string | { id: string } | Temporal.ZonedDateTime,
): string {
  if (typeof timezone === "string") {
    return Temporal.Now.zonedDateTimeISO(timezone).timeZoneId;
  }
  return "timeZoneId" in timezone ? timezone.timeZoneId : timezone.id;
}
