/**
 * Pipe function - chains functions from left to right.
 * The result of each function is passed as the argument to the next.
 *
 * @param value - Initial value to start the pipe
 * @param fns - Functions to apply in sequence
 * @returns Result of applying all functions
 *
 * @example
 * ```ts
 * import { pipe, startOf, add } from 'temporal-kit';
 *
 * const result = pipe(
 *   date,
 *   d => startOf(d, 'day'),
 *   d => add(d, { hours: 12 })
 * );
 * ```
 */
// biome-ignore lint/suspicious/noExplicitAny: Required for flexible function composition
export function pipe<T>(value: T, ...fns: Array<(arg: any) => any>): any {
  return fns.reduce((acc, fn) => fn(acc), value);
}

/**
 * Compose function - chains functions from right to left.
 * Creates a new function that applies functions in reverse order.
 *
 * @param fns - Functions to compose (applied right to left)
 * @returns A new function that applies all functions in sequence
 *
 * @example
 * ```ts
 * import { compose, startOf, add } from 'temporal-kit';
 *
 * const addTwelveHoursToStartOfDay = compose(
 *   d => add(d, { hours: 12 }),
 *   d => startOf(d, 'day')
 * );
 *
 * const result = addTwelveHoursToStartOfDay(date);
 * ```
 */
// biome-ignore lint/suspicious/noExplicitAny: Required for flexible function composition
export function compose<T>(...fns: Array<(arg: any) => any>): (value: T) => any {
  return (value: T) => fns.reduceRight((acc, fn) => fn(acc), value);
}
