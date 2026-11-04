import fc from "fast-check";
import { Temporal } from "temporal-polyfill";
import { describe, expect, it } from "vitest";
import {
  add,
  endOf,
  nextDay,
  previousDay,
  startOf,
  subtract,
  withDayOfWeek,
  withDayOfYear,
  withWeekOfYear,
} from "./index.js";

const plainDateArbitrary = fc
  .record({
    year: fc.integer({ min: 2000, max: 2035 }),
    month: fc.integer({ min: 1, max: 12 }),
    day: fc.integer({ min: 1, max: 28 }),
  })
  .map(({ year, month, day }) => Temporal.PlainDate.from({ year, month, day }));

describe("Math Functions", () => {
  describe("field replacement", () => {
    it("replaces calendar days and preserves leap years", () => {
      const date = Temporal.PlainDate.from("2024-02-27");
      expect(withDayOfYear(date, 60).toString()).toBe("2024-02-29");
      expect(withDayOfYear(date, 500).toString()).toBe("2024-12-31");
      expect(withDayOfYear(date, 0).toString()).toBe("2024-01-01");
      expect(withDayOfYear(date, 60.9).toString()).toBe("2024-02-29");
      expect(withDayOfYear(date, 60, { overflow: "reject" }).dayOfYear).toBe(60);
      expect(date.toString()).toBe("2024-02-27");
    });

    it("replaces weekdays within the same week and preserves time", () => {
      const date = Temporal.PlainDateTime.from("2024-02-27T12:34:56.123456789");
      expect(withDayOfWeek(date, 4).toString()).toBe("2024-02-29T12:34:56.123456789");
      expect(withDayOfWeek(date, 8).dayOfWeek).toBe(7);
      expect(withDayOfWeek(date, -1).dayOfWeek).toBe(1);
    });

    it("uses the ISO week-year rather than calendar year", () => {
      const date = Temporal.PlainDate.from("2021-01-01");
      expect(withWeekOfYear(date, 1).toString()).toBe("2020-01-03");
      expect(withWeekOfYear(date, 99).toString()).toBe("2021-01-01");
      expect(withWeekOfYear(Temporal.PlainDate.from("2021-07-01"), 53).weekOfYear).toBe(52);
      expect(() => withWeekOfYear(date.withCalendar("hebrew"), 1)).toThrow(RangeError);
    });

    it("preserves zoned local time across DST transitions", () => {
      const date = Temporal.ZonedDateTime.from("2024-03-25T12:00[Europe/Berlin]");
      const result = withDayOfWeek(date, 7);
      expect(result.toString()).toBe("2024-03-31T12:00:00+02:00[Europe/Berlin]");
      expect(withDayOfYear(date, 91).equals(result)).toBe(true);
      expect(withWeekOfYear(date, 14).toString()).toBe("2024-04-01T12:00:00+02:00[Europe/Berlin]");
    });

    it("rejects invalid numbers, overflow options and out-of-range fields", () => {
      const date = Temporal.PlainDate.from("2024-02-27");
      for (const helper of [withDayOfYear, withDayOfWeek, withWeekOfYear]) {
        for (const value of [NaN, Infinity, -Infinity]) {
          expect(() => helper(date, value)).toThrow(RangeError);
        }
        for (const value of [0, 500]) {
          expect(() => helper(date, value, { overflow: "reject" })).toThrow(RangeError);
        }
        // @ts-expect-error Invalid options are also checked for JavaScript callers.
        expect(() => helper(date, 1, { overflow: "invalid" })).toThrow(RangeError);
      }
    });
  });

  describe("add", () => {
    it("should add days to PlainDate", () => {
      const date = Temporal.PlainDate.from("2025-11-30");
      const result = add(date, { days: 5 });
      expect(result.toString()).toBe("2025-12-05");
    });

    it("should add weeks to PlainDate", () => {
      const date = Temporal.PlainDate.from("2025-11-30");
      const result = add(date, { weeks: 2 });
      expect(result.toString()).toBe("2025-12-14");
    });

    it("should add months to PlainDate", () => {
      const date = Temporal.PlainDate.from("2025-11-30");
      const result = add(date, { months: 1 });
      expect(result.toString()).toBe("2025-12-30");
    });

    it("should add years to PlainDate", () => {
      const date = Temporal.PlainDate.from("2025-11-30");
      const result = add(date, { years: 1 });
      expect(result.toString()).toBe("2026-11-30");
    });

    it("should add multiple units to PlainDate", () => {
      const date = Temporal.PlainDate.from("2025-11-30");
      const result = add(date, { years: 1, months: 2, days: 3 });
      expect(result.toString()).toBe("2027-02-02");
    });

    it("accepts native Temporal duration strings", () => {
      const date = Temporal.PlainDate.from("2025-11-30");
      expect(add(date, "P5D").toString()).toBe("2025-12-05");
    });

    it("should add hours to PlainDateTime", () => {
      const dt = Temporal.PlainDateTime.from("2025-11-30T10:00:00");
      const result = add(dt, { hours: 5 });
      expect(result.toString()).toBe("2025-11-30T15:00:00");
    });

    it("should add minutes to PlainDateTime", () => {
      const dt = Temporal.PlainDateTime.from("2025-11-30T10:00:00");
      const result = add(dt, { minutes: 90 });
      expect(result.toString()).toBe("2025-11-30T11:30:00");
    });

    it("should add to ZonedDateTime", () => {
      const zdt = Temporal.ZonedDateTime.from("2025-11-30T10:00:00+01:00[Europe/Berlin]");
      const result = add(zdt, { hours: 3, minutes: 30 });
      expect(result.toString()).toContain("13:30:00");
    });
  });

  describe("subtract", () => {
    it("should subtract days from PlainDate", () => {
      const date = Temporal.PlainDate.from("2025-12-05");
      const result = subtract(date, { days: 5 });
      expect(result.toString()).toBe("2025-11-30");
    });

    it("should subtract weeks from PlainDate", () => {
      const date = Temporal.PlainDate.from("2025-12-14");
      const result = subtract(date, { weeks: 2 });
      expect(result.toString()).toBe("2025-11-30");
    });

    it("should subtract months from PlainDate", () => {
      const date = Temporal.PlainDate.from("2025-12-30");
      const result = subtract(date, { months: 1 });
      expect(result.toString()).toBe("2025-11-30");
    });

    it("should subtract years from PlainDate", () => {
      const date = Temporal.PlainDate.from("2026-11-30");
      const result = subtract(date, { years: 1 });
      expect(result.toString()).toBe("2025-11-30");
    });

    it("should subtract multiple units from PlainDate", () => {
      const date = Temporal.PlainDate.from("2027-02-02");
      const result = subtract(date, { years: 1, months: 2, days: 3 });
      // 2027-02-02 - 1 year = 2026-02-02
      // 2026-02-02 - 2 months = 2025-12-02
      // 2025-12-02 - 3 days = 2025-11-29
      expect(result.toString()).toBe("2025-11-29");
    });

    it("should subtract hours from PlainDateTime", () => {
      const dt = Temporal.PlainDateTime.from("2025-11-30T15:00:00");
      const result = subtract(dt, { hours: 5 });
      expect(result.toString()).toBe("2025-11-30T10:00:00");
    });

    it("should subtract from ZonedDateTime", () => {
      const zdt = Temporal.ZonedDateTime.from("2025-11-30T15:00:00+01:00[Europe/Berlin]");
      const result = subtract(zdt, { hours: 2, minutes: 30 });
      expect(result.toString()).toContain("12:30:00");
    });
  });

  describe("startOf", () => {
    it("should get start of day for PlainDate", () => {
      const date = Temporal.PlainDate.from("2025-11-30");
      const result = startOf(date, "day");
      // PlainDate stays the same for day
      expect(result.toString()).toBe("2025-11-30");
    });

    it("should get start of week for PlainDate", () => {
      const date = Temporal.PlainDate.from("2025-11-30"); // Saturday
      const result = startOf(date, "week");
      expect(result.toString()).toBe("2025-11-24"); // Previous Monday
      expect(result).toBeInstanceOf(Temporal.PlainDate);
    });

    it("should get start of month for PlainDate", () => {
      const date = Temporal.PlainDate.from("2025-11-30");
      const result = startOf(date, "month");
      expect(result.toString()).toBe("2025-11-01");
    });

    it("should get start of year for PlainDate", () => {
      const date = Temporal.PlainDate.from("2025-11-30");
      const result = startOf(date, "year");
      expect(result.toString()).toBe("2025-01-01");
      expect(result).toBeInstanceOf(Temporal.PlainDate);
    });

    it("should get start of week for PlainDateTime", () => {
      const dt = Temporal.PlainDateTime.from("2025-11-30T15:30:45"); // Saturday
      const result = startOf(dt, "week");
      expect(result.toString()).toBe("2025-11-24T00:00:00"); // Previous Monday at midnight
    });

    it("should get start of year for PlainDateTime", () => {
      const dt = Temporal.PlainDateTime.from("2025-11-30T15:30:45");
      const result = startOf(dt, "year");
      expect(result.toString()).toBe("2025-01-01T00:00:00");
    });

    it("should get start of day for PlainDateTime", () => {
      const dt = Temporal.PlainDateTime.from("2025-11-30T15:30:45");
      const result = startOf(dt, "day");
      expect(result.toString()).toBe("2025-11-30T00:00:00");
    });

    it("should get start of month for PlainDateTime", () => {
      const dt = Temporal.PlainDateTime.from("2025-11-30T15:30:45");
      const result = startOf(dt, "month");
      expect(result.toString()).toBe("2025-11-01T00:00:00");
    });

    it("should get start of day for ZonedDateTime", () => {
      const zdt = Temporal.ZonedDateTime.from("2025-11-30T15:30:45+01:00[Europe/Berlin]");
      const result = startOf(zdt, "day");
      expect(result.toString()).toContain("2025-11-30");
      expect(result.toString()).toContain("00:00:00");
    });

    it("should choose the first occurrence of repeated midnight", () => {
      const zdt = Temporal.ZonedDateTime.from("2020-11-01T12:00[America/Havana]");
      const result = startOf(zdt, "day");

      expect(result.toPlainTime().toString()).toBe("00:00:00");
      expect(result.offset).toBe("-04:00");
    });

    it("should choose the first occurrence of midnight at the start of the month", () => {
      const zdt = Temporal.ZonedDateTime.from("2020-11-15T12:00[America/Havana]");
      const result = startOf(zdt, "month");

      expect(result.toPlainDate().toString()).toBe("2020-11-01");
      expect(result.offset).toBe("-04:00");
    });

    it("should start at the first valid time when midnight is skipped", () => {
      const zdt = Temporal.ZonedDateTime.from("2018-11-04T12:00[America/Sao_Paulo]");
      const result = startOf(zdt, "day");

      expect(result.toPlainDate().toString()).toBe("2018-11-04");
      expect(result.toPlainTime().toString()).toBe("01:00:00");
    });

    it("should throw for invalid unit", () => {
      const date = Temporal.PlainDate.from("2025-11-30");
      // @ts-expect-error - testing invalid unit
      expect(() => startOf(date, "invalid")).toThrow("Invalid unit: invalid");
    });
  });

  describe("endOf", () => {
    it("should get end of day for PlainDate", () => {
      const date = Temporal.PlainDate.from("2025-11-30");
      const result = endOf(date, "day");
      // PlainDate stays the same for day
      expect(result.toString()).toBe("2025-11-30");
    });

    it("should get end of week for PlainDate", () => {
      const date = Temporal.PlainDate.from("2025-11-24"); // Monday
      const result = endOf(date, "week");
      expect(result.toString()).toBe("2025-11-30"); // Following Sunday
      expect(result).toBeInstanceOf(Temporal.PlainDate);
    });

    it("should get end of month for PlainDate", () => {
      const date = Temporal.PlainDate.from("2025-11-15");
      const result = endOf(date, "month");
      expect(result.toString()).toBe("2025-11-30");
    });

    it("should get end of year for PlainDate", () => {
      const date = Temporal.PlainDate.from("2025-11-30");
      const result = endOf(date, "year");
      expect(result.toString()).toBe("2025-12-31");
      expect(result).toBeInstanceOf(Temporal.PlainDate);
    });

    it("should get end of week for PlainDateTime", () => {
      const dt = Temporal.PlainDateTime.from("2025-11-24T10:30:45"); // Monday
      const result = endOf(dt, "week");
      expect(result.toString()).toBe("2025-11-30T23:59:59.999999999"); // Following Sunday end of day
    });

    it("should get end of year for PlainDateTime", () => {
      const dt = Temporal.PlainDateTime.from("2025-11-30T15:30:45");
      const result = endOf(dt, "year");
      expect(result.toString()).toBe("2025-12-31T23:59:59.999999999");
    });

    it("should get end of day for PlainDateTime", () => {
      const dt = Temporal.PlainDateTime.from("2025-11-30T15:30:45");
      const result = endOf(dt, "day");
      expect(result.toString()).toBe("2025-11-30T23:59:59.999999999");
    });

    it("should get end of month for PlainDateTime", () => {
      const dt = Temporal.PlainDateTime.from("2025-11-15T15:30:45");
      const result = endOf(dt, "month");
      expect(result.toString()).toBe("2025-11-30T23:59:59.999999999");
    });

    it("should get end of day for ZonedDateTime", () => {
      const zdt = Temporal.ZonedDateTime.from("2025-11-30T15:30:45+01:00[Europe/Berlin]");
      const result = endOf(zdt, "day");
      expect(result.toString()).toContain("2025-11-30");
      expect(result.toString()).toContain("23:59:59");
    });

    it("should keep the end of day on the same date when midnight is skipped", () => {
      const zdt = Temporal.ZonedDateTime.from("2018-11-04T12:00[America/Sao_Paulo]");
      const result = endOf(zdt, "day");

      expect(result.toPlainDate().toString()).toBe("2018-11-04");
      expect(result.toPlainTime().toString()).toBe("23:59:59.999999999");
    });

    it("should throw for invalid unit", () => {
      const date = Temporal.PlainDate.from("2025-11-30");
      // @ts-expect-error - testing invalid unit
      expect(() => endOf(date, "invalid")).toThrow("Invalid unit: invalid");
    });
  });

  describe("nextDay", () => {
    it("should find next Friday from Sunday", () => {
      const date = Temporal.PlainDate.from("2025-11-30"); // Sunday
      const result = nextDay(date, 5); // Friday
      expect(result.toString()).toBe("2025-12-05");
    });

    it("should find next Monday from Sunday", () => {
      const date = Temporal.PlainDate.from("2025-11-30"); // Sunday
      const result = nextDay(date, 1); // Monday
      expect(result.toString()).toBe("2025-12-01");
    });

    it("should find next Monday from Monday", () => {
      const date = Temporal.PlainDate.from("2025-12-01"); // Monday
      const result = nextDay(date, 1); // Next Monday
      expect(result.toString()).toBe("2025-12-08");
    });

    it("should find next Friday from Monday", () => {
      const date = Temporal.PlainDate.from("2025-12-01"); // Monday
      const result = nextDay(date, 5); // Friday
      expect(result.toString()).toBe("2025-12-05");
    });

    it("should throw for invalid day of week", () => {
      const date = Temporal.PlainDate.from("2025-11-30");
      expect(() => nextDay(date, 0)).toThrow();
      expect(() => nextDay(date, 8)).toThrow();
    });
  });

  describe("previousDay", () => {
    it("should find previous Friday from Sunday", () => {
      const date = Temporal.PlainDate.from("2025-11-30"); // Sunday
      const result = previousDay(date, 5); // Friday
      expect(result.toString()).toBe("2025-11-28");
    });

    it("should find previous Monday from Sunday", () => {
      const date = Temporal.PlainDate.from("2025-11-30"); // Sunday
      const result = previousDay(date, 1); // Monday
      expect(result.toString()).toBe("2025-11-24");
    });

    it("should find previous Monday from Monday", () => {
      const date = Temporal.PlainDate.from("2025-12-01"); // Monday
      const result = previousDay(date, 1); // Previous Monday
      expect(result.toString()).toBe("2025-11-24");
    });

    it("should throw for invalid day of week", () => {
      const date = Temporal.PlainDate.from("2025-11-30");
      expect(() => previousDay(date, 0)).toThrow();
      expect(() => previousDay(date, 8)).toThrow();
    });
  });

  describe("property-based", () => {
    it("add and subtract days should round-trip for PlainDate", () => {
      fc.assert(
        fc.property(plainDateArbitrary, fc.integer({ min: -365, max: 365 }), (date, days) => {
          const shifted = add(date, { days });
          const restored = subtract(shifted, { days });
          expect(restored.equals(date)).toBe(true);
        }),
      );
    });

    it("nextDay should always return the requested weekday and be within 1..7 days", () => {
      fc.assert(
        fc.property(plainDateArbitrary, fc.integer({ min: 1, max: 7 }), (date, targetWeekday) => {
          const result = nextDay(date, targetWeekday);
          expect(result.dayOfWeek).toBe(targetWeekday);
          const distance = result.since(date, { largestUnit: "day" }).days;
          expect(distance).toBeGreaterThanOrEqual(1);
          expect(distance).toBeLessThanOrEqual(7);
        }),
      );
    });

    it("previousDay should always return the requested weekday and be within -7..-1 days", () => {
      fc.assert(
        fc.property(plainDateArbitrary, fc.integer({ min: 1, max: 7 }), (date, targetWeekday) => {
          const result = previousDay(date, targetWeekday);
          expect(result.dayOfWeek).toBe(targetWeekday);
          const distance = result.since(date, { largestUnit: "day" }).days;
          expect(distance).toBeLessThanOrEqual(-1);
          expect(distance).toBeGreaterThanOrEqual(-7);
        }),
      );
    });
  });
});
