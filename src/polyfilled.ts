/**
 * temporal-kit - Polyfilled entry point
 *
 * This entry automatically loads the temporal-polyfill for environments
 * that don't have native Temporal support.
 */

import "temporal-polyfill/global";

import type { Temporal as TemporalTypes } from "temporal-spec";

const TemporalApi = (globalThis as typeof globalThis & { Temporal: typeof TemporalTypes }).Temporal;

// Re-export everything from the main entry
export * from "./index.js";
// Re-export Temporal for convenience
export { TemporalApi as Temporal };
