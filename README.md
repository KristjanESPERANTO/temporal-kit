# Temporal Kit

> **A functional toolbox for working with Temporal.**

[![Status](https://img.shields.io/badge/Status-Ready%20for%20Early%20Adopters-success)](https://github.com/KristjanESPERANTO/temporal-kit)
[![npm version](https://img.shields.io/npm/v/temporal-kit)](https://www.npmjs.com/package/temporal-kit)
[![Min+gzip](https://img.shields.io/bundlejs/size/temporal-kit?label=minzip)](https://bundlejs.com/?q=temporal-kit)
[![License](https://img.shields.io/npm/l/temporal-kit)](https://github.com/KristjanESPERANTO/temporal-kit/blob/main/LICENSE.md)

**Temporal Kit** is a lightweight, tree-shakable collection of composable helpers for common date and time workflows. It complements Temporal with focused APIs for comparison, formatting, parsing, ranges, business-day arithmetic, and more, while keeping Temporal objects at the center.

🌐 **[Try the Live Playground →](https://kristjanesperanto.github.io/temporal-kit/)**

## Quick Start

### Installation

```bash
npm install temporal-kit
# Only needed when importing temporal-kit/polyfilled:
npm install temporal-polyfill
```

### Basic Usage

```typescript
// Node.js 26+ or modern browsers — native Temporal, no polyfill needed:
import { isPlainDate, add, startOf } from "temporal-kit";

// Node.js 24 or older — install temporal-polyfill first:
import { isPlainDate } from "temporal-kit/polyfilled";
```

### Browser Usage (without bundlers)

For environments that don't use bundlers (e.g., MagicMirror modules):

```html
<script src="node_modules/temporal-kit/dist/temporal-kit.browser.polyfilled.global.js"></script>
<script>
  const today = TemporalKit.today();
  const formatted = TemporalKit.formatPlainDate(today, 'en-US');
  console.log(formatted); // "January 9, 2026"
</script>
```

Or via CDN:

```html
<script src="https://unpkg.com/temporal-kit/dist/temporal-kit.browser.polyfilled.global.js"></script>
```

> **💡 See it in action:** Check out the [`examples`](examples/README.md) for runnable code samples covering type guards, polyfill usage, TypeScript integration, and more.

## Common Recipes

```typescript
import {
  formatRelative,
  startOf,
  endOf,
  add,
  nextDay,
  isBetween,
  addBusinessDays,
} from "temporal-kit";
// On Node.js 24/25: import { Temporal } from 'temporal-polyfill';
// On Node.js 26+ or modern browsers: Temporal is available globally

const now = Temporal.Now.zonedDateTimeISO();
const today = Temporal.Now.plainDateISO();

// 1. Relative Time
formatRelative(now.subtract({ minutes: 5 })); // "5 minutes ago"

// 2. Find next Friday
const nextFriday = nextDay(now, 5); // 5 = Friday

// 3. Check if date is in range
isBetween(now, startOf(now, "year"), endOf(now, "year")); // true

// 4. Business Days
const monday = addBusinessDays(today, 1); // Skips weekend
```

## Documentation

- **[API Reference](./docs/API.md)** - Complete function reference with examples
- **[Usage Examples](./docs/USAGE_EXAMPLES.md)** - Practical examples for common use cases
- **[Best Practices](./docs/BEST_PRACTICES.md)** - Comprehensive guide for using temporal-kit effectively

## Why Temporal Kit?

Temporal provides precise date and time primitives. Temporal Kit brings common application workflows together as small, typed functions that compose naturally:

```typescript
pipe(
  date,
  (d) => startOf(d, "month"),
  (d) => add(d, { days: 1 }),
);
```

Use the helpers you need independently: the API is tree-shakable, works directly with Temporal types, and has zero runtime dependencies in its native entry point.

## Design Principles

**Narrow scope, high quality.** ~30 helpers for the common case. Tested against DST, leap years, timezone edge cases. For specialized needs (RRULE, recurrence), see [rrule-temporal](https://github.com/ggaabe/rrule-temporal).

**Temporal-native.** Works with `Temporal` types directly. No `Date` quirks, no 1-indexed months, correct timezones by default.

**Functional.** Pure functions, tree-shakable, designed for `pipe` and `compose`. No wrapper classes or hidden state. Example:

```typescript
import { add, startOf, pipe } from "temporal-kit";

const endOfNextMonth = pipe(
  today,
  (d) => add(d, { months: 1 }),
  (d) => endOf(d, "month"),
);
```

**Polyfill as opt-in.** The main entry expects native Temporal (Node 26+, modern browsers). The `temporal-kit/polyfilled` entry loads the optional `temporal-polyfill` peer dependency; the standalone browser IIFE includes it.

## Features & Capabilities

- **Comparison:** `isBefore`, `isAfter`, `isSame`, `isBetween`, `min`, `max`, `clamp`
- **Arithmetic:** `add`, `subtract`, `startOf`, `endOf`
- **Formatting:** `format`, `formatTime`, `formatDateTime`, `formatRelative`, `formatCalendar` (Intl-based)
- **Conversion:** `now`, `today`, `nowZoned`, `fromISO`
- **Ranges:** `rangesOverlap`, `eachDayOfInterval`, `eachWeekOfInterval`, `eachMonthOfInterval`, `eachYearOfInterval`, `stepInterval`
- **Collections:** `sortAsc`, `sortDesc`, `closestTo`
- **Validation:** `isValidDateString`, `isValidTimeString`, `isValidDateTimeString`, `isValidInstantString`, `isValidZonedString`, `isValidTimezone`, `getTimezoneName`
- **Functional Utils:** `pipe`, `compose`

## Supply-Chain Trust

To improve release integrity and enterprise adoption, `temporal-kit` uses a CI-based publish model with npm provenance.

See [SECURITY.md](./SECURITY.md) for security policy and trust controls.
For maintainer release operations (versioning, stable/`latest` and pre-release/`next` flow), see [CONTRIBUTING.md](./CONTRIBUTING.md).

## Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md).

## Comparison

| Feature              | [Moment.js](https://momentjs.com/) | [date-fns v4](https://date-fns.org/) | [Luxon](https://moment.github.io/luxon/) | [Native Temporal](https://tc39.es/proposal-temporal/docs/) | **Temporal Kit** |
| :------------------- | :--------------------------------- | :----------------------------------- | :--------------------------------------- | :--------------------------------------------------------- | :--------------- |
| **Base Object**      | Mutable Wrapper                    | Legacy `Date`                        | Custom Class                             | `Temporal`                                                 | **`Temporal`**   |
| **Paradigm**         | OO / Mutable                       | Functional                           | OO / Immutable                           | Low-level OO                                               | **Functional**   |
| **Timezones**        | Separate lib                       | Separate lib                         | Built-in                                 | Native                                                     | **Native**       |
| **Calendar Systems** | No                                 | No                                   | No                                       | Yes                                                        | **Yes**          |
| **Tree-Shaking**     | No                                 | Yes                                  | No                                       | N/A                                                        | **Yes**          |
| **Polyfill Needed?** | No                                 | No                                   | No                                       | No (Native)                                                | **Optional**     |
| **Temporal-native**  | No                                 | No                                   | No                                       | Yes                                                        | **Yes**          |
