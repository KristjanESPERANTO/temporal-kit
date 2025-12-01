/**
 * Type guards for Temporal types
 *
 * These allow runtime type checking and enable TypeScript narrowing.
 */

import { Temporal } from "temporal-polyfill";
import type {
  DateLike,
  Instant,
  PlainDate,
  PlainDateTime,
  PlainTime,
  TimeLike,
  ZonedDateTime,
} from "../types/index.js";

/**
 * Type guard for Temporal.PlainDate
 */
export function isPlainDate(value: unknown): value is PlainDate {
  return value instanceof Temporal.PlainDate;
}

/**
 * Type guard for Temporal.PlainDateTime
 */
export function isPlainDateTime(value: unknown): value is PlainDateTime {
  return value instanceof Temporal.PlainDateTime;
}

/**
 * Type guard for Temporal.PlainTime
 */
export function isPlainTime(value: unknown): value is PlainTime {
  return value instanceof Temporal.PlainTime;
}

/**
 * Type guard for Temporal.ZonedDateTime
 */
export function isZonedDateTime(value: unknown): value is ZonedDateTime {
  return value instanceof Temporal.ZonedDateTime;
}

/**
 * Type guard for Temporal.Instant
 */
export function isInstant(value: unknown): value is Instant {
  return value instanceof Temporal.Instant;
}

/**
 * Type guard for DateLike types (PlainDate, PlainDateTime, ZonedDateTime)
 */
export function isDateLike(value: unknown): value is DateLike {
  return (
    value instanceof Temporal.PlainDate ||
    value instanceof Temporal.PlainDateTime ||
    value instanceof Temporal.ZonedDateTime
  );
}

/**
 * Type guard for TimeLike types (PlainTime, PlainDateTime, ZonedDateTime)
 */
export function isTimeLike(value: unknown): value is TimeLike {
  return (
    value instanceof Temporal.PlainTime ||
    value instanceof Temporal.PlainDateTime ||
    value instanceof Temporal.ZonedDateTime
  );
}

/**
 * Type guard for Temporal.Duration
 */
export function isDuration(value: unknown): value is Temporal.Duration {
  return value instanceof Temporal.Duration;
}

/**
 * Type guard for Temporal.PlainYearMonth
 */
export function isPlainYearMonth(value: unknown): value is Temporal.PlainYearMonth {
  return value instanceof Temporal.PlainYearMonth;
}

/**
 * Type guard for Temporal.PlainMonthDay
 */
export function isPlainMonthDay(value: unknown): value is Temporal.PlainMonthDay {
  return value instanceof Temporal.PlainMonthDay;
}
