/**
 * Core Temporal type re-exports and custom union types
 *
 * Philosophy: We work directly with Temporal types and provide
 * convenience unions for functions that can handle multiple types.
 */

// Emitted declarations retain this type dependency for Temporal definitions.
import type { Temporal } from "temporal-spec";

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

export type DurationInput = Temporal.DurationLike;

/**
 * Units that can be used for date/time manipulation.
 */
export type DateUnit = "year" | "month" | "week" | "day";
