# Temporal Kit

> **Modern, functional utilities for the Temporal API.**
> *Experiment with the future of JavaScript dates today.*

[![Status](https://img.shields.io/badge/Status-Ready%20for%20Early%20Adopters-success)](https://github.com/KristjanESPERANTO/temporal-kit)
[![npm version](https://img.shields.io/npm/v/temporal-kit)](https://www.npmjs.com/package/temporal-kit)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/temporal-kit)](https://bundlephobia.com/package/temporal-kit)
[![License](https://img.shields.io/npm/l/temporal-kit)](https://github.com/KristjanESPERANTO/temporal-kit/blob/main/LICENSE.md)

**Temporal Kit** is a lightweight, tree-shakable library that fills the gap between the raw `Temporal` API and the ergonomic needs of daily development. It provides the missing helper functions—like `startOf`, `isBetween`, or `formatRelative`—in a pure, functional, and type-safe way.

🌐 **[Try the Live Playground →](https://kristjanesperanto.github.io/temporal-kit/)**

## Quick Start

### Installation

```bash
npm install temporal-kit
```

### Basic Usage

```typescript
import { isPlainDate, add, startOf } from 'temporal-kit';
// Or with polyfill for legacy environments:
import { isPlainDate } from 'temporal-kit/polyfilled';
```

> **💡 See it in action:** Check out the [`examples`](examples/README.md) for runnable code samples covering type guards, polyfill usage, TypeScript integration, and more.

## Common Recipes

```typescript
import { formatRelative, startOf, endOf, add, nextDay, isBetween } from 'temporal-kit';
import { Temporal } from 'temporal-polyfill';

const now = Temporal.Now.zonedDateTimeISO();

// 1. Relative Time
formatRelative(now.subtract({ minutes: 5 })); // "5 minutes ago"

// 2. Find next Friday
const nextFriday = nextDay(now, 5); // 5 = Friday

// 3. Check if date is in range
isBetween(now, startOf(now, 'year'), endOf(now, 'year')); // true
```

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
4.  **Universal Compatibility:** Runs anywhere JavaScript runs (Browsers, Node.js, Edge) with native Temporal or polyfill
5.  **Explicit over Magic:** No global config, no implicit conversions, no surprises

**The Goal:** Stop reinventing the same small, error-prone utilities across projects. Instead, share a well-tested, modern implementation that covers 95% of everyday needs while staying lightweight and stable.

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

> **Why no method chaining?**
> Fluent APIs (like `moment().add().startOf()`) are convenient but break tree-shaking because the wrapper object must bundle *all* available methods. By sticking to pure functions, `temporal-kit` remains tiny (~11KB) and aligns with the future of JavaScript (Pipeline Operator).

### D. Polyfill Strategy (Explicit Opt-in)
We adopt a robust strategy for compatibility:
- **`temporal-kit`**: Lean. Expects `Temporal` to exist. Throws helpful error if missing.
- **`temporal-kit/polyfilled`**: Imports `temporal-polyfill` automatically for legacy environments (requires `temporal-polyfill` peer dependency).

## 3. Architecture

### Directory Structure
```
src/
├── types/          # Core type definitions (DateLike, TimeLike unions)
├── guards/         # Type guards (isPlainDate, isZonedDateTime, etc.)
├── compare/        # Comparison functions (isBefore, isAfter, min, max)
├── convert/        # Creation & conversion (now, fromISO, explicit conversions)
├── format/         # Intl-based formatting (format, formatTime, formatDateTime, formatRelative)
├── math/           # Arithmetic (add, subtract, startOf, endOf)
├── utils/          # Utilities (pipe, compose)
├── index.ts        # Main entry (expects native Temporal)
└── polyfilled.ts   # Auto-loads polyfill for legacy environments
```

### Implementation Details
- **Zero Runtime Dependencies:** We build directly on native `Temporal` APIs. Polyfill is optional.
- **Type-Safe:** Full TypeScript support with strict mode and cutting-edge compiler options.
- **Dual Entry Points:** 
  - `temporal-kit` - Expects native Temporal
  - `temporal-kit/polyfilled` - Auto-loads polyfill
- **Perfect Tree-Shaking:** `sideEffects: false` ensures optimal bundle sizes.
- **Modern Tooling:** 
  - **Biome** - Fast linting/formatting with performance rules
  - **Vitest** - Type-checked tests with 100% coverage threshold
  - **tsup** - ESNext bundling with optimized tree-shaking
  - **TypeScript 5.x** - Latest compiler features enabled
- **Testing Strategy:** 100% code coverage including:
  - Type guards and runtime checks
  - Comparison and conversion functions
  - Calendar arithmetic and boundary operations
  - Intl-based formatting with locale support
  - Functional composition utilities
  - Error handling and edge cases

## 4. Features & Capabilities

- **Comparison:** `isBefore`, `isAfter`, `isSame`, `isBetween`, `min`, `max`, `clamp`
- **Arithmetic:** `add`, `subtract`, `startOf`, `endOf`
- **Formatting:** `format`, `formatTime`, `formatDateTime`, `formatRelative` (Intl-based)
- **Conversion:** `now`, `fromISO`
- **Ranges:** `rangesOverlap`, `eachDayOfInterval`, `stepInterval`
- **Collections:** `sortAsc`, `sortDesc`, `closestTo`
- **Validation:** `isValidDateString`, `isValidTimezone`, `getTimezoneName`
- **Functional Utils:** `pipe`, `compose`

## 5. Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details on:
- Development setup
- Quality checks (Linting, Typechecking, Testing)
- Release process
- Project standards

- **ESNext target** - No legacy transpilation, minimal output

## 6. Comparison

| Feature | date-fns | Luxon | Native Temporal | **Temporal Kit** |
| :--- | :--- | :--- | :--- | :--- |
| **Base Object** | Legacy `Date` ⚠️ | Custom Class | `Temporal` | **`Temporal`** |
| **Paradigm** | Functional | OO / Immutable | OO / Verbose | **Functional** |
| **Timezones** | Separate Helpers | Built-in | Native | **Native** |
| **Tree-Shaking**| ✅ Yes | ❌ No | N/A | **✅ Yes** |
| **Polyfill Needed?**| No | No | No (Native) | **Optional** |
| **Best For...** | Legacy Projects | Heavy Date Apps | Low-level Logic | **Modern Apps** |
