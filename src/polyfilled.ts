/**
 * temporal-kit - Polyfilled entry point
 *
 * This entry automatically loads the temporal-polyfill for environments
 * that don't have native Temporal support.
 */

import "temporal-polyfill/global";

export * from "./index.js";
export { Temporal } from "./temporal.js";
