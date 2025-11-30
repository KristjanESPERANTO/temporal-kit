import { Temporal } from 'temporal-polyfill';

/**
 * Core Temporal type re-exports and custom union types
 *
 * Philosophy: We work directly with Temporal types and provide
 * convenience unions for functions that can handle multiple types.
 */

type PlainDate = Temporal.PlainDate;
type PlainDateTime = Temporal.PlainDateTime;
type PlainTime = Temporal.PlainTime;
type ZonedDateTime = Temporal.ZonedDateTime;
type Instant = Temporal.Instant;
type Duration = Temporal.Duration;
/**
 * Union of Temporal types that represent a date (with or without time).
 * Note: Instant is intentionally excluded - it has no inherent timezone,
 * so operations like "start of day" require explicit timezone context.
 */
type DateLike = PlainDate | PlainDateTime | ZonedDateTime;
/**
 * Union of Temporal types that have a time component.
 */
type TimeLike = PlainTime | PlainDateTime | ZonedDateTime;
/**
 * Options for operations that depend on locale.
 */
type LocaleOptions = {
    locale?: Intl.LocalesArgument;
};
/**
 * Options for operations that depend on week start day.
 * ISO 8601 standard: Monday = 1
 */
type WeekStartOptions = {
    weekStartsOn?: 1 | 2 | 3 | 4 | 5 | 6 | 7;
};
/**
 * Duration-like object that can be passed to add/subtract.
 * Matches Temporal.DurationLike but more explicit.
 */
type DurationInput = {
    years?: number;
    months?: number;
    weeks?: number;
    days?: number;
    hours?: number;
    minutes?: number;
    seconds?: number;
    milliseconds?: number;
    microseconds?: number;
    nanoseconds?: number;
};
/**
 * Units that can be used for date/time manipulation.
 */
type DateUnit = "year" | "month" | "week" | "day";
type TimeUnit = "hour" | "minute" | "second" | "millisecond" | "microsecond" | "nanosecond";
type DateTimeUnit = DateUnit | TimeUnit;

/**
 * Type guards for Temporal types
 *
 * These allow runtime type checking and enable TypeScript narrowing.
 */

/**
 * Type guard for Temporal.PlainDate
 */
declare function isPlainDate(value: unknown): value is PlainDate;
/**
 * Type guard for Temporal.PlainDateTime
 */
declare function isPlainDateTime(value: unknown): value is PlainDateTime;
/**
 * Type guard for Temporal.PlainTime
 */
declare function isPlainTime(value: unknown): value is PlainTime;
/**
 * Type guard for Temporal.ZonedDateTime
 */
declare function isZonedDateTime(value: unknown): value is ZonedDateTime;
/**
 * Type guard for Temporal.Instant
 */
declare function isInstant(value: unknown): value is Instant;
/**
 * Type guard for DateLike types (PlainDate, PlainDateTime, ZonedDateTime)
 */
declare function isDateLike(value: unknown): value is DateLike;
/**
 * Type guard for TimeLike types (PlainTime, PlainDateTime, ZonedDateTime)
 */
declare function isTimeLike(value: unknown): value is TimeLike;

/**
 * Comparison functions for Temporal date/time types
 * @module compare
 */

/**
 * Checks if the first date/time is before the second.
 *
 * Uses the appropriate compare method based on the type.
 *
 * @param a - First date/time to compare
 * @param b - Second date/time to compare
 * @returns true if a is before b
 *
 * @example
 * ```ts
 * import { isBefore } from 'temporal-kit';
 *
 * const date1 = Temporal.PlainDate.from('2025-01-01');
 * const date2 = Temporal.PlainDate.from('2025-12-31');
 *
 * isBefore(date1, date2); // true
 * ```
 */
declare function isBefore(a: DateLike, b: DateLike): boolean;
/**
 * Checks if the first date/time is after the second.
 *
 * Uses the appropriate compare method based on the type.
 *
 * @param a - First date/time to compare
 * @param b - Second date/time to compare
 * @returns true if a is after b
 *
 * @example
 * ```ts
 * import { isAfter } from 'temporal-kit';
 *
 * const date1 = Temporal.PlainDate.from('2025-12-31');
 * const date2 = Temporal.PlainDate.from('2025-01-01');
 *
 * isAfter(date1, date2); // true
 * ```
 */
declare function isAfter(a: DateLike, b: DateLike): boolean;
/**
 * Checks if two date/times are equal.
 *
 * Uses the appropriate compare method based on the type.
 *
 * @param a - First date/time to compare
 * @param b - Second date/time to compare
 * @returns true if a equals b
 *
 * @example
 * ```ts
 * import { isSame } from 'temporal-kit';
 *
 * const date1 = Temporal.PlainDate.from('2025-11-30');
 * const date2 = Temporal.PlainDate.from('2025-11-30');
 *
 * isSame(date1, date2); // true
 * ```
 */
declare function isSame(a: DateLike, b: DateLike): boolean;
/**
 * Returns the earliest (minimum) date/time from the provided values.
 *
 * @param dates - Array of dates to compare
 * @returns The earliest date
 * @throws {TypeError} If the array is empty
 *
 * @example
 * ```ts
 * import { min } from 'temporal-kit';
 *
 * const dates = [
 *   Temporal.PlainDate.from('2025-03-15'),
 *   Temporal.PlainDate.from('2025-01-01'),
 *   Temporal.PlainDate.from('2025-12-31')
 * ];
 *
 * min(dates); // 2025-01-01
 * ```
 */
declare function min<T extends DateLike>(dates: T[]): T;
/**
 * Returns the latest (maximum) date/time from the provided values.
 *
 * @param dates - Array of dates to compare
 * @returns The latest date
 * @throws {TypeError} If the array is empty
 *
 * @example
 * ```ts
 * import { max } from 'temporal-kit';
 *
 * const dates = [
 *   Temporal.PlainDate.from('2025-03-15'),
 *   Temporal.PlainDate.from('2025-01-01'),
 *   Temporal.PlainDate.from('2025-12-31')
 * ];
 *
 * max(dates); // 2025-12-31
 * ```
 */
declare function max<T extends DateLike>(dates: T[]): T;

/**
 * Get current date and time in the system timezone
 * @returns Current ZonedDateTime in system timezone
 * @example
 * const now = now()
 * console.log(now.toString()) // "2025-11-30T15:30:00+01:00[Europe/Berlin]"
 */
declare function now(): Temporal.ZonedDateTime;
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
declare function fromISO(isoString: string): Temporal.PlainDate | Temporal.PlainDateTime | Temporal.ZonedDateTime | Temporal.Instant;
/**
 * Convert any DateLike to PlainDate (discards time and timezone info)
 * @param date - PlainDate, PlainDateTime, or ZonedDateTime
 * @returns PlainDate representing the calendar date
 * @example
 * const zdt = Temporal.ZonedDateTime.from('2025-11-30T15:30:00+01:00[Europe/Berlin]')
 * const date = toPlainDate(zdt) // 2025-11-30
 */
declare function toPlainDate(date: DateLike): Temporal.PlainDate;
/**
 * Convert PlainDateTime or ZonedDateTime to PlainDateTime (discards timezone)
 * For PlainDate, you must provide an explicit time to convert to PlainDateTime
 * @param date - PlainDateTime or ZonedDateTime
 * @returns PlainDateTime
 * @example
 * const zdt = Temporal.ZonedDateTime.from('2025-11-30T15:30:00+01:00[Europe/Berlin]')
 * const pdt = toPlainDateTime(zdt) // 2025-11-30T15:30:00
 */
declare function toPlainDateTime(date: Temporal.PlainDateTime | Temporal.ZonedDateTime): Temporal.PlainDateTime;
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
declare function toZonedDateTime(date: DateLike, timeZone?: string): Temporal.ZonedDateTime;

export { type DateLike, type DateTimeUnit, type DateUnit, type Duration, type DurationInput, type Instant, type LocaleOptions, type PlainDate, type PlainDateTime, type PlainTime, type TimeLike, type TimeUnit, type WeekStartOptions, type ZonedDateTime, fromISO, isAfter, isBefore, isDateLike, isInstant, isPlainDate, isPlainDateTime, isPlainTime, isSame, isTimeLike, isZonedDateTime, max, min, now, toPlainDate, toPlainDateTime, toZonedDateTime };
