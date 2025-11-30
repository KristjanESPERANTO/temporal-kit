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
]);
