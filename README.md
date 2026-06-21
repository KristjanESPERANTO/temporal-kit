# Temporal Kit

> **The missing ergonomics layer for the Temporal API.**

[![Status](https://img.shields.io/badge/Status-Ready%20for%20Early%20Adopters-success)](https://github.com/KristjanESPERANTO/temporal-kit)
[![npm version](https://img.shields.io/npm/v/temporal-kit)](https://www.npmjs.com/package/temporal-kit)
[![Min+gzip](https://img.shields.io/bundlejs/size/temporal-kit?label=minzip)](https://bundlejs.com/?q=temporal-kit)
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
// Node.js 26+ or modern browsers — native Temporal, no polyfill needed:
import { isPlainDate, add, startOf } from 'temporal-kit';

// Node.js 24 or older browsers — polyfill included:
import { isPlainDate } from 'temporal-kit/polyfilled';
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
import { formatRelative, startOf, endOf, add, nextDay, isBetween, addBusinessDays } from 'temporal-kit';
// On Node.js 24/25: import { Temporal } from 'temporal-polyfill';
// On Node.js 26+ or modern browsers: Temporal is available globally

const now = Temporal.Now.zonedDateTimeISO();
const today = Temporal.Now.plainDateISO();

// 1. Relative Time
formatRelative(now.subtract({ minutes: 5 })); // "5 minutes ago"

// 2. Find next Friday
const nextFriday = nextDay(now, 5); // 5 = Friday

// 3. Check if date is in range
isBetween(now, startOf(now, 'year'), endOf(now, 'year')); // true

// 4. Business Days
const monday = addBusinessDays(today, 1); // Skips weekend
```

## Documentation

- **[API Reference](./docs/API.md)** - Complete function reference with examples
- **[Usage Examples](./docs/USAGE_EXAMPLES.md)** - Practical examples for common use cases
- **[Best Practices](./docs/BEST_PRACTICES.md)** - Comprehensive guide for using temporal-kit effectively

## Why Temporal Kit?

Temporal ships natively in Node.js 26+ and modern browsers. Its types (`Instant`, `ZonedDateTime`, `PlainDate`) are precise and correct by design—but intentionally low-level. The ergonomics teams actually need—`startOf`, `isBetween`, humanized formatting—you're back to writing yourself.

**Why not just write 20 lines yourself?**

You could. But the subtle bugs accumulate quickly:

- `startOf('month')` breaks during DST transitions unless you account for the offset shift
- `isBefore` needs to handle `PlainDate`, `ZonedDateTime`, and `Instant` uniformly—or you write three adapters
- Leap-year and calendar-system edge cases in arithmetic surface in production, not in tests you wrote in 5 minutes
- Every project reinvents the same utilities, each slightly differently

**Temporal Kit** solves this with ~30 well-tested, tree-shakable helpers:

- Every function is tested against DST transitions, leap years, and calendar boundaries
- Uniform API across all Temporal types—no per-type adapter code
- `pipe` and `compose` for readable date pipelines without a wrapper class
- Zero runtime dependencies; polyfill is strictly opt-in

## Design Principles

**Narrow scope, high quality.** Temporal Kit focuses on the 95% use case—common helpers most projects need, tested against edge cases you'd otherwise hit in production. For specialized needs like recurring patterns or iCalendar RRULE, see [rrule-temporal](https://github.com/ggaabe/rrule-temporal).

**Temporal-native.** Works directly with `Temporal` objects (`ZonedDateTime`, `PlainDate`, `Instant`). No legacy `Date` quirks, 1-indexed months, no timezone surprises. Formatting uses `Intl.DateTimeFormat`—correct localization without massive locale files.

**Functional-first.** Pure functions, tree-shakable, composable—no wrapper class, no hidden state.

```typescript
import { add, startOf, pipe } from 'temporal-kit'

// Direct
const result = add(startOf(date, 'day'), { hours: 1 })

// With pipe
const result = pipe(
  date,
  d => startOf(d, 'day'),
  d => add(d, { hours: 1 })
)
```

> Fluent APIs (`moment().add().startOf()`) are convenient but force bundling *all* methods. Pure functions give perfect tree-shaking and align with the upcoming JS pipeline operator (`|>`).

**Polyfill as explicit opt-in.** `temporal-kit` expects native Temporal and throws a clear error if missing. `temporal-kit/polyfilled` auto-loads the polyfill—no surprises, no global side effects by default.

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

| Feature | [Moment.js](https://momentjs.com/) | [date-fns v4](https://date-fns.org/) | [Luxon](https://moment.github.io/luxon/) | [Native Temporal](https://tc39.es/proposal-temporal/docs/) | **Temporal Kit** |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Base Object** | Mutable Wrapper | Legacy `Date` | Custom Class | `Temporal` | **`Temporal`** |
| **Paradigm** | OO / Mutable | Functional | OO / Immutable | Low-level OO | **Functional** |
| **Timezones** | Separate lib | Separate lib | Built-in | Native | **Native** |
| **Calendar Systems** | No | No | No | Yes | **Yes** |
| **Tree-Shaking** | No | Yes | No | N/A | **Yes** |
| **Polyfill Needed?** | No | No | No | No (Native) | **Optional** |
| **Temporal-native** | No | No | No | Yes | **Yes** |


