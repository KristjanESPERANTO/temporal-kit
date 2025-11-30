/**
 * Functional Composition Examples
 * 
 * Demonstrates pipe and compose utilities for elegant data flow.
 * 
 * Run with: node examples/08-composition.js
 */

import { isPlainDate } from '../dist/polyfilled.js';

// 🔜 Coming soon
// import { pipe, compose, add, startOf, endOf } from '../dist/polyfilled.js';

console.log('=== Functional Composition (Coming Soon) ===\n');

const today = Temporal.Now.plainDateISO();

// Example 1: Pipe - Left to Right
console.log('--- Pipe (left to right) ---');
console.log('Start:', today.toString());

// Get the end of the week, 2 weeks from start of this month
// const result = pipe(
//   today,
//   d => startOf(d, 'month'),
//   d => add(d, { weeks: 2 }),
//   d => endOf(d, 'week')
// );
// console.log('Result:', result.toString());
console.log('⏳ Functions coming soon...\n');

// Example 2: Compose - Right to Left
console.log('--- Compose (right to left) ---');
// const transform = compose(
//   d => endOf(d, 'week'),
//   d => add(d, { weeks: 2 }),
//   d => startOf(d, 'month')
// );
// console.log('Composed result:', transform(today).toString());
console.log('⏳ Functions coming soon...\n');

// Example 3: Reusable Transformations
console.log('--- Reusable Transformations ---');
// const endOfNextMonth = compose(
//   d => endOf(d, 'month'),
//   d => add(d, { months: 1 })
// );
// 
// const dates = [
//   Temporal.PlainDate.from('2025-01-15'),
//   Temporal.PlainDate.from('2025-06-20'),
//   Temporal.PlainDate.from('2025-12-10')
// ];
// 
// console.log('Original dates:', dates.map(d => d.toString()));
// console.log('End of next month:', dates.map(endOfNextMonth).map(d => d.toString()));
console.log('⏳ Functions coming soon...\n');

// Example 4: Pipeline Operator (Future JS)
console.log('--- Future: Pipeline Operator |> ---');
console.log('When JS gets |> operator, this will work:');
console.log(`
const result = today
  |> startOf(%, 'month')
  |> add(%, { weeks: 2 })
  |> endOf(%, 'week');
`);
console.log('⏳ Temporal Kit is ready for this!\n');

// Example 5: Complex Business Logic
console.log('--- Business Logic Example ---');
console.log('Calculate: First Monday of next quarter');
// const firstMondayNextQuarter = pipe(
//   today,
//   d => startOf(d, 'month'), // Start of current month
//   d => add(d, { months: 3 }), // Next quarter
//   d => startOf(d, 'month'), // Start of that month
//   d => {
//     // Find first Monday
//     const dayOfWeek = d.dayOfWeek;
//     const daysUntilMonday = dayOfWeek === 1 ? 0 : (8 - dayOfWeek);
//     return add(d, { days: daysUntilMonday });
//   }
// );
// console.log('Result:', firstMondayNextQuarter.toString());
console.log('⏳ Functions coming soon...\n');

console.log('💡 Tip: pipe() and compose() are standard FP utilities');
console.log('You can build them yourself or use libraries like Ramda for now');
