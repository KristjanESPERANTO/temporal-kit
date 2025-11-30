/**
 * temporal-kit - Main entry point (no polyfill)
 *
 * This entry expects Temporal to be available natively.
 * If you need polyfill support, use 'temporal-kit/polyfilled' instead.
 */

// Check if Temporal is available
if (typeof (globalThis as { Temporal?: unknown }).Temporal === "undefined") {
  throw new Error(
    "Temporal is not available. " +
      "Either use a modern environment with native Temporal support, " +
      "or import from 'temporal-kit/polyfilled' to automatically load the polyfill.",
  );
}

// Re-export guards
export * from "./guards/index.js";
// Re-export compare functions
export * from "./compare/index.js";
// Re-export convert functions
export * from "./convert/index.js";
// Re-export types
export type * from "./types/index.js";

// Placeholder exports for modules we'll implement next
// export * from "./format/index.js";
// export * from "./math/index.js";
// export * from "./utils/index.js";
