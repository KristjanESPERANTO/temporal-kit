import { Temporal } from "temporal-polyfill";
import { describe, expect, it } from "vitest";
import { getTimezoneName, isValidTimezone } from "./index";

describe("Timezone Utilities", () => {
  describe("isValidTimezone", () => {
    it("should return true for valid timezones", () => {
      expect(isValidTimezone("Europe/Berlin")).toBe(true);
      expect(isValidTimezone("UTC")).toBe(true);
      expect(isValidTimezone("America/New_York")).toBe(true);
    });

    it("should return false for invalid timezones", () => {
      expect(isValidTimezone("Invalid/Timezone")).toBe(false);
      expect(isValidTimezone("Not a timezone")).toBe(false);
      expect(isValidTimezone("")).toBe(false);
    });
  });

  describe("getTimezoneName", () => {
    it("should return the canonical ID for a string", () => {
      expect(getTimezoneName("Europe/Berlin")).toBe("Europe/Berlin");
      expect(getTimezoneName("UTC")).toBe("UTC");
    });

    it("should return the ID for a TimeZone object", () => {
      // Mock TimeZone object since Temporal.TimeZone is not exposed in polyfill
      const tz = { id: "Asia/Tokyo" };
      expect(getTimezoneName(tz)).toBe("Asia/Tokyo");
    });

    it("should return the ID for a ZonedDateTime object", () => {
      const zdt = Temporal.ZonedDateTime.from("2024-01-01T12:00:00[Europe/London]");
      expect(getTimezoneName(zdt)).toBe("Europe/London");
    });

    it("should throw for invalid timezone strings", () => {
      expect(() => getTimezoneName("Invalid/Timezone")).toThrow();
    });
  });
});
