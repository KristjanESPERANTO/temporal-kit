# Temporal Kit Examples

## Running Examples

**Note:** Native Temporal is not yet available in Node.js (as of Node 25). Use the polyfilled examples.

### Recommended: Start Here
```bash
npm run build
node examples/01-basic-usage.js    # Feature overview
node examples/02-real-world.js     # Practical patterns
```

### Browser Support (Native Temporal)
Native Temporal works in modern browsers without polyfill:
- Firefox 139+
- Chrome 144+

For Node.js, always use the polyfilled version for now.

### TypeScript Examples
```bash
# Compile TypeScript first
npx tsc examples/03-typescript-usage.ts --outDir examples/dist --module esnext --target esnext --moduleResolution bundler

# Then run
node examples/dist/03-typescript-usage.js
```

## Available Examples

- **01-basic-usage.js** - Overview of core features
- **02-real-world.js** - Practical patterns: current time, timezones, relative dates
- **03-typescript-usage.ts** - TypeScript integration and type safety
- **04-comparisons.js** - Date comparisons (isBefore, isAfter, min, max)
- **05-conversions.js** - Creation & conversion (now, fromISO, toZonedDateTime)
- **06-arithmetic.js** - Date arithmetic (add, subtract)
- **07-boundaries.js** - Start/end of periods (startOf, endOf)
- **08-composition.js** - Functional composition patterns (pipe, compose)
- **09-formatting.js** - Intl-based formatting with locales
- **10-parsing.js** - Smart parsing of various date string formats
- **11-timezones.js** - Timezone conversions, DST handling, offsets

## Notes

- Examples use ES modules (`.js` files with `import`)
- Built output is in `dist/` (run `npm run build` first)
- TypeScript examples show type safety and narrowing
- Polyfill examples work in any environment
