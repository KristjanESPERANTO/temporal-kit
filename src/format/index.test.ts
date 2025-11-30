import { Temporal } from "temporal-polyfill";
import { describe, expect, it } from "vitest";
import { format, formatDateTime, formatRelative, formatTime } from "./index.js";

describe("format", () => {
  const date = Temporal.PlainDate.from("2025-11-30");

  describe("PlainDate", () => {
    it("formats with default options (medium)", () => {
      const result = format(date);
      expect(result).toMatch(/Nov.*30.*2025/); // Locale-independent check
    });

    it("formats with short style", () => {
      const result = format(date, { dateStyle: "short" });
      expect(result).toContain("11");
      expect(result).toContain("30");
    });

    it("formats with long style", () => {
      const result = format(date, { dateStyle: "long" });
      expect(result).toContain("November");
    });

    it("formats with full style", () => {
      const result = format(date, { dateStyle: "full" });
      expect(result).toContain("Sunday");
      expect(result).toContain("November");
    });

    it("formats with specific locale (en-US)", () => {
      const result = format(date, { locale: "en-US" });
      expect(result).toMatch(/Nov.*30.*2025/);
    });

    it("formats with specific locale (de-DE)", () => {
      const result = format(date, { locale: "de-DE" });
      expect(result).toBe("30.11.2025");
    });

    it("formats with custom options", () => {
      const result = format(date, {
        options: { year: "numeric", month: "long" },
      });
      expect(result).toContain("November");
      expect(result).toContain("2025");
    });
  });

  describe("PlainDateTime", () => {
    const dt = Temporal.PlainDateTime.from("2025-11-30T15:30:45");

    it("formats PlainDateTime (date only)", () => {
      const result = format(dt);
      expect(result).toMatch(/Nov.*30.*2025/);
    });

    it("formats PlainDateTime with different locales", () => {
      const result = format(dt, { locale: "de-DE" });
      expect(result).toBe("30.11.2025");
    });
  });

  describe("ZonedDateTime", () => {
    const zdt = Temporal.ZonedDateTime.from("2025-11-30T15:30:45+01:00[Europe/Berlin]");

    it("formats ZonedDateTime", () => {
      const result = format(zdt);
      expect(result).toMatch(/Nov.*30.*2025/);
    });

    it("preserves timezone information", () => {
      const result = format(zdt, { locale: "de-DE" });
      expect(result).toBe("30.11.2025");
    });
  });
});

describe("formatTime", () => {
  describe("PlainTime", () => {
    const time = Temporal.PlainTime.from("15:30:45");

    it("formats with default options (medium)", () => {
      const result = formatTime(time);
      expect(result).toMatch(/3:30:45.*PM/);
    });

    it("formats with short style", () => {
      const result = formatTime(time, { timeStyle: "short" });
      expect(result).toMatch(/3:30.*PM/);
    });

    it("formats with medium style", () => {
      const result = formatTime(time, { timeStyle: "medium" });
      expect(result).toMatch(/3:30:45.*PM/);
    });

    it("formats with long style", () => {
      const result = formatTime(time, { timeStyle: "long" });
      expect(result).toContain("3:30:45");
    });

    it("formats with specific locale (en-US)", () => {
      const result = formatTime(time, { locale: "en-US" });
      expect(result).toMatch(/3:30:45.*PM/);
    });

    it("formats with specific locale (de-DE)", () => {
      const result = formatTime(time, { locale: "de-DE" });
      expect(result).toBe("15:30:45");
    });
  });

  describe("PlainDateTime", () => {
    const dt = Temporal.PlainDateTime.from("2025-11-30T15:30:45");

    it("formats PlainDateTime time", () => {
      const result = formatTime(dt);
      expect(result).toMatch(/3:30:45.*PM/);
    });

    it("formats with different locales", () => {
      const result = formatTime(dt, { locale: "de-DE" });
      expect(result).toBe("15:30:45");
    });
  });

  describe("ZonedDateTime", () => {
    const zdt = Temporal.ZonedDateTime.from("2025-11-30T15:30:45+01:00[Europe/Berlin]");

    it("formats ZonedDateTime time", () => {
      const result = formatTime(zdt);
      expect(result).toMatch(/3:30:45.*PM/);
    });
  });
});

describe("formatDateTime", () => {
  describe("PlainDateTime", () => {
    const dt = Temporal.PlainDateTime.from("2025-11-30T15:30:45");

    it("formats with default options", () => {
      const result = formatDateTime(dt);
      expect(result).toMatch(/Nov.*30.*2025.*3:30:45.*PM/);
    });

    it("formats with short date and time", () => {
      const result = formatDateTime(dt, {
        dateStyle: "short",
        timeStyle: "short",
      });
      expect(result).toContain("11/30");
      expect(result).toMatch(/3:30.*PM/);
    });

    it("formats with long date and medium time", () => {
      const result = formatDateTime(dt, {
        dateStyle: "long",
        timeStyle: "medium",
      });
      expect(result).toContain("November 30, 2025");
      expect(result).toMatch(/3:30:45.*PM/);
    });

    it("formats with full date and time", () => {
      const result = formatDateTime(dt, {
        dateStyle: "full",
        timeStyle: "full",
      });
      expect(result).toContain("Sunday");
      expect(result).toContain("November 30, 2025");
    });

    it("formats with specific locale (de-DE)", () => {
      const result = formatDateTime(dt, { locale: "de-DE" });
      expect(result).toBe("30.11.2025, 15:30:45");
    });
  });

  describe("PlainDate", () => {
    const date = Temporal.PlainDate.from("2025-11-30");

    it("formats PlainDate with time (uses midnight)", () => {
      const result = formatDateTime(date);
      expect(result).toMatch(/Nov.*30.*2025/);
      // Should show midnight time
      expect(result).toMatch(/12:00:00.*AM/);
    });
  });

  describe("ZonedDateTime", () => {
    const zdt = Temporal.ZonedDateTime.from("2025-11-30T15:30:45+01:00[Europe/Berlin]");

    it("formats ZonedDateTime", () => {
      const result = formatDateTime(zdt);
      expect(result).toMatch(/Nov.*30.*2025.*3:30:45.*PM/);
    });

    it("formats with locale preserving timezone", () => {
      const result = formatDateTime(zdt, { locale: "de-DE" });
      expect(result).toBe("30.11.2025, 15:30:45");
    });
  });
});

describe("formatRelative", () => {
  const base = Temporal.PlainDate.from("2025-11-30");

  describe("past dates", () => {
    it("formats yesterday", () => {
      const yesterday = base.subtract({ days: 1 });
      const result = formatRelative(yesterday, base);
      expect(result).toBe("yesterday");
    });

    it("formats 2 days ago", () => {
      const twoDaysAgo = base.subtract({ days: 2 });
      const result = formatRelative(twoDaysAgo, base);
      expect(result).toBe("2 days ago");
    });

    it("formats last week", () => {
      const lastWeek = base.subtract({ days: 7 });
      const result = formatRelative(lastWeek, base);
      expect(result).toBe("last week");
    });

    it("formats 2 weeks ago", () => {
      const twoWeeksAgo = base.subtract({ days: 14 });
      const result = formatRelative(twoWeeksAgo, base);
      expect(result).toBe("2 weeks ago");
    });

    it("formats last month", () => {
      const lastMonth = base.subtract({ days: 30 });
      const result = formatRelative(lastMonth, base);
      expect(result).toBe("last month");
    });

    it("formats 3 months ago", () => {
      const threeMonthsAgo = base.subtract({ days: 90 });
      const result = formatRelative(threeMonthsAgo, base);
      expect(result).toBe("3 months ago");
    });

    it("formats last year", () => {
      const lastYear = base.subtract({ days: 365 });
      const result = formatRelative(lastYear, base);
      expect(result).toBe("last year");
    });
  });

  describe("future dates", () => {
    it("formats tomorrow", () => {
      const tomorrow = base.add({ days: 1 });
      const result = formatRelative(tomorrow, base);
      expect(result).toBe("tomorrow");
    });

    it("formats in 2 days", () => {
      const inTwoDays = base.add({ days: 2 });
      const result = formatRelative(inTwoDays, base);
      expect(result).toBe("in 2 days");
    });

    it("formats next week", () => {
      const nextWeek = base.add({ days: 7 });
      const result = formatRelative(nextWeek, base);
      expect(result).toBe("next week");
    });

    it("formats in 2 weeks", () => {
      const inTwoWeeks = base.add({ days: 14 });
      const result = formatRelative(inTwoWeeks, base);
      expect(result).toBe("in 2 weeks");
    });

    it("formats next month", () => {
      const nextMonth = base.add({ days: 30 });
      const result = formatRelative(nextMonth, base);
      expect(result).toBe("next month");
    });

    it("formats in 3 months", () => {
      const inThreeMonths = base.add({ days: 90 });
      const result = formatRelative(inThreeMonths, base);
      expect(result).toBe("in 3 months");
    });

    it("formats next year", () => {
      const nextYear = base.add({ days: 365 });
      const result = formatRelative(nextYear, base);
      expect(result).toBe("next year");
    });
  });

  describe("today", () => {
    it("formats today", () => {
      const result = formatRelative(base, base);
      expect(result).toBe("today");
    });
  });

  describe("with different locales", () => {
    const yesterday = base.subtract({ days: 1 });

    it("formats in en-US", () => {
      const result = formatRelative(yesterday, base, { locale: "en-US" });
      expect(result).toBe("yesterday");
    });

    it("formats in de-DE", () => {
      const result = formatRelative(yesterday, base, { locale: "de-DE" });
      expect(result).toBe("gestern");
    });

    it("formats in fr-FR", () => {
      const result = formatRelative(yesterday, base, { locale: "fr-FR" });
      expect(result).toBe("hier");
    });

    it("formats in es-ES", () => {
      const result = formatRelative(yesterday, base, { locale: "es-ES" });
      expect(result).toBe("ayer");
    });
  });

  describe("with ZonedDateTime", () => {
    const baseDT = Temporal.ZonedDateTime.from("2025-11-30T12:00:00+01:00[Europe/Berlin]");
    const yesterdayDT = baseDT.subtract({ days: 1 });

    it("formats ZonedDateTime relative to ZonedDateTime", () => {
      const result = formatRelative(yesterdayDT, baseDT);
      expect(result).toBe("yesterday");
    });
  });

  describe("defaults to now when base not provided", () => {
    it("formats without base argument", () => {
      // This will compare against current date, so just verify it doesn't throw
      const yesterday = Temporal.Now.zonedDateTimeISO().toPlainDate().subtract({ days: 1 });
      const result = formatRelative(yesterday);
      expect(result).toBe("yesterday");
    });
  });
});
