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

/**
 * A calendar format resolver — either a static label string or a callback
 * that receives the date and base reference and returns a formatted string.
 *
 * @example
 * // Static label
 * const resolver: CalendarResolver = "Today";
 *
 * // Dynamic callback
 * const resolver: CalendarResolver = (date) =>
 *   formatTime(date, { locale: "en-US", timeStyle: "short" });
 */
export type CalendarResolver = string | ((date: DateLike, base: DateLike) => string);

/**
 * Options for {@link formatCalendar}.
 * Each key corresponds to a calendar "bucket" based on the day difference
 * between `date` and the reference (`base`).
 */
export interface CalendarFormatOptions {
  /** Locale used by built-in default renderers (Intl-based). */
  locale?: string | string[];
  /** `date` is on the same calendar day as `base` (diff = 0). */
  sameDay?: CalendarResolver;
  /** `date` is one calendar day before `base` (diff = -1). */
  lastDay?: CalendarResolver;
  /** `date` is one calendar day after `base` (diff = +1). */
  nextDay?: CalendarResolver;
  /** `date` is 2–6 calendar days before `base`. */
  lastWeek?: CalendarResolver;
  /** `date` is 2–6 calendar days after `base`. */
  nextWeek?: CalendarResolver;
  /** `date` is more than 6 calendar days away from `base`. */
  sameElse?: CalendarResolver;
}

/**
 * Classify and format a date using context-aware calendar labels.
 *
 * The date is placed into one of six buckets relative to `base` (defaults to
 * *now*) and formatted with the corresponding resolver. If no resolver is
 * provided for a bucket the built-in Intl-based default is used:
 *
 * | Bucket     | Default output (en-US)   |
 * |------------|--------------------------|
 * | `sameDay`  | "Today"                  |
 * | `lastDay`  | "Yesterday"              |
 * | `nextDay`  | "Tomorrow"               |
 * | `lastWeek` | "Monday" (weekday name)  |
 * | `nextWeek` | "Friday" (weekday name)  |
 * | `sameElse` | "Nov 15, 2025"           |
 *
 * @param date    - The date to format.
 * @param base    - Reference point for classification (default: *now*).
 * @param options - Per-bucket resolvers and locale.
 * @returns A human-readable string for the given date.
 *
 * @example
 * // Default Intl labels
 * formatCalendar(today);      // "Today"
 * formatCalendar(tomorrow);   // "Tomorrow"
 * formatCalendar(yesterday);  // "Yesterday"
 * formatCalendar(nextFriday); // "Friday"
 * formatCalendar(pastDate);   // "Nov 15, 2025"
 *
 * @example
 * // Custom labels with translation callbacks (MagicMirror-style)
 * formatCalendar(event.start, undefined, {
 *   locale: "de-DE",
 *   sameDay: () => translate("TODAY"),
 *   nextDay: () => translate("TOMORROW"),
 *   nextWeek: (d) => format(d, { locale: "de-DE", options: { weekday: "long" } }),
 *   sameElse: (d) => format(d, { locale: "de-DE", dateStyle: "medium" }),
 * });
 *
 * @example
 * // With time for timed events
 * formatCalendar(event.start, undefined, {
 *   locale: "en-US",
 *   sameDay:  (d) => `Today at ${formatTime(d, { locale: "en-US", timeStyle: "short" })}`,
 *   nextDay:  (d) => `Tomorrow at ${formatTime(d, { locale: "en-US", timeStyle: "short" })}`,
 *   nextWeek: (d) => format(d, { locale: "en-US", options: { weekday: "long", hour: "numeric", minute: "2-digit" } }),
 *   sameElse: (d) => format(d, { locale: "en-US", dateStyle: "medium" }),
 * });
 */
export function formatCalendar(
  date: DateLike,
  base?: DateLike,
  options: CalendarFormatOptions = {},
): string {
  const { locale, sameDay, lastDay, nextDay, lastWeek, nextWeek, sameElse } = options;

  const reference: DateLike = base ?? calendarDefaultBase(date);

  // Use plain dates for day-level classification (avoids timezone edge cases)
  const datePlain = toPlainDateFrom(date);
  const basePlain = toPlainDateFrom(reference);

  // Positive diff = date is in the future relative to base
  const diff = datePlain.since(basePlain, { largestUnit: "day" }).days;

  let resolver: CalendarResolver | undefined;
  if (diff === 0) resolver = sameDay;
  else if (diff === 1) resolver = nextDay;
  else if (diff === -1) resolver = lastDay;
  else if (diff >= 2 && diff <= 6) resolver = nextWeek;
  else if (diff <= -2 && diff >= -6) resolver = lastWeek;
  else resolver = sameElse;

  if (resolver !== undefined) {
    return typeof resolver === "function" ? resolver(date, reference) : resolver;
  }

  return calendarDefaultRender(date, diff, locale);
}

function calendarDefaultBase(date: DateLike): DateLike {
  if (date instanceof Temporal.PlainDate) return Temporal.Now.plainDateISO();
  if (date instanceof Temporal.PlainDateTime) return Temporal.Now.plainDateTimeISO();
  return Temporal.Now.zonedDateTimeISO();
}

function toPlainDateFrom(date: DateLike): Temporal.PlainDate {
  if (date instanceof Temporal.PlainDate) return date;
  if (date instanceof Temporal.PlainDateTime) return date.toPlainDate();
  return (date as Temporal.ZonedDateTime).toPlainDate();
}

function calendarDefaultRender(
  date: DateLike,
  diff: number,
  locale: string | string[] | undefined,
): string {
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

  if (diff === 0) return calendarCapitalize(rtf.format(0, "day")); // "today"
  if (diff === 1) return calendarCapitalize(rtf.format(1, "day")); // "tomorrow"
  if (diff === -1) return calendarCapitalize(rtf.format(-1, "day")); // "yesterday"

  // ±2–6 days: weekday name
  if (Math.abs(diff) <= 6) {
    const plain = toPlainDateFrom(date);
    const zdt = plain.toZonedDateTime(Temporal.Now.timeZoneId());
    return new Intl.DateTimeFormat(locale, { weekday: "long" }).format(
      new Date(zdt.epochMilliseconds),
    );
  }

  // Beyond ±6 days: absolute medium date
  return format(date, { ...(locale !== undefined && { locale }), dateStyle: "medium" });
}

function calendarCapitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
