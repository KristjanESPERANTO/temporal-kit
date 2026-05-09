# Temporal Kit Examples

## Running Examples

**Node.js 26+** ships with native Temporal support — no polyfill needed. For older Node.js versions, use the polyfilled examples.

### Recommended: Start Here
```bash
node --run build
node examples/01-basic-usage.js    # Feature overview
node examples/02-real-world.js     # Practical patterns
```

### Native Temporal Support
Native Temporal is available without polyfill in:
- **Node.js 26+**
- Modern browsers (Chrome, Edge, Firefox — see [MDN compatibility table](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal#browser_compatibility))

For older Node.js versions or older browsers, use the polyfilled entry point (`temporal-kit/polyfilled`).

### TypeScript Examples
```bash
# Compile TypeScript first
npx tsc examples/03-typescript-usage.ts --outDir examples/dist --module esnext --target esnext --moduleResolution bundler

# Then run
node examples/03-typescript-usage.js
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
- **12-business-days.js** - Business day calculations (addBusinessDays, isWeekend)

## Notes

- Examples use ES modules (`.js` files with `import`)
- Built output is in `dist/` (run `node --run build` first)
- TypeScript examples show type safety and narrowing
- Polyfill examples work in any environment
