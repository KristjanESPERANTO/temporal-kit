# Best Practices Guide

Comprehensive guide for using temporal-kit effectively.

## Table of Contents

- [Type Safety](#type-safety)
- [Timezone Handling](#timezone-handling)
- [Performance](#performance)
- [Internationalization](#internationalization)
- [Error Handling](#error-handling)
- [Common Patterns](#common-patterns)
- [Testing](#testing)
- [Common Pitfalls](#common-pitfalls)

---

## Type Safety

### Use Type Guards for Runtime Safety

When working with values from external sources (APIs, user input), always validate types:

```typescript
import { isPlainDate, isZonedDateTime, add } from 'temporal-kit';

function processUserDate(input: unknown) {
  if (isPlainDate(input)) {
    return add(input, { days: 1 });
  }
  
  if (isZonedDateTime(input)) {
    return add(input, { hours: 24 });
  }
  
  throw new TypeError('Expected PlainDate or ZonedDateTime');
}
```

### Leverage DateLike and TimeLike Types

Use union types for flexible function signatures:

```typescript
import type { DateLike } from 'temporal-kit';
import { toPlainDate, format } from 'temporal-kit';

function displayDate(date: DateLike): string {
  // Works with PlainDate, PlainDateTime, or ZonedDateTime
  const plain = toPlainDate(date);
  return format(plain, { dateStyle: 'long' });
}
```

### Type Narrowing with Guards

Combine guards for precise type narrowing:

```typescript
import { isDateLike, isTimeLike } from 'temporal-kit';

function describeTemporal(value: unknown) {
  if (isDateLike(value) && isTimeLike(value)) {
    // Must be PlainDateTime or ZonedDateTime
    return 'Has both date and time';
  }
  
  if (isDateLike(value)) {
    // PlainDate (no time component)
    return 'Date only';
  }
  
  if (isTimeLike(value)) {
    // PlainTime (no date component)
    return 'Time only';
  }
  
  return 'Not a Temporal type';
}
```

---

## Timezone Handling

### Always Be Explicit About Timezones

When converting to ZonedDateTime, always specify the timezone:

```typescript
import { toZonedDateTime } from 'temporal-kit';

const date = Temporal.PlainDate.from('2025-11-30');

// ✅ Good: explicit timezone
const berlinTime = toZonedDateTime(date, 'Europe/Berlin');
const nyTime = toZonedDateTime(date, 'America/New_York');

// ❌ Bad: would throw error
// const zdt = toZonedDateTime(date);
```

### Use System Timezone Carefully

Be aware that system timezone may differ between development and production:

```typescript
import { now } from 'temporal-kit';

// This uses system timezone
const systemTime = now();

// For portable code, consider being explicit:
const utcTime = Temporal.Now.instant();
const berlinTime = utcTime.toZonedDateTimeISO('Europe/Berlin');
```

### Handle DST Transitions

Be aware of Daylight Saving Time transitions:

```typescript
import { add } from 'temporal-kit';

// Spring forward example
const beforeDST = Temporal.ZonedDateTime.from(
  '2025-03-30T02:30:00+01:00[Europe/Berlin]'
);

// Adding 1 day during DST transition
const afterDST = add(beforeDST, { days: 1 });
// Result: 2025-03-31T02:30:00+02:00[Europe/Berlin]
// Clock time preserved, but offset changed

// Adding 24 hours gives different result
const after24h = add(beforeDST, { hours: 24 });
// Result: 2025-03-31T03:30:00+02:00[Europe/Berlin]
// Exact duration, clock time shifted
```

### Store UTC, Display Local

Best practice for databases and APIs:

```typescript
import { toZonedDateTime, format } from 'temporal-kit';

// Store as ISO string (UTC)
const instant = Temporal.Now.instant();
const stored = instant.toString(); // "2025-11-30T14:30:00Z"

// Display in user's timezone
function displayInUserTimezone(isoString: string, userTz: string) {
  const instant = Temporal.Instant.from(isoString);
  const local = instant.toZonedDateTimeISO(userTz);
  return format(local, { dateStyle: 'long', timeStyle: 'short' });
}

displayInUserTimezone(stored, 'Europe/Berlin');
displayInUserTimezone(stored, 'America/New_York');
```

---

## Performance

### Minimize Conversions

Avoid unnecessary type conversions in loops:

```typescript
import { toPlainDate } from 'temporal-kit';

// ❌ Bad: converts in every iteration
const dates = zdtArray.map(zdt => {
  const plain = toPlainDate(zdt); // repeated conversion
  return someOperation(plain);
});

// ✅ Good: convert once before loop
const plainDates = zdtArray.map(toPlainDate);
const results = plainDates.map(someOperation);
```

### Cache Format Objects

Intl.DateTimeFormat is expensive to create. Cache when formatting many dates:

```typescript
// ❌ Bad: creates new formatter for each date
dates.forEach(date => {
  console.log(format(date, { locale: 'de-DE', dateStyle: 'long' }));
});

// ✅ Good: create formatter once
const formatter = new Intl.DateTimeFormat('de-DE', { dateStyle: 'long' });
dates.forEach(date => {
  const jsDate = new Date(date.toString());
  console.log(formatter.format(jsDate));
});
```

### Use Compose for Repeated Operations

Create reusable functions to avoid repeated composition:

```typescript
import { compose, startOf, add } from 'temporal-kit';

// ❌ Bad: repeated composition
dates.map(d => add(startOf(d, 'month'), { days: 15 }));
dates.map(d => add(startOf(d, 'month'), { days: 15 }));

// ✅ Good: compose once, reuse
const midMonth = compose(
  d => add(d, { days: 15 }),
  d => startOf(d, 'month')
);

dates.map(midMonth);
dates.map(midMonth);
```

### Batch Operations

When possible, batch related operations:

```typescript
import { min, max, isBefore } from 'temporal-kit';

// ✅ Good: find range in one pass
const [earliest, latest] = [min(dates), max(dates)];

// Then use for filtering
const inRange = dates.filter(d => 
  !isBefore(d, earliest) && isBefore(d, latest)
);
```

---

## Internationalization

### Support Multiple Locales

Design functions to accept locale parameters:

```typescript
import { format } from 'temporal-kit';

function formatForUser(date: DateLike, userLocale: string | string[]) {
  return format(date, {
    locale: userLocale,
    dateStyle: 'long'
  });
}

// Use with user preferences
const date = Temporal.PlainDate.from('2025-11-30');
formatForUser(date, 'de-DE');  // "30. November 2025"
formatForUser(date, 'ja-JP');  // "2025年11月30日"
formatForUser(date, ['fr-CA', 'fr-FR']); // Try fr-CA, fallback to fr-FR
```

### Use Relative Time for Recency

Relative formatting is more user-friendly for recent dates:

```typescript
import { formatRelative, format, isBefore } from 'temporal-kit';

function smartFormat(date: DateLike, locale?: string) {
  const now = Temporal.Now.plainDateISO();
  const daysDiff = Math.abs(date.since(now).days);
  
  // Use relative for recent dates
  if (daysDiff <= 7) {
    return formatRelative(date, now, { locale });
  }
  
  // Use absolute for older dates
  return format(date, { locale, dateStyle: 'medium' });
}

const yesterday = Temporal.Now.plainDateISO().subtract({ days: 1 });
const lastMonth = Temporal.Now.plainDateISO().subtract({ months: 1 });

smartFormat(yesterday);  // "yesterday"
smartFormat(lastMonth);  // "Oct 30, 2025"
```

### Respect Calendar Systems

Some locales use different calendar systems:

```typescript
import { format } from 'temporal-kit';

const date = Temporal.PlainDate.from('2025-11-30');

// Gregorian (default)
format(date, { locale: 'en-US' }); // "Nov 30, 2025"

// Islamic calendar
format(date, { 
  locale: 'ar-SA',
  options: { calendar: 'islamic' }
});

// Japanese calendar
format(date, { 
  locale: 'ja-JP',
  options: { calendar: 'japanese', era: 'long' }
});
```

---

## Error Handling

### Validate Input Early

Check inputs before processing:

```typescript
import { isPlainDate, add } from 'temporal-kit';

function addBusinessDays(date: unknown, days: number): Temporal.PlainDate {
  // Validate types
  if (!isPlainDate(date)) {
    throw new TypeError('Expected PlainDate');
  }
  
  if (!Number.isInteger(days) || days < 0) {
    throw new RangeError('Days must be a positive integer');
  }
  
  // Now safe to proceed
  return add(date, { days });
}
```

### Handle Conversion Errors

ISO string parsing can fail:

```typescript
import { fromISO } from 'temporal-kit';

function parseUserDate(input: string): Temporal.PlainDate | null {
  try {
    const temporal = fromISO(input);
    // fromISO returns various types, convert to PlainDate
    if ('toPlainDate' in temporal) {
      return temporal.toPlainDate();
    }
    return temporal as Temporal.PlainDate;
  } catch (error) {
    console.error('Invalid date format:', input);
    return null;
  }
}
```

### Provide Helpful Error Messages

Make errors actionable:

```typescript
import { toZonedDateTime } from 'temporal-kit';

function convertToUserTimezone(
  date: DateLike, 
  timezone: string | undefined
): Temporal.ZonedDateTime {
  if (!timezone) {
    throw new Error(
      'Timezone is required for conversion. ' +
      'Common values: "America/New_York", "Europe/Berlin", "Asia/Tokyo". ' +
      'See https://en.wikipedia.org/wiki/List_of_tz_database_time_zones'
    );
  }
  
  return toZonedDateTime(date, timezone);
}
```

---

## Common Patterns

### Business Days Calculation

Skip weekends when adding days:

```typescript
import { add, pipe } from 'temporal-kit';

function addBusinessDays(date: Temporal.PlainDate, days: number): Temporal.PlainDate {
  let result = date;
  let remaining = days;
  
  while (remaining > 0) {
    result = add(result, { days: 1 });
    const dayOfWeek = result.dayOfWeek;
    
    // Skip weekends (6 = Saturday, 7 = Sunday)
    if (dayOfWeek !== 6 && dayOfWeek !== 7) {
      remaining--;
    }
  }
  
  return result;
}

const friday = Temporal.PlainDate.from('2025-11-28');
addBusinessDays(friday, 3); // Skips weekend, returns Tuesday
```

### Age Calculation

Calculate precise age from birthdate:

```typescript
import { toPlainDate, isBefore } from 'temporal-kit';

function calculateAge(birthDate: DateLike, referenceDate?: DateLike): number {
  const birth = toPlainDate(birthDate);
  const ref = referenceDate ? toPlainDate(referenceDate) : Temporal.Now.plainDateISO();
  
  const { years, months, days } = birth.until(ref, { largestUnit: 'year' });
  
  // Return full years
  return years;
}

const birthDate = Temporal.PlainDate.from('1990-06-15');
calculateAge(birthDate); // e.g., 35 (as of 2025-11-30)
```

### Date Range Generation

Generate array of dates:

```typescript
import { add } from 'temporal-kit';

function generateDateRange(
  start: Temporal.PlainDate, 
  end: Temporal.PlainDate
): Temporal.PlainDate[] {
  const dates: Temporal.PlainDate[] = [];
  let current = start;
  
  while (Temporal.PlainDate.compare(current, end) <= 0) {
    dates.push(current);
    current = add(current, { days: 1 });
  }
  
  return dates;
}

const start = Temporal.PlainDate.from('2025-11-28');
const end = Temporal.PlainDate.from('2025-12-02');
const range = generateDateRange(start, end);
// [2025-11-28, 2025-11-29, 2025-11-30, 2025-12-01, 2025-12-02]
```

### Quarters

Get fiscal quarters:

```typescript
import { startOf, endOf } from 'temporal-kit';

function getQuarter(date: Temporal.PlainDate): number {
  return Math.ceil(date.month / 3);
}

function getQuarterRange(date: Temporal.PlainDate): [Temporal.PlainDate, Temporal.PlainDate] {
  const quarter = getQuarter(date);
  const firstMonth = (quarter - 1) * 3 + 1;
  
  const start = Temporal.PlainDate.from({
    year: date.year,
    month: firstMonth,
    day: 1
  });
  
  const end = endOf(start.add({ months: 2 }), 'month');
  
  return [start, end];
}

const date = Temporal.PlainDate.from('2025-11-30');
getQuarter(date); // 4
getQuarterRange(date); // [2025-10-01, 2025-12-31]
```

### Duration Formatting

Format durations in human-readable form:

```typescript
function formatDuration(duration: Temporal.Duration): string {
  const parts: string[] = [];
  
  if (duration.years) parts.push(`${duration.years}y`);
  if (duration.months) parts.push(`${duration.months}mo`);
  if (duration.days) parts.push(`${duration.days}d`);
  if (duration.hours) parts.push(`${duration.hours}h`);
  if (duration.minutes) parts.push(`${duration.minutes}m`);
  if (duration.seconds) parts.push(`${duration.seconds}s`);
  
  return parts.join(' ') || '0s';
}

const start = Temporal.PlainDate.from('2025-01-01');
const end = Temporal.PlainDate.from('2025-11-30');
const duration = start.until(end);

formatDuration(duration); // "10mo 29d"
```

---

## Testing

### Use Fixed Dates in Tests

Avoid `Temporal.Now` in tests to ensure reproducibility:

```typescript
import { describe, it, expect } from 'vitest';
import { formatRelative } from 'temporal-kit';

describe('formatRelative', () => {
  it('formats yesterday correctly', () => {
    // ✅ Good: fixed dates
    const base = Temporal.PlainDate.from('2025-11-30');
    const yesterday = Temporal.PlainDate.from('2025-11-29');
    
    expect(formatRelative(yesterday, base)).toBe('yesterday');
  });
  
  // ❌ Bad: uses current time
  it('formats yesterday - FLAKY', () => {
    const yesterday = Temporal.Now.plainDateISO().subtract({ days: 1 });
    expect(formatRelative(yesterday)).toBe('yesterday'); // Can fail at midnight
  });
});
```

### Test Timezone Edge Cases

Test DST transitions and timezone boundaries:

```typescript
import { describe, it, expect } from 'vitest';
import { add } from 'temporal-kit';

describe('DST transitions', () => {
  it('handles spring forward', () => {
    const beforeDST = Temporal.ZonedDateTime.from(
      '2025-03-30T02:30:00+01:00[Europe/Berlin]'
    );
    
    const afterDay = add(beforeDST, { days: 1 });
    expect(afterDay.hour).toBe(2); // Clock time preserved
    expect(afterDay.offset).toBe('+02:00'); // Offset changed
    
    const after24h = add(beforeDST, { hours: 24 });
    expect(after24h.hour).toBe(3); // Clock time shifted
  });
});
```

### Mock Intl for Consistent Output

Lock locale in tests:

```typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { format } from 'temporal-kit';

describe('format with locked locale', () => {
  const originalLocale = Intl.DateTimeFormat().resolvedOptions().locale;
  
  beforeAll(() => {
    // Tests should explicitly pass locale
  });
  
  it('formats with explicit locale', () => {
    const date = Temporal.PlainDate.from('2025-11-30');
    
    // ✅ Good: explicit locale
    expect(format(date, { locale: 'en-US' })).toBe('Nov 30, 2025');
    expect(format(date, { locale: 'de-DE' })).toBe('30.11.2025');
  });
});
```

---

## Common Pitfalls

### Don't Confuse Days and Hours

Be aware of the difference when working with ZonedDateTime:

```typescript
import { add } from 'temporal-kit';

const zdt = Temporal.ZonedDateTime.from(
  '2025-03-30T00:00:00+01:00[Europe/Berlin]'
);

// Adding days preserves clock time (adjusts for DST)
const plusDay = add(zdt, { days: 1 });
// 2025-03-31T00:00:00+02:00 (still midnight, but offset changed)

// Adding hours is exact duration (may shift clock time)
const plus24h = add(zdt, { hours: 24 });
// 2025-03-31T01:00:00+02:00 (1 AM due to DST)
```

### Watch Out for Month Boundaries

Adding months respects calendar rules:

```typescript
import { add } from 'temporal-kit';

const jan31 = Temporal.PlainDate.from('2025-01-31');

add(jan31, { months: 1 }); // 2025-02-28 (Feb has 28 days)
add(jan31, { months: 2 }); // 2025-03-31 (Back to 31st)

// Multiple adds can accumulate:
const result = add(add(jan31, { months: 1 }), { months: 1 });
// 2025-03-28 (not March 31!)
```

### Don't Mix PlainDateTime and Timezones

PlainDateTime has no timezone information:

```typescript
import { toZonedDateTime } from 'temporal-kit';

const dt = Temporal.PlainDateTime.from('2025-11-30T12:00:00');

// ❌ Bad: assuming a timezone
console.log(dt.toString()); // No timezone info

// ✅ Good: explicit conversion
const berlin = toZonedDateTime(dt, 'Europe/Berlin');
const ny = toZonedDateTime(dt, 'America/New_York');

// These represent different instants in time!
console.log(berlin.toString()); // ...+01:00[Europe/Berlin]
console.log(ny.toString());     // ...-05:00[America/New_York]
```

### startOf Week Depends on Locale

Week start day varies by locale (Monday vs Sunday):

```typescript
import { startOf } from 'temporal-kit';

const date = Temporal.PlainDate.from('2025-11-30'); // Sunday

// ISO 8601 week (starts Monday)
const weekStart = startOf(date, 'week');
// 2025-11-24 (previous Monday)

// For US-style weeks (Sunday), need custom logic
function startOfWeekUS(date: Temporal.PlainDate): Temporal.PlainDate {
  const dayOfWeek = date.dayOfWeek;
  const daysToSubtract = dayOfWeek === 7 ? 0 : dayOfWeek;
  return date.subtract({ days: daysToSubtract });
}
```

### Be Careful with until/since

Direction matters for durations:

```typescript
const earlier = Temporal.PlainDate.from('2025-11-01');
const later = Temporal.PlainDate.from('2025-11-30');

// until() gives positive duration (from earlier to later)
earlier.until(later).days; // 29

// since() gives positive duration (from later to earlier)
later.since(earlier).days; // 29

// Reversed order gives negative
earlier.since(later).days; // -29
later.until(earlier).days; // -29
```

### Avoid String Concatenation

Don't build ISO strings manually:

```typescript
// ❌ Bad: error-prone
const dateStr = `${year}-${month}-${day}`;

// ✅ Good: use from() with object
const date = Temporal.PlainDate.from({ year, month, day });

// ✅ Good: use toString()
const isoString = date.toString();
```
