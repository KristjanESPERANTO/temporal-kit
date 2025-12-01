import { Temporal } from "temporal-polyfill";

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
    // Use ZonedDateTime to validate the timezone string.
    Temporal.ZonedDateTime.from({
      year: 2024,
      month: 1,
      day: 1,
      timeZone: timezone,
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * Gets the canonical timezone ID from a string or TimeZone object.
 * Throws an error if the timezone is invalid.
 *
 * @param timezone - The timezone string or object
 * @returns The canonical timezone ID
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
    const zdt = Temporal.ZonedDateTime.from({
      year: 2024,
      month: 1,
      day: 1,
      timeZone: timezone,
    });
    return zdt.timeZoneId;
  }

  if ("timeZoneId" in timezone) {
    return timezone.timeZoneId;
  }

  // It's a TimeZone object (or similar)
  return timezone.id;
}
