/**
 * Parse module - Smart string-to-Temporal parsing with format detection
 */

import { fromISO } from "../convert/index.js";
import { Temporal } from "../temporal.js";

/**
 * Parse a string into the most appropriate Temporal type based on format detection.
 *
 * Supports:
 * - ISO 8601 formats (date, datetime, zoned datetime, instant)
 * - Common date formats (YYYY-MM-DD, DD.MM.YYYY, MM/DD/YYYY)
 * - Common time formats (HH:MM:SS, HH:MM)
 * - Combined date-time formats
 *
 * @param input - String to parse
 * @returns The most appropriate Temporal type
 * @throws {RangeError} If string format is not recognized or invalid
 *
 * @example
 * ```typescript
 * parse('2025-11-30'); // PlainDate
 * parse('2025-11-30T15:30:00'); // PlainDateTime
 * parse('2025-11-30T15:30:00Z'); // Instant
 * parse('2025-11-30T15:30:00+01:00[Europe/Berlin]'); // ZonedDateTime
 * parse('15:30:00'); // PlainTime
 * parse('30.11.2025'); // PlainDate
 * parse('11/30/2025'); // PlainDate
 * ```
 */
export function parse(
  input: string,
):
  | Temporal.PlainDate
  | Temporal.PlainDateTime
  | Temporal.ZonedDateTime
  | Temporal.Instant
  | Temporal.PlainTime {
  const trimmed = input.trim();
  const result =
    parseDateTimeFormats(trimmed) ??
    attempt(() => fromISO(trimmed)) ??
    attempt(() => (/^\d{2}:\d{2}/.test(trimmed) ? Temporal.PlainTime.from(trimmed) : null)) ??
    attempt(() => parseDateFormats(trimmed)) ??
    parseTimeFormats(trimmed);

  if (result) {
    return result;
  }

  throw new RangeError(
    `Unable to parse "${input}". Expected ISO 8601 format or common date/time format. ` +
      'Examples: "2025-11-30", "2025-11-30T15:30:00", "30.11.2025", "11/30/2025", "15:30:00"',
  );
}

/**
 * Parse a string specifically as a PlainDate.
 *
 * @param input - String to parse
 * @returns PlainDate
 * @throws {RangeError} If string cannot be parsed as a date
 *
 * @example
 * ```typescript
 * parseDate('2025-11-30'); // PlainDate
 * parseDate('30.11.2025'); // PlainDate
 * parseDate('11/30/2025'); // PlainDate
 * ```
 */
export function parseDate(input: string): Temporal.PlainDate {
  const trimmed = input.trim();
  const result = attempt(() => Temporal.PlainDate.from(trimmed)) ?? parseDateFormats(trimmed);
  if (result) {
    return result;
  }

  throw new RangeError(
    `Unable to parse "${input}" as date. Expected formats: YYYY-MM-DD, DD.MM.YYYY, MM/DD/YYYY`,
  );
}

/**
 * Parse a string specifically as a PlainTime.
 *
 * @param input - String to parse
 * @returns PlainTime
 * @throws {RangeError} If string cannot be parsed as a time
 *
 * @example
 * ```typescript
 * parseTime('15:30:00'); // PlainTime
 * parseTime('15:30'); // PlainTime
 * parseTime('3:30 PM'); // PlainTime
 * ```
 */
export function parseTime(input: string): Temporal.PlainTime {
  const trimmed = input.trim();
  const result = attempt(() => Temporal.PlainTime.from(trimmed)) ?? parseTimeFormats(trimmed);
  if (result) {
    return result;
  }

  throw new RangeError(
    `Unable to parse "${input}" as time. Expected formats: HH:MM:SS, HH:MM, h:MM AM/PM`,
  );
}

/**
 * Parse a string specifically as a PlainDateTime.
 *
 * @param input - String to parse
 * @returns PlainDateTime
 * @throws {RangeError} If string cannot be parsed as a datetime
 *
 * @example
 * ```typescript
 * parseDateTime('2025-11-30T15:30:00'); // PlainDateTime
 * parseDateTime('2025-11-30 15:30:00'); // PlainDateTime
 * parseDateTime('30.11.2025 15:30'); // PlainDateTime
 * ```
 */
export function parseDateTime(input: string): Temporal.PlainDateTime {
  const trimmed = input.trim();
  // Without "T", PlainDateTime.from would silently accept a bare date as midnight.
  const result =
    (trimmed.includes("T") ? attempt(() => Temporal.PlainDateTime.from(trimmed)) : null) ??
    parseDateTimeFormats(trimmed);
  if (result) {
    return result;
  }

  throw new RangeError(
    `Unable to parse "${input}" as datetime. Expected formats: YYYY-MM-DDTHH:MM:SS, YYYY-MM-DD HH:MM:SS, DD.MM.YYYY HH:MM`,
  );
}

function attempt<T>(parse: () => T | null): T | null {
  try {
    return parse();
  } catch {
    return null;
  }
}

// [pattern, year group, month group, day group]
const DATE_FORMATS: Array<[RegExp, number, number, number]> = [
  [/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/, 3, 2, 1], // DD.MM.YYYY
  [/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/, 3, 1, 2], // MM/DD/YYYY
  [/^(\d{1,2})-(\d{1,2})-(\d{4})$/, 3, 2, 1], // DD-MM-YYYY
  [/^(\d{4})\/(\d{1,2})\/(\d{1,2})$/, 1, 2, 3], // YYYY/MM/DD
];

function parseDateFormats(input: string): Temporal.PlainDate | null {
  for (const [pattern, year, month, day] of DATE_FORMATS) {
    const match = pattern.exec(input);
    if (match) {
      return Temporal.PlainDate.from(
        { year: Number(match[year]), month: Number(match[month]), day: Number(match[day]) },
        { overflow: "reject" },
      );
    }
  }
  return null;
}

/** Parses H:MM, H:MM:SS and their 12-hour variants with AM/PM. */
function parseTimeFormats(input: string): Temporal.PlainTime | null {
  const match = /^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?$/i.exec(input);
  if (!match) return null;

  const period = match[4]?.toUpperCase();
  let hour = Number(match[1]);
  if (period) {
    if (hour < 1 || hour > 12) return null;
    hour = (hour % 12) + (period === "PM" ? 12 : 0);
  }

  return Temporal.PlainTime.from(
    { hour, minute: Number(match[2]), second: Number(match[3] ?? 0) },
    { overflow: "reject" },
  );
}

/** Parses "<date> <time>" where each part may be ISO or one of the common formats. */
function parseDateTimeFormats(input: string): Temporal.PlainDateTime | null {
  const spaceIdx = input.indexOf(" ");
  if (spaceIdx === -1) return null;

  const date = attempt(() => parseDate(input.slice(0, spaceIdx)));
  const time = attempt(() => parseTime(input.slice(spaceIdx + 1)));
  return date && time ? date.toPlainDateTime(time) : null;
}
