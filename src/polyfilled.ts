/**
 * temporal-kit - Polyfilled entry point
 *
 * This entry automatically loads the temporal-polyfill for environments
 * that don't have native Temporal support.
 */

// Load the polyfill first
import { Temporal } from "temporal-polyfill";

// Make it globally available
if (typeof (globalThis as { Temporal?: unknown }).Temporal === "undefined") {
  Object.defineProperty(globalThis, "Temporal", {
    value: Temporal,
    writable: false,
    configurable: false,
  });
}

// Re-export everything from the main entry
export * from "./index.js";
