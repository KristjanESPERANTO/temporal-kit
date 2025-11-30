/**
 * Core Temporal type re-exports and custom union types
 *
 * Philosophy: We work directly with Temporal types and provide
 * convenience unions for functions that can handle multiple types.
 */

// Use temporal-polyfill for type definitions
// The polyfill package provides complete TypeScript types
import type { Temporal } from "temporal-polyfill";

// Re-export Temporal types for convenience
export type PlainDate = Temporal.PlainDate;
export type PlainDateTime = Temporal.PlainDateTime;
export type PlainTime = Temporal.PlainTime;
export type ZonedDateTime = Temporal.ZonedDateTime;
export type Instant = Temporal.Instant;
export type Duration = Temporal.Duration;

/**
 * Union of Temporal types that represent a date (with or without time).
 * Note: Instant is intentionally excluded - it has no inherent timezone,
 * so operations like "start of day" require explicit timezone context.
 */
export type DateLike = PlainDate | PlainDateTime | ZonedDateTime;

/**
 * Union of Temporal types that have a time component.
 */
export type TimeLike = PlainTime | PlainDateTime | ZonedDateTime;

/**
 * Options for operations that depend on locale.
 */
export type LocaleOptions = {
  locale?: Intl.LocalesArgument;
};

/**
 * Options for operations that depend on week start day.
 * ISO 8601 standard: Monday = 1
 */
export type WeekStartOptions = {
  weekStartsOn?: 1 | 2 | 3 | 4 | 5 | 6 | 7;
};

/**
 * Duration-like object that can be passed to add/subtract.
 * Matches Temporal.DurationLike but more explicit.
 */
export type DurationInput = {
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
export type DateUnit = "year" | "month" | "week" | "day";
export type TimeUnit = "hour" | "minute" | "second" | "millisecond" | "microsecond" | "nanosecond";
export type DateTimeUnit = DateUnit | TimeUnit;
