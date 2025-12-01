import { Temporal } from "temporal-polyfill";
import { addBusinessDays, isWeekend } from "../dist/polyfilled.js";

console.log("--- Business Days ---");

const friday = Temporal.PlainDate.from("2025-10-03");
console.log(`Start date: ${friday.toString()} (${isWeekend(friday) ? "Weekend" : "Weekday"})`);

const nextBusinessDay = addBusinessDays(friday, 1);
console.log(`Next business day: ${nextBusinessDay.toString()}`);

const threeBusinessDays = addBusinessDays(friday, 3);
console.log(`+3 business days: ${threeBusinessDays.toString()}`);

const saturday = Temporal.PlainDate.from("2025-10-04");
console.log(
  `\nChecking Saturday ${saturday.toString()}: ${isWeekend(saturday) ? "Weekend" : "Weekday"}`,
);

const monday = Temporal.PlainDate.from("2025-10-06");
const previousBusinessDay = addBusinessDays(monday, -1);
console.log(`\nMonday ${monday.toString()} - 1 business day = ${previousBusinessDay.toString()}`);
