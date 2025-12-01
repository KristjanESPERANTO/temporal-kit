import type { PlainDate } from "../types/index.js";

/**
 * Checks if a date is a weekend (Saturday or Sunday).
 *
 * @param date - The date to check
 * @returns True if the date is Saturday or Sunday
 */
export function isWeekend(date: PlainDate): boolean {
  return date.dayOfWeek === 6 || date.dayOfWeek === 7;
}

/**
 * Adds business days to a date, skipping weekends.
 *
 * @param date - The start date
 * @param days - Number of business days to add (can be negative)
 * @returns The new date
 */
export function addBusinessDays(date: PlainDate, days: number): PlainDate {
  let result = date;
  let remaining = Math.abs(days);
  const direction = days > 0 ? 1 : -1;

  while (remaining > 0) {
    result = result.add({ days: direction });
    if (!isWeekend(result)) {
      remaining--;
    }
  }

  return result;
}
