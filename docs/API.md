# API Reference

Complete reference for all functions in temporal-kit.

## Table of Contents

- [Type Guards](#type-guards)
- [Comparison Functions](#comparison-functions)
- [Conversion Functions](#conversion-functions)
- [Parsing Functions](#parsing-functions)
- [Formatting Functions](#formatting-functions)
- [Math Functions](#math-functions)
- [Range Functions](#range-functions)
- [Collection Functions](#collection-functions)
- [Validation Functions](#validation-functions)
- [Rounding Functions](#rounding-functions)
- [Timezone Functions](#timezone-functions)
- [Utility Functions](#utility-functions)
- [Types](#types)

---

## Type Guards

Runtime type checking functions for Temporal types.

### `isPlainDate(value)`

Check if a value is a `Temporal.PlainDate`.

**Parameters:**
- `value: unknown` - Value to check

**Returns:** `boolean`

**Example:**
```typescript
import { isPlainDate } from 'temporal-kit';

const date = Temporal.PlainDate.from('2025-11-30');
isPlainDate(date); // true
isPlainDate('2025-11-30'); // false
```

---

### `isPlainDateTime(value)`

Check if a value is a `Temporal.PlainDateTime`.

**Parameters:**
- `value: unknown` - Value to check

**Returns:** `boolean`

**Example:**
```typescript
import { isPlainDateTime } from 'temporal-kit';

const dt = Temporal.PlainDateTime.from('2025-11-30T15:30:00');
isPlainDateTime(dt); // true
```

---

### `isZonedDateTime(value)`

Check if a value is a `Temporal.ZonedDateTime`.

**Parameters:**
- `value: unknown` - Value to check

**Returns:** `boolean`

**Example:**
```typescript
import { isZonedDateTime } from 'temporal-kit';

const zdt = Temporal.ZonedDateTime.from('2025-11-30T15:30:00+01:00[Europe/Berlin]');
isZonedDateTime(zdt); // true
```

---

### `isInstant(value)`

Check if a value is a `Temporal.Instant`.

**Parameters:**
- `value: unknown` - Value to check

**Returns:** `boolean`

**Example:**
```typescript
import { isInstant } from 'temporal-kit';

const instant = Temporal.Instant.from('2025-11-30T14:30:00Z');
isInstant(instant); // true
```

---

### `isPlainTime(value)`

Check if a value is a `Temporal.PlainTime`.

**Parameters:**
- `value: unknown` - Value to check

**Returns:** `boolean`

**Example:**
```typescript
import { isPlainTime } from 'temporal-kit';

const time = Temporal.PlainTime.from('15:30:00');
isPlainTime(time); // true
```

---

### `isDateLike(value)`

Check if a value is date-like (PlainDate, PlainDateTime, or ZonedDateTime).

**Parameters:**
- `value: unknown` - Value to check

**Returns:** `boolean`

**Example:**
```typescript
import { isDateLike } from 'temporal-kit';

isDateLike(Temporal.PlainDate.from('2025-11-30')); // true
isDateLike(Temporal.PlainDateTime.from('2025-11-30T15:30:00')); // true
isDateLike(Temporal.PlainTime.from('15:30:00')); // false
```

---

### `isTimeLike(value)`

Check if a value is time-like (PlainTime, PlainDateTime, or ZonedDateTime).

**Parameters:**
- `value: unknown` - Value to check

**Returns:** `boolean`

**Example:**
```typescript
import { isTimeLike } from 'temporal-kit';

isTimeLike(Temporal.PlainTime.from('15:30:00')); // true
isTimeLike(Temporal.PlainDateTime.from('2025-11-30T15:30:00')); // true
isTimeLike(Temporal.PlainDate.from('2025-11-30')); // false
```

---

## Comparison Functions

Functions for comparing and finding min/max dates.

### `isBefore(a, b)`

Check if date `a` is before date `b`.

**Parameters:**
- `a: DateLike` - First date
- `b: DateLike` - Second date

**Returns:** `boolean`

**Example:**
```typescript
import { isBefore } from 'temporal-kit';

const date1 = Temporal.PlainDate.from('2025-11-29');
const date2 = Temporal.PlainDate.from('2025-11-30');
isBefore(date1, date2); // true
```

---

### `isAfter(a, b)`

Check if date `a` is after date `b`.

**Parameters:**
- `a: DateLike` - First date
- `b: DateLike` - Second date

**Returns:** `boolean`

**Example:**
```typescript
import { isAfter } from 'temporal-kit';

const date1 = Temporal.PlainDate.from('2025-12-01');
const date2 = Temporal.PlainDate.from('2025-11-30');
isAfter(date1, date2); // true
```

---

### `isSame(a, b)`

Check if two dates are equal.

**Parameters:**
- `a: DateLike` - First date
- `b: DateLike` - Second date

**Returns:** `boolean`

**Example:**
```typescript
import { isSame } from 'temporal-kit';

const date1 = Temporal.PlainDate.from('2025-11-30');
const date2 = Temporal.PlainDate.from('2025-11-30');
isSame(date1, date2); // true
```

---

### `isSameYear(a, b)`

Check if two dates are in the same year.

**Parameters:**
- `a: DateLike` - First date
- `b: DateLike` - Second date

**Returns:** `boolean`

**Example:**
```typescript
import { isSameYear } from 'temporal-kit';

const date1 = Temporal.PlainDate.from('2025-01-01');
const date2 = Temporal.PlainDate.from('2025-12-31');
isSameYear(date1, date2); // true
```

---

### `isSameMonth(a, b)`

Check if two dates are in the same month and year.

**Parameters:**
- `a: DateLike` - First date
- `b: DateLike` - Second date

**Returns:** `boolean`

**Example:**
```typescript
import { isSameMonth } from 'temporal-kit';

const date1 = Temporal.PlainDate.from('2025-01-01');
const date2 = Temporal.PlainDate.from('2025-01-31');
isSameMonth(date1, date2); // true
```

---

### `isSameWeek(a, b)`

Check if two dates are in the same week and year (ISO week numbering).

**Parameters:**
- `a: DateLike` - First date
- `b: DateLike` - Second date

**Returns:** `boolean`

**Example:**
```typescript
import { isSameWeek } from 'temporal-kit';

const date1 = Temporal.PlainDate.from('2025-01-01'); // Wednesday
const date2 = Temporal.PlainDate.from('2025-01-05'); // Sunday
isSameWeek(date1, date2); // true
```

---

### `isSameDay(a, b)`

Check if two dates are on the same calendar day (year, month, day).

**Parameters:**
- `a: DateLike` - First date
- `b: DateLike` - Second date

**Returns:** `boolean`

**Example:**
```typescript
import { isSameDay } from 'temporal-kit';

const date1 = Temporal.PlainDate.from('2025-01-01');
const date2 = Temporal.PlainDateTime.from('2025-01-01T15:00');
isSameDay(date1, date2); // true
```

---

### `min(dates)`

Find the earliest date in an array.

**Parameters:**
- `dates: DateLike[]` - Array of dates

**Returns:** `DateLike` - Earliest date

**Throws:** `TypeError` if array is empty

**Example:**
```typescript
import { min } from 'temporal-kit';

const dates = [
  Temporal.PlainDate.from('2025-12-01'),
  Temporal.PlainDate.from('2025-11-29'),
  Temporal.PlainDate.from('2025-11-30')
];
min(dates); // 2025-11-29
```

---

### `max(dates)`

Find the latest date in an array.

**Parameters:**
- `dates: DateLike[]` - Array of dates

**Returns:** `DateLike` - Latest date

**Throws:** `TypeError` if array is empty

**Example:**
```typescript
import { max } from 'temporal-kit';

const dates = [
  Temporal.PlainDate.from('2025-11-29'),
  Temporal.PlainDate.from('2025-12-01'),
  Temporal.PlainDate.from('2025-11-30')
];
max(dates); // 2025-12-01
```

---

## Conversion Functions

Functions for creating and converting between Temporal types.

### `now()`

Get the current date/time as ZonedDateTime in the system timezone.

**Returns:** `Temporal.ZonedDateTime`

**Example:**
```typescript
import { now } from 'temporal-kit';

const current = now();
console.log(current.toString()); // e.g., "2025-11-30T15:30:00+01:00[Europe/Berlin]"
```

---

### `fromISO(isoString)`

Parse an ISO 8601 string and return the appropriate Temporal type.

**Parameters:**
- `isoString: string` - ISO 8601 formatted string

**Returns:** `Temporal.PlainDate | Temporal.PlainDateTime | Temporal.ZonedDateTime | Temporal.Instant`

**Example:**
```typescript
import { fromISO } from 'temporal-kit';

fromISO('2025-11-30'); // PlainDate
fromISO('2025-11-30T15:30:00'); // PlainDateTime
fromISO('2025-11-30T15:30:00+01:00[Europe/Berlin]'); // ZonedDateTime
fromISO('2025-11-30T15:30:00Z'); // Instant
```

---

### `toPlainDate(date)`

Convert any DateLike value to PlainDate.

**Parameters:**
- `date: DateLike` - Date to convert

**Returns:** `Temporal.PlainDate`

**Example:**
```typescript
import { toPlainDate } from 'temporal-kit';

const dt = Temporal.PlainDateTime.from('2025-11-30T15:30:00');
toPlainDate(dt); // 2025-11-30

const zdt = Temporal.ZonedDateTime.from('2025-11-30T15:30:00+01:00[Europe/Berlin]');
toPlainDate(zdt); // 2025-11-30
```

---

### `toPlainDateTime(date)`

Convert PlainDateTime or ZonedDateTime to PlainDateTime.

**Parameters:**
- `date: Temporal.PlainDateTime | Temporal.ZonedDateTime` - Date to convert

**Returns:** `Temporal.PlainDateTime`

**Example:**
```typescript
import { toPlainDateTime } from 'temporal-kit';

const zdt = Temporal.ZonedDateTime.from('2025-11-30T15:30:00+01:00[Europe/Berlin]');
toPlainDateTime(zdt); // 2025-11-30T15:30:00
```

---

### `toZonedDateTime(date, timeZone?)`

Convert any DateLike value to ZonedDateTime.

**Parameters:**
- `date: DateLike` - Date to convert
- `timeZone?: string` - IANA timezone (required for PlainDate/PlainDateTime)

**Returns:** `Temporal.ZonedDateTime`

**Throws:** `TypeError` if timezone is missing for PlainDate/PlainDateTime

**Example:**
```typescript
import { toZonedDateTime } from 'temporal-kit';

const date = Temporal.PlainDate.from('2025-11-30');
toZonedDateTime(date, 'Europe/Berlin'); // 2025-11-30T00:00:00+01:00[Europe/Berlin]

const dt = Temporal.PlainDateTime.from('2025-11-30T15:30:00');
toZonedDateTime(dt, 'America/New_York'); // 2025-11-30T15:30:00-05:00[America/New_York]
```

---

## Parsing Functions

Functions for parsing strings into Temporal types with smart format detection.

### `parse(input)`

Parse a string into the most appropriate Temporal type based on format detection.

**Parameters:**
- `input: string` - String to parse

**Returns:** `Temporal.PlainDate | Temporal.PlainDateTime | Temporal.ZonedDateTime | Temporal.Instant | Temporal.PlainTime`

**Supported Formats:**
- ISO 8601: All variants (dates, datetimes, instants, zoned datetimes)
- European dates: DD.MM.YYYY
- US dates: MM/DD/YYYY
- Alternative formats: DD-MM-YYYY, YYYY/MM/DD
- 12-hour time: With AM/PM (e.g., "3:30 PM")
- 24-hour time: HH:MM or HH:MM:SS
- DateTime combinations: Space-separated date and time

**Throws:** `RangeError` if string format is not recognized or contains invalid values

**Example:**
```typescript
import { parse } from 'temporal-kit';

// ISO 8601 formats
parse('2025-11-30');                              // PlainDate
parse('2025-11-30T15:30:00');                     // PlainDateTime
parse('2025-11-30T15:30:00Z');                    // Instant
parse('2025-11-30T15:30:00+01:00[Europe/Berlin]'); // ZonedDateTime

// European dates
parse('30.11.2025');                              // PlainDate
parse('30.11.2025 15:30');                        // PlainDateTime

// US dates
parse('11/30/2025');                              // PlainDate
parse('11/30/2025 3:30 PM');                      // PlainDateTime

// Alternative formats
parse('30-11-2025');                              // PlainDate
parse('2025/11/30');                              // PlainDate

// Time formats
parse('15:30');                                   // PlainTime
parse('15:30:45');                                // PlainTime
parse('3:30 PM');                                 // PlainTime
parse('9:00 AM');                                 // PlainTime

// DateTime combinations
parse('2025-11-30 15:30');                        // PlainDateTime
parse('2025-11-30 3:30 PM');                      // PlainDateTime
```

---

### `parseDate(input)`

Parse a string specifically as a PlainDate.

**Parameters:**
- `input: string` - String to parse

**Returns:** `Temporal.PlainDate`

**Supported Formats:**
- ISO 8601: YYYY-MM-DD
- European: DD.MM.YYYY
- US: MM/DD/YYYY
- Alternative: DD-MM-YYYY, YYYY/MM/DD

**Throws:** `RangeError` if string cannot be parsed as a date

**Example:**
```typescript
import { parseDate } from 'temporal-kit';

parseDate('2025-11-30');  // 2025-11-30
parseDate('30.11.2025');  // 2025-11-30
parseDate('11/30/2025');  // 2025-11-30
parseDate('30-11-2025');  // 2025-11-30
parseDate('2025/11/30');  // 2025-11-30

// Invalid dates are rejected
parseDate('2025-13-01');  // RangeError: Invalid month
parseDate('2025-02-29');  // RangeError: Invalid day for non-leap year
```

---

### `parseTime(input)`

Parse a string specifically as a PlainTime.

**Parameters:**
- `input: string` - String to parse

**Returns:** `Temporal.PlainTime`

**Supported Formats:**
- ISO 8601: HH:MM:SS, HH:MM:SS.sss
- Simplified: HH:MM
- 12-hour: h:MM AM/PM, h:MM:SS AM/PM

**Throws:** `RangeError` if string cannot be parsed as a time

**Example:**
```typescript
import { parseTime } from 'temporal-kit';

parseTime('15:30:00');    // 15:30:00
parseTime('15:30');       // 15:30:00
parseTime('3:30 PM');     // 15:30:00
parseTime('9:00 AM');     // 09:00:00
parseTime('12:00 AM');    // 00:00:00 (midnight)
parseTime('12:00 PM');    // 12:00:00 (noon)
parseTime('15:30:45.123'); // 15:30:45.123

// Invalid times are rejected
parseTime('25:00');       // RangeError: Invalid hour
parseTime('15:70');       // RangeError: Invalid minute
```

---

### `parseDateTime(input)`

Parse a string specifically as a PlainDateTime.

**Parameters:**
- `input: string` - String to parse

**Returns:** `Temporal.PlainDateTime`

**Supported Formats:**
- ISO 8601: YYYY-MM-DDTHH:MM:SS
- Space-separated: YYYY-MM-DD HH:MM:SS, DD.MM.YYYY HH:MM, MM/DD/YYYY HH:MM
- With 12-hour time: YYYY-MM-DD h:MM AM/PM, DD.MM.YYYY h:MM AM/PM

**Throws:** `RangeError` if string cannot be parsed as a datetime

**Example:**
```typescript
import { parseDateTime } from 'temporal-kit';

parseDateTime('2025-11-30T15:30:00');  // 2025-11-30T15:30:00
parseDateTime('2025-11-30 15:30:00');  // 2025-11-30T15:30:00
parseDateTime('30.11.2025 15:30');     // 2025-11-30T15:30:00
parseDateTime('11/30/2025 15:30');     // 2025-11-30T15:30:00
parseDateTime('2025-11-30 3:30 PM');   // 2025-11-30T15:30:00
parseDateTime('30.11.2025 9:00 AM');   // 2025-11-30T09:00:00

// Date-only or time-only strings throw
parseDateTime('2025-11-30');           // RangeError: Not a datetime
parseDateTime('15:30:00');             // RangeError: Not a datetime
```

**Practical Use Cases:**

```typescript
// User input parsing
function parseUserDateInput(input: string) {
  try {
    return parseDate(input);
  } catch (error) {
    return null; // or show error to user
  }
}

// API response parsing
const apiResponse = {
  createdAt: "2025-11-30T15:30:00Z",
  publishedAt: "2025-12-01T09:00:00+01:00[Europe/Paris]",
  date: "2025-11-30",
  time: "15:30:00",
};

const createdAt = parse(apiResponse.createdAt);       // Instant
const publishedAt = parse(apiResponse.publishedAt);   // ZonedDateTime
const date = parseDate(apiResponse.date);             // PlainDate
const time = parseTime(apiResponse.time);             // PlainTime

// Form data parsing with international formats
const formData = {
  birthDate: "11/30/2025",      // US format
  appointmentTime: "3:30 PM",    // 12-hour format
  europeanDate: "30.11.2025",    // European format
};

const birthDate = parseDate(formData.birthDate);
const appointmentTime = parseTime(formData.appointmentTime);
const europeanDate = parseDate(formData.europeanDate);
```

---

## Formatting Functions

Functions for formatting dates and times using Intl APIs.

### `format(date, options?)`

Format a DateLike value as a date string.

**Parameters:**
- `date: DateLike` - Date to format
- `options?: FormatOptions` - Formatting options

**FormatOptions:**
- `locale?: string | string[]` - Locale(s) to use (default: system locale)
- `dateStyle?: 'full' | 'long' | 'medium' | 'short'` - Date style (default: 'medium')
- `timeStyle?: 'full' | 'long' | 'medium' | 'short'` - Time style
- `options?: Intl.DateTimeFormatOptions` - Custom format options

**Returns:** `string`

**Example:**
```typescript
import { format } from 'temporal-kit';

const date = Temporal.PlainDate.from('2025-11-30');

format(date); // "Nov 30, 2025" (en-US)
format(date, { dateStyle: 'full' }); // "Sunday, November 30, 2025"
format(date, { locale: 'de-DE' }); // "30.11.2025"
format(date, { 
  options: { year: 'numeric', month: 'long' } 
}); // "November 2025"
```

---

### `formatTime(time, options?)`

Format a TimeLike value as a time string.

**Parameters:**
- `time: TimeLike` - Time to format
- `options?: FormatOptions` - Formatting options

**Returns:** `string`

**Example:**
```typescript
import { formatTime } from 'temporal-kit';

const time = Temporal.PlainTime.from('15:30:45');

formatTime(time); // "3:30:45 PM" (en-US)
formatTime(time, { timeStyle: 'short' }); // "3:30 PM"
formatTime(time, { locale: 'de-DE' }); // "15:30:45"
```

---

### `formatDateTime(date, options?)`

Format a DateLike value with both date and time.

**Parameters:**
- `date: DateLike` - Date to format
- `options?: FormatOptions` - Formatting options

**Returns:** `string`

**Example:**
```typescript
import { formatDateTime } from 'temporal-kit';

const dt = Temporal.PlainDateTime.from('2025-11-30T15:30:00');

formatDateTime(dt); // "Nov 30, 2025, 3:30:00 PM" (en-US)
formatDateTime(dt, { 
  dateStyle: 'long', 
  timeStyle: 'short' 
}); // "November 30, 2025 at 3:30 PM"
formatDateTime(dt, { locale: 'de-DE' }); // "30.11.2025, 15:30:00"
```

---

### `formatRelative(date, base?, options?)`

Format relative time (e.g., "2 days ago", "in 3 hours").

**Parameters:**
- `date: DateLike` - Date to format
- `base?: DateLike` - Base date to compare against (default: now)
- `options?: { locale?: string | string[], numeric?: "always" | "auto" }` - Formatting options

**Returns:** `string`

**Example:**
```typescript
import { formatRelative } from 'temporal-kit';

// Date comparisons (PlainDate)
const today = Temporal.PlainDate.from('2025-11-30');
formatRelative(today.subtract({ days: 1 }), today); // "yesterday"
formatRelative(today.add({ days: 14 }), today); // "in 2 weeks"

// Time comparisons (ZonedDateTime/PlainDateTime)
const now = Temporal.Now.zonedDateTimeISO();
formatRelative(now.subtract({ minutes: 10 }), now); // "10 minutes ago"
formatRelative(now.add({ hours: 3 }), now); // "in 3 hours"
formatRelative(now.add({ seconds: 30 }), now); // "in 30 seconds"

// Different locales
formatRelative(today.subtract({ days: 1 }), today, { locale: 'de-DE' }); // "gestern"
```

---

## Math Functions

Functions for date/time arithmetic and boundary operations.

### `add(date, duration)`

Add a duration to a date/time value.

**Parameters:**
- `date: DateLike` - Date to add to
- `duration: DurationInput` - Duration to add (object with years, months, days, hours, etc.)

**Returns:** Same type as input

**Example:**
```typescript
import { add } from 'temporal-kit';

const date = Temporal.PlainDate.from('2025-11-30');

add(date, { days: 5 }); // 2025-12-05
add(date, { months: 2, days: 3 }); // 2026-02-02

const dt = Temporal.PlainDateTime.from('2025-11-30T10:00:00');
add(dt, { hours: 5, minutes: 30 }); // 2025-11-30T15:30:00
```

---

### `subtract(date, duration)`

Subtract a duration from a date/time value.

**Parameters:**
- `date: DateLike` - Date to subtract from
- `duration: DurationInput` - Duration to subtract

**Returns:** Same type as input

**Example:**
```typescript
import { subtract } from 'temporal-kit';

const date = Temporal.PlainDate.from('2025-11-30');

subtract(date, { days: 5 }); // 2025-11-25
subtract(date, { months: 2 }); // 2025-09-30

const dt = Temporal.PlainDateTime.from('2025-11-30T15:00:00');
subtract(dt, { hours: 2, minutes: 30 }); // 2025-11-30T12:30:00
```

---

### `startOf(date, unit)`

Get the start of a time unit (e.g., start of day, start of month).

**Parameters:**
- `date: DateLike` - Date to round down
- `unit: DateUnit` - Time unit ('day' | 'week' | 'month' | 'year')

**Returns:** Same type as input

**Example:**
```typescript
import { startOf } from 'temporal-kit';

const dt = Temporal.PlainDateTime.from('2025-11-30T15:30:45');

startOf(dt, 'day');   // 2025-11-30T00:00:00
startOf(dt, 'week');  // 2025-11-24T00:00:00 (Monday)
startOf(dt, 'month'); // 2025-11-01T00:00:00
startOf(dt, 'year');  // 2025-01-01T00:00:00

const date = Temporal.PlainDate.from('2025-11-30');
startOf(date, 'month'); // 2025-11-01
```

---

### `endOf(date, unit)`

Get the end of a time unit (e.g., end of day, end of month).

**Parameters:**
- `date: DateLike` - Date to round up
- `unit: DateUnit` - Time unit ('day' | 'week' | 'month' | 'year')

**Returns:** Same type as input

**Example:**
```typescript
import { endOf } from 'temporal-kit';

const dt = Temporal.PlainDateTime.from('2025-11-30T15:30:45');

endOf(dt, 'day');   // 2025-11-30T23:59:59.999999999
endOf(dt, 'week');  // 2025-12-07T23:59:59.999999999 (Sunday)
endOf(dt, 'month'); // 2025-11-30T23:59:59.999999999
endOf(dt, 'year');  // 2025-12-31T23:59:59.999999999

const date = Temporal.PlainDate.from('2025-11-15');
endOf(date, 'month'); // 2025-11-30
```

---

## Range Functions

Functions for working with date intervals and ranges.

### `rangesOverlap(range1, range2)`

Checks if two time intervals overlap.

**Parameters:**
- `range1: { start: DateLike, end: DateLike }` - First interval
- `range2: { start: DateLike, end: DateLike }` - Second interval

**Returns:** `boolean`

**Example:**
```typescript
import { rangesOverlap } from 'temporal-kit';

const range1 = {
  start: Temporal.PlainDate.from('2025-01-01'),
  end: Temporal.PlainDate.from('2025-01-10')
};
const range2 = {
  start: Temporal.PlainDate.from('2025-01-05'),
  end: Temporal.PlainDate.from('2025-01-15')
};

rangesOverlap(range1, range2); // true
```

---

### `eachDayOfInterval(interval)`

Returns an array of days within the specified interval.

**Parameters:**
- `interval: { start: DateLike, end: DateLike }` - The interval

**Returns:** `DateLike[]` - Array of dates

**Example:**
```typescript
import { eachDayOfInterval } from 'temporal-kit';

const start = Temporal.PlainDate.from('2025-01-01');
const end = Temporal.PlainDate.from('2025-01-03');

eachDayOfInterval({ start, end });
// [2025-01-01, 2025-01-02, 2025-01-03]
```

---

### `eachWeekOfInterval(interval)`

Returns an array of weeks within the specified interval.

**Parameters:**
- `interval: { start: DateLike, end: DateLike }` - The interval

**Returns:** `DateLike[]` - Array of dates separated by 1 week

**Example:**
```typescript
import { eachWeekOfInterval } from 'temporal-kit';

const start = Temporal.PlainDate.from('2025-01-01');
const end = Temporal.PlainDate.from('2025-01-15');

eachWeekOfInterval({ start, end });
// [2025-01-01, 2025-01-08, 2025-01-15]
```

---

### `stepInterval(interval, duration)`

Generator that yields each step in an interval.

**Parameters:**
- `interval: { start: DateLike, end: DateLike }` - The interval
- `duration: Temporal.DurationLike` - The duration to step by

**Returns:** `Generator<DateLike>`

**Example:**
```typescript
import { stepInterval } from 'temporal-kit';

const start = Temporal.PlainDate.from('2025-01-01');
const end = Temporal.PlainDate.from('2025-01-05');

for (const date of stepInterval({ start, end }, { days: 2 })) {
  console.log(date.toString());
}
// 2025-01-01
// 2025-01-03
// 2025-01-05
```

---

## Collection Functions

Helpers for working with arrays of Temporal objects.

### `sortAsc(dates)`

Sorts an array of dates in ascending order. Returns a new array.

**Parameters:**
- `dates: DateLike[]` - Array of dates to sort

**Returns:** `DateLike[]` - New sorted array

**Example:**
```typescript
import { sortAsc } from 'temporal-kit';

const dates = [
  Temporal.PlainDate.from('2025-12-31'),
  Temporal.PlainDate.from('2025-01-01')
];

const sorted = sortAsc(dates);
// [2025-01-01, 2025-12-31]
```

---

### `sortDesc(dates)`

Sorts an array of dates in descending order. Returns a new array.

**Parameters:**
- `dates: DateLike[]` - Array of dates to sort

**Returns:** `DateLike[]` - New sorted array

**Example:**
```typescript
import { sortDesc } from 'temporal-kit';

const dates = [
  Temporal.PlainDate.from('2025-01-01'),
  Temporal.PlainDate.from('2025-12-31')
];

const sorted = sortDesc(dates);
// [2025-12-31, 2025-01-01]
```

---

### `closestTo(dateToCompare, dates)`

Returns the date from the array closest to the given date.

**Parameters:**
- `dateToCompare: DateLike` - The target date
- `dates: DateLike[]` - Array of dates to search

**Returns:** `DateLike | undefined` - The closest date, or undefined if array is empty

**Example:**
```typescript
import { closestTo } from 'temporal-kit';

const target = Temporal.PlainDate.from('2025-06-01');
const dates = [
  Temporal.PlainDate.from('2025-01-01'),
  Temporal.PlainDate.from('2025-12-31')
];

closestTo(target, dates); // 2025-01-01
```

---

## Validation Functions

Helpers for validating date/time strings.

### `isValidDateString(dateString)`

Checks if a string is a valid ISO 8601 date string (YYYY-MM-DD).

**Parameters:**
- `dateString: string` - The string to validate

**Returns:** `boolean`

**Example:**
```typescript
import { isValidDateString } from 'temporal-kit';

isValidDateString('2025-12-31'); // true
isValidDateString('2025-13-01'); // false
```

---

### `isValidTimeString(timeString)`

Checks if a string is a valid ISO 8601 time string (HH:MM:SS).

**Parameters:**
- `timeString: string` - The string to validate

**Returns:** `boolean`

**Example:**
```typescript
import { isValidTimeString } from 'temporal-kit';

isValidTimeString('15:30:00'); // true
isValidTimeString('25:00:00'); // false
```

---

### `isValidDateTimeString(dateTimeString)`

Checks if a string is a valid ISO 8601 date-time string.

**Parameters:**
- `dateTimeString: string` - The string to validate

**Returns:** `boolean`

**Example:**
```typescript
import { isValidDateTimeString } from 'temporal-kit';

isValidDateTimeString('2025-12-31T15:30:00'); // true
isValidDateTimeString('invalid'); // false
```

---

## Rounding Functions

Functional wrappers for rounding Temporal objects.

### `floor(value, unit)`

Rounds a value down to the specified unit.

**Parameters:**
- `value: Roundable` - The value to round (Instant, ZonedDateTime, PlainDateTime, PlainTime, Duration)
- `unit: string` - The unit to round to (e.g. 'hour', 'minute')

**Returns:** `Roundable` - The rounded value

**Example:**
```typescript
import { floor } from 'temporal-kit';

const dt = Temporal.PlainDateTime.from('2025-01-01T15:30:45');
floor(dt, 'hour'); // 2025-01-01T15:00:00
```

---

### `ceil(value, unit)`

Rounds a value up to the specified unit.

**Parameters:**
- `value: Roundable` - The value to round
- `unit: string` - The unit to round to

**Returns:** `Roundable` - The rounded value

**Example:**
```typescript
import { ceil } from 'temporal-kit';

const dt = Temporal.PlainDateTime.from('2025-01-01T15:30:45');
ceil(dt, 'hour'); // 2025-01-01T16:00:00
```

---

### `round(value, unit, options?)`

Rounds a value to the nearest unit (half-expand by default).

**Parameters:**
- `value: Roundable` - The value to round
- `unit: string` - The unit to round to
- `options?: object` - Additional options
  - `roundingMode?: string` - 'ceil', 'floor', 'expand', 'trunc', 'halfCeil', 'halfFloor', 'halfExpand', 'halfTrunc', 'halfEven'
  - `roundingIncrement?: number` - Increment to round to (e.g. 15 for 15 minutes)

**Returns:** `Roundable` - The rounded value

**Example:**
```typescript
import { round } from 'temporal-kit';

const dt = Temporal.PlainDateTime.from('2025-01-01T15:30:45');
round(dt, 'hour'); // 2025-01-01T16:00:00
```

---

## Timezone Functions

Utilities for working with timezones.

### `isValidTimezone(timezone)`

Checks if a string is a valid IANA timezone identifier.

**Parameters:**
- `timezone: string` - The timezone string to check

**Returns:** `boolean`

**Example:**
```typescript
import { isValidTimezone } from 'temporal-kit';

isValidTimezone('Europe/Berlin'); // true
isValidTimezone('Invalid/Timezone'); // false
```

---

### `getTimezoneName(timezone)`

Gets the canonical timezone ID from a string or TimeZone object.

**Parameters:**
- `timezone: string | TimeZone | ZonedDateTime` - The timezone string or object

**Returns:** `string` - The canonical timezone ID

**Example:**
```typescript
import { getTimezoneName } from 'temporal-kit';

getTimezoneName('Europe/Berlin'); // 'Europe/Berlin'
getTimezoneName('UTC'); // 'UTC'
```

---

## Utility Functions

Functions for functional composition.

### `pipe(value, ...fns)`

Chain functions from left to right. The result of each function is passed to the next.

**Parameters:**
- `value: T` - Initial value
- `...fns: Array<(arg: any) => any>` - Functions to apply in sequence

**Returns:** Result of applying all functions

**Example:**
```typescript
import { pipe, startOf, add } from 'temporal-kit';

const result = pipe(
  Temporal.PlainDateTime.from('2025-11-30T15:30:00'),
  d => startOf(d, 'day'),
  d => add(d, { hours: 12 })
);
// Result: 2025-11-30T12:00:00
```

---

### `compose(...fns)`

Chain functions from right to left. Creates a reusable composed function.

**Parameters:**
- `...fns: Array<(arg: any) => any>` - Functions to compose (applied right to left)

**Returns:** `(value: T) => any` - Composed function

**Example:**
```typescript
import { compose, startOf, add } from 'temporal-kit';

const addTwelveHoursToStartOfDay = compose(
  d => add(d, { hours: 12 }),
  d => startOf(d, 'day')
);

const result = addTwelveHoursToStartOfDay(
  Temporal.PlainDateTime.from('2025-11-30T15:30:00')
);
// Result: 2025-11-30T12:00:00
```

---

## Types

Type definitions used throughout temporal-kit.

### `DateLike`

Union type for date-like Temporal values.

```typescript
type DateLike = 
  | Temporal.PlainDate 
  | Temporal.PlainDateTime 
  | Temporal.ZonedDateTime;
```

---

### `TimeLike`

Union type for time-like Temporal values.

```typescript
type TimeLike = 
  | Temporal.PlainTime 
  | Temporal.PlainDateTime 
  | Temporal.ZonedDateTime;
```

---

### `DateUnit`

Valid units for `startOf` and `endOf` functions.

```typescript
type DateUnit = 'day' | 'week' | 'month' | 'year';
```

---

### `DurationInput`

Input format for durations (used by `add` and `subtract`).

```typescript
type DurationInput = {
  years?: number;
  months?: number;
  weeks?: number;
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
  milliseconds?: number;
  microseconds?: number;
  nanoseconds?: number;
};
```

---

### `FormatOptions`

Options for formatting functions.

```typescript
interface FormatOptions {
  locale?: string | string[];
  dateStyle?: 'full' | 'long' | 'medium' | 'short';
  timeStyle?: 'full' | 'long' | 'medium' | 'short';
  options?: Intl.DateTimeFormatOptions;
}
```

---

## Best Practices

### 1. Use Type Guards for Runtime Safety

When working with unknown values, use type guards to ensure type safety:

```typescript
import { isPlainDate, add } from 'temporal-kit';

function processDate(value: unknown) {
  if (isPlainDate(value)) {
    // TypeScript knows value is PlainDate here
    return add(value, { days: 1 });
  }
  throw new TypeError('Expected PlainDate');
}
```

### 2. Prefer Explicit Conversions

Be explicit about timezone when converting:

```typescript
import { toZonedDateTime } from 'temporal-kit';

const date = Temporal.PlainDate.from('2025-11-30');
// Good: explicit timezone
const zdt = toZonedDateTime(date, 'Europe/Berlin');

// Bad: would throw error
// const zdt = toZonedDateTime(date);
```

### 3. Use Pipe for Readable Transformations

Chain operations with `pipe` for better readability:

```typescript
import { pipe, startOf, add, format } from 'temporal-kit';

const formatted = pipe(
  Temporal.Now.zonedDateTimeISO(),
  d => startOf(d, 'week'),
  d => add(d, { days: 3 }),
  d => format(d.toPlainDate(), { dateStyle: 'full' })
);
```

### 4. Leverage Intl for Localization

Use format functions with locales for internationalization:

```typescript
import { formatDateTime } from 'temporal-kit';

const dt = Temporal.PlainDateTime.from('2025-11-30T15:30:00');

// Show in user's preferred languages
const languages = ['de-DE', 'en-US', 'fr-FR'];
const formatted = languages.map(locale => 
  formatDateTime(dt, { locale, dateStyle: 'long' })
);
```

### 5. Compose Reusable Functions

Create reusable date transformations with `compose`:

```typescript
import { compose, startOf, endOf, add } from 'temporal-kit';

// Create reusable utilities
const nextMonthStart = compose(
  d => add(d, { months: 1 }),
  d => startOf(d, 'month')
);

const thisMonthEnd = endOf.bind(null, 'month');

// Use them
const date = Temporal.PlainDate.from('2025-11-15');
nextMonthStart(date); // 2025-12-01
```

### 6. Handle Edge Cases

Be aware of calendar edge cases:

```typescript
import { add } from 'temporal-kit';

// Adding months respects calendar rules
const date = Temporal.PlainDate.from('2025-01-31');
add(date, { months: 1 }); // 2025-02-28 (not March 3rd)

// Adding days is always exact
add(date, { days: 31 }); // 2025-03-03
```

### 7. Use startOf/endOf for Range Queries

Get date ranges easily:

```typescript
import { startOf, endOf } from 'temporal-kit';

const date = Temporal.PlainDate.from('2025-11-15');

// Get current week range
const weekStart = startOf(date, 'week'); // Monday
const weekEnd = endOf(date, 'week');     // Sunday

// Get month range
const monthStart = startOf(date, 'month'); // 2025-11-01
const monthEnd = endOf(date, 'month');     // 2025-11-30
```
