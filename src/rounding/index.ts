/**
 * Functional rounding helpers
 * @module rounding
 */

import type { Temporal } from "temporal-spec";

/**
 * Union of Temporal types that support rounding.
 */
export type Roundable =
  | Temporal.Instant
  | Temporal.ZonedDateTime
  | Temporal.PlainDateTime
  | Temporal.PlainTime
  | Temporal.Duration;

export type RoundingUnit<T extends Roundable> = NonNullable<
  Parameters<T["round"]>[0]["smallestUnit"]
>;

export type RoundingOptions<T extends Roundable> = Omit<Parameters<T["round"]>[0], "smallestUnit">;

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
export function floor<T extends Roundable>(value: T, unit: RoundingUnit<NoInfer<T>>): T {
  return (value as unknown as { round(options: object): T }).round({
    smallestUnit: unit,
    roundingMode: "floor",
  });
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
export function ceil<T extends Roundable>(value: T, unit: RoundingUnit<NoInfer<T>>): T {
  return (value as unknown as { round(options: object): T }).round({
    smallestUnit: unit,
    roundingMode: "ceil",
  });
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
  unit: RoundingUnit<NoInfer<T>>,
  options?: RoundingOptions<NoInfer<T>>,
): T {
  return (value as unknown as { round(options: object): T }).round({
    ...options,
    smallestUnit: unit,
  });
}
