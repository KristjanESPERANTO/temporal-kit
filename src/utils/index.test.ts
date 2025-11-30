import { describe, expect, it } from "vitest";
import { Temporal } from "temporal-polyfill";
import { pipe, compose } from "./index.js";
import { add } from "../math/index.js";
import { toPlainDate, toPlainDateTime } from "../convert/index.js";
import { isBefore } from "../compare/index.js";

describe("Utils Functions", () => {
	describe("pipe", () => {
		it("should execute functions left to right", () => {
			const addDays = (d: Temporal.PlainDate) => add(d, { days: 5 });
			const addWeeks = (d: Temporal.PlainDate) => add(d, { weeks: 1 });

			const result = pipe(
				Temporal.PlainDate.from("2025-11-30"),
				addDays,
				addWeeks,
			);

			// 2025-11-30 + 5 days = 2025-12-05 + 1 week = 2025-12-12
			expect(result.toString()).toBe("2025-12-12");
		});

		it("should work with single function", () => {
			const addDays = (d: Temporal.PlainDate) => add(d, { days: 3 });

			const result = pipe(Temporal.PlainDate.from("2025-11-30"), addDays);

			expect(result.toString()).toBe("2025-12-03");
		});

		it("should work with multiple operations", () => {
			const toDate = (d: Temporal.ZonedDateTime) => toPlainDate(d);
			const addMonth = (d: Temporal.PlainDate) => add(d, { months: 1 });

			const result = pipe(
				Temporal.ZonedDateTime.from("2025-11-30T15:30:00+01:00[Europe/Berlin]"),
				toDate,
				addMonth,
			);

			expect(result.toString()).toBe("2025-12-30");
		});

		it("should handle type transformations", () => {
			const dt = Temporal.PlainDateTime.from("2025-11-30T00:00:00");
			const toDate = (d: Temporal.PlainDateTime) => toPlainDate(d);
			const addDays = (d: Temporal.PlainDate) => add(d, { days: 5 });

			const result = pipe(dt, toDate, addDays);

			expect(result.toString()).toBe("2025-12-05");
		});

		it("should work in comparison chains", () => {
			const date1 = Temporal.PlainDate.from("2025-11-30");
			const date2 = Temporal.PlainDate.from("2025-12-05");
			const addDays = (d: Temporal.PlainDate) => add(d, { days: 3 });

			const modifiedDate = pipe(date1, addDays);
			const isEarlier = isBefore(modifiedDate, date2);

			expect(modifiedDate.toString()).toBe("2025-12-03");
			expect(isEarlier).toBe(true);
		});
	});

	describe("compose", () => {
		it("should execute functions right to left", () => {
			const addDays = (d: Temporal.PlainDate) => add(d, { days: 5 });
			const addWeeks = (d: Temporal.PlainDate) => add(d, { weeks: 1 });

			const result = compose(
				addWeeks, // Applied second
				addDays, // Applied first
			)(Temporal.PlainDate.from("2025-11-30"));

			// Same result as pipe(date, addDays, addWeeks)
			expect(result.toString()).toBe("2025-12-12");
		});

		it("should work with single function", () => {
			const addDays = (d: Temporal.PlainDate) => add(d, { days: 3 });

			const result = compose(addDays)(Temporal.PlainDate.from("2025-11-30"));

			expect(result.toString()).toBe("2025-12-03");
		});

		it("should create reusable composed functions", () => {
			const toDate = (d: Temporal.ZonedDateTime) => toPlainDate(d);
			const addMonth = (d: Temporal.PlainDate) => add(d, { months: 1 });

			const processZonedDate = compose(addMonth, toDate);

			const result1 = processZonedDate(
				Temporal.ZonedDateTime.from("2025-11-30T15:30:00+01:00[Europe/Berlin]"),
			);
			const result2 = processZonedDate(
				Temporal.ZonedDateTime.from("2025-10-15T10:00:00+02:00[Europe/Berlin]"),
			);

			expect(result1.toString()).toBe("2025-12-30");
			expect(result2.toString()).toBe("2025-11-15");
		});

		it("should handle type transformations", () => {
			const toDate = (d: Temporal.PlainDateTime) => toPlainDate(d);
			const addDays = (d: Temporal.PlainDate) => add(d, { days: 5 });

			const transform = compose(addDays, toDate);
			const result = transform(
				Temporal.PlainDateTime.from("2025-11-30T00:00:00"),
			);

			expect(result.toString()).toBe("2025-12-05");
		});

		it("should work with complex chains", () => {
			const date = Temporal.PlainDate.from("2025-11-30");
			const addDays = (d: Temporal.PlainDate) => add(d, { days: 10 });
			const addWeeks = (d: Temporal.PlainDate) => add(d, { weeks: 2 });
			const addMonths = (d: Temporal.PlainDate) => add(d, { months: 1 });

			const transform = compose(addMonths, addWeeks, addDays);
			const result = transform(date);

			// Applied in order: addDays, addWeeks, addMonths
			// 2025-11-30 + 10 days = 2025-12-10
			// 2025-12-10 + 2 weeks = 2025-12-24
			// 2025-12-24 + 1 month = 2026-01-24
			expect(result.toString()).toBe("2026-01-24");
		});
	});

	describe("pipe vs compose", () => {
		it("should produce same result with reversed function order", () => {
			const addDays = (d: Temporal.PlainDate) => add(d, { days: 5 });
			const addWeeks = (d: Temporal.PlainDate) => add(d, { weeks: 1 });
			const date = Temporal.PlainDate.from("2025-11-30");

			const pipeResult = pipe(date, addDays, addWeeks);
			const composeResult = compose(addWeeks, addDays)(date);

			expect(pipeResult.toString()).toBe(composeResult.toString());
			expect(pipeResult.toString()).toBe("2025-12-12");
		});
	});
});
