// Numbers ledger check (round 2, ticket EB2): one basis per number, totals that match their rows, and verdict
// labels that match their numbers. Fixtures use generic stores and numbers.
import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const tool = fileURLToPath(new URL("../packs/shared/tools/quality/numbers.cjs", import.meta.url));
const dir = mkdtempSync(path.join(tmpdir(), "numbers-ledger-"));
let n = 0;
const put = (name: string, text: string) => { const file = path.join(dir, `${n++}-${name}`); writeFileSync(file, text); return file; };
const ledger = (figures: unknown) => put("numbers.json", JSON.stringify(figures));
const run = (...args: string[]) => spawnSync(process.execPath, [tool, ...args], { encoding: "utf8" });
const check = (figures: unknown, final?: string, brief?: string) =>
  run(ledger(figures), ...(final !== undefined ? ["--final", put("final.md", final)] : []), ...(brief !== undefined ? ["--brief", put("brief.md", brief)] : []));
const fig = (id: string, extra: Record<string, unknown>) => ({ id, unit: "INR", period: "month", basis: "gross profit", source: "brief", ...extra });

test("a ledger whose formulas give the written values, with a matching deliverable, is clean", () => {
  const r = check([
    fig("orders", { value: 1200, basis: "none", unit: "orders" }),
    fig("profit_each", { formula: "price * margin - shipping", inputs: { price: 800, margin: 0.6, shipping: 90 }, value: 390 }),
    fig("monthly_profit", { formula: "orders * profit_each", inputs: ["orders", "profit_each"], value: 468000 }),
  ], "# Plan\n\nEach order earns ₹390 in gross profit, so 1,200 orders earn ₹4.68 lakh a month.\n", "Orders: 1,200 a month. Price ₹800, margin 60%, shipping ₹90.");
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.stdout, /3 ledger figures, 3 with a value/);
  assert.match(r.stdout, /^clean$/m);
  assert.doesNotMatch(r.stdout, /WARN/);
});

test("a written value its formula does not give fails, and so does a total that does not match its rows", () => {
  const slip = check([fig("reachable", { formula: "customers * opt_in * (1 - holdout)", inputs: { customers: 6000, opt_in: 0.5, holdout: 0.1 }, value: 3000, basis: "none" })]);
  assert.equal(slip.status, 1);
  assert.match(slip.stdout, /"reachable": written as 3,000 but its formula gives 2,700/);
  const total = check([fig("a", { value: 1000 }), fig("b", { value: 2500 }), fig("total", { rows: ["a", "b"], value: 4000 })]);
  assert.equal(total.status, 1);
  assert.match(total.stdout, /"total": total 4,000 does not match its rows \(3,500\)/);
  const ok = check([fig("a", { value: 1000 }), fig("b", { value: 2500 }), fig("total", { rows: ["a", "b"], value: 3500 })]);
  assert.equal(ok.status, 0, ok.stdout);
});

test("a total that adds two periods or two money bases fails", () => {
  const periods = check([fig("a", { value: 1000, period: "month" }), fig("b", { value: 9000, period: "90 days" }), fig("t", { rows: ["a", "b"], value: 10000 })]);
  assert.equal(periods.status, 1);
  assert.match(periods.stdout, /"t": adds rows from two periods \(month, quarter\)/);
  const bases = check([fig("a", { value: 1000, basis: "revenue" }), fig("b", { value: 500, basis: "gross profit" }), fig("t", { rows: ["a", "b"], value: 1500 })]);
  assert.equal(bases.status, 1);
  assert.match(bases.stdout, /"t": adds rows on two money bases \(revenue, gross profit\)/);
  const loose = check([fig("a", { value: 1000, basis: "profit" }), fig("b", { value: 500, basis: "gross profit" }), fig("t", { rows: ["a", "b"], value: 1500 })]);
  assert.equal(loose.status, 0, "plain profit sits with gross profit");
});

test("verdict labels must match their numbers: Cut means zero, Hold the same, Scale higher, Trim lower", () => {
  const r = check([
    fig("cut", { label: "Cut", value: 2000, before: 4000, basis: "spend" }),
    fig("hold", { label: "Hold", value: 4500, before: 4000, basis: "spend" }),
    fig("scale", { label: "Scale", value: 3000, before: 4000, basis: "spend" }),
    fig("trim", { label: "Trim", value: 4000, before: 4000, basis: "spend" }),
    fig("fine_cut", { label: "Cut", value: 0, before: 4000, basis: "spend" }),
    fig("fine_hold", { label: "Hold", value: 4020, before: 4000, basis: "spend" }),
    fig("fine_scale", { label: "Scale", value: 5000, before: "fine_hold", basis: "spend" }),
  ]);
  assert.equal(r.status, 1);
  assert.match(r.stdout, /"cut": label "Cut" means zero, but the number is 2,000/);
  assert.match(r.stdout, /"hold": label "Hold" means the same, but 4,000 goes to 4,500/);
  assert.match(r.stdout, /"scale": label "Scale" means higher, but 4,000 goes to 3,000/);
  assert.match(r.stdout, /"trim": label "Trim" means lower/);
  assert.doesNotMatch(r.stdout, /fine_/);
});

test("deliverable tables: a Total row that does not add up, and a verdict column its numbers contradict", () => {
  const table = [
    "| Ad set | Cost per purchase | Call | ₹ a day, now to next | Next 14 days |",
    "|---|---|---|---|---|",
    "| Broad | ₹340 | Hold | 10,000 to 10,000 | ₹1,40,000 |",
    "| Retargeting | ₹290 | Cut | 4,000 to 2,000 | ₹28,000 |",
    "| Gifts | ₹970 | Cut | 3,000 to 0 | ₹0 |",
    "| Test | ₹580 | Hold | 3,000 to 4,000 | ₹56,000 |",
    "| **Total** | | | **16,000** | **₹2,30,000** |",
  ].join("\n");
  const r = check([], `# Budget\n\n${table}\n`);
  assert.equal(r.status, 1);
  assert.match(r.stdout, /row "Retargeting": "Cut" means zero, but the number is 2,000/);
  assert.match(r.stdout, /row "Test": "Hold" means the same, but 3,000 goes to 4,000/);
  assert.doesNotMatch(r.stdout, /row "Gifts"|row "Broad"/);
  assert.match(r.stdout, /column "Next 14 days": the total says ₹2,30,000 but the rows add up to 224,000/);
  assert.doesNotMatch(r.stdout, /column "₹ a day/, "the daily total matches the next-day figures");
  assert.doesNotMatch(r.stdout, /Cost per purchase/, "a rate column is never summed");
  const fixedTable = table.replace("| Retargeting | ₹290 | Cut | 4,000 to 2,000 | ₹28,000 |", "| Retargeting | ₹290 | Trim | 4,000 to 2,000 | ₹28,000 |")
    .replace("| Test | ₹580 | Hold | 3,000 to 4,000 | ₹56,000 |", "| Test | ₹580 | Scale | 3,000 to 4,000 | ₹62,000 |");
  const fixed = check([], `# Budget\n\n${fixedTable}\n`);
  assert.equal(fixed.status, 0, fixed.stdout);
});

test("ranges and lakh formats add up in a Total row", () => {
  const table = "| Group | Contacted | Extra buyers | Extra profit |\n|---|---|---|---|\n| A | 4,000 | 160 to 320 | ₹0.90 to 1.80 lakh |\n| B | 2,500 | 75 to 150 | ₹0.42 to 0.85 lakh |\n| **Total** | **6,500** | **235 to 470** | **₹1.3 to 2.7 lakh** |\n";
  const r = check([], table);
  assert.equal(r.status, 0, r.stdout);
  const bad = check([], table.replace("**235 to 470**", "**235 to 520**"));
  assert.equal(bad.status, 1);
  assert.match(bad.stdout, /column "Extra buyers": the total says 235 to 520 but the rows add up to 235 to 470/);
});

test("one column holds one period and one money basis; a day band is not a period", () => {
  const periods = check([], "| Item | Saving |\n|---|---|\n| Fewer refunds | ₹40,000 a month |\n| Lower shipping | ₹90,000 over 90 days |\n");
  assert.equal(periods.status, 1);
  assert.match(periods.stdout, /column "Saving": mixes two periods \(month, quarter\)/);
  const bases = check([fig("be_a", { value: 140, basis: "gross profit vs the single item", unit: "orders" }), fig("be_b", { value: 160, basis: "gross profit given up to pair buyers", unit: "orders" })],
    "| Bundle | Break-even |\n|---|---|\n| A | 140 new orders a month |\n| B | 160 new orders a month |\n");
  assert.equal(bases.status, 1);
  assert.match(bases.stdout, /column "Break-even": mixes two money bases/);
  const bands = check([], "| Wave | Group | Customers |\n|---|---|---|\n| 1 | Lapsed 46 to 90 days | 7,000 |\n| 2 | Lapsed 91 to 180 days | 12,000 |\n| 3 | Lapsed 181 to 365 days | 9,000 |\n");
  assert.equal(bands.status, 0, bands.stdout);
  const sideBySide = check([], "| Ad set | ₹ a day | Next 14 days |\n|---|---|---|\n| Broad | 10,000 | ₹1,40,000 |\n");
  assert.equal(sideBySide.status, 0, "a daily column beside a 14-day column is fine");
});

test("figures from nowhere and savings at revenue warn without failing", () => {
  const r = check([fig("profit_each", { value: 450 })],
    "# Plan\n\nEach order earns ₹450. Each saved return keeps ₹1,150 of order value.\nThe brief's budget of ₹5.6 lakh covers it, and ₹7,300 goes to tests.\n",
    "Monthly budget ₹5,60,000.");
  assert.equal(r.status, 0, r.stdout);
  assert.match(r.stdout, /WARN \(\d+, does not fail\)/);
  assert.match(r.stdout, /2 figure\(s\) in neither the ledger nor the brief: line 3: ₹1,150; line 4: ₹7,300/);
  assert.match(r.stdout, /line 3: a saving valued at revenue; value it at margin/);
  const ledgerWarn = check([fig("returns_saved_value", { value: 52000, basis: "revenue" }), { id: "no_source", value: 3 }]);
  assert.match(ledgerWarn.stdout, /"returns_saved_value": a saving or kept figure valued at revenue/);
  assert.match(ledgerWarn.stdout, /"no_source": no source/);
});

test("formulas are parsed, never run as code", () => {
  const r = check([fig("x", { formula: "require('fs').rmSync('.')" }), fig("y", { formula: "a +", inputs: { a: 1 } }), fig("z", { formula: "missing * 2" }), fig("loop", { formula: "loop + 1" })]);
  assert.equal(r.status, 1);
  assert.match(r.stdout, /"x": (cannot read|unknown function|unexpected)/);
  assert.match(r.stdout, /"y": formula ends too early/);
  assert.match(r.stdout, /"z": unknown input "missing"/);
  assert.match(r.stdout, /"loop" depends on itself \(loop > loop\)/);
  const fns = check([fig("m", { formula: "max(a, b) + round(c / 3) + 10%", inputs: { a: 2, b: 5, c: 10 }, value: 8.1 })]);
  assert.equal(fns.status, 0, fns.stdout);
});

test("a copy deliverable with schedules and merge fields stays clean", () => {
  const copy = [
    "# Welcome series", "", "| # | Send | Job |", "|---|---|---|", "| 1 | Right after sign-up | Send the code |", "| 2 | Day 3 | Answer the top question |", "",
    "Hi {{ first_name|default:\"there\" }},", "", "The day cream is ₹449. With your 10% code, it's ₹404.", "",
  ].join("\n");
  const r = check([fig("price", { value: 449, basis: "price" }), fig("with_code", { formula: "price * 0.9", inputs: ["price"], value: 404, basis: "price" })], copy, "Day cream ₹449. Welcome code 10% off.");
  assert.equal(r.status, 0, r.stdout);
  assert.match(r.stdout, /^clean$/m);
  assert.doesNotMatch(r.stdout, /WARN/);
});

test("usage errors exit 2", () => {
  assert.equal(run().status, 2);
  assert.equal(run(put("bad.json", "{not json")).status, 2);
  assert.equal(run(path.join(dir, "missing.json")).status, 2);
});
