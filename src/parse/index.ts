/**
 * Parse module - Smart string-to-Temporal parsing with format detection
 */

import { Temporal } from "temporal-polyfill";

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

  // Try combined date-time formats first (before trying ISO date which might partially match)
  if (trimmed.includes(" ")) {
    const dateTimeResult = parseDateTimeFormats(trimmed);
    if (dateTimeResult) {
      return dateTimeResult;
    }
  }

  // Try ISO 8601 (fastest path for standard formats)
  try {
    // Check for Instant (Z suffix or offset without timezone name)
    if (trimmed.endsWith("Z") || (/[+-]\d{2}:\d{2}$/.test(trimmed) && !trimmed.includes("["))) {
      return Temporal.Instant.from(trimmed);
    }

    // Check for ZonedDateTime (contains timezone in brackets)
    if (trimmed.includes("[") && trimmed.includes("]")) {
      return Temporal.ZonedDateTime.from(trimmed);
    }

    // Check for PlainDateTime (has T separator)
    if (trimmed.includes("T")) {
      return Temporal.PlainDateTime.from(trimmed);
    }

    // Check for PlainTime (HH:MM or HH:MM:SS format)
    if (/^\d{2}:\d{2}(:\d{2})?(\.\d+)?$/.test(trimmed)) {
      return Temporal.PlainTime.from(trimmed);
    }

    // Try PlainDate (only if no space - otherwise it would have been caught above)
    if (!trimmed.includes(" ")) {
      return Temporal.PlainDate.from(trimmed);
    }
  } catch {
    // ISO parsing failed, try common formats
  }

  // Try common date formats
  const dateResult = parseDateFormats(trimmed);
  if (dateResult) {
    return dateResult;
  }

  // Try common time formats
  const timeResult = parseTimeFormats(trimmed);
  if (timeResult) {
    return timeResult;
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

  // Try ISO format first
  try {
    return Temporal.PlainDate.from(trimmed);
  } catch {
    // Continue to other formats
  }

  // Try common formats
  const result = parseDateFormats(trimmed);
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

  // Try ISO format first
  try {
    return Temporal.PlainTime.from(trimmed);
  } catch {
    // Continue to other formats
  }

  // Try common formats
  const result = parseTimeFormats(trimmed);
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

  // Try ISO format first (with T separator)
  if (trimmed.includes("T")) {
    try {
      return Temporal.PlainDateTime.from(trimmed);
    } catch {
      // Continue to other formats
    }
  }

  // Try common formats
  const result = parseDateTimeFormats(trimmed);
  if (result) {
    return result;
  }

  throw new RangeError(
    `Unable to parse "${input}" as datetime. Expected formats: YYYY-MM-DDTHH:MM:SS, YYYY-MM-DD HH:MM:SS, DD.MM.YYYY HH:MM`,
  );
}

// Helper functions for parsing common formats

function parseDateFormats(input: string): Temporal.PlainDate | null {
  // DD.MM.YYYY (European format)
  const europeanMatch = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/.exec(input);
  if (europeanMatch?.[1] && europeanMatch[2] && europeanMatch[3]) {
    return Temporal.PlainDate.from(
      {
        year: Number.parseInt(europeanMatch[3], 10),
        month: Number.parseInt(europeanMatch[2], 10),
        day: Number.parseInt(europeanMatch[1], 10),
      },
      { overflow: "reject" },
    );
  }

  // MM/DD/YYYY (US format)
  const usMatch = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(input);
  if (usMatch?.[1] && usMatch[2] && usMatch[3]) {
    return Temporal.PlainDate.from(
      {
        year: Number.parseInt(usMatch[3], 10),
        month: Number.parseInt(usMatch[1], 10),
        day: Number.parseInt(usMatch[2], 10),
      },
      { overflow: "reject" },
    );
  }

  // DD-MM-YYYY (alternative format)
  const dashMatch = /^(\d{1,2})-(\d{1,2})-(\d{4})$/.exec(input);
  if (dashMatch?.[1] && dashMatch[2] && dashMatch[3]) {
    return Temporal.PlainDate.from(
      {
        year: Number.parseInt(dashMatch[3], 10),
        month: Number.parseInt(dashMatch[2], 10),
        day: Number.parseInt(dashMatch[1], 10),
      },
      { overflow: "reject" },
    );
  }

  // YYYY/MM/DD (alternative ISO-like)
  const isoSlashMatch = /^(\d{4})\/(\d{1,2})\/(\d{1,2})$/.exec(input);
  if (isoSlashMatch?.[1] && isoSlashMatch[2] && isoSlashMatch[3]) {
    return Temporal.PlainDate.from(
      {
        year: Number.parseInt(isoSlashMatch[1], 10),
        month: Number.parseInt(isoSlashMatch[2], 10),
        day: Number.parseInt(isoSlashMatch[3], 10),
      },
      { overflow: "reject" },
    );
  }

  return null;
}

function parseTimeFormats(input: string): Temporal.PlainTime | null {
  // 12-hour format with AM/PM
  const ampmMatch = /^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)$/i.exec(input);
  if (ampmMatch?.[1] && ampmMatch[2] && ampmMatch[4]) {
    let hour = Number.parseInt(ampmMatch[1], 10);
    const minute = ampmMatch[2];
    const second = ampmMatch[3];
    const period = ampmMatch[4];

    // Convert to 24-hour format
    if (period.toUpperCase() === "PM" && hour !== 12) {
      hour += 12;
    } else if (period.toUpperCase() === "AM" && hour === 12) {
      hour = 0;
    }

    return Temporal.PlainTime.from(
      {
        hour,
        minute: Number.parseInt(minute, 10),
        second: second ? Number.parseInt(second, 10) : 0,
      },
      { overflow: "reject" },
    );
  }

  // 24-hour format without seconds (HH:MM)
  const simpleMatch = /^(\d{1,2}):(\d{2})$/.exec(input);
  if (simpleMatch?.[1] && simpleMatch[2]) {
    return Temporal.PlainTime.from(
      {
        hour: Number.parseInt(simpleMatch[1], 10),
        minute: Number.parseInt(simpleMatch[2], 10),
        second: 0,
      },
      { overflow: "reject" },
    );
  }

  return null;
}

/**
 * Helper to combine a date and time into a PlainDateTime
 */
function combineDateAndTime(
  date: Temporal.PlainDate,
  time: Temporal.PlainTime,
): Temporal.PlainDateTime {
  return Temporal.PlainDateTime.from({
    year: date.year,
    month: date.month,
    day: date.day,
    hour: time.hour,
    minute: time.minute,
    second: time.second,
    millisecond: time.millisecond,
    microsecond: time.microsecond,
    nanosecond: time.nanosecond,
  });
}

/**
 * Try parsing datetime as space-separated date and time strings
 */
function parseDateTimeFormats(input: string): Temporal.PlainDateTime | null {
  const spaceMatch = /^(.+?)\s+(.+)$/.exec(input);
  if (!spaceMatch?.[1] || !spaceMatch[2]) {
    return null;
  }

  const dateStr = spaceMatch[1];
  const timeStr = spaceMatch[2];

  // Try ISO date + ISO time
  try {
    const date = Temporal.PlainDate.from(dateStr);
    const time = Temporal.PlainTime.from(timeStr);
    return combineDateAndTime(date, time);
  } catch {
    // Try next combination
  }

  // Try ISO date + common time format
  try {
    const date = Temporal.PlainDate.from(dateStr);
    const time = parseTimeFormats(timeStr);
    if (time) {
      return combineDateAndTime(date, time);
    }
  } catch {
    // Try next combination
  }

  // Try common date format + ISO time
  try {
    const date = parseDateFormats(dateStr);
    const time = date ? Temporal.PlainTime.from(timeStr) : null;
    if (date && time) {
      return combineDateAndTime(date, time);
    }
  } catch {
    // Try next combination
  }

  // Try common date format + common time format
  const date = parseDateFormats(dateStr);
  const time = parseTimeFormats(timeStr);
  if (date && time) {
    return combineDateAndTime(date, time);
  }

  return null;
}
