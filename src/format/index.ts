import { Temporal } from "temporal-polyfill";
import type { DateLike, TimeLike } from "../types/index.js";

/**
 * Format options for date/time formatting
 */
export interface FormatOptions {
  /** Locale(s) to use for formatting (default: system locale) */
  locale?: string | string[];
  /** Date style: 'full' | 'long' | 'medium' | 'short' */
  dateStyle?: "full" | "long" | "medium" | "short";
  /** Time style: 'full' | 'long' | 'medium' | 'short' */
  timeStyle?: "full" | "long" | "medium" | "short";
  /** Custom format options (overrides dateStyle/timeStyle) */
  options?: Intl.DateTimeFormatOptions;
}

/**
 * Format a DateLike value using Intl.DateTimeFormat
 * @param date - Date value to format
 * @param opts - Formatting options
 * @returns Formatted string
 * @example
 * const date = Temporal.PlainDate.from('2025-11-30');
 * format(date) // "11/30/2025" (en-US)
 * format(date, { dateStyle: 'full' }) // "Saturday, November 30, 2025"
 * format(date, { locale: 'de-DE' }) // "30.11.2025"
 */
export function format(date: DateLike, opts: FormatOptions = {}): string {
  const { locale, dateStyle = "medium", timeStyle, options } = opts;

  // Convert to a format Intl can handle
  let formattable: Date;

  if (date instanceof Temporal.PlainDate) {
    // PlainDate -> convert to midnight in system timezone
    const dt = date.toPlainDateTime(Temporal.PlainTime.from("00:00:00"));
    const zdt = dt.toZonedDateTime(Temporal.Now.timeZoneId());
    formattable = new Date(zdt.epochMilliseconds);
  } else if (date instanceof Temporal.PlainDateTime) {
    // PlainDateTime -> convert to ZonedDateTime in system timezone
    const zdt = date.toZonedDateTime(Temporal.Now.timeZoneId());
    formattable = new Date(zdt.epochMilliseconds);
  } else {
    // ZonedDateTime -> direct conversion
    formattable = new Date(date.epochMilliseconds);
  }

  // Build format options
  const formatOptions: Intl.DateTimeFormatOptions = options || {
    dateStyle,
    timeStyle,
  };

  return new Intl.DateTimeFormat(locale, formatOptions).format(formattable);
}

/**
 * Format a TimeLike value using Intl.DateTimeFormat
 * @param time - Time value to format
 * @param opts - Formatting options
 * @returns Formatted string
 * @example
 * const time = Temporal.PlainTime.from('15:30:00');
 * formatTime(time) // "3:30:00 PM" (en-US)
 * formatTime(time, { timeStyle: 'short' }) // "3:30 PM"
 * formatTime(time, { locale: 'de-DE' }) // "15:30:00"
 */
export function formatTime(time: TimeLike, opts: FormatOptions = {}): string {
  const { locale, timeStyle = "medium", options } = opts;

  // Convert to a format Intl can handle
  let formattable: Date;

  if (time instanceof Temporal.PlainTime) {
    // PlainTime -> combine with arbitrary date in system timezone
    const dt = Temporal.PlainDate.from("2000-01-01").toPlainDateTime(time);
    const zdt = dt.toZonedDateTime(Temporal.Now.timeZoneId());
    formattable = new Date(zdt.epochMilliseconds);
  } else if (time instanceof Temporal.PlainDateTime) {
    const zdt = time.toZonedDateTime(Temporal.Now.timeZoneId());
    formattable = new Date(zdt.epochMilliseconds);
  } else {
    // ZonedDateTime
    formattable = new Date(time.epochMilliseconds);
  }

  // Build format options
  const formatOptions: Intl.DateTimeFormatOptions = options || {
    timeStyle,
  };

  return new Intl.DateTimeFormat(locale, formatOptions).format(formattable);
}

/**
 * Format a DateLike value with both date and time
 * @param date - Date value to format
 * @param opts - Formatting options
 * @returns Formatted string
 * @example
 * const dt = Temporal.PlainDateTime.from('2025-11-30T15:30:00');
 * formatDateTime(dt) // "11/30/2025, 3:30:00 PM" (en-US)
 * formatDateTime(dt, { dateStyle: 'long', timeStyle: 'short' }) // "November 30, 2025 at 3:30 PM"
 */
export function formatDateTime(date: DateLike, opts: FormatOptions = {}): string {
  const { locale, dateStyle = "medium", timeStyle = "medium", options } = opts;

  // Convert to a format Intl can handle
  let formattable: Date;

  if (date instanceof Temporal.PlainDate) {
    // PlainDate with time doesn't make much sense, but convert to midnight
    const dt = date.toPlainDateTime(Temporal.PlainTime.from("00:00:00"));
    const zdt = dt.toZonedDateTime(Temporal.Now.timeZoneId());
    formattable = new Date(zdt.epochMilliseconds);
  } else if (date instanceof Temporal.PlainDateTime) {
    const zdt = date.toZonedDateTime(Temporal.Now.timeZoneId());
    formattable = new Date(zdt.epochMilliseconds);
  } else {
    formattable = new Date(date.epochMilliseconds);
  }

  // Build format options
  const formatOptions: Intl.DateTimeFormatOptions = options || {
    dateStyle,
    timeStyle,
  };

  return new Intl.DateTimeFormat(locale, formatOptions).format(formattable);
}

/**
 * Format relative time (e.g., "2 days ago", "in 3 hours")
 * @param date - Date to compare
 * @param base - Base date to compare against (default: now)
 * @param opts - Formatting options
 * @returns Formatted relative time string
 * @example
 * const past = Temporal.PlainDate.from('2025-11-28');
 * const now = Temporal.PlainDate.from('2025-11-30');
 * formatRelative(past, now) // "2 days ago"
 *
 * const future = Temporal.PlainDate.from('2025-12-05');
 * formatRelative(future, now) // "in 5 days"
 */
export function formatRelative(
  date: DateLike,
  base?: DateLike,
  opts: { locale?: string | string[] } = {},
): string {
  const { locale } = opts;

  // Default base to now
  const baseDate = base || Temporal.Now.zonedDateTimeISO().toPlainDate();

  // Convert both to PlainDate for comparison
  const targetDate = date instanceof Temporal.PlainDate ? date : date.toPlainDate();
  const referenceDate = baseDate instanceof Temporal.PlainDate ? baseDate : baseDate.toPlainDate();

  // Calculate difference in days
  const diff = targetDate.since(referenceDate, { largestUnit: "day" });
  const days = diff.days;

  // Use Intl.RelativeTimeFormat
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

  // Choose appropriate unit
  if (Math.abs(days) === 0) {
    return rtf.format(0, "day"); // "today"
  }
  if (Math.abs(days) < 7) {
    return rtf.format(days, "day");
  }
  if (Math.abs(days) < 30) {
    const weeks = Math.round(days / 7);
    return rtf.format(weeks, "week");
  }
  if (Math.abs(days) < 365) {
    const months = Math.round(days / 30);
    return rtf.format(months, "month");
  }

  const years = Math.round(days / 365);
  return rtf.format(years, "year");
}
