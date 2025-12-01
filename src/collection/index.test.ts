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

    it("returns undefined for empty array", () => {
      const target = Temporal.PlainDate.from("2025-06-01");
      expect(closestTo(target, [])).toBeUndefined();
    });

    it("works with ZonedDateTime", () => {
      const target = Temporal.ZonedDateTime.from("2025-06-01T12:00:00[UTC]");
      const dates = [
        Temporal.ZonedDateTime.from("2025-06-01T10:00:00[UTC]"), // 2 hours diff
        Temporal.ZonedDateTime.from("2025-06-01T15:00:00[UTC]"), // 3 hours diff
      ];
      const result = closestTo(target, dates);
      expect(result?.toString()).toBe("2025-06-01T10:00:00+00:00[UTC]");
    });
  });
});
