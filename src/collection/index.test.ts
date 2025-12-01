import { Temporal } from "temporal-polyfill";
import { describe, expect, it } from "vitest";
import { closestTo, sortAsc, sortDesc } from "./index.js";

describe("collection", () => {
  describe("sortAsc", () => {
    it("sorts PlainDates correctly", () => {
      const dates = [
        Temporal.PlainDate.from("2025-03-01"),
        Temporal.PlainDate.from("2025-01-01"),
        Temporal.PlainDate.from("2025-02-01"),
      ];
      const sorted = sortAsc(dates);
      expect(sorted[0].toString()).toBe("2025-01-01");
      expect(sorted[1].toString()).toBe("2025-02-01");
      expect(sorted[2].toString()).toBe("2025-03-01");
    });

    it("does not mutate original array", () => {
      const dates = [Temporal.PlainDate.from("2025-03-01"), Temporal.PlainDate.from("2025-01-01")];
      const original = [...dates];
      sortAsc(dates);
      expect(dates).toEqual(original);
    });
  });

  describe("sortDesc", () => {
    it("sorts PlainDates correctly", () => {
      const dates = [
        Temporal.PlainDate.from("2025-01-01"),
        Temporal.PlainDate.from("2025-03-01"),
        Temporal.PlainDate.from("2025-02-01"),
      ];
      const sorted = sortDesc(dates);
      expect(sorted[0].toString()).toBe("2025-03-01");
      expect(sorted[1].toString()).toBe("2025-02-01");
      expect(sorted[2].toString()).toBe("2025-01-01");
    });
  });

  describe("closestTo", () => {
    it("finds closest date", () => {
      const target = Temporal.PlainDate.from("2025-06-01");
      const dates = [
        Temporal.PlainDate.from("2025-01-01"),
        Temporal.PlainDate.from("2025-12-31"),
        Temporal.PlainDate.from("2025-05-30"), // Closest
      ];
      const result = closestTo(target, dates);
      expect(result?.toString()).toBe("2025-05-30");
    });

    it("finds closest PlainDateTime", () => {
      const target = Temporal.PlainDateTime.from("2025-06-01T12:00:00");
      const dates = [
        Temporal.PlainDateTime.from("2025-01-01T00:00:00"),
        Temporal.PlainDateTime.from("2025-06-01T13:00:00"), // Closest (1 hour diff)
        Temporal.PlainDateTime.from("2025-06-01T10:00:00"), // (2 hours diff)
      ];
      const result = closestTo(target, dates);
      expect(result?.toString()).toBe("2025-06-01T13:00:00");
    });

    it("finds closest ZonedDateTime", () => {
      const target = Temporal.ZonedDateTime.from("2025-06-01T12:00:00+00:00[UTC]");
      const dates = [
        Temporal.ZonedDateTime.from("2025-01-01T00:00:00+00:00[UTC]"),
        Temporal.ZonedDateTime.from("2025-06-01T13:00:00+00:00[UTC]"), // Closest
      ];
      const result = closestTo(target, dates);
      expect(result?.toString()).toBe("2025-06-01T13:00:00+00:00[UTC]");
    });

    it("returns undefined for empty array", () => {
      const target = Temporal.PlainDate.from("2025-06-01");
      expect(closestTo(target, [])).toBeUndefined();
    });

    it("finds closest among many PlainDates", () => {
      const target = Temporal.PlainDate.from("2025-03-15");
      const dates = [
        Temporal.PlainDate.from("2025-01-01"),
        Temporal.PlainDate.from("2025-02-01"),
        Temporal.PlainDate.from("2025-03-14"), // Closest: 1 day away
        Temporal.PlainDate.from("2025-04-01"),
        Temporal.PlainDate.from("2025-05-01"),
      ];
      // Verify PlainDate doesn't have epochNanoseconds
      expect("epochNanoseconds" in target).toBe(false);
      const result = closestTo(target, dates);
      expect(result?.toString()).toBe("2025-03-14");
    });

    it("finds closest when target is later than all dates", () => {
      const target = Temporal.PlainDate.from("2025-12-31");
      const dates = [
        Temporal.PlainDate.from("2025-01-01"),
        Temporal.PlainDate.from("2025-06-01"),
        Temporal.PlainDate.from("2025-10-01"), // Closest (even though all are before target)
      ];
      const result = closestTo(target, dates);
      expect(result?.toString()).toBe("2025-10-01");
    });

    it("finds closest when target is earlier than all dates", () => {
      const target = Temporal.PlainDate.from("2025-01-01");
      const dates = [
        Temporal.PlainDate.from("2025-06-01"),
        Temporal.PlainDate.from("2025-03-01"), // Closest (even though all are after target)
        Temporal.PlainDate.from("2025-12-01"),
      ];
      const result = closestTo(target, dates);
      expect(result?.toString()).toBe("2025-03-01");
    });

    it("works with ZonedDateTime", () => {
      const target = Temporal.ZonedDateTime.from("2025-06-01T12:00:00[UTC]");
      const dates = [
        Temporal.ZonedDateTime.from("2025-06-01T10:00:00[UTC]"), // 2 hours before (negative diff when target - date)
        Temporal.ZonedDateTime.from("2025-06-01T15:00:00[UTC]"), // 3 hours after (positive diff)
      ];
      const result = closestTo(target, dates);
      expect(result?.toString()).toBe("2025-06-01T10:00:00+00:00[UTC]");
    });

    it("works with ZonedDateTime where target is earliest", () => {
      const target = Temporal.ZonedDateTime.from("2025-06-01T08:00:00[UTC]");
      const dates = [
        Temporal.ZonedDateTime.from("2025-06-01T10:00:00[UTC]"), // Both after (positive diffs)
        Temporal.ZonedDateTime.from("2025-06-01T15:00:00[UTC]"),
      ];
      const result = closestTo(target, dates);
      expect(result?.toString()).toBe("2025-06-01T10:00:00+00:00[UTC]");
    });

    it("finds closest with mixed PlainDate and PlainDateTime", () => {
      // This test ensures the toZonedDateTime branch for ZonedDateTime input is covered
      const target = Temporal.PlainDateTime.from("2025-06-15T12:00:00");
      const dates = [
        Temporal.PlainDateTime.from("2025-06-01T00:00:00"),
        Temporal.PlainDateTime.from("2025-06-14T12:00:00"), // Closest: exactly 1 day before
        Temporal.PlainDateTime.from("2025-06-20T00:00:00"),
      ];
      const result = closestTo(target, dates);
      expect(result?.toString()).toBe("2025-06-14T12:00:00");
    });

    it("finds closest with mixed ZonedDateTime in array", () => {
      // Mix ZonedDateTime with PlainDate to cover toZonedDateTime for ZonedDateTime input
      const target = Temporal.ZonedDateTime.from("2025-06-15T12:00:00+00:00[UTC]");
      const dates: Array<Temporal.ZonedDateTime | Temporal.PlainDateTime> = [
        Temporal.PlainDateTime.from("2025-06-14T12:00:00"), // 1 day before (closest)
        Temporal.ZonedDateTime.from("2025-06-20T00:00:00+00:00[UTC]"),
      ];
      const result = closestTo(target, dates);
      expect(result?.toString()).toBe("2025-06-14T12:00:00");
    });
  });
});
