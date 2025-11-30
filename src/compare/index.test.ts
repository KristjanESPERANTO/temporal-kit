import { Temporal } from "temporal-polyfill";
import { describe, expect, it } from "vitest";
import { isAfter, isBefore, isSame, max, min } from "./index.js";

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
});
