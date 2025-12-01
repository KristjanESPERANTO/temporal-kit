# Temporal Kit

**Status:** ✅ Ready for Early Adopters

A modern, functional utility library for the standard `Temporal` API - built for early adopters who want to experiment with Temporal today.

🌐 **[Try it live in your browser →](https://kristjanesperanto.github.io/temporal-kit/)**

## Quick Start

```bash
npm install temporal-kit
```

```typescript
import { isPlainDate, isZonedDateTime } from 'temporal-kit';
// Or with polyfill for legacy environments:
import { isPlainDate } from 'temporal-kit/polyfilled';
```

> **💡 See it in action:** Check out [`examples/`](./examples) for runnable code samples covering type guards, polyfill usage, TypeScript integration, and more.

## Documentation

- **[API Reference](./docs/API.md)** - Complete function reference with examples
- **[Usage Examples](./docs/USAGE_EXAMPLES.md)** - Practical examples for common use cases
- **[Best Practices](./docs/BEST_PRACTICES.md)** - Comprehensive guide for using temporal-kit effectively

## 1. Why Temporal Kit?

**Temporal** is arriving as the modern standard for date/time handling in JavaScript, with precise primitives (`Instant`, `ZonedDateTime`, `PlainDate/Time`). By design, Temporal focuses on correctness and intentionally leaves out many convenience helpers—things like `startOf`/`endOf`, humanized formatting, or common comparison utilities. This is deliberate: Temporal provides the foundation, but everyday ergonomics are better handled by libraries.

**Temporal Kit** fills this gap with a focused, Temporal-first toolkit that provides:

1.  **Common Ergonomic Helpers:** The everyday utilities teams need (`startOf`, `endOf`, `add`, `subtract`, `isBefore`, `isAfter`)
2.  **Intl-First Formatting:** Locale-aware formatting without massive locale files
3.  **Functional-First Design:** Pure functions, tree-shakable, composable—no hidden state
4.  **Explicit over Magic:** No global config, no implicit conversions, no surprises

**The Goal:** Stop reinventing the same small, error-prone utilities across projects. Instead, share a well-tested, modern implementation that covers 95% of everyday needs while staying lightweight and stable.

**Slogan:** "Experiment with Temporal today."

## 2. Core Philosophy

### A. Narrow Scope, High Quality
Rather than replicating every feature from older libraries, Temporal Kit focuses on:
- **The 95% Use Case:** Common helpers that most projects need
- **Well-Tested Primitives:** Battle-tested implementations to avoid subtle bugs
- **Lightweight Core:** Keep it fast and stable by staying focused

The remaining 5%—specialized needs like complex recurring patterns, custom calendar systems, or advanced timezone logic—are better served by dedicated libraries that can focus deeply on those specific domains. For example, [rrule-temporal](https://github.com/ggaabe/rrule-temporal) handles recurring date calculations with iCalendar RRULE support.

### B. "Temporal First" & ISO Compliance
- We work directly with `Temporal` objects (`ZonedDateTime`, `PlainDate`, etc.)
- **Clean Break:** No legacy `Date` quirks. Months are 1-indexed. No timezone surprises.
- **Intl-First:** Formatting uses `Intl.DateTimeFormat` by default—correct localization without massive locale files.

### C. Functional-First API

A pure functional API optimized for composition, tree-shaking, and modern JavaScript patterns.

```typescript
import { add, startOf, pipe } from 'temporal-kit'

// Direct composition
const result = add(startOf(date, 'day'), { hours: 1 })

// With pipe utility
const result = pipe(
  date,
  d => startOf(d, 'day'),
  d => add(d, { hours: 1 })
)
```

**Benefits:**
- Perfect tree-shaking - only bundle what you use
- Composable and testable
- Modern functional patterns
- Future-ready for JS pipeline operator (`|>`)

*Note: A fluent/chainable API may be added later as a thin wrapper, but the functional core is the foundation.*

### D. Polyfill Strategy (Explicit Opt-in)
We adopt a robust strategy for compatibility:
- **`temporal-kit`**: Lean. Expects `Temporal` to exist. Throws helpful error if missing.
- **`temporal-kit/polyfilled`**: Imports `temporal-polyfill` automatically for legacy environments.

## 3. Architecture

### Directory Structure
```
src/
├── types/          # ✅ Core type definitions (DateLike, TimeLike unions)
├── guards/         # ✅ Type guards (isPlainDate, isZonedDateTime, etc.)
├── compare/        # ✅ Comparison functions (isBefore, isAfter, min, max)
├── convert/        # ✅ Creation & conversion (now, fromISO, explicit conversions)
├── format/         # ✅ Intl-based formatting (format, formatTime, formatDateTime, formatRelative)
├── math/           # ✅ Arithmetic (add, subtract, startOf, endOf)
├── utils/          # ✅ Utilities (pipe, compose)
├── index.ts        # ✅ Main entry (expects native Temporal)
└── polyfilled.ts   # ✅ Auto-loads polyfill for legacy environments
```

### Implementation Details
- **Zero Dependencies:** We build directly on native `Temporal` APIs. No vendored code.
- **Type-Safe:** Full TypeScript support with strict mode and cutting-edge compiler options.
- **Dual Entry Points:** 
  - `temporal-kit` - Expects native Temporal
  - `temporal-kit/polyfilled` - Auto-loads polyfill
- **Perfect Tree-Shaking:** `sideEffects: false` ensures optimal bundle sizes.
- **Modern Tooling:** 
  - **Biome** - Fast linting/formatting with performance rules
  - **Vitest** - Type-checked tests with 100% coverage threshold
  - **tsup** - ESNext bundling with optimized tree-shaking
  - **TypeScript 5.9+** - Latest compiler features enabled
- **Testing Strategy:** 100% code coverage (165 tests) including:
  - Type guards and runtime checks
  - Comparison and conversion functions
  - Calendar arithmetic and boundary operations
  - Intl-based formatting with locale support
  - Functional composition utilities
  - Error handling and edge cases

## 4. Current Status & Roadmap

### ✅ Phase 1: Foundation (DONE)
1.  **Scaffold:** TypeScript, Biome, Vitest, tsup configured.
2.  **Types:** Core type system with `DateLike`, `TimeLike` unions.
3.  **Guards:** Runtime type checks (`isPlainDate`, `isZonedDateTime`, etc.).
4.  **Build:** Dual entry points with proper tree-shaking.
5.  **Examples:** Comprehensive example files demonstrating usage patterns ([`examples/`](./examples)).

### ✅ Phase 2: Core Functions (DONE)
1.  **Comparison:** ✅ `isBefore`, `isAfter`, `isSame`, `min`, `max` ([`examples/04-comparisons.js`](./examples/04-comparisons.js))
2.  **Convert:** ✅ `now`, `fromISO`, explicit type conversions ([`examples/05-conversions.js`](./examples/05-conversions.js))
3.  **Math:** ✅ `add`, `subtract`, `startOf`, `endOf` ([`examples/06-arithmetic.js`](./examples/06-arithmetic.js), [`examples/07-boundaries.js`](./examples/07-boundaries.js))
4.  **Utils:** ✅ `pipe`, `compose` for functional composition ([`examples/08-composition.js`](./examples/08-composition.js))
5.  **Format:** ✅ `format`, `formatTime`, `formatDateTime`, `formatRelative` with Intl support ([`examples/09-formatting.js`](./examples/09-formatting.js))
6.  **Testing:** ✅ Comprehensive test suite with 100% coverage (165 tests)

### ✅ Phase 3: Formatting & Polish (DONE)
1.  **Formatting:** ✅ Implement `format` using `Intl.DateTimeFormat` with smart defaults ([`examples/09-formatting.js`](./examples/09-formatting.js))
2.  **Documentation:** ✅ API reference ([`docs/API.md`](./docs/API.md)), usage examples ([`docs/USAGE_EXAMPLES.md`](./docs/USAGE_EXAMPLES.md)), best practices ([`docs/BEST_PRACTICES.md`](./docs/BEST_PRACTICES.md))
3.  **Parse:** ✅ Smart string-to-Temporal parsing with format detection ([`examples/10-parsing.js`](./examples/10-parsing.js))
4.  **Timezone Examples:** ✅ Document DST transitions and offset handling ([`examples/11-timezones.js`](./examples/11-timezones.js))

### 💡 Phase 4: Advanced Features (IN PROGRESS)
1.  **Relative Formatting:** ✅ `formatRelative` updated with time unit support (seconds, minutes, hours)
2.  **Range Operations:** ✅ `rangesOverlap`, `eachDayOfInterval`, `eachWeekOfInterval`, `stepInterval`
3.  **Collection Helpers:** ✅ `sortAsc`, `sortDesc`, `closestTo` (Simplifies working with arrays of dates)
4.  **Specific Comparisons:** ✅ `isSameDay`, `isSameWeek`, `isSameMonth`, `isSameYear` helpers
5.  **Validation Helpers:** ✅ `isValidDateString`, `isValidTimeString`, `isValidDateTimeString`
6.  **Functional Rounding:** `floor`, `ceil`, `round` wrappers for functional composition
7.  **Timezone Utilities:** `isValidTimezone`, `getTimezoneName`
8.  **Fluent API:** Optional chainable wrapper as separate entry point (Experimental)

## 5. Developer Experience

### Development
```bash
npm run dev          # Watch mode for development
npm run test         # Run tests in watch mode
npm run test:ui      # Open Vitest UI
```

### Quality Checks
```bash
npm run typecheck    # TypeScript type checking
npm run lint         # Biome linting
npm run test:run     # Run all tests once
npm run test:coverage # Coverage report (100% threshold)
npm run ci           # Full CI pipeline (typecheck + lint + test + build)
```

### Release Management
```bash
npm run release        # Auto-bump patch version (0.0.1 → 0.0.2)
npm run release:minor  # Bump minor version (0.0.2 → 0.1.0)
npm run release:major  # Bump major version (0.0.2 → 1.0.0)
```

Uses [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) to automatically:
- Generate/update `CHANGELOG.md` from conventional commits
- Bump version in `package.json`
- Create git commit and tag
- Include `feat`, `fix`, `refactor`, `perf`, `chore`, and `docs` in changelog

### Features for Library Authors
- **Type-checked tests** - Vitest validates test types against your code
- **Modern exports** - Proper `exports` field with type/import/default conditions
- **Source maps** - Full debugging support in development
- **Coverage thresholds** - Strict 100% coverage requirement
- **ESNext target** - No legacy transpilation, minimal output

## 6. Comparison

| Feature | Date (Native) | Luxon | Day.js | Native Temporal | **Temporal Kit** |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Paradigm** | Mutable / Quirky | OO / Immutable | OO / Mutable | OO / Verbose | **Functional** |
| **Timezones** | Poor | Excellent | Plugin | Native | **Native** |
| **Tree-Shaking**| N/A | No | No | N/A | **Yes** |
| **Bundle Size**| N/A | ~70KB | ~7KB (+plugins) | Native | **~11KB** (native) / ~66KB (polyfilled) |
| **Target** | Everyone | Production | Production | Future | **Early Adopters** |
| **Philosophy** | Legacy | Battle-tested | Convenience | Standard | **Modern FP + Learning** |
