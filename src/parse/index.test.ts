import { Temporal } from "temporal-polyfill";
import { describe, expect, it } from "vitest";
import { parse, parseDate, parseDateTime, parseTime } from "./index.js";

describe("parse", () => {
  describe("ISO 8601 formats", () => {
    it("parses ISO date string as PlainDate", () => {
      const result = parse("2025-11-30");
      expect(result).toBeInstanceOf(Temporal.PlainDate);
      expect(result.toString()).toBe("2025-11-30");
    });

    it("parses ISO datetime string as PlainDateTime", () => {
      const result = parse("2025-11-30T15:30:00");
      expect(result).toBeInstanceOf(Temporal.PlainDateTime);
      expect(result.toString()).toBe("2025-11-30T15:30:00");
    });

    it("parses ISO datetime with milliseconds", () => {
      const result = parse("2025-11-30T15:30:00.123");
      expect(result).toBeInstanceOf(Temporal.PlainDateTime);
      expect(result.toString()).toBe("2025-11-30T15:30:00.123");
    });

    it("parses ISO instant (Z suffix) as Instant", () => {
      const result = parse("2025-11-30T15:30:00Z");
      expect(result).toBeInstanceOf(Temporal.Instant);
      expect(result.toString()).toBe("2025-11-30T15:30:00Z");
    });

    it("parses ISO instant with milliseconds", () => {
      const result = parse("2025-11-30T15:30:00.123Z");
      expect(result).toBeInstanceOf(Temporal.Instant);
      expect(result.toString()).toBe("2025-11-30T15:30:00.123Z");
    });

    it("parses ISO with offset as Instant", () => {
      const result = parse("2025-11-30T15:30:00+01:00");
      expect(result).toBeInstanceOf(Temporal.Instant);
    });

    it("parses ISO with timezone as ZonedDateTime", () => {
      const result = parse("2025-11-30T15:30:00+01:00[Europe/Berlin]");
      expect(result).toBeInstanceOf(Temporal.ZonedDateTime);
      expect(result.timeZoneId).toBe("Europe/Berlin");
    });

    it("parses time-only string as PlainTime", () => {
      const result = parse("15:30:00");
      expect(result).toBeInstanceOf(Temporal.PlainTime);
      expect(result.toString()).toBe("15:30:00");
    });

    it("parses time without seconds as PlainTime", () => {
      const result = parse("15:30");
      expect(result).toBeInstanceOf(Temporal.PlainTime);
      expect(result.toString()).toBe("15:30:00");
    });

    it("parses time with milliseconds", () => {
      const result = parse("15:30:45.123");
      expect(result).toBeInstanceOf(Temporal.PlainTime);
      expect(result.toString()).toBe("15:30:45.123");
    });
  });

  describe("European date formats (DD.MM.YYYY)", () => {
    it("parses European date format", () => {
      const result = parse("30.11.2025");
      expect(result).toBeInstanceOf(Temporal.PlainDate);
      expect(result.year).toBe(2025);
      expect(result.month).toBe(11);
      expect(result.day).toBe(30);
    });

    it("parses European date with single digit day and month", () => {
      const result = parse("5.3.2025");
      expect(result).toBeInstanceOf(Temporal.PlainDate);
      expect(result.year).toBe(2025);
      expect(result.month).toBe(3);
      expect(result.day).toBe(5);
    });

    it("parses European date at start of year", () => {
      const result = parse("01.01.2025");
      expect(result).toBeInstanceOf(Temporal.PlainDate);
      expect(result.toString()).toBe("2025-01-01");
    });

    it("parses European date at end of year", () => {
      const result = parse("31.12.2025");
      expect(result).toBeInstanceOf(Temporal.PlainDate);
      expect(result.toString()).toBe("2025-12-31");
    });
  });

  describe("US date formats (MM/DD/YYYY)", () => {
    it("parses US date format", () => {
      const result = parse("11/30/2025");
      expect(result).toBeInstanceOf(Temporal.PlainDate);
      expect(result.year).toBe(2025);
      expect(result.month).toBe(11);
      expect(result.day).toBe(30);
    });

    it("parses US date with single digit month and day", () => {
      const result = parse("3/5/2025");
      expect(result).toBeInstanceOf(Temporal.PlainDate);
      expect(result.year).toBe(2025);
      expect(result.month).toBe(3);
      expect(result.day).toBe(5);
    });

    it("parses US date at start of year", () => {
      const result = parse("01/01/2025");
      expect(result).toBeInstanceOf(Temporal.PlainDate);
      expect(result.toString()).toBe("2025-01-01");
    });

    it("parses US date at end of year", () => {
      const result = parse("12/31/2025");
      expect(result).toBeInstanceOf(Temporal.PlainDate);
      expect(result.toString()).toBe("2025-12-31");
    });
  });

  describe("Alternative date formats", () => {
    it("parses DD-MM-YYYY format", () => {
      const result = parse("30-11-2025");
      expect(result).toBeInstanceOf(Temporal.PlainDate);
      expect(result.year).toBe(2025);
      expect(result.month).toBe(11);
      expect(result.day).toBe(30);
    });

    it("parses YYYY/MM/DD format", () => {
      const result = parse("2025/11/30");
      expect(result).toBeInstanceOf(Temporal.PlainDate);
      expect(result.toString()).toBe("2025-11-30");
    });
  });

  describe("12-hour time formats", () => {
    it("parses 12-hour time with AM", () => {
      const result = parse("9:30 AM");
      expect(result).toBeInstanceOf(Temporal.PlainTime);
      expect(result.hour).toBe(9);
      expect(result.minute).toBe(30);
    });

    it("parses 12-hour time with PM", () => {
      const result = parse("3:30 PM");
      expect(result).toBeInstanceOf(Temporal.PlainTime);
      expect(result.hour).toBe(15);
      expect(result.minute).toBe(30);
    });

    it("parses 12:00 AM as midnight", () => {
      const result = parse("12:00 AM");
      expect(result).toBeInstanceOf(Temporal.PlainTime);
      expect(result.hour).toBe(0);
    });

    it("parses 12:00 PM as noon", () => {
      const result = parse("12:00 PM");
      expect(result).toBeInstanceOf(Temporal.PlainTime);
      expect(result.hour).toBe(12);
    });

    it("parses 12-hour time with seconds", () => {
      const result = parse("3:30:45 PM");
      expect(result).toBeInstanceOf(Temporal.PlainTime);
      expect(result.hour).toBe(15);
      expect(result.minute).toBe(30);
      expect(result.second).toBe(45);
    });

    it("parses 12-hour time with lowercase am/pm", () => {
      const result = parse("3:30 pm");
      expect(result).toBeInstanceOf(Temporal.PlainTime);
      expect(result.hour).toBe(15);
    });
  });

  describe("DateTime combinations", () => {
    it("parses ISO date with space and time", () => {
      const result = parse("2025-11-30 15:30:00");
      expect(result).toBeInstanceOf(Temporal.PlainDateTime);
      expect(result.year).toBe(2025);
      expect(result.month).toBe(11);
      expect(result.day).toBe(30);
      expect(result.hour).toBe(15);
      expect(result.minute).toBe(30);
      expect(result.second).toBe(0);
    });

    it("parses European date with time", () => {
      const result = parse("30.11.2025 15:30");
      expect(result).toBeInstanceOf(Temporal.PlainDateTime);
      expect(result.year).toBe(2025);
      expect(result.month).toBe(11);
      expect(result.day).toBe(30);
      expect(result.hour).toBe(15);
      expect(result.minute).toBe(30);
    });

    it("parses US date with time", () => {
      const result = parse("11/30/2025 3:30 PM");
      expect(result).toBeInstanceOf(Temporal.PlainDateTime);
      expect(result.year).toBe(2025);
      expect(result.month).toBe(11);
      expect(result.day).toBe(30);
      expect(result.hour).toBe(15);
      expect(result.minute).toBe(30);
    });

    it("parses date with 12-hour time", () => {
      const result = parse("2025-11-30 9:00 AM");
      expect(result).toBeInstanceOf(Temporal.PlainDateTime);
      expect(result.hour).toBe(9);
    });
  });

  describe("Whitespace handling", () => {
    it("trims leading whitespace", () => {
      const result = parse("  2025-11-30");
      expect(result).toBeInstanceOf(Temporal.PlainDate);
      expect(result.toString()).toBe("2025-11-30");
    });

    it("trims trailing whitespace", () => {
      const result = parse("2025-11-30  ");
      expect(result).toBeInstanceOf(Temporal.PlainDate);
      expect(result.toString()).toBe("2025-11-30");
    });

    it("trims both leading and trailing whitespace", () => {
      const result = parse("  15:30:00  ");
      expect(result).toBeInstanceOf(Temporal.PlainTime);
      expect(result.toString()).toBe("15:30:00");
    });
  });

  describe("Error handling", () => {
    it("throws for invalid date string", () => {
      expect(() => parse("not a date")).toThrow(RangeError);
      expect(() => parse("not a date")).toThrow(/Unable to parse/);
    });

    it("throws for invalid format", () => {
      expect(() => parse("2025/13/40")).toThrow(RangeError);
    });

    it("throws for empty string", () => {
      expect(() => parse("")).toThrow(RangeError);
    });

    it("throws with helpful error message", () => {
      expect(() => parse("invalid")).toThrow(
        /Expected ISO 8601 format or common date\/time format/,
      );
    });

    it("includes example formats in error message", () => {
      expect(() => parse("xyz")).toThrow(/2025-11-30/);
      expect(() => parse("xyz")).toThrow(/30.11.2025/);
      expect(() => parse("xyz")).toThrow(/15:30:00/);
    });
  });
});

describe("parseDate", () => {
  it("parses ISO date", () => {
    const result = parseDate("2025-11-30");
    expect(result).toBeInstanceOf(Temporal.PlainDate);
    expect(result.toString()).toBe("2025-11-30");
  });

  it("parses European format", () => {
    const result = parseDate("30.11.2025");
    expect(result.year).toBe(2025);
    expect(result.month).toBe(11);
    expect(result.day).toBe(30);
  });

  it("parses US format", () => {
    const result = parseDate("11/30/2025");
    expect(result.year).toBe(2025);
    expect(result.month).toBe(11);
    expect(result.day).toBe(30);
  });

  it("parses DD-MM-YYYY format", () => {
    const result = parseDate("30-11-2025");
    expect(result.year).toBe(2025);
    expect(result.month).toBe(11);
    expect(result.day).toBe(30);
  });

  it("parses YYYY/MM/DD format", () => {
    const result = parseDate("2025/11/30");
    expect(result.toString()).toBe("2025-11-30");
  });

  it("handles leap year date", () => {
    const result = parseDate("29.02.2024");
    expect(result.year).toBe(2024);
    expect(result.month).toBe(2);
    expect(result.day).toBe(29);
  });

  it("throws for invalid date", () => {
    expect(() => parseDate("invalid")).toThrow(RangeError);
    expect(() => parseDate("invalid")).toThrow(/Unable to parse.*as date/);
  });

  it("throws for time string", () => {
    expect(() => parseDate("15:30:00")).toThrow(RangeError);
  });

  it("includes expected formats in error message", () => {
    expect(() => parseDate("xyz")).toThrow(/YYYY-MM-DD/);
    expect(() => parseDate("xyz")).toThrow(/DD.MM.YYYY/);
    expect(() => parseDate("xyz")).toThrow(/MM\/DD\/YYYY/);
  });
});

describe("parseTime", () => {
  it("parses ISO time with seconds", () => {
    const result = parseTime("15:30:45");
    expect(result).toBeInstanceOf(Temporal.PlainTime);
    expect(result.hour).toBe(15);
    expect(result.minute).toBe(30);
    expect(result.second).toBe(45);
  });

  it("parses time without seconds", () => {
    const result = parseTime("15:30");
    expect(result.hour).toBe(15);
    expect(result.minute).toBe(30);
    expect(result.second).toBe(0);
  });

  it("parses 12-hour format with AM", () => {
    const result = parseTime("9:30 AM");
    expect(result.hour).toBe(9);
    expect(result.minute).toBe(30);
  });

  it("parses 12-hour format with PM", () => {
    const result = parseTime("3:30 PM");
    expect(result.hour).toBe(15);
    expect(result.minute).toBe(30);
  });

  it("parses midnight as 12:00 AM", () => {
    const result = parseTime("12:00 AM");
    expect(result.hour).toBe(0);
  });

  it("parses noon as 12:00 PM", () => {
    const result = parseTime("12:00 PM");
    expect(result.hour).toBe(12);
  });

  it("parses time with milliseconds", () => {
    const result = parseTime("15:30:45.123");
    expect(result.hour).toBe(15);
    expect(result.minute).toBe(30);
    expect(result.second).toBe(45);
    expect(result.millisecond).toBe(123);
  });

  it("parses single digit hour", () => {
    const result = parseTime("9:30");
    expect(result.hour).toBe(9);
  });

  it("throws for invalid time", () => {
    expect(() => parseTime("invalid")).toThrow(RangeError);
    expect(() => parseTime("invalid")).toThrow(/Unable to parse.*as time/);
  });

  it("throws for date string", () => {
    expect(() => parseTime("2025-11-30")).toThrow(RangeError);
  });

  it("throws for invalid hour", () => {
    expect(() => parseTime("25:00")).toThrow(RangeError);
  });

  it("throws for invalid minute", () => {
    expect(() => parseTime("15:70")).toThrow(RangeError);
  });

  it("includes expected formats in error message", () => {
    expect(() => parseTime("xyz")).toThrow(/HH:MM:SS/);
    expect(() => parseTime("xyz")).toThrow(/HH:MM/);
    expect(() => parseTime("xyz")).toThrow(/AM\/PM/);
  });
});

describe("parseDateTime", () => {
  it("parses ISO datetime", () => {
    const result = parseDateTime("2025-11-30T15:30:00");
    expect(result).toBeInstanceOf(Temporal.PlainDateTime);
    expect(result.year).toBe(2025);
    expect(result.month).toBe(11);
    expect(result.day).toBe(30);
    expect(result.hour).toBe(15);
    expect(result.minute).toBe(30);
    expect(result.second).toBe(0);
  });

  it("parses space-separated datetime", () => {
    const result = parseDateTime("2025-11-30 15:30:00");
    expect(result.year).toBe(2025);
    expect(result.hour).toBe(15);
  });

  it("parses European date with time", () => {
    const result = parseDateTime("30.11.2025 15:30");
    expect(result.year).toBe(2025);
    expect(result.month).toBe(11);
    expect(result.day).toBe(30);
    expect(result.hour).toBe(15);
    expect(result.minute).toBe(30);
  });

  it("parses US date with time", () => {
    const result = parseDateTime("11/30/2025 15:30");
    expect(result.year).toBe(2025);
    expect(result.month).toBe(11);
    expect(result.day).toBe(30);
    expect(result.hour).toBe(15);
  });

  it("parses date with 12-hour time", () => {
    const result = parseDateTime("2025-11-30 3:30 PM");
    expect(result.hour).toBe(15);
    expect(result.minute).toBe(30);
  });

  it("parses European date with 12-hour time", () => {
    const result = parseDateTime("30.11.2025 9:00 AM");
    expect(result.year).toBe(2025);
    expect(result.hour).toBe(9);
  });

  it("parses with milliseconds", () => {
    const result = parseDateTime("2025-11-30T15:30:45.123");
    expect(result.millisecond).toBe(123);
  });

  it("throws for invalid datetime", () => {
    expect(() => parseDateTime("invalid")).toThrow(RangeError);
    expect(() => parseDateTime("invalid")).toThrow(/Unable to parse.*as datetime/);
  });

  it("throws for date-only string", () => {
    expect(() => parseDateTime("2025-11-30")).toThrow(RangeError);
  });

  it("throws for time-only string", () => {
    expect(() => parseDateTime("15:30:00")).toThrow(RangeError);
  });

  it("includes expected formats in error message", () => {
    expect(() => parseDateTime("xyz")).toThrow(/YYYY-MM-DDTHH:MM:SS/);
    expect(() => parseDateTime("xyz")).toThrow(/YYYY-MM-DD HH:MM:SS/);
    expect(() => parseDateTime("xyz")).toThrow(/DD.MM.YYYY HH:MM/);
  });
});

describe("Edge cases", () => {
  it("handles leap year date correctly", () => {
    const result = parseDate("2024-02-29");
    expect(result.year).toBe(2024);
    expect(result.month).toBe(2);
    expect(result.day).toBe(29);
  });

  it("rejects invalid leap year date", () => {
    expect(() => parseDate("2025-02-29")).toThrow(RangeError);
  });

  it("handles end of month correctly", () => {
    const jan = parseDate("31.01.2025");
    expect(jan.day).toBe(31);

    const apr = parseDate("30.04.2025");
    expect(apr.day).toBe(30);
  });

  it("rejects invalid day for month", () => {
    expect(() => parseDate("31.04.2025")).toThrow(RangeError); // April has 30 days
    expect(() => parseDate("31.02.2025")).toThrow(RangeError); // Feb has 28/29 days
  });

  it("handles year boundaries", () => {
    const startOfYear = parseDate("01.01.2025");
    expect(startOfYear.toString()).toBe("2025-01-01");

    const endOfYear = parseDate("31.12.2025");
    expect(endOfYear.toString()).toBe("2025-12-31");
  });

  it("handles time boundaries", () => {
    const midnight = parseTime("00:00:00");
    expect(midnight.hour).toBe(0);
    expect(midnight.minute).toBe(0);

    const endOfDay = parseTime("23:59:59");
    expect(endOfDay.hour).toBe(23);
    expect(endOfDay.minute).toBe(59);
    expect(endOfDay.second).toBe(59);
  });
});
