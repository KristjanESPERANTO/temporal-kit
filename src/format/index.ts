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
 * const future = Temporal.ZonedDateTime.from('2025-12-01T15:00:00+01:00[Europe/Berlin]');
 * formatRelative(future, now) // "in 3 hours"
 */
export function formatRelative(
  date: DateLike,
  base?: DateLike,
  opts: { locale?: string | string[]; numeric?: "always" | "auto" } = {},
): string {
  const { locale, numeric = "auto" } = opts;
  const reference = getReferenceDate(date, base);
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric });

  // Case 1: Both are PlainDate (Date only comparison)
  if (date instanceof Temporal.PlainDate && reference instanceof Temporal.PlainDate) {
    const diff = date.since(reference, { largestUnit: "day" });
    return formatDaysDiff(diff.days, rtf);
  }

  // Case 2: Time comparison involved
  return formatTimeDiff(date, reference, rtf);
}

function getReferenceDate(date: DateLike, base?: DateLike): DateLike {
  if (base) return base;
  if (date instanceof Temporal.PlainDate) return Temporal.Now.plainDateISO();
  if (date instanceof Temporal.PlainDateTime) return Temporal.Now.plainDateTimeISO();
  return Temporal.Now.zonedDateTimeISO();
}

function formatDaysDiff(days: number, rtf: Intl.RelativeTimeFormat): string {
  const absDays = Math.abs(days);
  if (absDays < 7) return rtf.format(days, "day");
  if (absDays < 30) return rtf.format(Math.round(days / 7), "week");
  if (absDays < 365) return rtf.format(Math.round(days / 30), "month");
  return rtf.format(Math.round(days / 365), "year");
}

function formatTimeDiff(date: DateLike, reference: DateLike, rtf: Intl.RelativeTimeFormat): string {
  // Convert both to ZonedDateTime for accurate comparison (using system TZ for Plain types)
  const toZDT = (d: DateLike): Temporal.ZonedDateTime => {
    if ("timeZoneId" in d) return d as Temporal.ZonedDateTime;
    if ("hour" in d)
      return (d as Temporal.PlainDateTime).toZonedDateTime(Temporal.Now.timeZoneId());
    return (d as Temporal.PlainDate)
      .toPlainDateTime("00:00")
      .toZonedDateTime(Temporal.Now.timeZoneId());
  };

  const zdt1 = toZDT(date);
  const zdt2 = toZDT(reference);

  const diffSeconds = zdt1.since(zdt2, { largestUnit: "second" }).total("second");
  const absSeconds = Math.abs(diffSeconds);

  if (absSeconds < 60) return rtf.format(Math.round(diffSeconds), "second");
  if (absSeconds < 3600) return rtf.format(Math.round(diffSeconds / 60), "minute");
  if (absSeconds < 86400) return rtf.format(Math.round(diffSeconds / 3600), "hour");

  return formatDaysDiff(Math.round(diffSeconds / 86400), rtf);
}
