// Checks every way a mini tool is built against its worked examples. The build and the tests both use these.
// If one way gives a different answer, the build stops: it doesn't ship.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import vm from "node:vm";
import { spawnSync } from "node:child_process";
import { compiled, compute, defaults, evaluate, namesIn, parse, presetOf } from "./engine.mjs";

const TOL = 5e-6;
/** Does an answer match the expected value? null must be null; numbers must agree to 0.000005 (or the example's own tol). */
export function same(got, want, tol = TOL) {
  if (want === null) return got === null;
  if (typeof got !== "number") return false;
  return Math.abs(got - want) <= tol;
}
const show = (v) => (v instanceof Error ? `error: ${v.message}` : JSON.stringify(v));

/** Compares one set of answers with an example. Returns a list of problems. */
export function diff(where, ex, answers) {
  const out = [];
  for (const [id, want] of Object.entries(ex.expect)) {
    if (!(id in answers)) { out.push(`${where}: "${ex.name}": no answer called ${id}`); continue; }
    if (!same(answers[id], want, ex.tol)) out.push(`${where}: "${ex.name}": ${id} is ${show(answers[id])}, expected ${JSON.stringify(want)}`);
  }
  return out;
}

/** The example's full set of numbers. Examples list every input; a missing one is a mistake in the example. */
export function exampleValues(tool, ex) {
  const missing = tool.inputs.filter((i) => !(i.id in ex.inputs)).map((i) => i.id);
  if (missing.length) throw new Error(`"${ex.name}" doesn't set ${missing.join(", ")}`);
  return { ...ex.inputs };
}

/** Slugs in the library, with their names and where their page is. */
export function catalogue(repo) {
  const root = path.join(repo, "catalogue-items");
  const out = {};
  for (const category of ["general", "ecommerce", "orchestrators"]) {
    const dir = path.join(root, category);
    if (!fs.existsSync(dir)) continue;
    for (const slug of fs.readdirSync(dir)) {
      const y = path.join(dir, slug, "item.yaml");
      if (!fs.existsSync(y)) continue;
      const text = fs.readFileSync(y, "utf8");
      const name = (text.match(/^name:\s*"?(.+?)"?\s*$/m) ?? [])[1] ?? slug;
      const type = (text.match(/^type:\s*(\w+)/m) ?? [])[1] ?? "skill";
      const kind = category === "orchestrators" || type === "workflow" || type === "routine" ? "workflows" : type === "prompt" ? "prompts" : "skills";
      out[slug] = { name, path: `/${kind}/${slug}` };
    }
  }
  return out;
}

const textFields = (tool) => {
  const out = [tool.name, tool.headline, tool.summary, tool.question];
  const add = (x) => { if (!x) return; if (typeof x === "string") out.push(x); else if (Array.isArray(x)) x.forEach((y) => add(y.text ?? y)); else if (x.text) add(x.text); else Object.values(x).forEach(add); };
  for (const i of tool.inputs) out.push(i.label, i.help, i.where);
  for (const o of tool.outputs) { out.push(o.label, o.none); add(o.sum); add(o.means); }
  tool.answer.forEach((l) => add(l));
  (tool.next ?? []).forEach((n) => out.push(n.why));
  (tool.notes ?? []).forEach((n) => out.push(n));
  return out.filter(Boolean);
};
/** Everything a visitor reads, as one text, for the reading-level check. */
export const visitorText = (tool) => textFields(tool).join("\n");

// The engine's format() owns each unit: it already writes "6 hours", "25%", "$10.00", "3 weeks". So a template must
// not add the unit again: "{peopleHours} hours" would show "6 hours hours". Words format() does not add, like
// "minutes" or "people", belong in the template.
const UNIT_AFTER = {
  percent: /^\s*(%|per\s?cent\b)/i,
  points: /^\s+(percentage\s+)?(points?|pts?)\b/i,
  x: /^(\s*x\b|\s+times\b)/i,
  tokens: /^\s+tokens?\b/i,
  months: /^\s+(months?|mos?)\b/i,
  weeks: /^\s+(weeks?|wks?)\b/i,
  days: /^\s+days?\b/i,
  hours: /^\s+(hours?|hrs?)\b/i,
};
const UNIT_BEFORE = { money: /[$£€]\s*$/, smallmoney: /[$£€]\s*$/ };
/** Every {name} in a tool's working and answers that is followed (or led) by the unit format() already adds. */
export function doubledUnits(tool) {
  const unit = (id) => (tool.inputs.find((i) => i.id === id) ?? tool.outputs.find((o) => o.id === id))?.unit ?? "number";
  const temps = [];
  const walk = (x, self, where) => {
    if (!x) return;
    if (typeof x === "string") temps.push([x, self, where]);
    else if (Array.isArray(x)) x.forEach((y) => walk(y, self, where));
    else if (x.text) walk(x.text, self, where);
    else if (!x.if) Object.values(x).forEach((y) => walk(y, self, where));
  };
  for (const o of tool.outputs) { walk(o.sum, o.id, `${o.id} working`); walk(o.means, o.id, `${o.id} meaning`); }
  tool.answer.forEach((list) => walk(list, null, "answer"));
  const p = [];
  for (const [t, self, where] of temps) {
    for (const m of t.matchAll(/\{(=|[A-Za-z_][A-Za-z0-9_]*)(?::\w+)?\}/g)) {
      const u = unit(m[1] === "=" ? self : m[1]);
      const after = t.slice(m.index + m[0].length);
      const before = t.slice(0, m.index);
      if (UNIT_AFTER[u]?.test(after) || UNIT_BEFORE[u]?.test(before)) p.push(`${tool.slug} ${where}: {${m[1]}} already shows its unit (${u}), so "${t}" says it twice`);
    }
  }
  return p;
}

/** The tool file itself: formulas read, every name exists before it's used, every link is in the library, the copy follows the rules. */
export function checkStructure(tool, examples, lib) {
  const p = [];
  const ids = [...tool.inputs.map((i) => i.id), ...tool.outputs.map((o) => o.id)];
  const dup = ids.filter((x, k) => ids.indexOf(x) !== k);
  if (dup.length) p.push(`${tool.slug}: names used twice: ${dup.join(", ")}`);
  const known = new Set(tool.inputs.map((i) => i.id));
  for (const o of tool.outputs) {
    let node;
    try { node = parse(o.formula); } catch (e) { p.push(`${tool.slug}.${o.id}: ${e.message}`); continue; }
    for (const n of namesIn(node)) if (!known.has(n)) p.push(`${tool.slug}.${o.id}: uses "${n}" before it is worked out, or it doesn't exist`);
    known.add(o.id);
  }
  const all = new Set(ids);
  const conds = [];
  const temps = [];
  const walk = (x) => { if (!x) return; if (typeof x === "string") temps.push(x); else if (Array.isArray(x)) x.forEach(walk); else { if (x.if) conds.push(x.if); if (x.text) walk(x.text); else if (!x.if) Object.values(x).forEach(walk); } };
  tool.outputs.forEach((o) => { walk(o.sum); walk(o.means); });
  tool.answer.forEach(walk);
  (tool.next ?? []).forEach((n) => n.if && conds.push(n.if));
  for (const c of conds) { try { for (const n of namesIn(parse(c))) if (!all.has(n)) p.push(`${tool.slug}: condition "${c}" uses unknown "${n}"`); } catch (e) { p.push(`${tool.slug}: condition "${c}": ${e.message}`); } }
  for (const t of temps) for (const m of t.matchAll(/\{([A-Za-z_][A-Za-z0-9_]*)(?::\w+)?\}/g)) if (!all.has(m[1])) p.push(`${tool.slug}: "${t}" names unknown "${m[1]}"`);
  for (const n of tool.next ?? []) if (lib && !lib[n.slug]) p.push(`${tool.slug}: next step "${n.slug}" isn't in catalogue-items`);
  p.push(...doubledUnits(tool));
  for (const t of textFields(tool)) {
    if (t.includes("—")) p.push(`${tool.slug}: em dash in "${t}"`);
    if (/!/.test(t)) p.push(`${tool.slug}: exclamation mark in "${t}"`);
  }
  for (const i of tool.inputs) {
    if (!i.where) p.push(`${tool.slug}.${i.id}: says nowhere where to find the number`);
    if (!Number.isFinite(i.example)) p.push(`${tool.slug}.${i.id}: no example value`);
  }
  for (const pr of tool.presets) {
    const d = defaults(tool, pr.id);
    for (const i of tool.inputs) if ((i.min !== undefined && d[i.id] < i.min && (!i.boards || i.boards.includes(pr.id))) || (i.max !== undefined && d[i.id] > i.max)) p.push(`${tool.slug}.${i.id}: example ${d[i.id]} is out of range`);
  }
  if (!examples?.length) p.push(`${tool.slug}: no worked examples`);
  for (const ex of examples ?? []) {
    try {
      const v = exampleValues(tool, ex);
      for (const i of tool.inputs) if ((i.min !== undefined && v[i.id] < i.min) || (i.max !== undefined && v[i.id] > i.max)) p.push(`${tool.slug}: "${ex.name}" sets ${i.id} to ${v[i.id]}, out of range`);
    } catch (e) { p.push(`${tool.slug}: ${e.message}`); }
  }
  return p;
}

/** Way 0: the formula file, worked out by the engine. Also checks each example's answer says what it should. */
export async function checkFormula(tool, examples, answerLines) {
  const p = [];
  for (const ex of examples) {
    const env = compute(tool, exampleValues(tool, ex));
    p.push(...diff("formula", ex, env));
    for (const o of tool.outputs) if (env[o.id] instanceof Error) p.push(`formula: "${ex.name}": ${o.id} can't be worked out (${env[o.id].message}). Guard it in the formula.`);
    if (ex.says) {
      const said = answerLines(tool, env, presetOf(tool, ex.preset).id, tool.fixedCurrency ?? "$").join(" ");
      if (!said.toLowerCase().includes(ex.says.toLowerCase())) p.push(`formula: "${ex.name}": the answer should say "${ex.says}" but says "${said}"`);
    }
  }
  return p;
}

/** Way 2, the download: run the page's own maths script, with nothing else, and compare. */
export function checkHtml(tool, examples, html, where = "download") {
  const m = html.match(/<script id="mini-tool-maths">([\s\S]*?)<\/script>/);
  if (!m) return [`${where}: no maths script in the page`];
  const ctx = { window: {} };
  vm.runInNewContext(m[1], ctx);
  const M = ctx.window.MiniTool;
  const p = [];
  for (const ex of examples) p.push(...diff(where, ex, M.engine.compute(M.tool, exampleValues(tool, ex))));
  if (!/<script id="mini-tool-ui">/.test(html)) p.push(`${where}: no calculator script in the page`);
  if (/<(link|script)[^>]+(src|href)="https?:/i.test(html.replace(/<link rel="canonical"[^>]*>/, ""))) p.push(`${where}: loads something from the internet, so it won't work offline`);
  return p;
}

const unxml = (s) => s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&amp;/g, "&");
/** Reads the first sheet of an .xlsx: every cell, with its formula, cached value and text. */
export function readSheet(bytes, unzipSync, strFromU8) {
  const files = unzipSync(bytes);
  const xml = strFromU8(files["xl/worksheets/sheet1.xml"]);
  const cells = {};
  for (const m of xml.matchAll(/<c r="([A-Z]+)(\d+)"([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
    const [, colL, row, attrs, inner = ""] = m;
    const t = (attrs.match(/t="(\w+)"/) ?? [])[1];
    const f = (inner.match(/<f>([\s\S]*?)<\/f>/) ?? [])[1];
    const v = (inner.match(/<v>([\s\S]*?)<\/v>/) ?? [])[1];
    const s = (inner.match(/<t[^>]*>([\s\S]*?)<\/t>/) ?? [])[1];
    cells[`${colL}${row}`] = { col: colL, row: Number(row), t, f: f === undefined ? undefined : unxml(f), v: t === "str" ? (v ? unxml(v) : "") : v === undefined ? undefined : Number(v), text: s === undefined ? undefined : unxml(s) };
  }
  return { files, cells };
}

/** Where each input and answer sits, read from the sheet itself: the Name column (E) beside it. */
export function sheetMap(cells) {
  const at = {};
  let section = "";
  const rows = [...new Set(Object.values(cells).map((c) => c.row))].sort((a, b) => a - b);
  for (const r of rows) {
    const a = cells[`A${r}`]?.text ?? "";
    if (cells[`E${r}`]?.text === "Name" || cells[`B${r}`]?.text === "Value" || /: change the yellow cells$/.test(a)) { section = /: change the yellow cells$/.test(a) ? "compare" : a === "Answers" ? "answers" : "inputs"; continue; }
    const name = cells[`E${r}`]?.text;
    if (name && section !== "compare") at[name] = { ref: `B${r}`, label: a, section };
  }
  return at;
}

/** Works out a sheet's formulas from the numbers in its cells (the example's numbers swapped in). */
export function evaluateSheet(cells, overrides = {}) {
  const val = {};
  const busy = new Set();
  const get = (ref) => {
    if (ref in val) return val[ref];
    if (ref in overrides) return (val[ref] = overrides[ref]);
    const c = cells[ref];
    if (!c) return (val[ref] = 0); // an empty cell counts as 0, as in a spreadsheet
    if (c.f === undefined) return (val[ref] = typeof c.v === "number" ? c.v : 0);
    if (busy.has(ref)) throw new Error(`${ref} refers back to itself`);
    busy.add(ref);
    const node = parse(c.f);
    const env = {};
    for (const n of namesIn(node)) { try { env[n] = get(n); } catch (e) { env[n] = e; } }
    let v;
    try { v = evaluate(node, env); } catch (e) { v = e; }
    busy.delete(ref);
    return (val[ref] = v);
  };
  return get;
}

/** Way 3, the spreadsheet: every formula points at the right cells, the saved values match, and with each example's
 *  numbers typed in, the sheet's own formulas give the example's answers. */
export function checkXlsx(tool, examples, bytes, { unzipSync, strFromU8 }, where = "spreadsheet") {
  const p = [];
  const { cells } = readSheet(bytes, unzipSync, strFromU8);
  const at = sheetMap(cells);
  const f = compiled(tool);
  const labelOf = (id) => (tool.inputs.find((i) => i.id === id) ?? tool.outputs.find((o) => o.id === id)).label;
  for (const i of tool.inputs) {
    if (!at[i.id]) { p.push(`${where}: input ${i.id} isn't on the sheet`); continue; }
    if (at[i.id].label !== i.label) p.push(`${where}: ${at[i.id].ref} is labelled "${at[i.id].label}", not "${i.label}"`);
    if (cells[at[i.id].ref].f !== undefined) p.push(`${where}: input ${i.id} is a formula, not a number`);
  }
  const refToId = Object.fromEntries(Object.entries(at).map(([id, x]) => [x.ref, id]));
  const defaultsEnv = compute(tool, defaults(tool, tool.presets[0].id));
  for (const o of tool.outputs) {
    const a = at[o.id];
    if (!a) { p.push(`${where}: answer ${o.id} isn't on the sheet`); continue; }
    const c = cells[a.ref];
    if (c.f === undefined) { p.push(`${where}: ${o.id} at ${a.ref} has no formula`); continue; }
    // The cells the formula reads are exactly the inputs and answers the formula file names, and each is labelled as such.
    const refs = [...namesIn(parse(c.f))];
    const names = refs.map((r) => refToId[r] ?? `?${r}`).sort();
    const want = [...namesIn(f[o.id])].sort();
    if (JSON.stringify(names) !== JSON.stringify(want)) p.push(`${where}: ${o.id} at ${a.ref} reads ${names.join(", ")}, expected ${want.join(", ")}`);
    for (const r of refs) if (refToId[r] && at[refToId[r]].label !== labelOf(refToId[r])) p.push(`${where}: ${r} has the wrong label`);
    // Saved values are the formula file's answers for the numbers on the sheet.
    const saved = c.t === "str" ? (c.v === "" ? null : c.v) : c.v;
    const want0 = defaultsEnv[o.id];
    if (!same(saved, want0 instanceof Error ? NaN : want0, 1e-9)) p.push(`${where}: saved value of ${o.id} is ${saved}, expected ${want0}`);
  }
  for (const ex of examples) {
    const v = exampleValues(tool, ex);
    const over = Object.fromEntries(tool.inputs.filter((i) => at[i.id]).map((i) => [at[i.id].ref, v[i.id]]));
    const get = evaluateSheet(cells, over);
    const answers = Object.fromEntries(tool.outputs.filter((o) => at[o.id]).map((o) => [o.id, get(at[o.id].ref)]));
    p.push(...diff(where, ex, answers));
  }
  // The side-by-side columns work too: each column's input cell drives that column's answers.
  if (tool.compare) {
    const c = tool.compare;
    const rows = Object.values(cells).filter((x) => x.col === "E" && x.text === c.input).map((x) => x.row).filter((r) => cells[`B${r}`]?.f === undefined && r > (at[tool.outputs.at(-1).id] ? Number(at[tool.outputs.at(-1).id].ref.slice(1)) : 0));
    if (!rows.length) p.push(`${where}: the side-by-side columns are missing`);
    else {
      const r0 = rows[0];
      const get = evaluateSheet(cells);
      const base = defaults(tool, tool.presets[0].id);
      c.values.forEach((value, j) => {
        const letter = String.fromCharCode(66 + j);
        if (cells[`${letter}${r0}`]?.v !== value) p.push(`${where}: column ${letter} should start at ${value}`);
        const env = compute(tool, { ...base, [c.input]: value });
        tool.outputs.forEach((o, k) => {
          const got = get(`${letter}${r0 + 1 + k}`);
          const want = env[o.id];
          if (!same(got, want instanceof Error ? NaN : want, 1e-9)) p.push(`${where}: column ${letter}, ${o.id} is ${got}, expected ${want}`);
        });
      });
    }
  }
  return p;
}

/** Python 3, if this computer has it. */
export function findPython() {
  for (const cmd of ["python3", "python"]) {
    const r = spawnSync(cmd, ["-c", "import sys; print(sys.version_info[0])"], { encoding: "utf8" });
    if (r.status === 0 && r.stdout.trim() === "3") return cmd;
  }
  return null;
}

// A failed launch can have no stdout/stderr. Keep the actual process diagnostic
// and fail the check instead of throwing while formatting its error.
function pythonFailure(result) {
  return [
    result.error && `${result.error.code ?? result.error.name}: ${result.error.message}`,
    result.signal && `signal ${result.signal}`,
    Number.isInteger(result.status) && `exit ${result.status}`,
    typeof result.stderr === "string" && result.stderr.trim().split("\n").at(-1),
  ].filter(Boolean).join("; ") || "process returned no status or diagnostic";
}

/** Way 4, the AI's code: run the Python the skill gives the AI, on every example, and compare. */
export function checkPython(tool, examples, code, python = findPython()) {
  if (!python) return { skipped: true, problems: [] };
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "mini-tool-"));
  try {
    const file = path.join(dir, `${tool.slug.replace(/-/g, "_")}.py`);
    const data = path.join(dir, "examples.json");
    fs.writeFileSync(file, code);
    fs.writeFileSync(data, JSON.stringify(examples.map((ex) => exampleValues(tool, ex))));
    const r = spawnSync(python, ["-I", file, "--json", data], { encoding: "utf8" });
    if (r.status !== 0) return { skipped: false, problems: [`python: the code failed: ${pythonFailure(r)}`] };
    const got = JSON.parse(r.stdout);
    const problems = examples.flatMap((ex, k) => diff("python", ex, got[k]));
    // And it runs as the AI will run it, printing the working, without an error.
    const plain = spawnSync(python, ["-I", file], { encoding: "utf8" });
    if (plain.status !== 0) problems.push(`python: printing the working failed: ${pythonFailure(plain)}`);
    else if (!/THE WORKING, LINE BY LINE/.test(plain.stdout)) problems.push("python: didn't print the working");
    return { skipped: false, problems, printed: plain.stdout };
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}
