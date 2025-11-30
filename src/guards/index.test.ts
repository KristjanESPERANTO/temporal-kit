import { describe, expect, it } from "vitest";
import { Temporal } from "temporal-polyfill";
import {
	isPlainDate,
	isPlainDateTime,
	isZonedDateTime,
	isInstant,
	isPlainTime,
	isDateLike,
	isTimeLike,
} from "./index.js";

describe("Type Guards", () => {
	describe("isPlainDate", () => {
		it("should return true for PlainDate", () => {
			const date = Temporal.PlainDate.from("2025-11-30");
			expect(isPlainDate(date)).toBe(true);
		});

		it("should return false for PlainDateTime", () => {
			const dateTime = Temporal.PlainDateTime.from("2025-11-30T15:30:00");
			expect(isPlainDate(dateTime)).toBe(false);
		});

		it("should return false for ZonedDateTime", () => {
			const zoned = Temporal.ZonedDateTime.from(
				"2025-11-30T15:30:00+01:00[Europe/Berlin]",
			);
			expect(isPlainDate(zoned)).toBe(false);
		});

		it("should return false for non-Temporal values", () => {
			expect(isPlainDate(null)).toBe(false);
			expect(isPlainDate(undefined)).toBe(false);
			expect(isPlainDate("2025-11-30")).toBe(false);
			expect(isPlainDate(new Date())).toBe(false);
			expect(isPlainDate({})).toBe(false);
		});
	});

	describe("isPlainDateTime", () => {
		it("should return true for PlainDateTime", () => {
			const dateTime = Temporal.PlainDateTime.from("2025-11-30T15:30:00");
			expect(isPlainDateTime(dateTime)).toBe(true);
		});

		it("should return false for PlainDate", () => {
			const date = Temporal.PlainDate.from("2025-11-30");
			expect(isPlainDateTime(date)).toBe(false);
		});

		it("should return false for ZonedDateTime", () => {
			const zoned = Temporal.ZonedDateTime.from(
				"2025-11-30T15:30:00+01:00[Europe/Berlin]",
			);
			expect(isPlainDateTime(zoned)).toBe(false);
		});

		it("should return false for non-Temporal values", () => {
			expect(isPlainDateTime(null)).toBe(false);
			expect(isPlainDateTime({})).toBe(false);
		});
	});

	describe("isZonedDateTime", () => {
		it("should return true for ZonedDateTime", () => {
			const zoned = Temporal.ZonedDateTime.from(
				"2025-11-30T15:30:00+01:00[Europe/Berlin]",
			);
			expect(isZonedDateTime(zoned)).toBe(true);
		});

		it("should return false for PlainDate", () => {
			const date = Temporal.PlainDate.from("2025-11-30");
			expect(isZonedDateTime(date)).toBe(false);
		});

		it("should return false for PlainDateTime", () => {
			const dateTime = Temporal.PlainDateTime.from("2025-11-30T15:30:00");
			expect(isZonedDateTime(dateTime)).toBe(false);
		});

		it("should return false for non-Temporal values", () => {
			expect(isZonedDateTime(null)).toBe(false);
			expect(isZonedDateTime({})).toBe(false);
		});
	});

	describe("isInstant", () => {
		it("should return true for Instant", () => {
			const instant = Temporal.Instant.from("2025-11-30T14:30:00Z");
			expect(isInstant(instant)).toBe(true);
		});

		it("should return false for other Temporal types", () => {
			const date = Temporal.PlainDate.from("2025-11-30");
			const dateTime = Temporal.PlainDateTime.from("2025-11-30T15:30:00");
			const zoned = Temporal.ZonedDateTime.from(
				"2025-11-30T15:30:00+01:00[Europe/Berlin]",
			);

			expect(isInstant(date)).toBe(false);
			expect(isInstant(dateTime)).toBe(false);
			expect(isInstant(zoned)).toBe(false);
		});

		it("should return false for non-Temporal values", () => {
			expect(isInstant(null)).toBe(false);
			expect(isInstant({})).toBe(false);
		});
	});

	describe("isPlainTime", () => {
		it("should return true for PlainTime", () => {
			const time = Temporal.PlainTime.from("15:30:00");
			expect(isPlainTime(time)).toBe(true);
		});

		it("should return false for other Temporal types", () => {
			const date = Temporal.PlainDate.from("2025-11-30");
			const dateTime = Temporal.PlainDateTime.from("2025-11-30T15:30:00");

			expect(isPlainTime(date)).toBe(false);
			expect(isPlainTime(dateTime)).toBe(false);
		});

		it("should return false for non-Temporal values", () => {
			expect(isPlainTime(null)).toBe(false);
			expect(isPlainTime("15:30:00")).toBe(false);
			expect(isPlainTime({})).toBe(false);
		});
	});

	describe("isDateLike", () => {
		it("should return true for PlainDate", () => {
			const date = Temporal.PlainDate.from("2025-11-30");
			expect(isDateLike(date)).toBe(true);
		});

		it("should return true for PlainDateTime", () => {
			const dateTime = Temporal.PlainDateTime.from("2025-11-30T15:30:00");
			expect(isDateLike(dateTime)).toBe(true);
		});

		it("should return true for ZonedDateTime", () => {
			const zoned = Temporal.ZonedDateTime.from(
				"2025-11-30T15:30:00+01:00[Europe/Berlin]",
			);
			expect(isDateLike(zoned)).toBe(true);
		});

		it("should return false for Instant", () => {
			const instant = Temporal.Instant.from("2025-11-30T14:30:00Z");
			expect(isDateLike(instant)).toBe(false);
		});

		it("should return false for PlainTime", () => {
			const time = Temporal.PlainTime.from("15:30:00");
			expect(isDateLike(time)).toBe(false);
		});

		it("should return false for non-Temporal values", () => {
			expect(isDateLike(null)).toBe(false);
			expect(isDateLike(undefined)).toBe(false);
			expect(isDateLike("2025-11-30")).toBe(false);
			expect(isDateLike({})).toBe(false);
		});
	});

	describe("isTimeLike", () => {
		it("should return true for PlainTime", () => {
			const time = Temporal.PlainTime.from("15:30:00");
			expect(isTimeLike(time)).toBe(true);
		});

		it("should return true for PlainDateTime", () => {
			const dateTime = Temporal.PlainDateTime.from("2025-11-30T15:30:00");
			expect(isTimeLike(dateTime)).toBe(true);
		});

		it("should return true for ZonedDateTime", () => {
			const zoned = Temporal.ZonedDateTime.from(
				"2025-11-30T15:30:00+01:00[Europe/Berlin]",
			);
			expect(isTimeLike(zoned)).toBe(true);
		});

		it("should return false for PlainDate", () => {
			const date = Temporal.PlainDate.from("2025-11-30");
			expect(isTimeLike(date)).toBe(false);
		});

		it("should return false for Instant", () => {
			const instant = Temporal.Instant.from("2025-11-30T14:30:00Z");
			expect(isTimeLike(instant)).toBe(false);
		});

		it("should return false for non-Temporal values", () => {
			expect(isTimeLike(null)).toBe(false);
			expect(isTimeLike("15:30:00")).toBe(false);
			expect(isTimeLike({})).toBe(false);
		});
	});
});
