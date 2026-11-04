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
 * @throws {RangeError} If days is not a safe integer
 */
export function addBusinessDays(date: PlainDate, days: number): PlainDate {
  if (!Number.isSafeInteger(days)) {
    throw new RangeError("days must be a safe integer");
  }
  if (days === 0) return date;

  let result = date;
  const direction = days > 0 ? 1 : -1;
  let remaining = Math.abs(days);

  if (isWeekend(result)) {
    const daysToWeekday = direction > 0 ? 8 - result.dayOfWeek : result.dayOfWeek - 5;
    result = result.add({ days: direction * daysToWeekday });
    remaining--;
  }

  const wholeWeeks = Math.floor(remaining / 5);
  if (wholeWeeks > 0) {
    result = result.add({ days: direction * wholeWeeks * 7 });
    remaining -= wholeWeeks * 5;
  }

  while (remaining > 0) {
    result = result.add({ days: direction });
    if (!isWeekend(result)) {
      remaining--;
    }
  }

  return result;
}
