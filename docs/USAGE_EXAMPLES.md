# Usage Examples

Practical examples for common use cases with temporal-kit.

## Table of Contents

- [Getting Started](#getting-started)
- [Parsing Strings](#parsing-strings)
- [Working with Dates](#working-with-dates)
- [Time Calculations](#time-calculations)
- [Formatting](#formatting)
- [Timezone Operations](#timezone-operations)
- [Functional Composition](#functional-composition)
- [Real-World Scenarios](#real-world-scenarios)

---

## Getting Started

### Installation and Basic Usage

```bash
npm install temporal-kit
```

```typescript
// Import specific functions
import { isPlainDate, add, format } from 'temporal-kit';

// Or import everything
import * as tk from 'temporal-kit';

// For environments without native Temporal support
import { isPlainDate, add } from 'temporal-kit/polyfilled';
```

### Browser Usage (without bundlers)

For projects that don't use bundlers (e.g., MagicMirror modules, legacy setups):

```html
<!-- With polyfill included -->
<script src="node_modules/temporal-kit/dist/temporal-kit.browser.polyfilled.global.js"></script>

<!-- Or from CDN -->
<script src="https://unpkg.com/temporal-kit/dist/temporal-kit.browser.polyfilled.global.js"></script>

<script>
  // All functions are available on the global TemporalKit object
  const today = TemporalKit.today();
  const tomorrow = TemporalKit.add(today, { days: 1 });
  const formatted = TemporalKit.formatPlainDate(tomorrow, 'de-DE');
  console.log(formatted); // "10. Januar 2026"
</script>
```

> **Note:** The browser build (`temporal-kit.browser.polyfilled.global.js`) includes the Temporal polyfill and exposes all functions via the global `TemporalKit` variable. For modern browsers with native Temporal support, use `temporal-kit.browser.global.js` instead (smaller size, requires external polyfill if needed).

### Type Checking

```typescript
import { isPlainDate, isZonedDateTime, isDateLike } from 'temporal-kit';

function processDate(value: unknown) {
  if (isPlainDate(value)) {
    console.log('Plain date:', value.toString());
  } else if (isZonedDateTime(value)) {
    console.log('Zoned datetime:', value.toString());
  } else if (isDateLike(value)) {
    console.log('Some date type:', value.toString());
  } else {
    console.log('Not a date');
  }
}

// Usage
processDate(Temporal.PlainDate.from('2025-11-30'));
processDate(Temporal.Now.zonedDateTimeISO());
processDate('2025-11-30'); // "Not a date"
```

---

## Parsing Strings

### Smart Format Detection

The `parse()` function automatically detects the input format and returns the most appropriate Temporal type:

```typescript
import { parse } from 'temporal-kit';

// ISO 8601 - most common standard
parse('2025-11-30');                              // PlainDate
parse('2025-11-30T15:30:00');                     // PlainDateTime
parse('2025-11-30T15:30:00Z');                    // Instant
parse('2025-11-30T15:30:00+01:00[Europe/Berlin]'); // ZonedDateTime

// European dates (DD.MM.YYYY)
parse('30.11.2025');                              // PlainDate
parse('30.11.2025 15:30');                        // PlainDateTime

// US dates (MM/DD/YYYY)
parse('11/30/2025');                              // PlainDate
parse('11/30/2025 3:30 PM');                      // PlainDateTime

// Alternative formats
parse('30-11-2025');                              // PlainDate
parse('2025/11/30');                              // PlainDate

// Time formats
parse('15:30');                                   // PlainTime
parse('3:30 PM');                                 // PlainTime (12-hour with AM/PM)
parse('9:00 AM');                                 // PlainTime
```

### Specific Type Parsing

When you know the expected type, use specific parsing functions for better error messages:

```typescript
import { parseDate, parseTime, parseDateTime } from 'temporal-kit';

// Parse specifically as PlainDate
const date1 = parseDate('2025-11-30');   // ISO format
const date2 = parseDate('30.11.2025');   // European format
const date3 = parseDate('11/30/2025');   // US format

// Parse specifically as PlainTime
const time1 = parseTime('15:30:00');     // 24-hour with seconds
const time2 = parseTime('15:30');        // 24-hour without seconds
const time3 = parseTime('3:30 PM');      // 12-hour with AM/PM
const time4 = parseTime('12:00 AM');     // Midnight
const time5 = parseTime('12:00 PM');     // Noon

// Parse specifically as PlainDateTime
const dt1 = parseDateTime('2025-11-30T15:30:00');  // ISO format
const dt2 = parseDateTime('2025-11-30 15:30:00');  // Space-separated
const dt3 = parseDateTime('30.11.2025 15:30');     // European date + time
const dt4 = parseDateTime('11/30/2025 3:30 PM');   // US date + 12-hour time
```

### Handling User Input

```typescript
import { parseDate, parseTime } from 'temporal-kit';

// Flexible date input parsing
function parseUserDateInput(input: string): Temporal.PlainDate | null {
  try {
    return parseDate(input);
  } catch (error) {
    console.error('Invalid date format:', error.message);
    return null;
  }
}

// Accept various date formats from users
console.log(parseUserDateInput('2025-11-30'));   // Works: ISO
console.log(parseUserDateInput('30.11.2025'));   // Works: European
console.log(parseUserDateInput('11/30/2025'));   // Works: US
console.log(parseUserDateInput('invalid'));      // Returns null

// Parse appointment times
function parseAppointmentTime(input: string): Temporal.PlainTime | null {
  try {
    return parseTime(input);
  } catch (error) {
    return null;
  }
}

console.log(parseAppointmentTime('3:30 PM'));    // Works
console.log(parseAppointmentTime('15:30'));      // Works
console.log(parseAppointmentTime('not a time')); // Returns null
```

### API Response Parsing

```typescript
import { parse, parseDate, parseTime } from 'temporal-kit';

interface APIResponse {
  createdAt: string;
  publishedAt: string;
  date: string;
  time: string;
}

const response: APIResponse = {
  createdAt: "2025-11-30T15:30:00Z",
  publishedAt: "2025-12-01T09:00:00+01:00[Europe/Paris]",
  date: "2025-11-30",
  time: "15:30:00"
};

// Auto-detect the appropriate type
const createdAt = parse(response.createdAt);       // Instant
const publishedAt = parse(response.publishedAt);   // ZonedDateTime
const date = parseDate(response.date);             // PlainDate
const time = parseTime(response.time);             // PlainTime

console.log(createdAt instanceof Temporal.Instant);        // true
console.log(publishedAt instanceof Temporal.ZonedDateTime); // true
```

### Form Data Parsing

```typescript
import { parseDate, parseTime } from 'temporal-kit';

interface FormData {
  birthDate: string;      // User might enter in various formats
  appointmentTime: string; // Could be 12-hour or 24-hour
  eventDate: string;      // International users
}

function processFormData(formData: FormData) {
  // Parse with validation
  const birthDate = parseDate(formData.birthDate);
  const appointmentTime = parseTime(formData.appointmentTime);
  const eventDate = parseDate(formData.eventDate);
  
  // Now you have properly typed Temporal objects
  console.log('Birth date:', birthDate.toLocaleString());
  console.log('Appointment:', appointmentTime.toLocaleString());
  console.log('Event:', eventDate.toLocaleString());
  
  return { birthDate, appointmentTime, eventDate };
}

// Works with various input formats
processFormData({
  birthDate: '11/30/2025',      // US format
  appointmentTime: '3:30 PM',    // 12-hour
  eventDate: '30.11.2025'        // European format
});
```

### Validation

```typescript
import { parseDate } from 'temporal-kit';

// Invalid dates are automatically rejected
try {
  parseDate('2025-13-01');  // Month 13 doesn't exist
} catch (error) {
  console.error('Invalid date:', error.message);
}

try {
  parseDate('2025-02-29');  // 2025 is not a leap year
} catch (error) {
  console.error('Invalid date:', error.message);
}

try {
  parseDate('31.04.2025');  // April only has 30 days
} catch (error) {
  console.error('Invalid date:', error.message);
}

// Invalid times are also rejected
import { parseTime } from 'temporal-kit';

try {
  parseTime('25:00');  // Hour 25 doesn't exist
} catch (error) {
  console.error('Invalid time:', error.message);
}

try {
  parseTime('15:70');  // Minute 70 doesn't exist
} catch (error) {
  console.error('Invalid time:', error.message);
}
```

---

## Working with Dates

### Creating and Converting Dates

```typescript
import { now, fromISO, toPlainDate, toZonedDateTime } from 'temporal-kit';

// Get current date/time
const current = now();
console.log(current.toString()); // e.g., "2025-11-30T15:30:00+01:00[Europe/Berlin]"

// Parse ISO strings
const date = fromISO('2025-11-30');
const datetime = fromISO('2025-11-30T15:30:00');
const zoned = fromISO('2025-11-30T15:30:00+01:00[Europe/Berlin]');

// Convert between types
const plainDate = toPlainDate(zoned); // Just the date part
const zonedDate = toZonedDateTime(date, 'America/New_York'); // Add timezone
```

### Date Comparison

```typescript
import { isBefore, isAfter, isSame, min, max } from 'temporal-kit';

const today = Temporal.PlainDate.from('2025-11-30');
const yesterday = Temporal.PlainDate.from('2025-11-29');
const tomorrow = Temporal.PlainDate.from('2025-12-01');

// Compare two dates
isBefore(yesterday, today); // true
isAfter(tomorrow, today);   // true
isSame(today, today);       // true

// Find earliest/latest
const dates = [tomorrow, yesterday, today];
min(dates); // 2025-11-29
max(dates); // 2025-12-01
```

### Date Ranges

```typescript
import { isBefore, isAfter, startOf, endOf } from 'temporal-kit';

// Check if date is in range
function isInRange(
  date: Temporal.PlainDate,
  start: Temporal.PlainDate,
  end: Temporal.PlainDate
): boolean {
  return !isBefore(date, start) && !isAfter(date, end);
}

// Get month boundaries
const someDate = Temporal.PlainDate.from('2025-11-15');
const monthStart = startOf(someDate, 'month'); // 2025-11-01
const monthEnd = endOf(someDate, 'month');     // 2025-11-30

isInRange(someDate, monthStart, monthEnd); // true
```

---

## Time Calculations

### Adding and Subtracting

```typescript
import { add, subtract } from 'temporal-kit';

const date = Temporal.PlainDate.from('2025-11-30');

// Add time
add(date, { days: 5 });                    // 2025-12-05
add(date, { months: 2 });                  // 2026-01-30
add(date, { years: 1, months: 3, days: 7 }); // 2027-03-07

// Subtract time
subtract(date, { days: 10 });              // 2025-11-20
subtract(date, { months: 1 });             // 2025-10-30

// Works with datetime too
const dt = Temporal.PlainDateTime.from('2025-11-30T15:00:00');
add(dt, { hours: 3, minutes: 30 });        // 2025-11-30T18:30:00
subtract(dt, { hours: 1 });                // 2025-11-30T14:00:00
```

### Start and End of Periods

```typescript
import { startOf, endOf } from 'temporal-kit';

const dt = Temporal.PlainDateTime.from('2025-11-30T15:30:45');

// Start of periods
startOf(dt, 'day');   // 2025-11-30T00:00:00
startOf(dt, 'week');  // 2025-11-24T00:00:00 (Monday)
startOf(dt, 'month'); // 2025-11-01T00:00:00
startOf(dt, 'year');  // 2025-01-01T00:00:00

// End of periods
endOf(dt, 'day');     // 2025-11-30T23:59:59.999999999
endOf(dt, 'week');    // 2025-12-07T23:59:59.999999999 (Sunday)
endOf(dt, 'month');   // 2025-11-30T23:59:59.999999999
endOf(dt, 'year');    // 2025-12-31T23:59:59.999999999
```

### Duration Calculations

```typescript
import { toPlainDate } from 'temporal-kit';

const start = Temporal.PlainDate.from('2025-01-01');
const end = Temporal.PlainDate.from('2025-11-30');

// Calculate duration
const duration = start.until(end, { largestUnit: 'year' });
console.log(duration.toString()); // "P10M29D"

// Get specific units
const days = start.until(end).days; // 333
const months = start.until(end, { largestUnit: 'month' }).months; // 10
```

---

## Formatting

### Basic Formatting

```typescript
import { format, formatTime, formatDateTime } from 'temporal-kit';

const date = Temporal.PlainDate.from('2025-11-30');
const time = Temporal.PlainTime.from('15:30:45');
const dt = Temporal.PlainDateTime.from('2025-11-30T15:30:00');

// Format date
format(date);                              // "Nov 30, 2025" (en-US)
format(date, { dateStyle: 'full' });       // "Sunday, November 30, 2025"
format(date, { dateStyle: 'short' });      // "11/30/25"

// Format time
formatTime(time);                          // "3:30:45 PM"
formatTime(time, { timeStyle: 'short' });  // "3:30 PM"

// Format date and time
formatDateTime(dt);                        // "Nov 30, 2025, 3:30:00 PM"
formatDateTime(dt, { 
  dateStyle: 'long', 
  timeStyle: 'short' 
}); // "November 30, 2025 at 3:30 PM"
```

### Localized Formatting

```typescript
import { format, formatTime } from 'temporal-kit';

const date = Temporal.PlainDate.from('2025-11-30');
const time = Temporal.PlainTime.from('15:30:00');

// Different locales
format(date, { locale: 'en-US' }); // "Nov 30, 2025"
format(date, { locale: 'de-DE' }); // "30.11.2025"
format(date, { locale: 'fr-FR' }); // "30 nov. 2025"
format(date, { locale: 'ja-JP' }); // "2025/11/30"

// Time formatting varies by locale
formatTime(time, { locale: 'en-US' }); // "3:30:00 PM"
formatTime(time, { locale: 'de-DE' }); // "15:30:00"
formatTime(time, { locale: 'fr-FR' }); // "15:30:00"
```

### Custom Format Options

```typescript
import { format } from 'temporal-kit';

const date = Temporal.PlainDate.from('2025-11-30');

// Custom format
format(date, {
  options: {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  }
}); // "Sunday, November 30, 2025"

// Just month and year
format(date, {
  options: {
    year: 'numeric',
    month: 'short'
  }
}); // "Nov 2025"
```

### Relative Time Formatting

```typescript
import { formatRelative } from 'temporal-kit';

const today = Temporal.PlainDate.from('2025-11-30');

// Relative to today
formatRelative(today.subtract({ days: 1 }), today); // "yesterday"
formatRelative(today.add({ days: 1 }), today);      // "tomorrow"
formatRelative(today.subtract({ days: 7 }), today); // "last week"
formatRelative(today.add({ days: 14 }), today);     // "in 2 weeks"
formatRelative(today.subtract({ days: 60 }), today); // "2 months ago"

// Different locales
formatRelative(today.subtract({ days: 1 }), today, { locale: 'de-DE' }); // "gestern"
formatRelative(today.subtract({ days: 1 }), today, { locale: 'fr-FR' }); // "hier"
formatRelative(today.subtract({ days: 1 }), today, { locale: 'ja-JP' }); // "昨日"
```

---

## Timezone Operations

### Converting Between Timezones

```typescript
import { toZonedDateTime, format } from 'temporal-kit';

// Create date in different timezones
const date = Temporal.PlainDate.from('2025-11-30');
const berlinTime = toZonedDateTime(date, 'Europe/Berlin');
const nyTime = toZonedDateTime(date, 'America/New_York');

console.log(berlinTime.toString()); // "2025-11-30T00:00:00+01:00[Europe/Berlin]"
console.log(nyTime.toString());     // "2025-11-30T00:00:00-05:00[America/New_York]"

// Convert between timezones
const instant = Temporal.Now.instant();
const tokyo = instant.toZonedDateTimeISO('Asia/Tokyo');
const london = instant.toZonedDateTimeISO('Europe/London');

// Same instant, different local times
console.log(tokyo.toString());
console.log(london.toString());
```

### Working with UTC

```typescript
import { now } from 'temporal-kit';

// Get current time in UTC
const utcInstant = Temporal.Now.instant();
console.log(utcInstant.toString()); // e.g., "2025-11-30T14:30:00Z"

// Convert to local timezone
const local = now();
console.log(local.toString()); // e.g., "2025-11-30T15:30:00+01:00[Europe/Berlin]"

// Store as UTC, display as local
function storeAndDisplay(userTimezone: string) {
  // Store as instant (UTC)
  const stored = Temporal.Now.instant().toString();
  
  // Display in user's timezone
  const instant = Temporal.Instant.from(stored);
  const local = instant.toZonedDateTimeISO(userTimezone);
  return local.toString();
}

storeAndDisplay('America/Los_Angeles');
storeAndDisplay('Asia/Tokyo');
```

---

## Functional Composition

### Using pipe()

```typescript
import { pipe, startOf, add, format, toPlainDate } from 'temporal-kit';

// Chain operations from left to right
const result = pipe(
  Temporal.Now.zonedDateTimeISO(),
  d => startOf(d, 'month'),
  d => add(d, { days: 15 }),
  d => toPlainDate(d),
  d => format(d, { dateStyle: 'full' })
);

console.log(result); // "Sunday, November 16, 2025"
```

### Using compose()

```typescript
import { compose, startOf, add, format } from 'temporal-kit';

// Create reusable composed function
const getMidMonthFormatted = compose(
  d => format(d.toPlainDate(), { dateStyle: 'long' }),
  d => add(d, { days: 15 }),
  d => startOf(d, 'month')
);

// Use it multiple times
const current = getMidMonthFormatted(Temporal.Now.zonedDateTimeISO());
console.log(current); // "November 16, 2025"
```

### Building Custom Utilities

```typescript
import { compose, add, startOf, endOf } from 'temporal-kit';

// Create a utility to get next month's date range
const getNextMonthRange = compose(
  (date: Temporal.PlainDate) => [
    startOf(date, 'month'),
    endOf(date, 'month')
  ],
  (date: Temporal.PlainDate) => add(date, { months: 1 })
);

const today = Temporal.PlainDate.from('2025-11-30');
const [start, end] = getNextMonthRange(today);
console.log(start.toString()); // "2025-12-01"
console.log(end.toString());   // "2025-12-31"
```

---

## Real-World Scenarios

### Event Scheduling

```typescript
import { add, isBefore, isAfter, formatDateTime } from 'temporal-kit';

interface Event {
  title: string;
  start: Temporal.ZonedDateTime;
  durationMinutes: number;
}

function createEvent(
  title: string,
  start: Temporal.ZonedDateTime,
  durationMinutes: number
): Event {
  return { title, start, durationMinutes };
}

function getEventEnd(event: Event): Temporal.ZonedDateTime {
  return add(event.start, { minutes: event.durationMinutes });
}

function eventsOverlap(event1: Event, event2: Event): boolean {
  const end1 = getEventEnd(event1);
  const end2 = getEventEnd(event2);
  
  return !(
    isBefore(end1, event2.start) || 
    isAfter(event1.start, end2)
  );
}

// Usage
const meeting1 = createEvent(
  'Team Standup',
  Temporal.ZonedDateTime.from('2025-11-30T09:00:00+01:00[Europe/Berlin]'),
  30
);

const meeting2 = createEvent(
  'Client Call',
  Temporal.ZonedDateTime.from('2025-11-30T09:15:00+01:00[Europe/Berlin]'),
  60
);

if (eventsOverlap(meeting1, meeting2)) {
  console.log('Warning: Events overlap!');
}
```

### Age Verification

```typescript
import { toPlainDate, isBefore } from 'temporal-kit';

function isOldEnough(birthDate: Temporal.PlainDate, minimumAge: number): boolean {
  const today = Temporal.Now.plainDateISO();
  const minBirthDate = today.subtract({ years: minimumAge });
  
  return isBefore(birthDate, minBirthDate) || birthDate.equals(minBirthDate);
}

// Usage
const birthDate = Temporal.PlainDate.from('2000-06-15');
const canDrinkAlcohol = isOldEnough(birthDate, 21); // true (as of 2025)
const canVote = isOldEnough(birthDate, 18);         // true
```

### Deadline Tracking

```typescript
import { formatRelative, isBefore } from 'temporal-kit';

interface Task {
  title: string;
  deadline: Temporal.PlainDate;
}

function getTaskStatus(task: Task): string {
  const today = Temporal.Now.plainDateISO();
  const daysUntil = task.deadline.since(today).days;
  
  if (isBefore(task.deadline, today)) {
    return `⚠️ Overdue (${formatRelative(task.deadline, today)})`;
  }
  
  if (daysUntil === 0) {
    return '🔥 Due today!';
  }
  
  if (daysUntil <= 3) {
    return `⚡ Due ${formatRelative(task.deadline, today)}`;
  }
  
  return `📅 Due ${formatRelative(task.deadline, today)}`;
}

// Usage
const tasks: Task[] = [
  { title: 'Submit report', deadline: Temporal.PlainDate.from('2025-11-29') },
  { title: 'Review code', deadline: Temporal.PlainDate.from('2025-11-30') },
  { title: 'Plan sprint', deadline: Temporal.PlainDate.from('2025-12-03') }
];

const today = Temporal.PlainDate.from('2025-11-30');
tasks.forEach(task => {
  console.log(`${task.title}: ${getTaskStatus(task)}`);
});
```

### Business Hours Calculator

```typescript
import { add, startOf } from 'temporal-kit';

function addBusinessDays(
  date: Temporal.PlainDate,
  days: number
): Temporal.PlainDate {
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

function isBusinessDay(date: Temporal.PlainDate): boolean {
  const dayOfWeek = date.dayOfWeek;
  return dayOfWeek !== 6 && dayOfWeek !== 7;
}

// Usage
const friday = Temporal.PlainDate.from('2025-11-28');
const deliveryDate = addBusinessDays(friday, 3);
console.log(deliveryDate.toString()); // "2025-12-03" (Wednesday, skips weekend)

console.log(isBusinessDay(friday)); // true
console.log(isBusinessDay(Temporal.PlainDate.from('2025-11-29'))); // false (Saturday)
```

### Subscription Management

```typescript
import { add, isBefore, formatRelative } from 'temporal-kit';

interface Subscription {
  name: string;
  startDate: Temporal.PlainDate;
  billingCycle: 'monthly' | 'yearly';
  trialDays?: number;
}

function getNextBillingDate(sub: Subscription): Temporal.PlainDate {
  const duration = sub.billingCycle === 'monthly' 
    ? { months: 1 } 
    : { years: 1 };
  
  let current = sub.startDate;
  if (sub.trialDays) {
    current = add(current, { days: sub.trialDays });
  }
  
  const today = Temporal.Now.plainDateISO();
  
  // Find next billing date after today
  while (isBefore(current, today)) {
    current = add(current, duration);
  }
  
  return current;
}

function isInTrial(sub: Subscription): boolean {
  if (!sub.trialDays) return false;
  
  const today = Temporal.Now.plainDateISO();
  const trialEnd = add(sub.startDate, { days: sub.trialDays });
  
  return isBefore(today, trialEnd);
}

// Usage
const subscription: Subscription = {
  name: 'Premium Plan',
  startDate: Temporal.PlainDate.from('2025-11-01'),
  billingCycle: 'monthly',
  trialDays: 14
};

const today = Temporal.PlainDate.from('2025-11-30');

console.log(`Trial active: ${isInTrial(subscription)}`);
console.log(`Next billing: ${formatRelative(getNextBillingDate(subscription), today)}`);
```

### Meeting Scheduler with Timezone Support

```typescript
import { toZonedDateTime, formatDateTime } from 'temporal-kit';

interface Meeting {
  title: string;
  datetime: Temporal.ZonedDateTime;
}

function scheduleMeeting(
  title: string,
  localDatetime: string,
  timezone: string
): Meeting {
  const dt = Temporal.PlainDateTime.from(localDatetime);
  const zdt = toZonedDateTime(dt, timezone);
  
  return { title, datetime: zdt };
}

function displayMeetingInUserTimezone(
  meeting: Meeting,
  userTimezone: string
): string {
  const instant = meeting.datetime.toInstant();
  const userTime = instant.toZonedDateTimeISO(userTimezone);
  
  return formatDateTime(userTime, {
    dateStyle: 'full',
    timeStyle: 'short'
  });
}

// Usage
const meeting = scheduleMeeting(
  'Product Review',
  '2025-12-01T14:00:00',
  'America/New_York'
);

// Display for different team members
console.log('New York:', displayMeetingInUserTimezone(meeting, 'America/New_York'));
console.log('London:', displayMeetingInUserTimezone(meeting, 'Europe/London'));
console.log('Tokyo:', displayMeetingInUserTimezone(meeting, 'Asia/Tokyo'));
```

---

## Tips

### Performance Tip: Cache Formatters

```typescript
import { format } from 'temporal-kit';

// For many dates with same format, create formatter once
const formatter = new Intl.DateTimeFormat('en-US', { 
  dateStyle: 'long' 
});

const dates = [
  Temporal.PlainDate.from('2025-11-28'),
  Temporal.PlainDate.from('2025-11-29'),
  Temporal.PlainDate.from('2025-11-30')
];

// Efficient: reuse formatter
dates.forEach(date => {
  const jsDate = new Date(date.toString());
  console.log(formatter.format(jsDate));
});
```

### Type Safety Tip: Use Type Guards Early

```typescript
import { isPlainDate, add } from 'temporal-kit';

function safeDateAdd(date: unknown, days: number) {
  // Validate early
  if (!isPlainDate(date)) {
    throw new TypeError('Expected PlainDate');
  }
  
  // TypeScript now knows date is PlainDate
  return add(date, { days });
}
```

### Composition Tip: Build Reusable Functions

```typescript
import { compose, startOf, add } from 'temporal-kit';

// Create library of date utilities
const dateUtils = {
  nextMonthStart: compose(
    d => startOf(d, 'month'),
    d => add(d, { months: 1 })
  ),
  
  lastMonthStart: compose(
    d => startOf(d, 'month'),
    d => add(d, { months: -1 })
  ),
  
  nextWeekStart: compose(
    d => startOf(d, 'week'),
    d => add(d, { weeks: 1 })
  )
};

// Use anywhere
const date = Temporal.PlainDate.from('2025-11-30');
console.log(dateUtils.nextMonthStart(date)); // "2025-12-01"
```
