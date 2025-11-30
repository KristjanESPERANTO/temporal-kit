import { Temporal } from 'temporal-polyfill';

// src/guards/index.ts
function isPlainDate(value) {
  return value instanceof Temporal.PlainDate;
}
function isPlainDateTime(value) {
  return value instanceof Temporal.PlainDateTime;
}
function isPlainTime(value) {
  return value instanceof Temporal.PlainTime;
}
function isZonedDateTime(value) {
  return value instanceof Temporal.ZonedDateTime;
}
function isInstant(value) {
  return value instanceof Temporal.Instant;
}
function isDateLike(value) {
  return value instanceof Temporal.PlainDate || value instanceof Temporal.PlainDateTime || value instanceof Temporal.ZonedDateTime;
}
function isTimeLike(value) {
  return value instanceof Temporal.PlainTime || value instanceof Temporal.PlainDateTime || value instanceof Temporal.ZonedDateTime;
}
function isBefore(a, b) {
  if ("hour" in a && "hour" in b) {
    if ("timeZoneId" in a && "timeZoneId" in b) {
      return Temporal.ZonedDateTime.compare(a, b) < 0;
    }
    return Temporal.PlainDateTime.compare(a, b) < 0;
  }
  return Temporal.PlainDate.compare(a, b) < 0;
}
function isAfter(a, b) {
  if ("hour" in a && "hour" in b) {
    if ("timeZoneId" in a && "timeZoneId" in b) {
      return Temporal.ZonedDateTime.compare(a, b) > 0;
    }
    return Temporal.PlainDateTime.compare(a, b) > 0;
  }
  return Temporal.PlainDate.compare(a, b) > 0;
}
function isSame(a, b) {
  if ("hour" in a && "hour" in b) {
    if ("timeZoneId" in a && "timeZoneId" in b) {
      return Temporal.ZonedDateTime.compare(a, b) === 0;
    }
    return Temporal.PlainDateTime.compare(a, b) === 0;
  }
  return Temporal.PlainDate.compare(a, b) === 0;
}
function min(dates) {
  if (dates.length === 0) {
    throw new TypeError("Cannot find min of empty array");
  }
  return dates.reduce((earliest, current) => {
    if ("hour" in current && "hour" in earliest) {
      if ("timeZoneId" in current && "timeZoneId" in earliest) {
        return Temporal.ZonedDateTime.compare(current, earliest) < 0 ? current : earliest;
      }
      return Temporal.PlainDateTime.compare(current, earliest) < 0 ? current : earliest;
    }
    return Temporal.PlainDate.compare(current, earliest) < 0 ? current : earliest;
  });
}
function max(dates) {
  if (dates.length === 0) {
    throw new TypeError("Cannot find max of empty array");
  }
  return dates.reduce((latest, current) => {
    if ("hour" in current && "hour" in latest) {
      if ("timeZoneId" in current && "timeZoneId" in latest) {
        return Temporal.ZonedDateTime.compare(current, latest) > 0 ? current : latest;
      }
      return Temporal.PlainDateTime.compare(current, latest) > 0 ? current : latest;
    }
    return Temporal.PlainDate.compare(current, latest) > 0 ? current : latest;
  });
}

// src/index.ts
if (typeof globalThis.Temporal === "undefined") {
  throw new Error(
    "Temporal is not available. Either use a modern environment with native Temporal support, or import from 'temporal-kit/polyfilled' to automatically load the polyfill."
  );
}

export { isAfter, isBefore, isDateLike, isInstant, isPlainDate, isPlainDateTime, isPlainTime, isSame, isTimeLike, isZonedDateTime, max, min };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map