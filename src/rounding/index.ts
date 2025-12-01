/**
 * Functional rounding helpers
 * @module rounding
 */

import type { Temporal } from "temporal-polyfill";

/**
 * Union of Temporal types that support rounding.
 */
export type Roundable =
  | Temporal.Instant
  | Temporal.ZonedDateTime
  | Temporal.PlainDateTime
  | Temporal.PlainTime
  | Temporal.Duration;

/**
 * Rounds a value down (floor) to the specified unit.
 *
 * @param value - The value to round (Instant, ZonedDateTime, PlainDateTime, PlainTime, Duration)
 * @param unit - The unit to round to (e.g. 'hour', 'minute', 'second')
 * @returns The rounded value
 *
 * @example
 * ```ts
 * import { floor } from 'temporal-kit';
 * import { Temporal } from 'temporal-polyfill';
 *
 * const dt = Temporal.PlainDateTime.from('2025-01-01T15:30:45');
 * floor(dt, 'hour'); // 2025-01-01T15:00:00
 * ```
 */
export function floor<T extends Roundable>(value: T, unit: string): T {
  // Cast to any to avoid complex union type compatibility issues with .round() signatures
  // biome-ignore lint/suspicious/noExplicitAny: Union type compatibility is complex here
  return (value as any).round({ smallestUnit: unit, roundingMode: "floor" });
}

/**
 * Rounds a value up (ceil) to the specified unit.
 *
 * @param value - The value to round
 * @param unit - The unit to round to
 * @returns The rounded value
 *
 * @example
 * ```ts
 * import { ceil } from 'temporal-kit';
 * import { Temporal } from 'temporal-polyfill';
 *
 * const dt = Temporal.PlainDateTime.from('2025-01-01T15:30:45');
 * ceil(dt, 'hour'); // 2025-01-01T16:00:00
 * ```
 */
export function ceil<T extends Roundable>(value: T, unit: string): T {
  // biome-ignore lint/suspicious/noExplicitAny: Union type compatibility is complex here
  return (value as any).round({ smallestUnit: unit, roundingMode: "ceil" });
}

/**
 * Rounds a value to the nearest unit.
 * Uses 'halfExpand' (standard rounding) by default.
 *
 * @param value - The value to round
 * @param unit - The unit to round to
 * @param options - Additional rounding options
 * @returns The rounded value
 *
 * @example
 * ```ts
 * import { round } from 'temporal-kit';
 * import { Temporal } from 'temporal-polyfill';
 *
 * const dt = Temporal.PlainDateTime.from('2025-01-01T15:30:45');
 * round(dt, 'hour'); // 2025-01-01T16:00:00
 * ```
 */
export function round<T extends Roundable>(
  value: T,
  unit: string,
  options: {
    roundingMode?:
      | "ceil"
      | "floor"
      | "expand"
      | "trunc"
      | "halfCeil"
      | "halfFloor"
      | "halfExpand"
      | "halfTrunc"
      | "halfEven";
    roundingIncrement?: number;
  } = {},
): T {
  // biome-ignore lint/suspicious/noExplicitAny: Union type compatibility is complex here
  return (value as any).round({ smallestUnit: unit, ...options });
}
