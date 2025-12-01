import { Temporal } from "temporal-polyfill";
import { describe, expect, it } from "vitest";
import {
  eachDayOfInterval,
  eachWeekOfInterval,
  rangesOverlap,
  stepInterval,
} from "./index.js";

describe("range", () => {
  describe("rangesOverlap", () => {
    it("should return true for overlapping ranges", () => {
      const range1 = {
        start: Temporal.PlainDate.from("2025-01-01"),
        end: Temporal.PlainDate.from("2025-01-10"),
      };
      const range2 = {
        start: Temporal.PlainDate.from("2025-01-05"),
        end: Temporal.PlainDate.from("2025-01-15"),
      };
      expect(rangesOverlap(range1, range2)).toBe(true);
    });

    it("should return false for non-overlapping ranges (before)", () => {
      const range1 = {
        start: Temporal.PlainDate.from("2025-01-01"),
        end: Temporal.PlainDate.from("2025-01-05"),
      };
      const range2 = {
        start: Temporal.PlainDate.from("2025-01-06"),
        end: Temporal.PlainDate.from("2025-01-10"),
      };
      expect(rangesOverlap(range1, range2)).toBe(false);
    });

    it("should return false for non-overlapping ranges (after)", () => {
      const range1 = {
        start: Temporal.PlainDate.from("2025-01-10"),
        end: Temporal.PlainDate.from("2025-01-15"),
      };
      const range2 = {
        start: Temporal.PlainDate.from("2025-01-01"),
        end: Temporal.PlainDate.from("2025-01-05"),
      };
      expect(rangesOverlap(range1, range2)).toBe(false);
    });

    it("should return true for contained ranges", () => {
      const range1 = {
        start: Temporal.PlainDate.from("2025-01-01"),
        end: Temporal.PlainDate.from("2025-01-20"),
      };
      const range2 = {
        start: Temporal.PlainDate.from("2025-01-05"),
        end: Temporal.PlainDate.from("2025-01-10"),
      };
      expect(rangesOverlap(range1, range2)).toBe(true);
    });

    it("should work with ZonedDateTime", () => {
      const range1 = {
        start: Temporal.ZonedDateTime.from("2025-01-01T10:00:00+01:00[Europe/Berlin]"),
        end: Temporal.ZonedDateTime.from("2025-01-01T12:00:00+01:00[Europe/Berlin]"),
      };
      const range2 = {
        start: Temporal.ZonedDateTime.from("2025-01-01T11:00:00+01:00[Europe/Berlin]"),
        end: Temporal.ZonedDateTime.from("2025-01-01T13:00:00+01:00[Europe/Berlin]"),
      };
      expect(rangesOverlap(range1, range2)).toBe(true);
    });
  });

  describe("stepInterval", () => {
    it("should yield dates with specified step", () => {
      const start = Temporal.PlainDate.from("2025-01-01");
      const end = Temporal.PlainDate.from("2025-01-05");
      const generator = stepInterval({ start, end }, { days: 2 });

      expect(generator.next().value.toString()).toBe("2025-01-01");
      expect(generator.next().value.toString()).toBe("2025-01-03");
      expect(generator.next().value.toString()).toBe("2025-01-05");
      expect(generator.next().done).toBe(true);
    });
  });

  describe("eachDayOfInterval", () => {
    it("should return all days in interval inclusive", () => {
      const start = Temporal.PlainDate.from("2025-01-01");
      const end = Temporal.PlainDate.from("2025-01-03");
      const days = eachDayOfInterval({ start, end });

      expect(days).toHaveLength(3);
      expect(days[0].toString()).toBe("2025-01-01");
      expect(days[1].toString()).toBe("2025-01-02");
      expect(days[2].toString()).toBe("2025-01-03");
    });

    it("should work with ZonedDateTime", () => {
      const start = Temporal.ZonedDateTime.from("2025-01-01T10:00:00+01:00[Europe/Berlin]");
      const end = Temporal.ZonedDateTime.from("2025-01-03T10:00:00+01:00[Europe/Berlin]");
      const days = eachDayOfInterval({ start, end });

      expect(days).toHaveLength(3);
      expect(days[0].toString()).toContain("2025-01-01");
      expect(days[2].toString()).toContain("2025-01-03");
    });
  });

  describe("eachWeekOfInterval", () => {
    it("should return weeks in interval", () => {
      const start = Temporal.PlainDate.from("2025-01-01");
      const end = Temporal.PlainDate.from("2025-01-15");
      const weeks = eachWeekOfInterval({ start, end });

      expect(weeks).toHaveLength(3); // 1st, 8th, 15th
      expect(weeks[0].toString()).toBe("2025-01-01");
      expect(weeks[1].toString()).toBe("2025-01-08");
      expect(weeks[2].toString()).toBe("2025-01-15");
    });
  });
});
