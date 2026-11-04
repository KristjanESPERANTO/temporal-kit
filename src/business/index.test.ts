import { Temporal } from "temporal-polyfill";
import { describe, expect, it } from "vitest";
import { addBusinessDays, isWeekend } from "./index.js";

function addBusinessDaysByStepping(date: Temporal.PlainDate, days: number): Temporal.PlainDate {
  let result = date;
  let remaining = Math.abs(days);
  const direction = days > 0 ? 1 : -1;
  while (remaining > 0) {
    result = result.add({ days: direction });
    if (!isWeekend(result)) remaining--;
  }
  return result;
}

describe("business", () => {
  describe("isWeekend", () => {
    it("should return true for Saturday", () => {
      const saturday = Temporal.PlainDate.from("2023-10-07");
      expect(isWeekend(saturday)).toBe(true);
    });

    it("should return true for Sunday", () => {
      const sunday = Temporal.PlainDate.from("2023-10-08");
      expect(isWeekend(sunday)).toBe(true);
    });

    it("should return false for Monday", () => {
      const monday = Temporal.PlainDate.from("2023-10-09");
      expect(isWeekend(monday)).toBe(false);
    });

    it("should return false for Friday", () => {
      const friday = Temporal.PlainDate.from("2023-10-06");
      expect(isWeekend(friday)).toBe(false);
    });
  });

  describe("addBusinessDays", () => {
    it("matches day-by-day stepping across start weekdays and directions", () => {
      const monday = Temporal.PlainDate.from("2023-10-09");
      for (let weekday = 1; weekday <= 7; weekday++) {
        const start = monday.add({ days: weekday - 1 });
        for (let days = -30; days <= 30; days++) {
          const expected = addBusinessDaysByStepping(start, days);
          expect(addBusinessDays(start, days).toString()).toBe(expected.toString());
        }
      }
    });

    it("rejects non-integer and unsafe business-day counts", () => {
      const date = Temporal.PlainDate.from("2023-10-09");
      for (const days of [1.5, Number.NaN, Number.POSITIVE_INFINITY, Number.MAX_SAFE_INTEGER + 1]) {
        expect(() => addBusinessDays(date, days)).toThrow(RangeError);
      }
    });

    it("should add days within the same week", () => {
      const monday = Temporal.PlainDate.from("2023-10-09");
      const result = addBusinessDays(monday, 2);
      expect(result.toString()).toBe("2023-10-11"); // Wednesday
    });

    it("should skip weekend when adding days", () => {
      const friday = Temporal.PlainDate.from("2023-10-06");
      const result = addBusinessDays(friday, 1);
      expect(result.toString()).toBe("2023-10-09"); // Monday
    });

    it("should skip weekend when adding multiple days", () => {
      const friday = Temporal.PlainDate.from("2023-10-06");
      const result = addBusinessDays(friday, 3);
      expect(result.toString()).toBe("2023-10-11"); // Wednesday (Fri -> Mon, Tue, Wed)
    });

    it("should subtract days within the same week", () => {
      const wednesday = Temporal.PlainDate.from("2023-10-11");
      const result = addBusinessDays(wednesday, -2);
      expect(result.toString()).toBe("2023-10-09"); // Monday
    });

    it("should skip weekend when subtracting days", () => {
      const monday = Temporal.PlainDate.from("2023-10-09");
      const result = addBusinessDays(monday, -1);
      expect(result.toString()).toBe("2023-10-06"); // Friday
    });
  });
});
