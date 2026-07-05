/**
 * Internal access to the Temporal API.
 *
 * Resolves Temporal from the global scope so the main entry works with
 * native Temporal without requiring the polyfill package at runtime.
 * The polyfilled entry installs the polyfill globally before this runs.
 *
 * @module temporal
 */

// Type-only import — erased at build time, no runtime dependency.
import type { Temporal as TemporalTypes } from "temporal-spec";

const GlobalTemporal = (globalThis as { Temporal?: typeof TemporalTypes }).Temporal;

/* v8 ignore start -- environment guard, only reachable in runtimes without Temporal */
if (GlobalTemporal === undefined) {
  throw new Error(
    "temporal-kit: The Temporal API is not available in this environment. " +
      "Use a runtime with native Temporal (Node.js 26+, modern browsers) or " +
      "import 'temporal-kit/polyfilled' instead.",
  );
}
/* v8 ignore stop */

export const Temporal = GlobalTemporal;

// Type-only namespace merged with the const above, so `Temporal.PlainDate`
// etc. also work in type positions.
export namespace Temporal {
  export type PlainDate = TemporalTypes.PlainDate;
  export type PlainDateTime = TemporalTypes.PlainDateTime;
  export type PlainTime = TemporalTypes.PlainTime;
  export type PlainYearMonth = TemporalTypes.PlainYearMonth;
  export type PlainMonthDay = TemporalTypes.PlainMonthDay;
  export type ZonedDateTime = TemporalTypes.ZonedDateTime;
  export type Instant = TemporalTypes.Instant;
  export type Duration = TemporalTypes.Duration;
  export type DurationLike = TemporalTypes.DurationLike;
}
