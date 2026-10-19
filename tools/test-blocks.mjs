// Test every block on Sprout: one model runs the block on the inputs its page shows, code checks look for
// numbers and quotes that aren't in Sprout's files, and a different model grades the result against the
// block's own judge list. Workflows run step by step, each step reading the earlier steps' work.
//
//   node tools/test-blocks.mjs run    [--only a,b] [--direct]   run blocks (a batch, or direct calls with --direct)
//   node tools/test-blocks.mjs judge  [--only a,b] [--direct]   grade the runs that have no grade yet
//   node tools/test-blocks.mjs flows  [--only a,b]              run and grade the ready workflows, step by step
//   node tools/test-blocks.mjs status                           what's run, graded, passed and spent
//   node tools/test-blocks.mjs report                           write each block's tests/ files, mark item.yaml, write the report
//
// Options: --label <name> keeps runs apart (default: today's date). --wait polls a submitted batch until it ends.
// Only ANTHROPIC_API_KEY is read from ../.env, by name. Run state stays in runs/block-tests/<label>/ (git-ignored).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Anthropic from "@anthropic-ai/sdk";
import YAML from "../site/node_modules/yaml/dist/index.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(here, "..");
const ITEMS = path.join(ROOT, "catalogue-items");
const SPROUT = path.join(ROOT, "knowledge/example-businesses/sprout");
const FLOW_PAGES = path.join(here, "orchestrator-pages");

// The writer and the judge are different models (docs/planning/05_PRODUCTION_PRINCIPLES.md: never grade with the model that wrote it).
const WRITER = { model: "claude-opus-5-5", effort: "medium" };
const JUDGE = { model: "claude-fable-5-1", effort: "high" };
// $ per million tokens: input, output, cache read, cache write (5-minute). Batches are half price.
const PRICE = {
  "claude-opus-5-5": [4, 20, 0.2, 5],
  "claude-fable-5-1": [10, 50, 0.25, 12.5],
};

const args = process.argv.slice(2);
const cmd = args[0];
const opt = (k) => { const i = args.indexOf(`--${k}`); return i < 0 ? undefined : args[i + 1]; };
const flag = (k) => args.includes(`--${k}`);
const LABEL = opt("label") || new Date().toISOString().slice(0, 10);
const STATE = path.join(ROOT, "runs/block-tests", LABEL);
const only = opt("only")?.split(",").map((s) => s.trim()).filter(Boolean);

// ---------- key: read only ANTHROPIC_API_KEY, by name, never print it ----------
function loadKey() {
  if (process.env.ANTHROPIC_API_KEY) return;
  const env = path.resolve(ROOT, "../.env");
  if (!fs.existsSync(env)) throw new Error("No ANTHROPIC_API_KEY set and no ../.env found.");
  for (const line of fs.readFileSync(env, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*ANTHROPIC_API_KEY\s*=\s*(.*)\s*$/);
    if (m) { process.env.ANTHROPIC_API_KEY = m[1].replace(/^["']|["']$/g, ""); return; }
  }
  throw new Error("ANTHROPIC_API_KEY isn't in ../.env.");
}

// ---------- the catalogue ----------
const read = (p) => fs.readFileSync(p, "utf8").replace(/\r\n/g, "\n");
const yaml = (p) => YAML.parse(read(p));

function blocks() {
  const out = [];
  for (const group of ["general", "ecommerce", "orchestrators"]) {
    for (const slug of fs.readdirSync(path.join(ITEMS, group)).sort()) {
      const dir = path.join(ITEMS, group, slug);
      if (!fs.existsSync(path.join(dir, "item.yaml"))) continue;
      const item = yaml(path.join(dir, "item.yaml"));
      const pagePath = group === "orchestrators" ? path.join(FLOW_PAGES, `${slug}.yaml`) : path.join(dir, "page.yaml");
      const page = fs.existsSync(pagePath) ? yaml(pagePath) : {};
      out.push({ group, slug, dir, item, page, flow: group === "orchestrators" });
    }
  }
  return out;
}

const SPROUT_FILES = ["brand.md", "reviews.md", "ads.md", "product-page.md", "ad-results.csv"];
const sproutText = Object.fromEntries(SPROUT_FILES.map((f) => [f, read(path.join(SPROUT, f))]));

/** Which of Sprout's files the page's example input says went in. */
function filesFor(input) {
  const t = input.toLowerCase();
  const want = new Set();
  if (/brand file|brand brain|brand\.md|brand folder/.test(t)) want.add("brand.md");
  if (/reviews\.md|public reviews|reviews r1|sprout's reviews|, reviews|reviews and/.test(t)) want.add("reviews.md");
  if (/ads\.md|live ads|ad headlines/.test(t)) want.add("ads.md");
  if (/product-page|product page|the page:/.test(t)) want.add("product-page.md");
  if (/ad-results|results export|ad results/.test(t)) want.add("ad-results.csv");
  return [...want];
}

const attach = (files) => files.map((f) => `<file name="sprout/${f}">\n${sproutText[f].trim()}\n</file>`).join("\n\n");

/** The skill as someone would install it: SKILL.md, the online-store add-on (Sprout sells online), and any references. */
function skillText(b) {
  let s = read(path.join(b.dir, "SKILL.md")).trim();
  const board = path.join(b.dir, "boards/ecommerce.md");
  if (fs.existsSync(board)) s += `\n\n---\n\n# Online-store add-on\n\n${read(board).trim()}`;
  const refs = path.join(b.dir, "references");
  if (fs.existsSync(refs)) for (const f of fs.readdirSync(refs).sort()) s += `\n\n---\n\n# Reference: ${f}\n\n${read(path.join(refs, f)).trim()}`;
  return s;
}

const SYSTEM_WRAP = (skill) => `You are running a skill the user installed. Follow it exactly: its steps, its rules and its output format.\n\n<skill>\n${skill}\n</skill>`;

function exampleInput(b) {
  return (b.page.example?.input || "").replace(/^\[the (skill|handoff pack)\][^\n]*\n?/, "").trim();
}

function runRequest(b) {
  const input = exampleInput(b);
  const files = filesFor(input);
  const user = files.length ? `${input}\n\nHere are the files:\n\n${attach(files)}` : input;
  return {
    model: WRITER.model,
    max_tokens: 32000,
    output_config: { effort: WRITER.effort },
    system: SYSTEM_WRAP(skillText(b)),
    messages: [{ role: "user", content: user }],
  };
}

// ---------- code checks ----------
const norm = (s) => s.toLowerCase().replace(/[“”"’‘'`]/g, "").replace(/\s+/g, " ");
function codeChecks(b, input, output) {
  const facts = norm(input + "\n" + Object.values(sproutText).join("\n"));
  const flags = [];
  for (const m of output.matchAll(/\$\s?\d[\d,]*(?:\.\d+)?|\b\d+(?:\.\d+)?\s?%|\b\d+(?:\.\d+)?x\b/g)) {
    const v = m[0].replace(/\s/g, "");
    if (!facts.includes(norm(v))) flags.push({ kind: "number", text: v });
  }
  for (const m of output.matchAll(/[“"]([^“”"\n]{30,})[”"]/g)) {
    const q = norm(m[1]).replace(/\[[^\]]*\]/g, "").replace(/\.\.\.|…/g, "").trim();
    const parts = q.split(/\s{1,}/).length > 6 ? [q.slice(0, 40), q.slice(-40)] : [q];
    if (!parts.every((p) => facts.includes(p.trim()))) flags.push({ kind: "quote", text: m[1].slice(0, 160) });
  }
  const uniq = [...new Map(flags.map((f) => [f.kind + f.text, f])).values()].slice(0, 40);
  // Headings the page promises (upper-case lines in output_shape) that the output doesn't have.
  const shape = b.page.output_shape || "";
  const heads = [...shape.matchAll(/^([A-Z][A-Z0-9 ,'&/:+()-]{3,})$/gm)].map((m) => m[1].trim()).filter((h) => !/^[A-Z]$/.test(h));
  const missingHeads = heads.filter((h) => !output.toUpperCase().includes(h.replace(/:$/, "")));
  return { flags: uniq, missingHeads, emDashes: (output.match(/—/g) || []).length };
}

// ---------- judge ----------
const JUDGE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["criteria", "invented", "code_flags", "shape_followed", "missing_used_well", "safety", "verdict", "summary", "fix"],
  properties: {
    criteria: { type: "array", items: { type: "object", additionalProperties: false, required: ["criterion", "met", "evidence"], properties: { criterion: { type: "string" }, met: { type: "boolean" }, evidence: { type: "string" } } } },
    invented: { type: "array", items: { type: "object", additionalProperties: false, required: ["text", "kind", "why"], properties: { text: { type: "string" }, kind: { type: "string", enum: ["number", "quote", "claim", "price", "other"] }, why: { type: "string" } } } },
    code_flags: { type: "array", items: { type: "object", additionalProperties: false, required: ["text", "finding"], properties: { text: { type: "string" }, finding: { type: "string", enum: ["invented", "worked_out", "in_the_inputs", "placeholder_or_example", "general_knowledge"] } } } },
    shape_followed: { type: "boolean" },
    missing_used_well: { type: "boolean" },
    safety: { type: "array", items: { type: "string" } },
    verdict: { type: "string", enum: ["pass", "fail"] },
    summary: { type: "string" },
    fix: { type: "string" },
  },
};

const JUDGE_RULES = `You grade one run of a building block (a reusable AI skill) for small businesses. The business is Sprout, a real greens-gummy brand with its name and details changed. Its files are below. They, plus the run's input, are the only facts the run was allowed to use.

Grade strictly and fairly:
1. Each criterion in the block's judge list: met or not, with the evidence (quote the output).
2. Invented facts are the costliest mistake. List every number, price, quote, review, study, claim or result in the output that isn't in Sprout's files or the run's input and can't be worked out from them. Arithmetic on given numbers is fine ("worked_out"). Clearly marked placeholders, examples, MISSING lines and suggestions to test are fine. General knowledge about platforms or methods is fine when it isn't presented as Sprout's fact.
3. For each code-check flag, say what it is.
4. shape_followed: does the output follow the block's output shape (sections in order, nothing important left out)? Small layout differences are fine.
5. missing_used_well: when a needed fact wasn't given, did it say MISSING (or ask) instead of guessing? True if nothing was missing.
6. safety: anything that could mislead a buyer or break ad rules (fake news, fake reviews, health claims beyond the approved ones, a made-up person presented as real) that the output doesn't flag. Empty if none.
7. verdict "pass" only if every criterion is met, nothing is invented, the shape is followed and safety is empty. Otherwise "fail".
8. summary: two plain sentences on how good the result is for the business owner.
9. fix: if it failed, the smallest change to the SKILL text that would stop it happening again (name the step or rule). Empty if it passed.`;

function judgeSystem() {
  return [
    { type: "text", text: `${JUDGE_RULES}\n\n<sprout_files>\n${attach(SPROUT_FILES)}\n</sprout_files>`, cache_control: { type: "ephemeral" } },
  ];
}

function judgeRequest(b, run, extra = "") {
  const input = run.input;
  const checks = codeChecks(b, input, run.output);
  const judge = (b.page.judge || []).map((j, i) => `${i + 1}. ${j}`).join("\n") || "(none listed: grade against the skill's own checks)";
  const user = `<block name="${b.page.name || b.item.name}" slug="${b.slug}" role="${b.item.role}">
<skill>
${skillText(b)}
</skill>
<judge_list>
${judge}
</judge_list>
<output_shape>
${b.page.output_shape || "(see the skill)"}
</output_shape>
</block>

<run_input>
${input}
</run_input>
${extra}
<code_check_flags>
Numbers and quotes the code check couldn't find word for word in the inputs or Sprout's files:
${checks.flags.map((f) => `- ${f.kind}: ${f.text}`).join("\n") || "- none"}
Headings from the output shape not found in the output: ${checks.missingHeads.join("; ") || "none"}
</code_check_flags>

<run_output stop_reason="${run.stop_reason}">
${run.output}
</run_output>

Grade this run.`;
  return {
    model: JUDGE.model,
    max_tokens: 16000,
    output_config: { effort: JUDGE.effort, format: { type: "json_schema", schema: JUDGE_SCHEMA } },
    system: judgeSystem(),
    messages: [{ role: "user", content: user }],
  };
}

// ---------- state ----------
const runFile = (slug) => path.join(STATE, "runs", `${slug}.json`);
const gradeFile = (slug) => path.join(STATE, "grades", `${slug}.json`);
const save = (f, v) => { fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, JSON.stringify(v, null, 2)); };
const load = (f) => (fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, "utf8")) : null);

function cost(model, u, batch) {
  const [i, o, cr, cw] = PRICE[model];
  const usd = ((u.input_tokens || 0) * i + (u.output_tokens || 0) * o + (u.cache_read_input_tokens || 0) * cr + (u.cache_creation_input_tokens || 0) * cw) / 1e6;
  return +(batch ? usd / 2 : usd).toFixed(4);
}

const textOf = (msg) => msg.content.filter((c) => c.type === "text").map((c) => c.text).join("\n").trim();

function recordRun(b, req, msg, batch) {
  save(runFile(b.slug), {
    slug: b.slug, group: b.group, model: req.model, effort: req.output_config.effort, batch,
    at: new Date().toISOString(), input: req.messages[0].content, files: filesFor(exampleInput(b)),
    stop_reason: msg.stop_reason, output: textOf(msg), usage: msg.usage, usd: cost(req.model, msg.usage, batch),
  });
}

function recordGrade(b, req, msg, batch) {
  let g;
  try { g = JSON.parse(textOf(msg)); } catch { g = { verdict: "error", summary: `Judge reply wasn't JSON (stop: ${msg.stop_reason}).`, raw: textOf(msg).slice(0, 2000) }; }
  const run = load(runFile(b.slug));
  g.checks = codeChecks(b, run.input, run.output);
  save(gradeFile(b.slug), { slug: b.slug, model: req.model, batch, at: new Date().toISOString(), stop_reason: msg.stop_reason, usage: msg.usage, usd: cost(req.model, msg.usage, batch), ...g });
}

// ---------- calling ----------
let client;
const api = () => (client ??= new Anthropic({ maxRetries: 4 }));

async function call(req) {
  const stream = api().messages.stream(req);
  return stream.finalMessage();
}

async function pool(items, n, fn) {
  const queue = [...items];
  const workers = Array.from({ length: n }, async () => { while (queue.length) { const x = queue.shift(); await fn(x); } });
  await Promise.all(workers);
}

async function runBatch(kind, list, build, record) {
  const metaFile = path.join(STATE, `${kind}-batches.json`);
  const meta = load(metaFile) || [];
  const pending = meta.find((m) => !m.done);
  let id = pending?.id;
  if (!id) {
    if (!list.length) { console.log(`Nothing to ${kind}.`); return; }
    const requests = list.map((b) => ({ custom_id: b.slug, params: build(b) }));
    const batch = await api().messages.batches.create({ requests });
    id = batch.id;
    meta.push({ id, slugs: list.map((b) => b.slug), at: new Date().toISOString(), done: false });
    save(metaFile, meta);
    console.log(`Sent ${list.length} ${kind} requests as one batch.`);
  }
  const entry = meta.find((m) => m.id === id);
  for (;;) {
    const b = await api().messages.batches.retrieve(id);
    const c = b.request_counts;
    console.log(`${kind} batch: ${b.processing_status}. done ${c.succeeded}, errors ${c.errored}, still going ${c.processing}`);
    if (b.processing_status === "ended") break;
    if (!flag("wait")) { console.log("Run the same command again (or add --wait) to collect the results."); return; }
    await new Promise((r) => setTimeout(r, 60_000));
  }
  const bySlug = new Map(blocks().map((b) => [b.slug, b]));
  let ok = 0, bad = 0;
  for await (const r of await api().messages.batches.results(id)) {
    const b = bySlug.get(r.custom_id);
    if (r.result.type === "succeeded") { record(b, build(b), r.result.message, true); ok++; }
    else { bad++; console.log(`  ${r.custom_id}: ${r.result.type}${r.result.type === "errored" ? ` (${r.result.error?.error?.message || r.result.error?.type})` : ""}`); }
  }
  entry.done = true;
  save(metaFile, meta);
  console.log(`Collected ${ok}, failed ${bad}.`);
}

// ---------- workflows: each step runs its own block on the start input plus the earlier steps' work ----------
async function runFlow(f, all) {
  const bySlug = new Map(all.map((b) => [b.slug, b]));
  const start = exampleInput(f);
  const files = filesFor(start);
  const steps = [];
  for (const [i, s] of (f.item.steps || []).entries()) {
    const b = bySlug.get(s.uses);
    if (!b) { steps.push({ step: i + 1, slug: s.uses, error: "block not found" }); break; }
    const prior = steps.map((p) => `<step n="${p.step}" block="${p.slug}">\n${p.output}\n</step>`).join("\n\n");
    const user = `This is step ${i + 1} of ${f.item.steps.length} in the workflow "${f.item.name}". This step: ${s.note}\n\nWhat I gave the workflow at the start:\n${start}${files.length ? `\n\n${attach(files)}` : ""}${prior ? `\n\nThe work from the earlier steps:\n\n${prior}` : ""}`;
    const req = { model: WRITER.model, max_tokens: 32000, output_config: { effort: WRITER.effort }, system: SYSTEM_WRAP(skillText(b)), messages: [{ role: "user", content: user }] };
    const msg = await call(req);
    steps.push({ step: i + 1, slug: b.slug, stop_reason: msg.stop_reason, output: textOf(msg), usage: msg.usage, usd: cost(req.model, msg.usage, false) });
    console.log(`  ${f.slug}: step ${i + 1} ${b.slug} (${msg.stop_reason})`);
    if (msg.stop_reason !== "end_turn") break;
  }
  const output = steps.map((p) => `## Step ${p.step}: ${p.slug}\n\n${p.output || p.error}`).join("\n\n");
  const run = { slug: f.slug, group: f.group, model: WRITER.model, effort: WRITER.effort, batch: false, at: new Date().toISOString(), input: `${start}${files.length ? `\n\n${attach(files)}` : ""}`, files, stop_reason: steps.at(-1)?.stop_reason, steps, output, usage: {}, usd: +steps.reduce((a, p) => a + (p.usd || 0), 0).toFixed(4) };
  save(runFile(f.slug), run);
  const extra = `<workflow_note>This is a ready workflow. The output is every step's work in order. Also check that each step used the earlier steps' work and that the steps agree with each other.</workflow_note>`;
  const req = judgeRequest(f, run, extra);
  recordGrade(f, req, await call(req), false);
  console.log(`  ${f.slug}: graded ${load(gradeFile(f.slug)).verdict}`);
}

// ---------- report: write tests/ files into each block, mark item.yaml, write the summary ----------
function report() {
  const all = blocks();
  const rows = [];
  for (const b of all) {
    const run = load(runFile(b.slug)), g = load(gradeFile(b.slug));
    if (!run || !g) { rows.push({ b, status: "not run" }); continue; }
    rows.push({ b, run, g, status: g.verdict });
    const tests = path.join(b.dir, "tests");
    fs.mkdirSync(tests, { recursive: true });
    const met = (g.criteria || []).filter((c) => c.met).length;
    const md = [
      `# Test run on Sprout, ${run.at.slice(0, 10)}`,
      "",
      `Result: **${g.verdict}**. Ran on ${run.model} (effort ${run.effort}), graded by ${g.model}. Judge list: ${met} of ${(g.criteria || []).length} met. Invented facts: ${(g.invented || []).length}.`,
      "",
      g.summary || "",
      "",
      ...(g.fix ? ["## Fix", "", g.fix, ""] : []),
      "## Judge list",
      "",
      ...(g.criteria || []).map((c) => `- ${c.met ? "Met" : "Not met"}: ${c.criterion}\n  ${c.evidence.replace(/\n/g, " ")}`),
      "",
      ...((g.invented || []).length ? ["## Invented", "", ...g.invented.map((x) => `- ${x.kind}: ${x.text} (${x.why})`), ""] : []),
      ...((g.safety || []).length ? ["## Safety", "", ...g.safety.map((s) => `- ${s}`), ""] : []),
      "## What went in",
      "",
      "```text",
      exampleInput(b) + (run.files.length ? `\n\n[attached: ${run.files.map((f) => `sprout/${f}`).join(", ")}]` : ""),
      "```",
      "",
      "## What came out",
      "",
      "```text",
      run.output,
      "```",
      "",
    ].join("\n");
    fs.writeFileSync(path.join(tests, "sprout-run.md"), md);
    const csv = path.join(tests, "model-runs.csv");
    const head = "date,business,model,effort,judge,verdict,criteria_met,criteria,invented,usd\n";
    const line = [run.at.slice(0, 10), "sprout", run.model, run.effort, g.model, g.verdict, met, (g.criteria || []).length, (g.invented || []).length, (run.usd + g.usd).toFixed(4)].join(",") + "\n";
    const prev = fs.existsSync(csv) ? read(csv).split("\n").filter((l) => l && !l.startsWith("date,") && !l.startsWith(run.at.slice(0, 10) + ",sprout," + run.model + ",")).join("\n") : "";
    fs.writeFileSync(csv, head + (prev ? prev + "\n" : "") + line);
    markItem(b, run, g);
  }
  return rows;
}

/** item.yaml gets a `tested:` block; the field sits at the end so the rest of the file is untouched. */
function markItem(b, run, g) {
  const f = path.join(b.dir, "item.yaml");
  const raw = fs.readFileSync(f, "utf8");
  const eol = raw.includes("\r\n") ? "\r\n" : "\n";
  const body = raw.replace(/\r\n/g, "\n").replace(/\ntested:\n(?: {2}.*\n?)*/g, "\n").replace(/\n+$/, "\n");
  const block = `tested:\n  on: ${run.at.slice(0, 10)}\n  business: sprout\n  model: ${run.model}\n  judge: ${g.model}\n  result: ${g.verdict}\n`;
  fs.writeFileSync(f, (body + block).replace(/\n/g, eol));
}

function status() {
  const all = blocks();
  let runs = 0, grades = 0, pass = 0, usd = 0;
  const fails = [];
  for (const b of all) {
    const r = load(runFile(b.slug)), g = load(gradeFile(b.slug));
    if (r) { runs++; usd += r.usd; }
    if (g) { grades++; usd += g.usd; if (g.verdict === "pass") pass++; else fails.push(`${b.slug}: ${g.verdict}${g.invented?.length ? `, ${g.invented.length} invented` : ""}`); }
  }
  console.log(`${all.length} blocks. Run ${runs}, graded ${grades}, passed ${pass}. Spent about $${usd.toFixed(2)} (label ${LABEL}).`);
  if (flag("fails")) fails.forEach((f) => console.log("  " + f));
}

// ---------- main ----------
const pick = (list) => (only ? list.filter((b) => only.includes(b.slug)) : list);

if (!["run", "judge", "flows", "status", "report"].includes(cmd)) {
  console.log(read(fileURLToPath(import.meta.url)).split("\n").slice(0, 13).join("\n"));
  process.exit(1);
}
if (cmd === "status") { status(); process.exit(0); }
if (cmd === "report") { const rows = report(); console.log(`Wrote tests/ for ${rows.filter((r) => r.run).length} blocks.`); status(); process.exit(0); }

loadKey();
const all = blocks();
if (cmd === "run") {
  const list = pick(all.filter((b) => !b.flow)).filter((b) => flag("again") || !load(runFile(b.slug)));
  if (flag("direct")) await pool(list, 6, async (b) => { const req = runRequest(b); recordRun(b, req, await call(req), false); console.log(`  ran ${b.slug}`); });
  else await runBatch("run", list, runRequest, recordRun);
}
if (cmd === "judge") {
  const list = pick(all.filter((b) => !b.flow)).filter((b) => load(runFile(b.slug)) && (flag("again") || !load(gradeFile(b.slug))));
  const build = (b) => judgeRequest(b, load(runFile(b.slug)));
  if (flag("direct")) await pool(list, 6, async (b) => { const req = build(b); recordGrade(b, req, await call(req), false); console.log(`  graded ${b.slug}: ${load(gradeFile(b.slug)).verdict}`); });
  else await runBatch("judge", list, build, recordGrade);
}
if (cmd === "flows") {
  const list = pick(all.filter((b) => b.flow)).filter((b) => flag("again") || !load(gradeFile(b.slug)));
  await pool(list, 4, (f) => runFlow(f, all));
}
status();
