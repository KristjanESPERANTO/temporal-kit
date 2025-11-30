/**
 * Formatting Examples
 * 
 * Demonstrates Intl-based formatting without locale files.
 * 
 * Run with: node examples/07-formatting.js
 */

import { isZonedDateTime } from '../dist/polyfilled.js';

// 🔜 Coming soon
// import { format, formatRelative } from '../dist/polyfilled.js';

console.log('=== Intl-Based Formatting (Coming Soon) ===\n');

const now = Temporal.Now.zonedDateTimeISO('Europe/Berlin');
const plainDate = Temporal.PlainDate.from('2025-12-24');

console.log('Date:', plainDate.toString());
console.log('ZonedDateTime:', now.toString());
console.log();

// Example 1: Date Formatting
console.log('--- Date Formatting ---');
// console.log('Short:', format(plainDate, 'short')); // 24.12.25
// console.log('Medium:', format(plainDate, 'medium')); // 24. Dez. 2025
// console.log('Long:', format(plainDate, 'long')); // 24. Dezember 2025
// console.log('Full:', format(plainDate, 'full')); // Mittwoch, 24. Dezember 2025
console.log('⏳ Functions coming soon...\n');

// Example 2: Time Formatting
console.log('--- Time Formatting ---');
// console.log('Short time:', format(now, { time: 'short' })); // 15:30
// console.log('Medium time:', format(now, { time: 'medium' })); // 15:30:45
// console.log('With timezone:', format(now, { time: 'short', timezone: true })); // 15:30 CET
console.log('⏳ Functions coming soon...\n');

// Example 3: Locale-Aware Formatting
console.log('--- Different Locales ---');
// console.log('German:', format(plainDate, 'long', { locale: 'de-DE' }));
// console.log('English:', format(plainDate, 'long', { locale: 'en-US' }));
// console.log('Japanese:', format(plainDate, 'long', { locale: 'ja-JP' }));
console.log('⏳ Functions coming soon...\n');

// Example 4: Relative Time
console.log('--- Relative Formatting ---');
const yesterday = Temporal.Now.plainDateISO().subtract({ days: 1 });
const nextWeek = Temporal.Now.plainDateISO().add({ weeks: 1 });

console.log('Yesterday:', yesterday.toString());
console.log('Next week:', nextWeek.toString());
// console.log('Relative:', formatRelative(yesterday)); // "yesterday"
// console.log('Relative:', formatRelative(nextWeek)); // "in 7 days"
console.log('⏳ Functions coming soon...\n');

// Example 5: Custom Patterns (Intl-based)
console.log('--- Custom Patterns ---');
// Uses Intl.DateTimeFormat options
// console.log('Weekday:', format(plainDate, { weekday: 'long' })); // "Wednesday"
// console.log('Month year:', format(plainDate, { month: 'long', year: 'numeric' })); // "December 2025"
console.log('⏳ Functions coming soon...\n');

console.log('💡 Tip: Use native .toLocaleString() for now');
console.log('Example (German):', plainDate.toLocaleString('de-DE', { 
  dateStyle: 'full' 
}));
console.log('Example (US):', now.toLocaleString('en-US', { 
  dateStyle: 'long',
  timeStyle: 'short',
  timeZoneName: 'short'
}));
