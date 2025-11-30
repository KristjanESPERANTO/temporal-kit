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

// src/index.ts
if (typeof globalThis.Temporal === "undefined") {
  throw new Error(
    "Temporal is not available. Either use a modern environment with native Temporal support, or import from 'temporal-kit/polyfilled' to automatically load the polyfill."
  );
}

export { isDateLike, isInstant, isPlainDate, isPlainDateTime, isPlainTime, isTimeLike, isZonedDateTime };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map