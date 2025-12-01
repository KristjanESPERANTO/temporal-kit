import { Temporal } from "temporal-polyfill";
import { describe, expect, it } from "vitest";
import {
  isAfter,
  isBefore,
  isSame,
  isSameDay,
  isSameMonth,
  isSameWeek,
  isSameYear,
  max,
  min,
} from "./index.js";

describe("Comparison Functions", () => {
  describe("isBefore", () => {
    it("should return true when first date is before second (PlainDate)", () => {
      const date1 = Temporal.PlainDate.from("2025-11-29");
      const date2 = Temporal.PlainDate.from("2025-11-30");
      expect(isBefore(date1, date2)).toBe(true);
    });

    it("should return false when first date is after second (PlainDate)", () => {
      const date1 = Temporal.PlainDate.from("2025-12-01");
      const date2 = Temporal.PlainDate.from("2025-11-30");
      expect(isBefore(date1, date2)).toBe(false);
    });

    it("should return false when dates are equal (PlainDate)", () => {
      const date1 = Temporal.PlainDate.from("2025-11-30");
      const date2 = Temporal.PlainDate.from("2025-11-30");
      expect(isBefore(date1, date2)).toBe(false);
    });

    it("should work with PlainDateTime", () => {
      const dt1 = Temporal.PlainDateTime.from("2025-11-30T10:00:00");
      const dt2 = Temporal.PlainDateTime.from("2025-11-30T15:00:00");
      expect(isBefore(dt1, dt2)).toBe(true);
      expect(isBefore(dt2, dt1)).toBe(false);
    });

    it("should work with ZonedDateTime", () => {
      const zdt1 = Temporal.ZonedDateTime.from("2025-11-30T10:00:00+01:00[Europe/Berlin]");
      const zdt2 = Temporal.ZonedDateTime.from("2025-11-30T15:00:00+01:00[Europe/Berlin]");
      expect(isBefore(zdt1, zdt2)).toBe(true);
      expect(isBefore(zdt2, zdt1)).toBe(false);
    });
  });

  describe("isAfter", () => {
    it("should return true when first date is after second (PlainDate)", () => {
      const date1 = Temporal.PlainDate.from("2025-12-01");
      const date2 = Temporal.PlainDate.from("2025-11-30");
      expect(isAfter(date1, date2)).toBe(true);
    });

    it("should return false when first date is before second (PlainDate)", () => {
      const date1 = Temporal.PlainDate.from("2025-11-29");
      const date2 = Temporal.PlainDate.from("2025-11-30");
      expect(isAfter(date1, date2)).toBe(false);
    });

    it("should return false when dates are equal (PlainDate)", () => {
      const date1 = Temporal.PlainDate.from("2025-11-30");
      const date2 = Temporal.PlainDate.from("2025-11-30");
      expect(isAfter(date1, date2)).toBe(false);
    });

    it("should work with PlainDateTime", () => {
      const dt1 = Temporal.PlainDateTime.from("2025-11-30T15:00:00");
      const dt2 = Temporal.PlainDateTime.from("2025-11-30T10:00:00");
      expect(isAfter(dt1, dt2)).toBe(true);
      expect(isAfter(dt2, dt1)).toBe(false);
    });

    it("should work with ZonedDateTime", () => {
      const zdt1 = Temporal.ZonedDateTime.from("2025-11-30T15:00:00+01:00[Europe/Berlin]");
      const zdt2 = Temporal.ZonedDateTime.from("2025-11-30T10:00:00+01:00[Europe/Berlin]");
      expect(isAfter(zdt1, zdt2)).toBe(true);
      expect(isAfter(zdt2, zdt1)).toBe(false);
    });
  });

  describe("isSame", () => {
    it("should return true when dates are equal (PlainDate)", () => {
      const date1 = Temporal.PlainDate.from("2025-11-30");
      const date2 = Temporal.PlainDate.from("2025-11-30");
      expect(isSame(date1, date2)).toBe(true);
    });

    it("should return false when dates are different (PlainDate)", () => {
      const date1 = Temporal.PlainDate.from("2025-11-30");
      const date2 = Temporal.PlainDate.from("2025-12-01");
      expect(isSame(date1, date2)).toBe(false);
    });

    it("should work with PlainDateTime", () => {
      const dt1 = Temporal.PlainDateTime.from("2025-11-30T15:00:00");
      const dt2 = Temporal.PlainDateTime.from("2025-11-30T15:00:00");
      const dt3 = Temporal.PlainDateTime.from("2025-11-30T16:00:00");
      expect(isSame(dt1, dt2)).toBe(true);
      expect(isSame(dt1, dt3)).toBe(false);
    });

    it("should work with ZonedDateTime", () => {
      const zdt1 = Temporal.ZonedDateTime.from("2025-11-30T15:00:00+01:00[Europe/Berlin]");
      const zdt2 = Temporal.ZonedDateTime.from("2025-11-30T15:00:00+01:00[Europe/Berlin]");
      const zdt3 = Temporal.ZonedDateTime.from("2025-11-30T16:00:00+01:00[Europe/Berlin]");
      expect(isSame(zdt1, zdt2)).toBe(true);
      expect(isSame(zdt1, zdt3)).toBe(false);
    });
  });

  describe("cross-timezone comparisons", () => {
    it("should compare ZonedDateTime across different timezones (isBefore)", () => {
      // 2 PM in New York = 8 PM in Berlin (same instant)
      const nyTime = Temporal.ZonedDateTime.from("2025-06-15T14:00:00-04:00[America/New_York]");
      const berlinTime = Temporal.ZonedDateTime.from("2025-06-15T20:00:00+02:00[Europe/Berlin]");

      // They are the same instant, so neither is before the other
      expect(isBefore(nyTime, berlinTime)).toBe(false);
      expect(isBefore(berlinTime, nyTime)).toBe(false);

      // 2 PM NY is before 9 PM Berlin (2 PM NY = 8 PM Berlin)
      const laterBerlin = Temporal.ZonedDateTime.from("2025-06-15T21:00:00+02:00[Europe/Berlin]");
      expect(isBefore(nyTime, laterBerlin)).toBe(true);
      expect(isBefore(laterBerlin, nyTime)).toBe(false);
    });

    it("should compare ZonedDateTime across different timezones (isAfter)", () => {
      const nyTime = Temporal.ZonedDateTime.from("2025-06-15T14:00:00-04:00[America/New_York]");
      const berlinTime = Temporal.ZonedDateTime.from("2025-06-15T20:00:00+02:00[Europe/Berlin]");

      // They are the same instant
      expect(isAfter(nyTime, berlinTime)).toBe(false);
      expect(isAfter(berlinTime, nyTime)).toBe(false);

      // 3 PM NY (9 PM Berlin) is after 8 PM Berlin
      const laterNY = Temporal.ZonedDateTime.from("2025-06-15T15:00:00-04:00[America/New_York]");
      expect(isAfter(laterNY, berlinTime)).toBe(true);
      expect(isAfter(berlinTime, laterNY)).toBe(false);
    });

    it("should compare ZonedDateTime across different timezones (isSame)", () => {
      // 2 PM in New York = 8 PM in Berlin
      const nyTime = Temporal.ZonedDateTime.from("2025-06-15T14:00:00-04:00[America/New_York]");
      const berlinTime = Temporal.ZonedDateTime.from("2025-06-15T20:00:00+02:00[Europe/Berlin]");

      expect(isSame(nyTime, berlinTime)).toBe(true);

      // Different instants
      const laterBerlin = Temporal.ZonedDateTime.from("2025-06-15T21:00:00+02:00[Europe/Berlin]");
      expect(isSame(nyTime, laterBerlin)).toBe(false);
    });

    it("should handle min/max with cross-timezone ZonedDateTime", () => {
      const dates = [
        Temporal.ZonedDateTime.from("2025-06-15T14:00:00-04:00[America/New_York]"), // 6 PM UTC
        Temporal.ZonedDateTime.from("2025-06-15T20:00:00+02:00[Europe/Berlin]"), // 6 PM UTC (same)
        Temporal.ZonedDateTime.from("2025-06-15T21:00:00+02:00[Europe/Berlin]"), // 7 PM UTC
        Temporal.ZonedDateTime.from("2025-06-15T13:00:00-04:00[America/New_York]"), // 5 PM UTC
      ];

      const earliest = min(dates);
      const latest = max(dates);

      // Earliest should be 1 PM NY (5 PM UTC)
      expect(earliest.toString()).toContain("13:00:00");
      expect(earliest.timeZoneId).toBe("America/New_York");

      // Latest should be 9 PM Berlin (7 PM UTC)
      expect(latest.toString()).toContain("21:00:00");
      expect(latest.timeZoneId).toBe("Europe/Berlin");
    });
  });

  describe("min", () => {
    it("should return the earliest date (PlainDate)", () => {
      const dates = [
        Temporal.PlainDate.from("2025-12-01"),
        Temporal.PlainDate.from("2025-11-29"),
        Temporal.PlainDate.from("2025-11-30"),
      ];
      const result = min(dates);
      expect(result.toString()).toBe("2025-11-29");
    });

    it("should work with single element array", () => {
      const dates = [Temporal.PlainDate.from("2025-11-30")];
      const result = min(dates);
      expect(result.toString()).toBe("2025-11-30");
    });

    it("should throw for empty array", () => {
      expect(() => min([])).toThrow("Cannot find min of empty array");
    });

    it("should work with PlainDateTime", () => {
      const dates = [
        Temporal.PlainDateTime.from("2025-11-30T15:00:00"),
        Temporal.PlainDateTime.from("2025-11-30T10:00:00"),
        Temporal.PlainDateTime.from("2025-11-30T12:00:00"),
      ];
      const result = min(dates);
      expect(result.toString()).toBe("2025-11-30T10:00:00");
    });

    it("should work with ZonedDateTime", () => {
      const dates = [
        Temporal.ZonedDateTime.from("2025-11-30T15:00:00+01:00[Europe/Berlin]"),
        Temporal.ZonedDateTime.from("2025-11-30T10:00:00+01:00[Europe/Berlin]"),
        Temporal.ZonedDateTime.from("2025-11-30T12:00:00+01:00[Europe/Berlin]"),
      ];
      const result = min(dates);
      expect(result.toString()).toContain("10:00:00");
    });
  });

  describe("max", () => {
    it("should return the latest date (PlainDate)", () => {
      const dates = [
        Temporal.PlainDate.from("2025-11-29"),
        Temporal.PlainDate.from("2025-12-01"),
        Temporal.PlainDate.from("2025-11-30"),
      ];
      const result = max(dates);
      expect(result.toString()).toBe("2025-12-01");
    });

    it("should work with single element array", () => {
      const dates = [Temporal.PlainDate.from("2025-11-30")];
      const result = max(dates);
      expect(result.toString()).toBe("2025-11-30");
    });

    it("should throw for empty array", () => {
      expect(() => max([])).toThrow("Cannot find max of empty array");
    });

    it("should work with PlainDateTime", () => {
      const dates = [
        Temporal.PlainDateTime.from("2025-11-30T10:00:00"),
        Temporal.PlainDateTime.from("2025-11-30T15:00:00"),
        Temporal.PlainDateTime.from("2025-11-30T12:00:00"),
      ];
      const result = max(dates);
      expect(result.toString()).toBe("2025-11-30T15:00:00");
    });

    it("should work with ZonedDateTime", () => {
      const dates = [
        Temporal.ZonedDateTime.from("2025-11-30T10:00:00+01:00[Europe/Berlin]"),
        Temporal.ZonedDateTime.from("2025-11-30T15:00:00+01:00[Europe/Berlin]"),
        Temporal.ZonedDateTime.from("2025-11-30T12:00:00+01:00[Europe/Berlin]"),
      ];
      const result = max(dates);
      expect(result.toString()).toContain("15:00:00");
    });
  });

  describe("isSameYear", () => {
    it("returns true for same year", () => {
      const d1 = Temporal.PlainDate.from("2025-01-01");
      const d2 = Temporal.PlainDate.from("2025-12-31");
      expect(isSameYear(d1, d2)).toBe(true);
    });

    it("returns false for different years", () => {
      const d1 = Temporal.PlainDate.from("2025-12-31");
      const d2 = Temporal.PlainDate.from("2026-01-01");
      expect(isSameYear(d1, d2)).toBe(false);
    });
  });

  describe("isSameMonth", () => {
    it("returns true for same month and year", () => {
      const d1 = Temporal.PlainDate.from("2025-01-01");
      const d2 = Temporal.PlainDate.from("2025-01-31");
      expect(isSameMonth(d1, d2)).toBe(true);
    });

    it("returns false for different months", () => {
      const d1 = Temporal.PlainDate.from("2025-01-31");
      const d2 = Temporal.PlainDate.from("2025-02-01");
      expect(isSameMonth(d1, d2)).toBe(false);
    });

    it("returns false for same month different year", () => {
      const d1 = Temporal.PlainDate.from("2025-01-01");
      const d2 = Temporal.PlainDate.from("2026-01-01");
      expect(isSameMonth(d1, d2)).toBe(false);
    });
  });

  describe("isSameWeek", () => {
    it("returns true for same week", () => {
      const d1 = Temporal.PlainDate.from("2025-01-01"); // Wednesday
      const d2 = Temporal.PlainDate.from("2025-01-05"); // Sunday
      expect(isSameWeek(d1, d2)).toBe(true);
    });

    it("returns false for different weeks", () => {
      const d1 = Temporal.PlainDate.from("2025-01-05"); // Sunday
      const d2 = Temporal.PlainDate.from("2025-01-06"); // Monday (next week)
      expect(isSameWeek(d1, d2)).toBe(false);
    });

    it("handles year boundaries correctly", () => {
      // Dec 29 2025 is Monday, Week 1 of 2026
      const d1 = Temporal.PlainDate.from("2025-12-29");
      const d2 = Temporal.PlainDate.from("2026-01-01");
      expect(isSameWeek(d1, d2)).toBe(true);
    });
  });

  describe("isSameDay", () => {
    it("returns true for same day", () => {
      const d1 = Temporal.PlainDate.from("2025-01-01");
      const d2 = Temporal.PlainDateTime.from("2025-01-01T15:00");
      expect(isSameDay(d1, d2)).toBe(true);
    });

    it("returns false for different days", () => {
      const d1 = Temporal.PlainDate.from("2025-01-01");
      const d2 = Temporal.PlainDate.from("2025-01-02");
      expect(isSameDay(d1, d2)).toBe(false);
    });
  });
});
