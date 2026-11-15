#!/usr/bin/env node
// Builds every test-data fixture under fixtures/<task id>/ and checks the planted signals hold.
//
//   node fixtures/build/build-fixtures.mjs [--only E04,E05] [--facts]
//
// --facts prints the planted numbers (for whoever maintains keys/). Never paste that output into a
// run folder or a judge sheet: it is answer-key material. Offline, no packages, deterministic.
import { rmSync, existsSync } from "node:fs";
import path from "node:path";
import { FIXTURES, allFacts } from "./lib.mjs";
import * as ads from "./ads.mjs";
import * as email from "./email.mjs";
import * as site from "./site.mjs";
import * as ops from "./ops.mjs";
import * as text from "./text.mjs";

const argv = process.argv.slice(2);
const only = (argv[argv.indexOf("--only") + 1] ?? "").split(",").filter(x => argv.includes("--only") && x);
const builders = { ...ads, ...email, ...site, ...ops, ...text };
const ids = Object.keys(builders).filter(k => /^E\d\d$/.test(k)).sort();
let n = 0;
for (const id of ids) {
  if (only.length && !only.includes(id)) continue;
  const d = path.join(FIXTURES, id);
  if (existsSync(d)) rmSync(d, { recursive: true });
  builders[id]();
  n++;
}
console.log(`built ${n} fixture folders under ${FIXTURES}`);
if (argv.includes("--facts")) console.log(JSON.stringify(allFacts(), null, 1));
