import { describe, expect, it } from "vitest";
import { Temporal } from "temporal-polyfill";
import { add, subtract, startOf, endOf } from "./index.js";

describe("Math Functions", () => {
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
			const zdt = Temporal.ZonedDateTime.from(
				"2025-11-30T10:00:00+01:00[Europe/Berlin]",
			);
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
			const zdt = Temporal.ZonedDateTime.from(
				"2025-11-30T15:00:00+01:00[Europe/Berlin]",
			);
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
			const zdt = Temporal.ZonedDateTime.from(
				"2025-11-30T15:30:45+01:00[Europe/Berlin]",
			);
			const result = startOf(zdt, "day");
			expect(result.toString()).toContain("2025-11-30");
			expect(result.toString()).toContain("00:00:00");
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
			const zdt = Temporal.ZonedDateTime.from(
				"2025-11-30T15:30:45+01:00[Europe/Berlin]",
			);
			const result = endOf(zdt, "day");
			expect(result.toString()).toContain("2025-11-30");
			expect(result.toString()).toContain("23:59:59");
		});

		it("should throw for invalid unit", () => {
			const date = Temporal.PlainDate.from("2025-11-30");
			// @ts-expect-error - testing invalid unit
			expect(() => endOf(date, "invalid")).toThrow("Invalid unit: invalid");
		});
	});
});
