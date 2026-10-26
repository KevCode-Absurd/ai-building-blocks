// Test every block on Sprout: one model runs the block on the inputs its page shows, code checks look for
// numbers and quotes that aren't in Sprout's files, and a different model grades the result against the
// block's own judge list. Workflows run step by step, each step reading the earlier steps' work.
//
//   node tools/test-blocks.mjs run    [--only a,b] [--direct]   run the blocks that are new or changed since their last run
//   node tools/test-blocks.mjs judge  [--only a,b] [--direct]   grade the runs that have no current grade
//   node tools/test-blocks.mjs flows  [--only a,b]              run and grade the ready workflows, step by step
//   node tools/test-blocks.mjs status [--fails]                 what's run, changed, graded, passed and spent
//   node tools/test-blocks.mjs report                           write each block's tests/ files, mark item.yaml, write the report
//   node tools/test-blocks.mjs stamp  --at <git-rev>            give old runs a fingerprint from the commit they ran on
//   node tools/test-blocks.mjs plan   [--only a,b]              what run and judge would send, and a rough price, without sending
//
//   node tools/test-blocks.mjs prep   [--only a,b]              imported items: write a test input (and judge list) with Haiku, as a batch
//   node tools/test-blocks.mjs remaining                        write reports/<label>-untested-remaining.json
//   node tools/test-blocks.mjs spend                            what's spent against the $200 cap (tools/spend-cap.mjs)
//
// Options: --label <name> keeps runs apart (default: today's date). --wait polls a submitted batch until it ends.
// --again redoes everything picked. judge --new grades only ungraded runs; judge --recheck only light-judge fails. --strong grades every pick with the strong judge.
// --imported picks only the imported items not yet tested; --own only the own-built ones.
// --groups general,ecommerce picks groups. --limit N sends only the first N picks, most-used blocks first
// (usedIn from site/public/data/blocks.json; blocks already marked tested and passed go last).
//
// Spend cap: every batch and direct call is priced before it goes out and refused when it could take total spend
// since 2026-10-26 past $200 minus $10 headroom (tools/spend-cap.mjs, ledger runs/api-spend-2026-10-26.json).
//
// Saving tokens:
// - A block runs again only when what the writer sees changed (skill, add-on, references, example input, files).
// - Sprout's files sit in a cached system block, so blocks given the same files share the cache.
// - Every run goes to the light judge first. A light fail is graded again by the strong judge on the next
//   `judge`, so a fail always has a strong judge behind it.
// - The writer hands back only the skill's output; the judge keeps evidence and notes short.
// Imported items (origin "imported", untested, in site/public/data/blocks.json) have no example input, so `prep` has
// Haiku write a realistic one from the item's own inputs, pick Sprout's files when they fit, and draw a judge list from
// the item's own steps and output when the page has none. Their runs say no tools are available, and their judge sees
// only the files the run was sent.
// Only ANTHROPIC_API_KEY is read from ../.env, by name. Run state stays in runs/block-tests/<label>/ (git-ignored).
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Anthropic from "@anthropic-ai/sdk";
import { PRICE, cost, estimate, guard, reserve, settle, charge, summary as spendSummary } from "./spend-cap.mjs";
import YAML from "../site/node_modules/yaml/dist/index.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(here, "..");
const ITEMS = path.join(ROOT, "catalogue-items");
const SPROUT = path.join(ROOT, "knowledge/example-businesses/sprout");
const FLOW_PAGES = path.join(here, "orchestrator-pages");

// The writer and the judge are different models (docs/planning/05_PRODUCTION_PRINCIPLES.md: never grade with the model that wrote it).
// Sonnet writes; Opus grades every run first; Fable grades again only what Opus failed.
const WRITER = { model: "claude-sonnet-5-5", effort: "medium" };
const JUDGE = { model: "claude-fable-5-1", effort: "high" };
const LIGHT_JUDGE = { model: "claude-opus-5-5", effort: "medium" };
const PREPPER = { model: "claude-haiku-5-5", effort: "medium" };
// Prices live in tools/spend-cap.mjs (PRICE), shared with the spend cap.
// Output tokens (thinking included) assumed per request when pricing a request before it is sent. Past runs:
// Measured 2026-10-26: Sonnet writer p90 3.1k (imported up to 6.8k), Opus light judge p90 1.6k / max 3.1k; Fable judge
// p50 3.2k (older runs). Set at about twice the p90; input is priced with no cache discount; the ledger keeps the real cost.
const EST_OUT = { run: 7000, light: 3000, strong: 6000, prep: 2500 };
// Imported skills can carry huge references: the writer gets at most this much skill text, the judge less.
const IMPORTED_CAP = { skill: 40000, refs: 30000, judge: 12000 };

const args = process.argv.slice(2);
const cmd = args[0];
const opt = (k) => { const i = args.indexOf(`--${k}`); return i < 0 ? undefined : args[i + 1]; };
const flag = (k) => args.includes(`--${k}`);
const LABEL = opt("label") || new Date().toISOString().slice(0, 10);
const STATE = path.join(ROOT, "runs/block-tests", LABEL);
const only = opt("only")?.split(",").map((s) => s.trim()).filter(Boolean);
const groups = opt("groups")?.split(",").map((s) => s.trim()).filter(Boolean);
const limit = opt("limit") ? Number(opt("limit")) : Infinity;

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
// Files are read through `src`, so `stamp` can read a block as it was at an older commit.
const disk = { read: (p) => fs.readFileSync(p, "utf8"), exists: (p) => fs.existsSync(p), list: (p) => fs.readdirSync(p) };
let src = disk;
const read = (p) => src.read(p).replace(/\r\n/g, "\n");
const yaml = (p) => YAML.parse(read(p));

/** Imported items nobody has tested yet (origin "imported", no tested flag in the site's index). */
const IMPORTED = (() => {
  try { return new Set(JSON.parse(fs.readFileSync(path.join(ROOT, "site/public/data/blocks.json"), "utf8")).blocks.filter((x) => x.origin === "imported" && !x.tested).map((x) => x.slug)); }
  catch { return new Set(); }
})();

let blockCache;
function blocks() {
  if (blockCache) return blockCache;
  const out = [];
  for (const group of ["general", "ecommerce", "orchestrators", "imported", "agents"]) {
    for (const slug of fs.readdirSync(path.join(ITEMS, group)).sort()) {
      const imported = IMPORTED.has(slug);
      if ((group === "imported" || group === "agents") && !imported) continue;
      const dir = path.join(ITEMS, group, slug);
      if (!fs.existsSync(path.join(dir, "item.yaml")) || !fs.existsSync(path.join(dir, "SKILL.md"))) continue;
      const item = yaml(path.join(dir, "item.yaml"));
      const flow = group === "orchestrators" && !imported;
      const pagePath = flow ? path.join(FLOW_PAGES, `${slug}.yaml`) : path.join(dir, "page.yaml");
      const page = (fs.existsSync(pagePath) ? yaml(pagePath) : {}) || {};
      out.push({ group, slug, dir, item, page, flow, imported, prep: imported ? load(prepFile(slug)) : null });
    }
  }
  return (blockCache = out);
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

const GO_AHEAD = "I can't add anything else right now. Go ahead with what I've given you.";

/** The Sprout files a block's run is sent: from its example input, or for an imported item, the ones its prep picked. */
const filesOf = (b) => (b.imported && !b.page.example?.input ? (b.prep?.sprout_files || []).filter((x) => SPROUT_FILES.includes(x)) : filesFor(exampleInput(b)));
const judgeList = (b) => (b.page.judge?.length ? b.page.judge : b.imported ? b.prep?.judge || [] : []);
const outputShape = (b) => b.page.output_shape || (b.imported ? b.prep?.output_shape || "" : "");

const attach = (files) => files.map((f) => `<file name="sprout/${f}">\n${sproutText[f].trim()}\n</file>`).join("\n\n");

/** The skill as someone would install it: SKILL.md, the online-store add-on (Sprout sells online), and any references. */
function skillText(b, judgeView = false) {
  if (b.imported) return importedSkill(b, judgeView);
  let s = read(path.join(b.dir, "SKILL.md")).trim();
  const board = path.join(b.dir, "boards/ecommerce.md");
  if (src.exists(board)) s += `\n\n---\n\n# Online-store add-on\n\n${read(board).trim()}`;
  const refs = path.join(b.dir, "references");
  // References can sit in sub-folders; each file is added with its path under references/.
  const walk = (d, rel = "") => src.list(d).sort().flatMap((f) => {
    const p = path.join(d, f);
    let isDir = false;
    try { isDir = src === disk ? fs.statSync(p).isDirectory() : !/\.[a-z0-9]+$/i.test(f); } catch {}
    return isDir ? walk(p, `${rel}${f}/`) : [[`${rel}${f}`, p]];
  });
  if (src.exists(refs)) for (const [f, p] of walk(refs)) s += `\n\n---\n\n# Reference: ${f}\n\n${read(p).trim()}`;
  return s;
}

/** An imported skill, cut to IMPORTED_CAP so one huge reference can't eat the budget. */
function importedSkill(b, judgeView) {
  const cut = (t, n) => (t.length > n ? `${t.slice(0, n)}\n[cut: ${t.length - n} more characters]` : t);
  let s = cut(read(path.join(b.dir, "SKILL.md")).trim(), judgeView ? IMPORTED_CAP.judge : IMPORTED_CAP.skill);
  if (judgeView) return s;
  const refs = path.join(b.dir, "references");
  if (!fs.existsSync(refs)) return s;
  const walk = (d, rel = "") => fs.readdirSync(d).sort().flatMap((f) => { const p = path.join(d, f); return fs.statSync(p).isDirectory() ? walk(p, `${rel}${f}/`) : [[`${rel}${f}`, p]]; });
  let room = IMPORTED_CAP.refs;
  for (const [f, p] of walk(refs)) {
    if (room <= 0) { s += `\n\n---\n\n# Reference: ${f}\n\n[left out for length]`; continue; }
    const t = cut(read(p).trim(), room);
    room -= t.length;
    s += `\n\n---\n\n# Reference: ${f}\n\n${t}`;
  }
  return s;
}

const NO_TOOLS = `\n\nThis is a test run with no tools: you can't run code, search, open links or read files other than any attached above. Where the skill needs a tool, a file or a result you don't have, say so in a line and do every part you can from what you were given (for example, give the exact commands or the plan). Never describe results of a tool you didn't run.`;

const SYSTEM_WRAP = (skill) => `You are running a skill the user installed. Follow it exactly: its steps, its rules and its output format. Hand back only what its output format asks for: no preamble, no recap of the steps, no closing offer.\n\n<skill>\n${skill}\n</skill>`;

function exampleInput(b) {
  return (b.page.example?.input || (b.imported ? b.prep?.input : "") || "").replace(/^\[the (skill|handoff pack)\][^\n]*\n?/, "").trim();
}

const sha = (...parts) => crypto.createHash("sha256").update(parts.join("\u0000")).digest("hex").slice(0, 16);
/** Everything the writer sees for this block. When it changes, the block needs a new run. */
const runPrint = (b) => sha(WRITER.model, WRITER.effort, skillText(b), exampleInput(b), filesOf(b).join(","), ...(b.imported ? [NO_TOOLS] : []));
/** What the judge grades against, on top of the run. When it changes, the run needs a new grade. */
const gradePrint = (b, run) => sha(run.fp || run.at, judgeList(b).join("\n"), outputShape(b));

/** The attached files go first, in a cached system block, so blocks given the same files share one cache. */
function writerSystem(files, skill, noTools = false) {
  const sys = [];
  if (files.length) sys.push({ type: "text", text: `The user attached these files for this run:\n\n${attach(files)}`, cache_control: { type: "ephemeral" } });
  sys.push({ type: "text", text: SYSTEM_WRAP(skill) + (noTools ? NO_TOOLS : "") });
  return sys;
}

function runRequest(b) {
  const input = exampleInput(b);
  const files = filesOf(b);
  // A test has one turn, so it answers "add more, or shall I go ahead?" up front, as a person would.
  const user = `${files.length ? `${input}\n\n(The files are attached above: ${files.map((f) => `sprout/${f}`).join(", ")}.)` : input}\n\n${GO_AHEAD}`;
  return {
    model: WRITER.model,
    max_tokens: 32000,
    output_config: { effort: WRITER.effort },
    system: writerSystem(files, skillText(b), b.imported),
    messages: [{ role: "user", content: user }],
  };
}

// ---------- prep: a test input and judge list for imported items, written by Haiku ----------
const PREP_SCHEMA = {
  type: "object", additionalProperties: false, required: ["input", "sprout_files", "judge", "output_shape"],
  properties: {
    input: { type: "string" },
    sprout_files: { type: "array", items: { type: "string", enum: SPROUT_FILES } },
    judge: { type: "array", items: { type: "string" } },
    output_shape: { type: "string" },
  },
};
const PREP_RULES = `You set up a test of one AI skill from a free library. Write what a real user would send the skill, so a model can run it once and a judge can grade the result.

- input: the user's message, written as the user, 60 to 250 words. Make it specific and realistic for the skill's own inputs (what it says to give it). Put any data the skill needs inline as short sample data (a few rows, a short draft, a short brief). Don't paste whole files; don't name links the model would have to open. If the skill needs files that can't be pasted (photos, audio, big datasets), describe them in a sentence as attached and keep going.
- sprout_files: Sprout is an example consumer brand (greens gummies sold online) with these files: brand.md (brand voice, look, claims), reviews.md (customer reviews), ads.md (live ad copy), product-page.md (product page text), ad-results.csv (ad results export). Pick the ones a user of THIS skill would attach, only when the skill is about a consumer brand's marketing, brand, product page, ads or reviews. If you pick any, the input must be written as Sprout's owner and mention the attached files. Otherwise leave it empty.
- judge: 4 to 6 pass/fail checks for the output, drawn from the skill's own steps, rules and output format, each checkable from the output text alone. Include one on not inventing facts beyond the input.
- output_shape: the skill's output format in one to five lines (section names in order), or "free form" if it defines none.`;

function prepRequest(b) {
  const page = ["summary", "when", "you_give", "you_get"].filter((k) => b.page[k]).map((k) => `${k}: ${JSON.stringify(b.page[k])}`).join("\n");
  const skill = read(path.join(b.dir, "SKILL.md")).trim();
  return {
    model: PREPPER.model,
    max_tokens: 4000,
    output_config: { effort: PREPPER.effort, format: { type: "json_schema", schema: PREP_SCHEMA } },
    system: [{ type: "text", text: PREP_RULES }],
    messages: [{ role: "user", content: `<skill name="${b.page.name || b.item.name || b.slug}">\n<page>\n${page}\n</page>\n<skill_md>\n${skill.length > 15000 ? `${skill.slice(0, 15000)}\n[cut]` : skill}\n</skill_md>\n</skill>\n\nSet up the test.` }],
  };
}

const prepFile = (slug) => path.join(STATE, "prep", `${slug}.json`);
function recordPrep(b, req, msg, batch) {
  let p;
  try { p = JSON.parse(textOf(msg)); } catch { p = { error: `Reply wasn't JSON (stop: ${msg.stop_reason}).` }; }
  const model = msg.model || req.model;
  save(prepFile(b.slug), { slug: b.slug, group: b.group, model, batch, at: new Date().toISOString(), usage: msg.usage, usd: cost(model, msg.usage, batch), ...p });
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
6b. This test sends text only. Photos, screenshots, video or audio files the input names are not really attached. A run that says it can't see them and works from Sprout's files (the brand file's look section, the product page) is right. A run that describes them as if it saw them is inventing.
6c. The run was sent only the Sprout files named in the "[attached: …]" line after its input, and none when there is no such line. You see all of Sprout's files so you can catch invented facts, but don't fail a run for missing a fact that sits only in a file it wasn't sent. Saying MISSING or asking for that fact is right.
7. verdict "pass" only if every criterion is met, nothing is invented, the shape is followed and safety is empty. Otherwise "fail".
8. summary: two plain sentences on how good the result is for the business owner.
9. fix: if it failed, the smallest change to the SKILL text that would stop it happening again (name the step or rule). Empty if it passed.

Keep it short: each evidence is one quote or note of 25 words or fewer, each why is one line, the fix is one or two sentences.`;

const IMPORTED_JUDGE_RULES = `You grade one run of a skill (a reusable AI instruction set) from a free library of AI skills. The skill was given a test input written for this test and, when listed, some files from Sprout, an example consumer brand. The input and those files are the only facts the run was allowed to use.

The run had no tools: it couldn't run code, search, open links or read anything not given. A run that says what it couldn't do and still does every part it can (a plan, the exact commands, a draft) is right. A run that reports results of code or searches it didn't run is inventing.

Grade strictly and fairly:
1. Each check in the judge list: met or not, with the evidence (quote the output). If a check needs a tool the run didn't have, it is met when the run handled that honestly and did the rest.
2. invented: every number, quote, source, study, claim or result in the output that isn't in the input or files and can't be worked out from them. Arithmetic on given numbers is fine ("worked_out"). Marked placeholders, examples, MISSING lines, and general knowledge not presented as the user's facts are fine.
3. For each code-check flag, say what it is.
4. shape_followed: does the output follow the skill's output format (sections in order, nothing important left out)? Small layout differences are fine.
5. missing_used_well: when a needed fact wasn't given, did it say so (or ask) instead of guessing? True if nothing was missing.
6. safety: anything harmful, misleading or against ad, health, legal or privacy rules that the output doesn't flag. Empty if none.
7. verdict "pass" only if every check is met, nothing is invented, the shape is followed and safety is empty. Otherwise "fail".
8. summary: two plain sentences on how useful the result is to the user.
9. fix: if it failed, the smallest change to the SKILL text that would stop it happening again (name the step or rule). Empty if it passed.

Keep it short: each evidence is one quote or note of 25 words or fewer, each why is one line, the fix is one or two sentences.`;

function judgeSystem(b, run) {
  if (b?.imported) {
    const files = run?.files || [];
    return [{ type: "text", text: `${IMPORTED_JUDGE_RULES}${files.length ? `\n\n<files_the_run_was_sent>\n${attach(files)}\n</files_the_run_was_sent>` : ""}`, cache_control: { type: "ephemeral" } }];
  }
  return [
    { type: "text", text: `${JUDGE_RULES}\n\n<sprout_files>\n${attach(SPROUT_FILES)}\n</sprout_files>`, cache_control: { type: "ephemeral" } },
  ];
}

/** The light judge grades every run first; the strong judge grades again after a light fail, or with --strong. */
function judgeFor(b) {
  const prev = load(gradeFile(b.slug));
  if (flag("strong") || (prev?.tier === "light" && prev.verdict !== "pass")) return { ...JUDGE, tier: "strong" };
  return { ...LIGHT_JUDGE, tier: "light" };
}

function judgeRequest(b, run, extra = "") {
  const input = run.input;
  const checks = codeChecks(b, input, run.output);
  const j = judgeFor(b);
  const judge = judgeList(b).map((j, i) => `${i + 1}. ${j}`).join("\n") || "(none listed: grade against the skill's own steps and output format)";
  const user = `<block name="${b.page.name || b.item.name}" slug="${b.slug}" role="${b.item.role}">
<skill>
${skillText(b, true)}
</skill>
<judge_list>
${judge}
</judge_list>
<output_shape>
${outputShape(b) || "(see the skill)"}
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
    model: j.model,
    max_tokens: 16000,
    output_config: { effort: j.effort, format: { type: "json_schema", schema: JUDGE_SCHEMA } },
    system: judgeSystem(b, run),
    messages: [{ role: "user", content: user }],
  };
}

// ---------- state ----------
const runFile = (slug) => path.join(STATE, "runs", `${slug}.json`);
const gradeFile = (slug) => path.join(STATE, "grades", `${slug}.json`);
const save = (f, v) => { fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, JSON.stringify(v, null, 2)); };
const load = (f) => (fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, "utf8")) : null);

/** Output tokens to assume for a request when pricing it before it is sent. */
const estOut = (req) => (req.model === PREPPER.model ? EST_OUT.prep : req.model === WRITER.model ? EST_OUT.run : req.model === LIGHT_JUDGE.model ? EST_OUT.light : EST_OUT.strong);

const textOf = (msg) => msg.content.filter((c) => c.type === "text").map((c) => c.text).join("\n").trim();

// The model is taken from the reply, so a batch collected later is priced by the model that really ran.
function recordRun(b, req, msg, batch) {
  const model = msg.model || req.model;
  save(runFile(b.slug), {
    slug: b.slug, group: b.group, model, effort: req.output_config.effort, batch, fp: runPrint(b), usd_before: spentBefore(runFile(b.slug)),
    at: new Date().toISOString(), input: req.messages[0].content, files: filesOf(b),
    stop_reason: msg.stop_reason, output: textOf(msg), usage: msg.usage, usd: cost(model, msg.usage, batch),
  });
}

function recordGrade(b, req, msg, batch) {
  let g;
  try { g = JSON.parse(textOf(msg)); } catch { g = { verdict: "error", summary: `Judge reply wasn't JSON (stop: ${msg.stop_reason}).`, raw: textOf(msg).slice(0, 2000) }; }
  const run = load(runFile(b.slug));
  g.checks = codeChecks(b, run.input, run.output);
  const model = msg.model || req.model;
  const tier = model === LIGHT_JUDGE.model ? "light" : "strong";
  save(gradeFile(b.slug), { slug: b.slug, model, tier, batch, fp: gradePrint(b, run), usd_before: spentBefore(gradeFile(b.slug)), at: new Date().toISOString(), stop_reason: msg.stop_reason, usage: msg.usage, usd: cost(model, msg.usage, batch), ...g });
}

/** A replaced run or grade still cost money, so its spend carries forward into `usd_before`. */
const spentBefore = (f) => { const p = load(f); return p ? +((p.usd || 0) + (p.usd_before || 0)).toFixed(4) : 0; };

// ---------- calling ----------
let client;
const api = () => (client ??= new Anthropic({ maxRetries: 4 }));

/** One direct call, priced and checked against the spend cap first, entered in the ledger after. */
async function call(req, what = "direct call") {
  guard(estimate(req, estOut(req), false), `${what} (${req.model})`);
  const stream = api().messages.stream(req);
  const msg = await stream.finalMessage();
  charge({ script: "test-blocks", kind: what, label: LABEL, model: msg.model || req.model }, cost(msg.model || req.model, msg.usage, false));
  return msg;
}

async function pool(items, n, fn) {
  const queue = [...items];
  const workers = Array.from({ length: n }, async () => { while (queue.length) { const x = queue.shift(); await fn(x); } });
  await Promise.all(workers);
}

/** Collect any open batch that has ended, send the picks that aren't in an open batch, and with --wait poll until all end. */
async function runBatch(kind, list, build, record) {
  const metaFile = path.join(STATE, `${kind}-batches.json`);
  const meta = load(metaFile) || [];
  const collect = async (entry) => {
    const bt = await api().messages.batches.retrieve(entry.id);
    const c = bt.request_counts;
    console.log(`${kind} batch ${entry.id.slice(-8)}: ${bt.processing_status}. done ${c.succeeded}, errors ${c.errored}, still going ${c.processing}`);
    if (bt.processing_status !== "ended") return false;
    const bySlug = new Map(blocks().map((x) => [x.slug, x]));
    let ok = 0, bad = 0, usd = 0;
    for await (const r of await api().messages.batches.results(entry.id)) {
      const blk = bySlug.get(entry.ids?.[r.custom_id] || r.custom_id);
      if (r.result.type === "succeeded") {
        const m = r.result.message;
        usd += cost(m.model, m.usage, true);
        // A block renamed or removed since it was sent still cost money; it's counted, not recorded.
        if (blk) record(blk, build(blk), m, true); ok++;
      } else { bad++; console.log(`  ${r.custom_id}: ${r.result.type}${r.result.type === "errored" ? ` (${r.result.error?.error?.message || r.result.error?.type})` : ""}`); }
    }
    entry.done = true;
    save(metaFile, meta);
    settle(entry.id, usd);
    console.log(`Collected ${ok}, failed ${bad}. This batch cost $${usd.toFixed(2)}.`);
    return true;
  };
  for (const e of meta.filter((m) => !m.done)) await collect(e);
  const open = new Set(meta.filter((m) => !m.done).flatMap((m) => m.slugs));
  const fresh = list.filter((x) => !open.has(x.slug));
  if (fresh.length) {
    // A custom_id is at most 64 of [A-Za-z0-9_-]; longer or odd slugs go by a hash, kept in the batch's ids map.
    const ids = {};
    const cid = (slug) => (/^[A-Za-z0-9_-]{1,64}$/.test(slug) ? slug : ((ids[`h_${sha(slug)}`] = slug), `h_${sha(slug)}`));
    const requests = fresh.map((x) => ({ custom_id: cid(x.slug), params: build(x) }));
    const est = requests.reduce((t, r) => t + estimate(r.params, estOut(r.params), true), 0);
    guard(est, `a ${kind} batch of ${requests.length}`);
    console.log(`Pricing: about $${est.toFixed(2)} at most for ${requests.length} ${kind} requests.`);
    const batch = await api().messages.batches.create({ requests });
    reserve({ id: batch.id, script: "test-blocks", kind, label: LABEL, requests: requests.length, estimate_usd: +est.toFixed(4) });
    meta.push({ id: batch.id, slugs: fresh.map((x) => x.slug), ids, at: new Date().toISOString(), done: false });
    save(metaFile, meta);
    console.log(`Sent ${fresh.length} ${kind} requests as one batch.`);
  } else if (!meta.some((m) => !m.done)) { console.log(`Nothing to ${kind}.`); return; }
  for (;;) {
    const left = meta.filter((m) => !m.done);
    if (!left.length) return;
    if (!flag("wait")) { console.log("Run the same command again (or add --wait) to collect the results."); return; }
    await new Promise((r) => setTimeout(r, 60_000));
    for (const e of left) await collect(e);
  }
}


// ---------- workflows: each step runs its own block on the start input plus the earlier steps' work ----------
/** A workflow needs a new run when its start input, its steps or any step's block changed. */
const flowPrint = (f, bySlug) => sha(exampleInput(f), JSON.stringify(f.item.steps || []), ...(f.item.steps || []).map((s) => (bySlug.get(s.uses) ? runPrint(bySlug.get(s.uses)) : s.uses)));
async function runFlow(f, all) {
  const bySlug = new Map(all.map((b) => [b.slug, b]));
  const start = exampleInput(f);
  const files = filesFor(start);
  const steps = [];
  for (const [i, s] of (f.item.steps || []).entries()) {
    const b = bySlug.get(s.uses);
    if (!b) { steps.push({ step: i + 1, slug: s.uses, error: "block not found" }); break; }
    const prior = steps.map((p) => `<step n="${p.step}" block="${p.slug}">\n${p.output}\n</step>`).join("\n\n");
    const user = `This is step ${i + 1} of ${f.item.steps.length} in the workflow "${f.item.name}". This step: ${s.note}\n\nWhat I gave the workflow at the start:\n${start}${files.length ? `\n\n(The files are attached above: ${files.map((x) => `sprout/${x}`).join(", ")}.)` : ""}${prior ? `\n\nThe work from the earlier steps:\n\n${prior}` : ""}\n\n${GO_AHEAD}`;
    const req = { model: WRITER.model, max_tokens: 32000, output_config: { effort: WRITER.effort }, system: writerSystem(files, skillText(b)), messages: [{ role: "user", content: user }] };
    const msg = await call(req, "flow step");
    steps.push({ step: i + 1, slug: b.slug, stop_reason: msg.stop_reason, output: textOf(msg), usage: msg.usage, usd: cost(req.model, msg.usage, false) });
    console.log(`  ${f.slug}: step ${i + 1} ${b.slug} (${msg.stop_reason})`);
    if (msg.stop_reason !== "end_turn") break;
  }
  const output = steps.map((p) => `## Step ${p.step}: ${p.slug}\n\n${p.output || p.error}`).join("\n\n");
  const run = { slug: f.slug, group: f.group, model: WRITER.model, effort: WRITER.effort, batch: false, fp: flowPrint(f, bySlug), usd_before: spentBefore(runFile(f.slug)), at: new Date().toISOString(), input: `${start}${files.length ? `\n\n${attach(files)}` : ""}`, files, stop_reason: steps.at(-1)?.stop_reason, steps, output, usage: {}, usd: +steps.reduce((a, p) => a + (p.usd || 0), 0).toFixed(4) };
  save(runFile(f.slug), run);
  const extra = `<workflow_note>This is a ready workflow. The output is every step's work in order. Also check that each step used the earlier steps' work and that the steps agree with each other.</workflow_note>`;
  const req = judgeRequest(f, run, extra);
  recordGrade(f, req, await call(req, "flow grade"), false);
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
      `# Test run${run.files?.length || !b.imported ? " on Sprout" : " on an example input"}, ${run.at.slice(0, 10)}`,
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
  const block = `tested:\n  on: ${run.at.slice(0, 10)}\n  business: ${run.files?.length || !b.imported ? "sprout" : "example-input"}\n  model: ${run.model}\n  judge: ${g.model}\n  result: ${g.verdict}\n`;
  fs.writeFileSync(f, (body + block).replace(/\n/g, eol));
}

/** Does this block need a new run, or its run a new grade? Old runs with no fingerprint count as current (see `stamp`). */
const runStale = (b, r) => !r || (r.fp && r.fp !== (b.flow ? flowPrint(b, new Map(blocks().map((x) => [x.slug, x]))) : runPrint(b)));
const gradeStale = (b, r, g) => !g || (g.fp && g.fp !== gradePrint(b, r)) || (g.tier === "light" && g.verdict !== "pass");

function status() {
  const all = blocks();
  let runs = 0, grades = 0, pass = 0, usd = 0, changed = 0, light = 0;
  const fails = [];
  for (const b of all) {
    const r = load(runFile(b.slug)), g = load(gradeFile(b.slug));
    if (r) { runs++; usd += r.usd + (r.usd_before || 0); if (runStale(b, r)) changed++; }
    if (g) {
      grades++; usd += g.usd + (g.usd_before || 0);
      if (g.tier === "light") light++;
      if (g.verdict === "pass") pass++; else fails.push(`${b.slug}: ${g.verdict}${g.tier === "light" ? " (light judge, strong judge next)" : ""}${g.invented?.length ? `, ${g.invented.length} invented` : ""}`);
    }
  }
  console.log(`${all.length} blocks. Run ${runs} (${changed} changed since), graded ${grades} (${light} by the light judge), passed ${pass}. Spent about $${usd.toFixed(2)} (label ${LABEL}).`);
  if (flag("fails")) fails.forEach((f) => console.log("  " + f));
}

/** Give runs that have no fingerprint the one their block had at a commit, so `run` can tell what changed since. */
function stamp(rev) {
  const repo = ROOT;
  const now = blocks();
  const rel = (p) => path.relative(repo, p).split(path.sep).join("/");
  const git = (...a) => execFileSync("git", ["-C", repo, ...a], { encoding: "utf8", maxBuffer: 64 << 20 });
  const tree = new Set(git("ls-tree", "-r", "--name-only", rev).split("\n").filter(Boolean));
  const dirs = new Set([...tree].flatMap((f) => f.split("/").slice(0, -1).map((_, i, a) => a.slice(0, i + 1).join("/"))));
  src = {
    read: (p) => git("show", `${rev}:${rel(p)}`),
    exists: (p) => tree.has(rel(p)) || dirs.has(rel(p)),
    list: (p) => [...new Set([...tree].filter((f) => f.startsWith(rel(p) + "/")).map((f) => f.slice(rel(p).length + 1).split("/")[0]))],
  };
  let n = 0, gone = 0;
  for (const b of now) {
    const f = runFile(b.slug), r = load(f);
    if (!r || r.fp || b.flow) continue;
    if (!src.exists(path.join(b.dir, "SKILL.md"))) { gone++; continue; }
    const page = path.join(b.dir, "page.yaml");
    r.fp = runPrint({ ...b, page: src.exists(page) ? YAML.parse(read(page)) : {} });
    r.fp_from = rev;
    save(f, r); n++;
  }
  src = disk;
  console.log(`Stamped ${n} runs from ${rev}${gone ? `; ${gone} blocks weren't in that commit` : ""}.`);
}

/** What `run` and `judge` would send now, priced the cautious way the spend cap prices it, and from real costs when this label has some. */
function plan() {
  const all = blocks().filter((b) => !b.flow);
  const toRun = first(pick(all).filter((b) => flag("again") || runStale(b, load(runFile(b.slug)))));
  const toJudge = first(pick(all).filter((b) => { const r = load(runFile(b.slug)); return r && !runStale(b, r) && (flag("again") || gradeStale(b, r, load(gradeFile(b.slug)))); }));
  const tiers = toJudge.map((b) => judgeFor(b).tier);
  const light = tiers.filter((t) => t === "light").length, strong = tiers.length - light;
  const runEst = toRun.reduce((x, b) => x + estimate(runRequest(b), EST_OUT.run, true), 0);
  // A run not made yet is graded on an output of about EST_OUT.run tokens.
  const fakeRun = (b) => ({ input: exampleInput(b), output: "x".repeat(EST_OUT.run * 3), stop_reason: "end_turn" });
  const gradeEst = (b, run, j) => estimate({ ...judgeRequest(b, run), model: j.model }, EST_OUT[j.tier], true);
  const newGrades = toRun.reduce((x, b) => x + gradeEst(b, fakeRun(b), { ...LIGHT_JUDGE, tier: "light" }), 0);
  const judgeEst = toJudge.reduce((x, b, i) => x + gradeEst(b, load(runFile(b.slug)), tiers[i] === "light" ? { ...LIGHT_JUDGE, tier: "light" } : { ...JUDGE, tier: "strong" }), 0);
  const done = (sub) => { const d = path.join(STATE, sub); return fs.existsSync(d) ? fs.readdirSync(d).map((x) => load(path.join(d, x))).filter((r) => r.batch && r.model) : []; };
  const runs = done("runs").filter((r) => r.model === WRITER.model), lights = done("grades").filter((g) => g.tier === "light");
  const avg = (xs) => (xs.length ? xs.reduce((x, r) => x + r.usd, 0) / xs.length : null);
  console.log(`run: ${toRun.length} blocks, at most about $${runEst.toFixed(2)} as a batch, plus about $${newGrades.toFixed(2)} to grade them (light judge)`);
  console.log(`judge: ${toJudge.length} runs (${light} light, ${strong} strong), at most about $${judgeEst.toFixed(2)} as a batch`);
  if (avg(runs) != null) console.log(`Real so far in ${LABEL}: $${avg(runs).toFixed(4)} a run (${runs.length}), ${avg(lights) != null ? `$${avg(lights).toFixed(4)} a light grade (${lights.length})` : "no light grades yet"}. At that rate: run $${(toRun.length * avg(runs)).toFixed(2)}.`);
  if (flag("list")) toRun.forEach((b) => console.log(`  ${b.group}/${b.slug}`));
  console.log(spendSummary());
}

// ---------- main ----------
const pick = (list) => list.filter((b) => (!only || only.includes(b.slug)) && (!groups || groups.includes(b.group))
  && (!flag("imported") || b.imported) && (!flag("own") || !b.imported));
/** Most-used blocks first (usedIn = how many workflows use it), blocks already tested and passed last, then --limit. */
function first(list) {
  let site = {};
  try { site = Object.fromEntries(JSON.parse(fs.readFileSync(path.join(ROOT, "site/public/data/blocks.json"), "utf8")).blocks.map((x) => [x.slug, x])); } catch {}
  const done = (b) => (b.item.tested?.result === "pass" ? 1 : 0);
  const used = (b) => Number(site[b.slug]?.usedIn) || 0;
  return [...list].sort((a, b) => done(a) - done(b) || used(b) - used(a) || a.slug.localeCompare(b.slug)).slice(0, limit);
}

/** Everything without a final grade in this label, for the next round of testing (subscription subagents). */
function remaining() {
  const out = [];
  for (const b of first(pick(blocks()))) {
    const r = load(runFile(b.slug)), g = load(gradeFile(b.slug));
    const stale = r && runStale(b, r);
    let status = null;
    if (!r) status = b.imported && !exampleInput(b) ? "no test input yet" : "not run";
    else if (stale) status = g ? "changed since it was run and graded" : "changed since it was run; not graded";
    else if (!g || gradeStale(b, r, g)) status = g?.tier === "light" && g.verdict !== "pass" ? "light judge failed it; strong judge not run" : "run, not graded";
    if (!status) continue;
    out.push({ slug: b.slug, group: b.group, origin: b.imported ? "imported" : "own", kind: b.flow ? "workflow" : "skill", status,
      dir: path.relative(ROOT, b.dir).split(path.sep).join("/"), ...(b.imported && exampleInput(b) ? { test_input: exampleInput(b), judge: judgeList(b) } : {}),
      ...(g?.fix ? { light_judge_fix: g.fix } : {}) });
  }
  const file = path.join(ROOT, "reports", `${opt("date") || LABEL}-untested-remaining.json`);
  save(file, { label: LABEL, written: new Date().toISOString(), count: out.length, items: out });
  const by = out.reduce((a, x) => ((a[`${x.origin} ${x.status}`] = (a[`${x.origin} ${x.status}`] || 0) + 1), a), {});
  console.log(`Wrote ${path.relative(ROOT, file)}: ${out.length} items. ${JSON.stringify(by)}`);
}

if (!["run", "judge", "flows", "status", "report", "stamp", "plan", "spend", "prep", "remaining"].includes(cmd)) {
  const lines = read(fileURLToPath(import.meta.url)).split("\n");
  console.log(lines.slice(0, lines.findIndex((l) => !l.startsWith("//"))).join("\n"));
  process.exit(1);
}
if (cmd === "status") { status(); process.exit(0); }
if (cmd === "spend") { console.log(spendSummary()); process.exit(0); }
if (cmd === "remaining") { remaining(); process.exit(0); }
if (cmd === "plan") { plan(); process.exit(0); }
if (cmd === "report") { const rows = report(); console.log(`Wrote tests/ for ${rows.filter((r) => r.run).length} blocks.`); status(); process.exit(0); }
if (cmd === "stamp") { if (!opt("at")) throw new Error("stamp needs --at <git-rev>"); stamp(opt("at")); status(); process.exit(0); }

loadKey();
const all = blocks();
/** Blocks already in an open batch of this kind; they're left out before --limit counts. */
const openIn = (kind) => new Set((load(path.join(STATE, `${kind}-batches.json`)) || []).filter((m) => !m.done).flatMap((m) => m.slugs));
if (cmd === "prep") {
  const open = openIn("prep");
  const list = first(pick(all.filter((b) => b.imported && !b.page.example?.input)).filter((b) => !open.has(b.slug) && (flag("again") || !b.prep?.input)));
  await runBatch("prep", list, prepRequest, recordPrep);
}
if (cmd === "run") {
  // An imported item runs once prep has given it a test input.
  const open = openIn("run");
  const list = first(pick(all.filter((b) => !b.flow && (!b.imported || exampleInput(b)))).filter((b) => !open.has(b.slug) && (flag("again") || runStale(b, load(runFile(b.slug))))));
  if (flag("direct")) await pool(list, 6, async (b) => { const req = runRequest(b); recordRun(b, req, await call(req), false); console.log(`  ran ${b.slug}`); });
  else await runBatch("run", list, runRequest, recordRun);
}
if (cmd === "judge") {
  // Only grade runs that are current: a run of an old version of the block is run again first.
  // --new grades only runs with no grade yet; --recheck only light-judge fails (strong judge). Neither re-grades a
  // block just because its page's judge list changed, so a rewrite in progress doesn't trigger a paid re-grade.
  const want = (b, r, g) => (flag("new") ? !g : flag("recheck") ? g?.tier === "light" && g.verdict !== "pass" : flag("again") || gradeStale(b, r, g));
  const open = openIn("judge");
  const list = first(pick(all.filter((b) => !b.flow)).filter((b) => { const r = load(runFile(b.slug)); return !open.has(b.slug) && r && !runStale(b, r) && want(b, r, load(gradeFile(b.slug))); }));
  const build = (b) => judgeRequest(b, load(runFile(b.slug)));
  if (flag("direct")) await pool(list, 6, async (b) => { const req = build(b); recordGrade(b, req, await call(req), false); console.log(`  graded ${b.slug}: ${load(gradeFile(b.slug)).verdict}`); });
  else await runBatch("judge", list, build, recordGrade);
}
if (cmd === "flows") {
  const list = first(pick(all.filter((b) => b.flow)).filter((b) => { const r = load(runFile(b.slug)); return flag("again") || runStale(b, r) || gradeStale(b, r, load(gradeFile(b.slug))); }));
  await pool(list, 4, (f) => runFlow(f, all));
}
status();
