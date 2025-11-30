import { Temporal } from "temporal-polyfill";
import type { DateLike } from "../types/index.js";

/**
 * Get current date and time in the system timezone
 * @returns Current ZonedDateTime in system timezone
 * @example
 * const now = now()
 * console.log(now.toString()) // "2025-11-30T15:30:00+01:00[Europe/Berlin]"
 */
export function now(): Temporal.ZonedDateTime {
  return Temporal.Now.zonedDateTimeISO();
}

/**
 * Parse an ISO 8601 string into the appropriate Temporal type
 * @param isoString - ISO 8601 formatted string
 * @returns PlainDate, PlainDateTime, ZonedDateTime, or Instant depending on the format
 * @example
 * fromISO('2025-11-30') // PlainDate
 * fromISO('2025-11-30T15:30:00') // PlainDateTime
 * fromISO('2025-11-30T15:30:00+01:00[Europe/Berlin]') // ZonedDateTime
 * fromISO('2025-11-30T14:30:00Z') // Instant
 */
export function fromISO(
  isoString: string,
): Temporal.PlainDate | Temporal.PlainDateTime | Temporal.ZonedDateTime | Temporal.Instant {
  // Try to detect format by presence of timezone/offset indicators
  if (isoString.includes("[") || /[+-]\d{2}:\d{2}$/.test(isoString)) {
    // Has timezone identifier or offset
    return Temporal.ZonedDateTime.from(isoString);
  }

  if (isoString.endsWith("Z") || /[+-]\d{2}:\d{2}/.test(isoString)) {
    // Has Z or offset but no timezone - treat as Instant
    return Temporal.Instant.from(isoString);
  }

  if (isoString.includes("T")) {
    // Has time component but no timezone
    return Temporal.PlainDateTime.from(isoString);
  }

  // Just a date
  return Temporal.PlainDate.from(isoString);
}

/**
 * Convert any DateLike to PlainDate (discards time and timezone info)
 * @param date - PlainDate, PlainDateTime, or ZonedDateTime
 * @returns PlainDate representing the calendar date
 * @example
 * const zdt = Temporal.ZonedDateTime.from('2025-11-30T15:30:00+01:00[Europe/Berlin]')
 * const date = toPlainDate(zdt) // 2025-11-30
 */
export function toPlainDate(date: DateLike): Temporal.PlainDate {
  if (date instanceof Temporal.PlainDate) {
    return date;
  }
  return date.toPlainDate();
}

/**
 * Convert PlainDateTime or ZonedDateTime to PlainDateTime (discards timezone)
 * For PlainDate, you must provide an explicit time to convert to PlainDateTime
 * @param date - PlainDateTime or ZonedDateTime
 * @returns PlainDateTime
 * @example
 * const zdt = Temporal.ZonedDateTime.from('2025-11-30T15:30:00+01:00[Europe/Berlin]')
 * const pdt = toPlainDateTime(zdt) // 2025-11-30T15:30:00
 */
export function toPlainDateTime(
  date: Temporal.PlainDateTime | Temporal.ZonedDateTime,
): Temporal.PlainDateTime {
  if (date instanceof Temporal.PlainDateTime) {
    return date;
  }
  return date.toPlainDateTime();
}

/**
 * Convert any DateLike to ZonedDateTime
 * @param date - PlainDate, PlainDateTime, or ZonedDateTime
 * @param timeZone - IANA timezone identifier (required for PlainDate and PlainDateTime)
 * @returns ZonedDateTime in the specified (or existing) timezone
 * @example
 * const date = Temporal.PlainDate.from('2025-11-30')
 * const zdt = toZonedDateTime(date, 'Europe/Berlin') // 2025-11-30T00:00:00+01:00[Europe/Berlin]
 *
 * const pdt = Temporal.PlainDateTime.from('2025-11-30T15:30:00')
 * const zdt2 = toZonedDateTime(pdt, 'America/New_York') // 2025-11-30T15:30:00-05:00[America/New_York]
 */
export function toZonedDateTime(date: DateLike, timeZone?: string): Temporal.ZonedDateTime {
  if (date instanceof Temporal.ZonedDateTime) {
    // If already ZonedDateTime, optionally convert to different timezone
    return timeZone ? date.withTimeZone(timeZone) : date;
  }

  if (!timeZone) {
    throw new TypeError(
      "timeZone is required when converting PlainDate or PlainDateTime to ZonedDateTime",
    );
  }

  return date.toZonedDateTime(timeZone);
}
