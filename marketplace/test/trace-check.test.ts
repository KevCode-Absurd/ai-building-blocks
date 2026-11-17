// tools/quality/trace-check.cjs: the working trace of knowledge lookups is checked before hand-over. Fixtures: a
// passing trace, a short one, an unknown card id, a card id leaked into the deliverable, and a missing trace.
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { TOOL_FILES } from "../src/modules/packs/build.ts";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const TOOL = path.join(ROOT, "packs", "shared", "tools", "quality", "trace-check.cjs");

const SPEC = `# Spec

- **The job:** the owner picks one offer for next month.
- **Signal pass:**
  1. Two-item orders return the most profit per order.
  2. Most carts sit just under the shipping threshold.
  3. Repeat buyers come back for the same pair.
- **Decisions:**
  - Which offer leads.
  - Where the threshold sits.
`;

const MODULE = `# E-commerce knowledge: Offers (OFF)

## Set the threshold from order value peaks

Card OFF-0001. Tier 3, growth.

Body.

## Lead with the pair that already sells

Card OFF-0002. Tier 2, baseline.

Body.
`;

const GOOD = `| Question | Cards | Call it supports |
|---|---|---|
| which bundle earns the most per order | OFF-0002 | lead with the pair |
| where should the shipping threshold sit | OFF-0001 | set it just above the main peak |
| do repeat buyers want the same pair | OFF-0002 | keep the pair in the first email |
| which offer should lead | OFF-0002 | the pair leads unchanged |
| how to place the threshold | OFF-0001 | one threshold, no second test |
`;

function pack(files: Record<string, string>): string {
  const dir = mkdtempSync(path.join(tmpdir(), "trace-"));
  for (const [p, text] of Object.entries(files)) { mkdirSync(path.dirname(path.join(dir, p)), { recursive: true }); writeFileSync(path.join(dir, p), text); }
  return dir;
}
const run = (dir: string, ...extra: string[]) => {
  const r = spawnSync(process.execPath, [TOOL, path.join(dir, "context", "trace.md"), "--spec", path.join(dir, "context", "spec.md"), "--pack", dir, ...extra], { encoding: "utf8" });
  return { code: r.status, out: `${r.stdout}${r.stderr}` };
};
const base = { "AGENTS.md": "# Agent\n", "knowledge/ecommerce/OFF.md": MODULE, "context/spec.md": SPEC };

test("a trace with one query per signal and decision, citing pack cards, passes", () => {
  const dir = pack({ ...base, "context/trace.md": GOOD, "final.md": "# Offer plan\n\nLead with the pair.\n" });
  const r = run(dir, "--final", path.join(dir, "final.md"));
  assert.equal(r.code, 0, r.out);
  assert.match(r.out, /clean: 5 queries for 3 signals and 2 decisions/);
});

test("fewer queries than signals prompts evidence review without forcing redundant retrieval", () => {
  const short = GOOD.split("\n").slice(0, 4).join("\n");
  const r = run(pack({ ...base, "context/trace.md": short }));
  assert.equal(r.code, 0);
  assert.match(r.out, /2 queries for 3 signals and 2 decisions/);
  assert.match(r.out, /review source-to-decision coverage, including supplied business records/);
  assert.match(r.out, /query count cannot establish evidence completeness/);
});

test("Q-style blocks count as queries too", () => {
  const blocks = [1, 2, 3, 4, 5].map(n => `## Q${n}: question ${n}\nCards: OFF-0001\nSupports: a call\n`).join("\n");
  assert.equal(run(pack({ ...base, "context/trace.md": blocks })).code, 0);
});

test("a card id that is not in the pack fails", () => {
  const r = run(pack({ ...base, "context/trace.md": GOOD.replace("OFF-0001 | set", "MCR-0099 | set") }));
  assert.equal(r.code, 1);
  assert.match(r.out, /not in this pack's knowledge files: MCR-0099/);
});

test("a card id in the deliverable fails", () => {
  const dir = pack({ ...base, "context/trace.md": GOOD, "final.md": "# Offer plan\n\nLead with the pair (OFF-0002).\n" });
  const r = run(dir, "--final", path.join(dir, "final.md"));
  assert.equal(r.code, 1);
  assert.match(r.out, /deliverable line 3 names card id OFF-0002/);
});

test("a missing trace fails, a missing spec is a usage error, and the tool ships in every agent pack", () => {
  const r = run(pack(base));
  assert.equal(r.code, 1);
  assert.match(r.out, /no trace at/);
  const dir = pack({ "AGENTS.md": "# A\n", "context/trace.md": GOOD });
  assert.equal(run(dir).code, 2);
  assert.ok(TOOL_FILES.some(t => t.name === "quality/trace-check.cjs"));
  assert.ok(TOOL_FILES.some(t => t.name === "quality/numbers.cjs"), "numbers.cjs ships once it exists (EB writes it)");
  assert.ok(TOOL_FILES.findIndex(t => t.name === "quality/trace-check.cjs") === TOOL_FILES.findIndex(t => t.name === "quality/leakcheck.cjs") + 1);
});
