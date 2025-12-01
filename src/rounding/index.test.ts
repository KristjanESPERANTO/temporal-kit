import { Temporal } from "temporal-polyfill";
import { describe, expect, it } from "vitest";
import { ceil, floor, round } from "./index.js";

describe("rounding", () => {
  describe("floor", () => {
    it("floors PlainDateTime to hour", () => {
      const dt = Temporal.PlainDateTime.from("2025-01-01T15:30:45");
      const result = floor(dt, "hour");
      expect(result.toString()).toBe("2025-01-01T15:00:00");
    });

    it("floors PlainTime to minute", () => {
      const time = Temporal.PlainTime.from("15:30:45");
      const result = floor(time, "minute");
      expect(result.toString()).toBe("15:30:00");
    });

    it("floors ZonedDateTime to hour", () => {
      const zdt = Temporal.ZonedDateTime.from("2025-01-01T15:30:45+01:00[Europe/Berlin]");
      const result = floor(zdt, "hour");
      expect(result.toString()).toBe("2025-01-01T15:00:00+01:00[Europe/Berlin]");
    });

    it("floors Duration to minute", () => {
      const duration = Temporal.Duration.from("PT1H30M45S");
      const result = floor(duration, "minute");
      expect(result.toString()).toBe("PT1H30M");
    });
  });

  describe("ceil", () => {
    it("ceils PlainDateTime to hour", () => {
      const dt = Temporal.PlainDateTime.from("2025-01-01T15:30:45");
      const result = ceil(dt, "hour");
      expect(result.toString()).toBe("2025-01-01T16:00:00");
    });

    it("ceils PlainTime to minute", () => {
      const time = Temporal.PlainTime.from("15:30:45");
      const result = ceil(time, "minute");
      expect(result.toString()).toBe("15:31:00");
    });
  });

  describe("round", () => {
    it("rounds to nearest hour (halfExpand default)", () => {
      const dt1 = Temporal.PlainDateTime.from("2025-01-01T15:29:00");
      const dt2 = Temporal.PlainDateTime.from("2025-01-01T15:31:00");

      expect(round(dt1, "hour").toString()).toBe("2025-01-01T15:00:00");
      expect(round(dt2, "hour").toString()).toBe("2025-01-01T16:00:00");
    });

    it("supports custom rounding increment", () => {
      const time = Temporal.PlainTime.from("15:12:00");
      // Round to nearest 15 minutes
      const result = round(time, "minute", { roundingIncrement: 15 });
      expect(result.toString()).toBe("15:15:00");
    });

    it("supports custom rounding mode", () => {
      const time = Temporal.PlainTime.from("15:30:00");
      // Round to hour with ceil
      const result = round(time, "hour", { roundingMode: "ceil" });
      expect(result.toString()).toBe("16:00:00");
    });
  });
});
