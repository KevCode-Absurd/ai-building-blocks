#!/usr/bin/env node
// Saves one judge's verdict from `claude -p --output-format json` output. It takes the JSON object out of the
// judge's reply and adds the model id that really ran ("judge_model"), so a silent change in what an alias points
// to shows up in score.json. Also accepts plain text output (older rounds), with no model recorded.
//
//   node scripts/save-verdict.mjs <raw output> <verdict.json>
import { readFileSync, writeFileSync } from "node:fs";

const [raw, out] = process.argv.slice(2);
if (!raw || !out) { console.error("usage: save-verdict.mjs <raw> <verdict.json>"); process.exit(2); }
const text = readFileSync(raw, "utf8");
let reply = text, model = null;
try {
  const j = JSON.parse(text);
  if (j && typeof j.result === "string") { reply = j.result; model = Object.keys(j.modelUsage ?? {})[0] ?? j.model ?? null; }
} catch { /* plain text output */ }
const m = reply.match(/\{[\s\S]*\}/);
if (!m) { console.error(`no JSON in ${raw}`); process.exit(1); }
let v;
try { v = JSON.parse(m[0]); } catch (e) { console.error(`bad JSON in ${raw}: ${e.message}`); process.exit(1); }
if (model) v.judge_model = model;
writeFileSync(out, JSON.stringify(v));
