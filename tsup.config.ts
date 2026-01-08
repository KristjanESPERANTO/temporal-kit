import { defineConfig } from "tsup";

export default defineConfig([
  // Main entry (no polyfill)
  {
    entry: ["src/index.ts"],
    format: ["esm"],
    dts: {
      resolve: true,
    },
    sourcemap: true,
    clean: true,
    treeshake: "recommended",
    splitting: false,
    outDir: "dist",
    target: "esnext",
    minify: false,
    external: ["temporal-polyfill"],
    bundle: true,
  },
  // Polyfilled entry
  {
    entry: ["src/polyfilled.ts"],
    format: ["esm"],
    dts: {
      resolve: true,
    },
    sourcemap: true,
    treeshake: "recommended",
    splitting: false,
    outDir: "dist",
    target: "esnext",
    minify: false,
    noExternal: ["temporal-polyfill"],
    bundle: true,
  },
  // IIFE build for browsers without bundlers (e.g., MagicMirror modules)
  {
    entry: { "temporal-kit.browser": "src/index.ts" },
    format: ["iife"],
    globalName: "TemporalKit",
    sourcemap: true,
    treeshake: "recommended",
    outDir: "dist",
    target: "esnext",
    minify: true,
    external: ["temporal-polyfill"],
    bundle: true,
  },
  // IIFE build with polyfill included
  {
    entry: { "temporal-kit.browser.polyfilled": "src/polyfilled.ts" },
    format: ["iife"],
    globalName: "TemporalKit",
    sourcemap: true,
    treeshake: "recommended",
    outDir: "dist",
    target: "esnext",
    minify: true,
    noExternal: ["temporal-polyfill"],
    bundle: true,
  },
]);
