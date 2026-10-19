// Unit tests for the mini tools: run with `node --test mini-tools/test/` from the repo root.
// Every worked example is checked against the formula file, the download page's own script, the embed page,
// the spreadsheet's formulas (worked out from the sheet itself) and the Python the AI runs.
import { test } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { TOOLS, EXAMPLES } from "../index.mjs";
import { compute, defaults, evaluate, format, normsinv, parse, toExcel, toPython } from "../engine.mjs";
import { buildTool, checkTool } from "../../tools/build-mini-tool.mjs";
import { checkStructure, checkXlsx, catalogue, exampleValues, findPython, readSheet, sheetMap, visitorText } from "../check.mjs";
import { grade } from "../../tools/readability.mjs";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const fflate = createRequire(path.join(REPO, "site", "package.json"))("fflate");
const lib = catalogue(REPO);

// ---- The engine ----

test("formulas follow spreadsheet order of operations", () => {
  const ev = (s, env = {}) => evaluate(parse(s), env);
  assert.equal(ev("2 + 3 * 4"), 14);
  assert.equal(ev("(2 + 3) * 4"), 20);
  assert.equal(ev("10 - 4 - 3"), 3);
  assert.equal(ev("100 / 10 / 5"), 2);
  assert.equal(ev("2 ^ 3 ^ 2"), 64); // left to right, as in a spreadsheet
  assert.equal(ev("-2 ^ 2"), 4); // the minus sign belongs to the 2, as in a spreadsheet
  assert.equal(ev("IF(a > 1, 10, 20)", { a: 2 }), 10);
  assert.equal(ev("IF(HAS(x), x, 0)", { x: null }), 0);
  assert.equal(ev("ROUNDUP(2.0000000000000004, 0)"), 2);
  assert.equal(ev("ROUNDUP(13.1, 0)"), 14);
  assert.equal(ev("ROUNDDOWN(3.9, 0)"), 3);
  assert.equal(ev("ROUND(2.5, 0)"), 3);
  assert.equal(ev("ROUND(-2.5, 0)"), -3);
  assert.equal(ev("MIN(3, 1, 2) + MAX(3, 1, 2)"), 4);
});

test("dividing by zero, or doing sums with no answer, is an error, not a made-up number", () => {
  assert.throws(() => evaluate(parse("1 / 0"), {}), /divide by zero/);
  assert.throws(() => evaluate(parse("x + 1"), { x: null }), /no answer/);
  assert.throws(() => evaluate(parse("y + 1"), {}), /Unknown name/);
  assert.throws(() => parse("1 +"), /ends too soon/);
});

test("the spreadsheet and Python versions of a formula work out the same way", () => {
  const f = parse("a - (b - c) + IF(AND(a > 0, HAS(d)), d / a, NA()) ^ 2");
  assert.equal(toExcel(f, (n) => n.toUpperCase() + "1"), 'A1-(B1-C1)+IF(AND(A1>0,ISNUMBER(D1)),D1/A1,"")^2');
  assert.equal(toPython(f), "((a - (b - c)) + (((d / a) if ((a > 0) and (d is not None)) else None) ** 2))");
  // Reading the spreadsheet formula back gives the same tree, so the sheet can be checked with the same engine.
  const back = parse(toExcel(f, (n) => n));
  for (const env of [{ a: 2, b: 5, c: 1, d: 6 }, { a: -1, b: 0, c: 0, d: 3 }]) {
    try { assert.equal(evaluate(back, env), evaluate(f, env)); } catch (e) { assert.throws(() => evaluate(f, env)); }
  }
});

test("NORMSINV matches the published values of the normal distribution", () => {
  assert.ok(Math.abs(normsinv(0.975) - 1.959963984540054) < 1e-12);
  assert.ok(Math.abs(normsinv(0.8) - 0.8416212335729143) < 1e-12);
  assert.ok(Math.abs(normsinv(0.95) - 1.6448536269514722) < 1e-12);
  assert.ok(Math.abs(normsinv(0.0001) + 3.719016485455709) < 1e-10);
  assert.ok(Math.abs(normsinv(0.5)) < 1e-15);
});

test("numbers read the way a person writes them", () => {
  assert.equal(format("money", 1234.5, "£"), "£1,234.50");
  assert.equal(format("money", -3.444), "-$3.44");
  assert.equal(format("money", -0.001), "$0.00");
  assert.equal(format("smallmoney", 0.0008), "$0.0008");
  assert.equal(format("smallmoney", 16), "$16.00");
  assert.equal(format("percent", 33.3333), "33.33%");
  assert.equal(format("percent", 50), "50%");
  assert.equal(format("x", 2.898551), "2.90x");
  assert.equal(format("count", 53211), "53,211");
  assert.equal(format("months", 1), "1.0 month");
  assert.equal(format("points", -0.7), "-0.7 points");
  assert.equal(format("money", null), "none");
});

// ---- Every tool, five ways ----

for (const tool of TOOLS) {
  const examples = EXAMPLES[tool.slug];
  const built = buildTool(tool);

  test(`${tool.slug}: the formula file is complete, its links are in the library and its copy follows the rules`, () => {
    assert.deepEqual(checkStructure(tool, examples, lib), []);
    assert.ok(examples.length >= 5, "at least five worked examples, edge cases included");
    for (const n of tool.next) assert.ok(lib[n.slug], `${n.slug} is in catalogue-items`);
    const g = grade(visitorText(tool).replace(/\{[^}]+\}/g, "it"));
    assert.ok(g <= 10, `grade ${g}`);
  });

  test(`${tool.slug}: every worked example matches on the formula, download, embed, spreadsheet and AI code`, async () => {
    assert.deepEqual(built.problems, []);
    const res = await checkTool(tool, built);
    assert.deepEqual(res.problems, []);
  });

  test(`${tool.slug}: the spreadsheet's formulas point at the right cells, and a wrong one is caught`, () => {
    const bytes = built.files[`${tool.slug}.xlsx`];
    const { cells } = readSheet(bytes, fflate.unzipSync, fflate.strFromU8);
    const at = sheetMap(cells);
    for (const i of tool.inputs) assert.equal(cells[at[i.id].ref].f, undefined, `${i.id} is a number you can type over`);
    for (const o of tool.outputs) assert.ok(cells[at[o.id].ref].f, `${o.id} is a formula`);
    // Break one formula on purpose: point it at the wrong cell. The check must notice.
    const target = tool.outputs.find((o) => /[A-Za-z]/.test(o.formula.replace(/[A-Z]+\(/g, "")));
    const files = fflate.unzipSync(bytes);
    const xml = fflate.strFromU8(files["xl/worksheets/sheet1.xml"]);
    const ref = at[target.id].ref;
    const broken = xml.replace(new RegExp(`(<c r="${ref}"[^>]*><f>)([^<]*)`), (_, a, f) => a + f.replace(/\b[A-Z]+\d+\b/, "A1"));
    assert.notEqual(broken, xml);
    files["xl/worksheets/sheet1.xml"] = fflate.strToU8(broken);
    const problems = checkXlsx(tool, examples, fflate.zipSync(files), fflate);
    assert.ok(problems.some((p) => p.includes(target.id)), "the broken reference is reported");
  });

  test(`${tool.slug}: the same tool always builds the same files`, () => {
    const again = buildTool(tool);
    for (const [name, body] of Object.entries(built.files)) assert.deepEqual(again.files[name], body, name);
  });

  test(`${tool.slug}: the AI skill asks for the numbers, runs code and never guesses`, () => {
    const skill = built.files["SKILL.md"];
    assert.match(skill, new RegExp(`^---\\nname: ${tool.slug}\\ndescription: Use when `));
    assert.match(skill, /Never work a sum out in your head/);
    assert.match(skill, /```python\n[\s\S]*def calculate\(v\):/);
    for (const i of tool.inputs.filter((x) => x.section !== "prices")) assert.ok(skill.includes(i.label), `asks for ${i.label}`);
    const prompt = built.files["prompt.txt"];
    assert.match(prompt, /Never do the sums in your head/);
    assert.ok(prompt.length < skill.length);
    const guide = built.files["save-it-in-your-ai.md"];
    for (const name of ["Claude, as a Project", "ChatGPT, as a custom GPT", "Gemini, as a Gem"]) assert.ok(guide.includes(name));
    const zip = fflate.unzipSync(built.files[`${tool.slug}-skill.zip`]);
    assert.deepEqual(Object.keys(zip), [`${tool.slug}/SKILL.md`]);
  });

  test(`${tool.slug}: the example numbers on every board give an answer, and they're labelled as examples`, () => {
    for (const p of tool.presets) {
      const env = compute(tool, defaults(tool, p.id));
      for (const o of tool.outputs) assert.ok(!(env[o.id] instanceof Error), `${p.id}: ${o.id} works out`);
    }
    assert.match(built.files[`${tool.slug}.html`], /window\.MiniTool/);
    assert.match(fflate.strFromU8(fflate.unzipSync(built.files[`${tool.slug}.xlsx`])["xl/worksheets/sheet1.xml"]), /Example numbers are filled in/);
  });

  test(`${tool.slug}: examples set every input, each within range`, () => {
    for (const ex of examples) assert.doesNotThrow(() => exampleValues(tool, ex), ex.name);
  });
}

test("Python is here, so the AI code really ran", { skip: findPython() ? false : "Python 3 isn't installed" }, () => {
  assert.ok(findPython());
});

test("AI run cost: prices are dated and every lab is there", async () => {
  const { MODELS, CHECKED } = await import("../ai-run-cost/tool.mjs");
  assert.equal(CHECKED, "2026-10-19");
  assert.deepEqual([...new Set(MODELS.map((m) => m.lab))], ["Anthropic", "OpenAI", "Google", "DeepSeek"]);
  for (const m of MODELS) assert.match(m.url, /^https:\/\/(platform\.claude\.com|developers\.openai\.com|ai\.google\.dev|api-docs\.deepseek\.com)\//);
});
