/**
 * temporal-kit - Polyfilled entry point
 *
 * This entry automatically loads the temporal-polyfill for environments
 * that don't have native Temporal support.
 */

// Load/install the polyfill globally (uses native Temporal when available)
import "temporal-polyfill/global";

const TemporalApi = globalThis.Temporal;

// Re-export everything from the main entry
export * from "./index.js";
// Re-export Temporal for convenience
export { TemporalApi as Temporal };
