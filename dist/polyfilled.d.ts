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

export { type DateLike, type DateTimeUnit, type DateUnit, type Duration, type DurationInput, type Instant, type LocaleOptions, type PlainDate, type PlainDateTime, type PlainTime, type TimeLike, type TimeUnit, type WeekStartOptions, type ZonedDateTime, isDateLike, isInstant, isPlainDate, isPlainDateTime, isPlainTime, isTimeLike, isZonedDateTime };
