import { describe, expect, it } from "vitest";
import {
  isValidDateString,
  isValidDateTimeString,
  isValidInstantString,
  isValidTimeString,
  isValidZonedString,
} from "./index.js";

describe("validation", () => {
  describe("isValidDateString", () => {
    it("returns true for valid ISO dates", () => {
      expect(isValidDateString("2025-01-01")).toBe(true);
      expect(isValidDateString("2025-12-31")).toBe(true);
    });

    it("returns false for invalid dates", () => {
      expect(isValidDateString("2025-13-01")).toBe(false); // Invalid month
      expect(isValidDateString("2025-02-30")).toBe(false); // Invalid day
      expect(isValidDateString("invalid")).toBe(false);
    });
  });

  describe("isValidTimeString", () => {
    it("returns true for valid ISO times", () => {
      expect(isValidTimeString("15:30:00")).toBe(true);
      expect(isValidTimeString("00:00:00")).toBe(true);
      expect(isValidTimeString("23:59:59")).toBe(true);
    });

    it("returns false for invalid times", () => {
      expect(isValidTimeString("25:00:00")).toBe(false); // Invalid hour
      expect(isValidTimeString("15:60:00")).toBe(false); // Invalid minute
      expect(isValidTimeString("invalid")).toBe(false);
    });
  });

  describe("isValidDateTimeString", () => {
    it("returns true for valid ISO date-times", () => {
      expect(isValidDateTimeString("2025-01-01T15:30:00")).toBe(true);
      expect(isValidDateTimeString("2025-01-01 15:30:00")).toBe(true); // Temporal accepts space separator
    });

    it("returns false for invalid date-times", () => {
      expect(isValidDateTimeString("2025-13-01T15:30:00")).toBe(false);
      expect(isValidDateTimeString("2025-01-01T25:00:00")).toBe(false);
      expect(isValidDateTimeString("invalid")).toBe(false);
    });
  });

  describe("isValidInstantString", () => {
    it("returns true for valid instant strings", () => {
      expect(isValidInstantString("2025-12-31T15:30:00Z")).toBe(true);
      expect(isValidInstantString("2025-12-31T15:30:00+02:00")).toBe(true);
      expect(isValidInstantString("2025-12-31T00:00:00.000Z")).toBe(true);
    });

    it("returns false for strings without UTC offset", () => {
      expect(isValidInstantString("2025-12-31")).toBe(false);
      expect(isValidInstantString("2025-12-31T15:30:00")).toBe(false);
      expect(isValidInstantString("invalid")).toBe(false);
    });
  });

  describe("isValidZonedString", () => {
    it("returns true for valid zoned date-time strings", () => {
      expect(isValidZonedString("2025-12-31T15:30:00+01:00[Europe/Berlin]")).toBe(true);
      expect(isValidZonedString("2025-01-01T00:00:00+00:00[UTC]")).toBe(true);
    });

    it("returns false for strings without IANA timezone identifier", () => {
      expect(isValidZonedString("2025-12-31T15:30:00Z")).toBe(false);
      expect(isValidZonedString("2025-12-31T15:30:00+01:00")).toBe(false);
      expect(isValidZonedString("2025-12-31")).toBe(false);
      expect(isValidZonedString("invalid")).toBe(false);
    });
  });
});
