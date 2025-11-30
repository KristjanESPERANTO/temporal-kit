import { Temporal } from "temporal-polyfill";
import { describe, expect, it } from "vitest";
import { fromISO, now, toPlainDate, toPlainDateTime, toZonedDateTime } from "./index.js";

describe("Convert Functions", () => {
  describe("now", () => {
    it("should return current ZonedDateTime in system timezone", () => {
      const result = now();
      expect(result).toBeInstanceOf(Temporal.ZonedDateTime);
      expect(result.year).toBeGreaterThan(2024);
      expect(result.timeZoneId).toBeTruthy();
    });
  });

  describe("fromISO", () => {
    it("should detect date format and return PlainDate", () => {
      const result = fromISO("2025-11-30");
      expect(result).toBeInstanceOf(Temporal.PlainDate);
      expect(result.toString()).toBe("2025-11-30");
    });

    it("should detect datetime format and return PlainDateTime", () => {
      const result = fromISO("2025-11-30T15:30:00");
      expect(result).toBeInstanceOf(Temporal.PlainDateTime);
      expect(result.toString()).toBe("2025-11-30T15:30:00");
    });

    it("should detect zoned format and return ZonedDateTime", () => {
      const result = fromISO("2025-11-30T15:30:00+01:00[Europe/Berlin]");
      expect(result).toBeInstanceOf(Temporal.ZonedDateTime);
      if (result instanceof Temporal.ZonedDateTime) {
        expect(result.timeZoneId).toBe("Europe/Berlin");
      }
    });

    it("should detect instant format and return Instant", () => {
      const result = fromISO("2025-11-30T15:30:00Z");
      expect(result).toBeInstanceOf(Temporal.Instant);
    });

    it("should handle instant format with milliseconds", () => {
      const result = fromISO("2025-11-30T15:30:00.123Z");
      expect(result).toBeInstanceOf(Temporal.Instant);
    });
  });

  describe("toPlainDate", () => {
    it("should convert PlainDate to PlainDate (no-op)", () => {
      const input = Temporal.PlainDate.from("2025-11-30");
      const result = toPlainDate(input);
      expect(result).toBeInstanceOf(Temporal.PlainDate);
      expect(result.toString()).toBe("2025-11-30");
    });

    it("should convert PlainDateTime to PlainDate", () => {
      const input = Temporal.PlainDateTime.from("2025-11-30T15:30:00");
      const result = toPlainDate(input);
      expect(result).toBeInstanceOf(Temporal.PlainDate);
      expect(result.toString()).toBe("2025-11-30");
    });

    it("should convert ZonedDateTime to PlainDate", () => {
      const input = Temporal.ZonedDateTime.from("2025-11-30T15:30:00+01:00[Europe/Berlin]");
      const result = toPlainDate(input);
      expect(result).toBeInstanceOf(Temporal.PlainDate);
      expect(result.toString()).toBe("2025-11-30");
    });
  });

  describe("toPlainDateTime", () => {
    it("should convert PlainDateTime to PlainDateTime (no-op)", () => {
      const input = Temporal.PlainDateTime.from("2025-11-30T15:30:00");
      const result = toPlainDateTime(input);
      expect(result).toBeInstanceOf(Temporal.PlainDateTime);
      expect(result.toString()).toBe("2025-11-30T15:30:00");
    });

    it("should convert ZonedDateTime to PlainDateTime", () => {
      const input = Temporal.ZonedDateTime.from("2025-11-30T15:30:00+01:00[Europe/Berlin]");
      const result = toPlainDateTime(input);
      expect(result).toBeInstanceOf(Temporal.PlainDateTime);
      expect(result.toString()).toBe("2025-11-30T15:30:00");
    });
  });

  describe("toZonedDateTime", () => {
    it("should convert PlainDate to ZonedDateTime (midnight in timezone)", () => {
      const input = Temporal.PlainDate.from("2025-11-30");
      const result = toZonedDateTime(input, "Europe/Berlin");
      expect(result).toBeInstanceOf(Temporal.ZonedDateTime);
      expect(result.timeZoneId).toBe("Europe/Berlin");
      expect(result.toString()).toContain("2025-11-30");
    });

    it("should convert PlainDateTime to ZonedDateTime", () => {
      const input = Temporal.PlainDateTime.from("2025-11-30T15:30:00");
      const result = toZonedDateTime(input, "America/New_York");
      expect(result).toBeInstanceOf(Temporal.ZonedDateTime);
      expect(result.timeZoneId).toBe("America/New_York");
      expect(result.toString()).toContain("2025-11-30");
      expect(result.toString()).toContain("15:30:00");
    });

    it("should convert ZonedDateTime to different timezone", () => {
      const input = Temporal.ZonedDateTime.from("2025-11-30T15:30:00+01:00[Europe/Berlin]");
      const result = toZonedDateTime(input, "America/New_York");
      expect(result).toBeInstanceOf(Temporal.ZonedDateTime);
      expect(result.timeZoneId).toBe("America/New_York");
      // Time should be different due to timezone conversion
      expect(result.toString()).not.toBe(input.toString());
    });

    it("should require timezone for PlainDate/PlainDateTime", () => {
      const input = Temporal.PlainDate.from("2025-11-30");
      expect(() => toZonedDateTime(input)).toThrow(
        "timeZone is required when converting PlainDate or PlainDateTime to ZonedDateTime",
      );
    });

    it("should not require timezone when converting existing ZonedDateTime", () => {
      const input = Temporal.ZonedDateTime.from("2025-11-30T15:30:00+01:00[Europe/Berlin]");
      const result = toZonedDateTime(input);
      expect(result).toBeInstanceOf(Temporal.ZonedDateTime);
      expect(result.timeZoneId).toBe("Europe/Berlin");
    });
  });
});
