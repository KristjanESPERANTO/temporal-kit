import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const { version } = JSON.parse(readFileSync("package.json", "utf8"));
const tag = `v${version}`;

execFileSync("git", ["push", "--follow-tags", "origin", "main"], { stdio: "inherit" });
execFileSync("gh", ["release", "create", tag, "--generate-notes"], { stdio: "inherit" });
