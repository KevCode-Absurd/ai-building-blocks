// Screen every catalogue item for value: a cheap read of each item's own files (no test run) against one rubric,
// plus a free local near-duplicate check. For the items test-blocks.mjs can't run (imported, agents, minds,
// orchestrators, ai-tools), and as a first pass over the run-and-judge groups too.
//
//   node tools/screen-items.mjs dupes                                local only: near-duplicates, boilerplate, broken file links
//   node tools/screen-items.mjs plan   [--groups a,b] [--limit N]    what `run` would send and a cautious price
//   node tools/screen-items.mjs run    [--groups a,b] [--limit N] [--only g/slug,...] [--wait]
//                                                                    send the items that are new or changed as batches
//   node tools/screen-items.mjs status                               what's screened, verdicts, spend
//   node tools/screen-items.mjs report [--tests-label L] [--date D]  reports/<D>-catalogue-screen.json and
//                                                                    reports/<D>-catalogue-test-summary.md
//
// Options: --label <name> keeps screens apart (default: today's date). --again redoes everything picked.
// --chunk N requests per batch (default 1000).
//
// Model: claude-haiku-5-5 through the Batch API (half price), one call per item, answer fixed by a JSON schema.
// Spend cap: every batch is priced before it is sent and refused when it could take total spend since 2026-10-26
// past $200 minus $10 headroom (tools/spend-cap.mjs). Only ANTHROPIC_API_KEY is read from ../.env, by name.
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Anthropic from "@anthropic-ai/sdk";
import YAML from "../site/node_modules/yaml/dist/index.js";
import { cost, estimate, guard, reserve, settle, summary as spendSummary } from "./spend-cap.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(here, "..");
const ITEMS = path.join(ROOT, "catalogue-items");
const FLOW_PAGES = path.join(here, "orchestrator-pages");
const MODEL = { model: "claude-haiku-5-5", effort: "medium" };
const EST_OUT = 2500; // output tokens assumed per item when pricing (thinking included)
const FILE_CAP = 18000, ITEM_CAP = 45000; // characters sent per file and per item

const args = process.argv.slice(2);
const cmd = args[0];
const opt = (k) => { const i = args.indexOf(`--${k}`); return i < 0 ? undefined : args[i + 1]; };
const flag = (k) => args.includes(`--${k}`);
const LABEL = opt("label") || new Date().toISOString().slice(0, 10);
const STATE = path.join(ROOT, "runs/screen", LABEL);
const DUPES = path.join(ROOT, "runs/screen", "dupes.json");
const GROUPS = ["general", "ecommerce", "orchestrators", "imported", "agents", "minds", "ai-tools"];
const groups = opt("groups")?.split(",").map((s) => s.trim()) || GROUPS;
const only = opt("only")?.split(",").map((s) => s.trim());
const limit = opt("limit") ? Number(opt("limit")) : Infinity;
const CHUNK = Number(opt("chunk") || 1000);

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

const read = (p) => fs.readFileSync(p, "utf8").replace(/\r\n/g, "\n");
const sha = (...p) => crypto.createHash("sha256").update(p.join("\u0000")).digest("hex");
const save = (f, v) => { fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, JSON.stringify(v, null, 2)); };
const load = (f) => { try { return JSON.parse(fs.readFileSync(f, "utf8")); } catch { return null; } };

// ---------- the catalogue ----------
const KIND = {
  general: "a skill (building block) the user installs in Claude, ChatGPT or Gemini, or pastes as a prompt",
  ecommerce: "a skill (building block) for online stores, installed in Claude, ChatGPT or Gemini, or pasted as a prompt",
  orchestrators: "a workflow that runs several skills in order, each step feeding the next",
  imported: "a skill brought in from a public source, re-labelled for this catalogue",
  agents: "an agent: a skill meant to run on its own, often on a schedule or trigger, with tools",
  minds: "a mind: an expert persona (a real person's public thinking, credited) that the user hires to advise, critique or write",
  "ai-tools": "a directory entry for an outside AI tool: what it does, who it's for, pricing, when not to use it",
};

/** Every item: its key, the files that describe it, and the main text used for the near-duplicate check. */
function items() {
  const out = [];
  for (const group of GROUPS) {
    const gdir = path.join(ITEMS, group);
    if (!fs.existsSync(gdir)) continue;
    if (group === "ai-tools") {
      for (const f of fs.readdirSync(gdir).sort()) {
        if (!f.endsWith(".yaml") || f.startsWith("_")) continue;
        const p = path.join(gdir, f);
        out.push({ group, slug: f.replace(/\.yaml$/, ""), dir: gdir, files: [[f, p]], main: p, others: [] });
      }
      continue;
    }
    for (const slug of fs.readdirSync(gdir).sort()) {
      const dir = path.join(gdir, slug);
      if (!fs.statSync(dir).isDirectory()) continue;
      const has = (f) => fs.existsSync(path.join(dir, f));
      if (!has("SKILL.md") && !has("item.yaml") && !has("mind.yaml")) continue;
      const want = group === "minds" ? ["mind.yaml", "SKILL.md", "playbook.md"] : ["item.yaml", "page.yaml", "SKILL.md"];
      const files = want.filter(has).map((f) => [f, path.join(dir, f)]);
      if (group === "orchestrators" && fs.existsSync(path.join(FLOW_PAGES, `${slug}.yaml`))) files.splice(1, 0, ["page.yaml (workflow page)", path.join(FLOW_PAGES, `${slug}.yaml`)]);
      const listed = new Set(want);
      const others = [];
      const walk = (d, rel) => { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); if (fs.statSync(p).isDirectory()) { if (!["exports", "tests", "node_modules", "__pycache__"].includes(f)) walk(p, `${rel}${f}/`); } else if (!listed.has(`${rel}${f}`)) others.push(`${rel}${f}`); } };
      walk(dir, "");
      out.push({ group, slug, dir, files, main: has("SKILL.md") ? path.join(dir, "SKILL.md") : files[0][1], others: others.slice(0, 80) });
    }
  }
  return out;
}
const keyOf = (it) => `${it.group}/${it.slug}`;
const resultFile = (it) => path.join(STATE, "results", `${it.group}__${it.slug}.json`);

// ---------- local checks (free) ----------
const words = (t) => t.toLowerCase().replace(/```[\s\S]*?```/g, " ").replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);
function fnv(s) { let h = 0x811c9dc5; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193); } return h >>> 0; }
function shingles(t, k = 5) { const w = words(t); const s = new Set(); for (let i = 0; i + k <= w.length; i++) s.add(fnv(w.slice(i, i + k).join(" "))); return s; }
function mix(x, seed) { x = Math.imul(x ^ seed, 0x85ebca6b); x ^= x >>> 13; x = Math.imul(x, 0xc2b2ae35); x ^= x >>> 16; return x >>> 0; }

function dupes() {
  const all = items();
  const sets = all.map((it) => shingles(read(it.main)));
  // Shingles in 2% or more of all items are boilerplate.
  const df = new Map();
  for (const s of sets) for (const h of s) df.set(h, (df.get(h) || 0) + 1);
  const common = Math.max(20, Math.ceil(all.length * 0.02));
  // MinHash (64) + LSH (16 bands of 4) over the shingles that aren't boilerplate.
  const N = 64, B = 16, R = 4;
  const seeds = Array.from({ length: N }, (_, i) => fnv(`seed${i}`));
  const core = sets.map((s) => new Set([...s].filter((h) => df.get(h) < common)));
  const buckets = new Map();
  core.forEach((s, idx) => {
    if (s.size < 20) return;
    const sig = seeds.map((sd) => { let m = 0xffffffff; for (const h of s) { const v = mix(h, sd); if (v < m) m = v; } return m; });
    for (let b = 0; b < B; b++) { const k = `${b}:${sig.slice(b * R, b * R + R).join(",")}`; if (!buckets.has(k)) buckets.set(k, []); buckets.get(k).push(idx); }
  });
  const best = new Map();
  const jac = (a, b) => { let n = 0; const [x, y] = a.size < b.size ? [a, b] : [b, a]; for (const h of x) if (y.has(h)) n++; return n / (a.size + b.size - n || 1); };
  const seen = new Set();
  for (const ids of buckets.values()) {
    if (ids.length < 2 || ids.length > 300) continue;
    for (let i = 0; i < ids.length; i++) for (let j = i + 1; j < ids.length; j++) {
      const k = ids[i] * 100000 + ids[j];
      if (seen.has(k)) continue; seen.add(k);
      const v = jac(sets[ids[i]], sets[ids[j]]);
      for (const [p, q] of [[ids[i], ids[j]], [ids[j], ids[i]]]) if (!best.has(p) || best.get(p).similarity < v) best.set(p, { item: keyOf(all[q]), similarity: +v.toFixed(3) });
    }
  }
  // Same display name in two places.
  const names = new Map();
  all.forEach((it, i) => { const n = nameOf(it); if (!n) return; const k = n.toLowerCase(); if (!names.has(k)) names.set(k, []); names.get(k).push(i); });
  const out = {};
  all.forEach((it, i) => {
    const s = sets[i];
    const boiler = s.size ? [...s].filter((h) => df.get(h) >= common).length / s.size : 0;
    const text = read(it.main);
    const broken = [...new Set([...text.matchAll(/\b((?:references|scripts|assets|templates|examples)\/[\w./-]+\.\w+)/g)].map((m) => m[1]))].filter((p) => !fs.existsSync(path.join(it.dir, p)));
    const same = (names.get(nameOf(it)?.toLowerCase()) || []).filter((j) => j !== i).map((j) => keyOf(all[j]));
    out[keyOf(it)] = { nearest: best.get(i) || null, boilerplate_share: +boiler.toFixed(3), words: words(text).length, broken_links: broken.slice(0, 10), same_name: same.slice(0, 5) };
  });
  save(DUPES, out);
  const near = Object.values(out).filter((d) => d.nearest?.similarity >= 0.6).length;
  console.log(`Checked ${all.length} items: ${near} have a near-duplicate (similarity 0.6 or more), ${Object.values(out).filter((d) => d.broken_links.length).length} link to files that aren't there, ${Object.values(out).filter((d) => d.same_name.length).length} share a name. Wrote ${path.relative(ROOT, DUPES)}.`);
  return out;
}

function nameOf(it) {
  try {
    for (const [f, p] of it.files) if (/\.yaml/.test(f)) { const y = YAML.parse(read(p)); if (y?.name) return String(y.name); }
  } catch {}
  return null;
}

// ---------- the screen ----------
const THEMES = ["vague_outcome", "no_when_not_to_use", "inputs_unclear", "steps_vague", "no_output_format",
  "no_next_steps", "boilerplate_or_duplicate", "invented_facts_risk", "broken_or_missing_instructions", "paid_service_unlabelled",
  "scraping_unlabelled", "safety_or_compliance", "too_long_or_bloated", "jargon_or_unclear_copy", "wrong_audience", "other"];

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["scores", "safety_issues", "score", "verdict", "fixes", "themes"],
  properties: {
    scores: {
      type: "object",
      additionalProperties: false,
      required: ["what_you_get", "when_to_use", "inputs", "steps", "output_format", "next_steps", "distinct"],
      properties: Object.fromEntries(["what_you_get", "when_to_use", "inputs", "steps", "output_format", "next_steps", "distinct"].map((k) => [k, { type: "integer" }])),
    },
    safety_issues: { type: "array", items: { type: "string" } },
    score: { type: "integer" },
    verdict: { type: "string", enum: ["keep", "improve", "rewrite"] },
    fixes: { type: "array", items: { type: "string" } },
    themes: { type: "array", items: { type: "string", enum: THEMES } },
  },
};

const RULES = `You screen one item from AI Blocks (useaiblocks.com), a free library of AI skills, workflows, agents, expert "minds" and AI tool listings for people running or working in a business. Your job: judge how much the item helps the person who opens it, from its own files. You are not running it.

Score each part 0 to 10 (10 = clearly done, 5 = partly, 0 = missing). Read each part for the kind of item it is:
- what_you_get: it says plainly what the user gets at the end (the outcome, not a vague promise).
- when_to_use: it says when to use it AND when not to (or what to use instead).
- inputs: the inputs are explicit and the user is told what to gather first (files, numbers, links). For a mind: how to brief them. For an AI tool: what you need to start (account, plan, data).
- steps: the steps are concrete and in order, so a model or person could follow them without guessing. For a mind: the playbook. For an AI tool: how to get a first result.
- output_format: the shape of the result is defined (sections, table, fields, length).
- next_steps: it says what to do with the result next, or what it pairs with.
- distinct: it is its own thing, not boilerplate shared with many items or a near-copy of another item. Use the local check numbers given.

Then:
- safety_issues: real problems only: instructions that invite invented facts, numbers, reviews or quotes presented as real; broken or contradictory instructions; steps that need a paid service, an API key or scraping without saying so; health, legal, financial or ad-policy risks; claims about a real person or company that look made up. Empty when none.
- score: 0 to 100 for overall value to the user. Roughly the average of the seven parts times 10, minus up to 30 for safety issues.
- verdict: "keep" (score 70+, no serious safety issue: worth showing as is), "improve" (useful but needs the fixes), "rewrite" (score under 40, broken, harmful, empty, or a near-copy that adds nothing: needs a major rewrite). Nothing is ever removed from the library; this only sets how much work it needs.
- fixes: 1 to 3 specific edits that would most raise its value, each one sentence naming what to add or change and where (e.g. "Add a 'When not to use' line under the summary: not for B2B lists, use X instead."). No generic advice. Never ask for a worked example or sample input: examples are not required.
- themes: tags for the problems you found, from the list. Empty if none.

Rules: judge only what the files show. Files may be cut short for length (marked [cut]); don't mark down for the cut. Long is not better: a short item that does the job well scores high. Front matter and YAML fields count as part of the page.`;

function screenRequest(it, d) {
  let used = 0;
  const parts = it.files.map(([f, p]) => {
    let t = read(p).trim();
    const room = Math.max(2000, Math.min(FILE_CAP, ITEM_CAP - used));
    if (t.length > room) t = `${t.slice(0, room)}\n[cut: ${t.length - room} more characters]`;
    used += t.length;
    return `<file name="${f}">\n${t}\n</file>`;
  });
  const local = d ? [
    `Most similar other item: ${d.nearest ? `${d.nearest.item} (word-shingle similarity ${d.nearest.similarity}; 0.6+ is a near-copy)` : "none found"}`,
    `Share of this item's text that is boilerplate found in many items: ${Math.round(d.boilerplate_share * 100)}%`,
    `Length of main file: ${d.words} words`,
    `Links to files that don't exist: ${d.broken_links.join(", ") || "none"}`,
    `Other items with the same name: ${d.same_name.join(", ") || "none"}`,
  ].join("\n") : "Local check not run.";
  const other = it.others.length ? `\nOther files in the folder (not shown): ${it.others.join(", ")}` : "";
  return {
    model: MODEL.model,
    max_tokens: 4000,
    output_config: { effort: MODEL.effort, format: { type: "json_schema", schema: SCHEMA } },
    system: [{ type: "text", text: RULES }],
    messages: [{ role: "user", content: `<item group="${it.group}" slug="${it.slug}">\nThis is ${KIND[it.group]}.${other}\n\n${parts.join("\n\n")}\n</item>\n\n<local_check>\n${local}\n</local_check>\n\nScreen this item.` }],
  };
}

const textOf = (msg) => msg.content.filter((c) => c.type === "text").map((c) => c.text).join("\n").trim();
const clamp = (n, a, b) => Math.max(a, Math.min(b, Math.round(Number(n) || 0)));

function record(it, req, msg) {
  let g;
  try {
    g = JSON.parse(textOf(msg));
    for (const k of Object.keys(g.scores)) g.scores[k] = clamp(g.scores[k], 0, 10);
    g.score = clamp(g.score, 0, 100);
    g.fixes = (g.fixes || []).slice(0, 3);
  } catch { g = { verdict: "error", error: `Reply wasn't JSON (stop: ${msg.stop_reason}).`, raw: textOf(msg).slice(0, 1000) }; }
  save(resultFile(it), { key: keyOf(it), slug: it.slug, group: it.group, fp: fp(req), model: msg.model, at: new Date().toISOString(), batch: true, stop_reason: msg.stop_reason, usage: msg.usage, usd: cost(msg.model, msg.usage, true), ...g });
}

const fp = (req) => sha(req.model, req.output_config.effort, RULES, req.messages[0].content).slice(0, 16);

// ---------- batches ----------
let client;
const api = () => (client ??= new Anthropic({ maxRetries: 4 }));

function todo(all, d) {
  const picked = all.filter((it) => groups.includes(it.group) && (!only || only.includes(keyOf(it))));
  const out = [];
  for (const it of picked) {
    const req = screenRequest(it, d[keyOf(it)]);
    const r = load(resultFile(it));
    if (flag("again") || !r || r.verdict === "error" || r.fp !== fp(req)) out.push({ it, req });
  }
  return out.slice(0, limit);
}

async function collect(entry, meta, metaFile, byKey) {
  for (;;) {
    const b = await api().messages.batches.retrieve(entry.id);
    const c = b.request_counts;
    console.log(`screen batch ${entry.id.slice(-8)}: ${b.processing_status}. done ${c.succeeded}, errors ${c.errored}, still going ${c.processing}`);
    if (b.processing_status === "ended") break;
    if (!flag("wait")) return false;
    await new Promise((r) => setTimeout(r, 60_000));
  }
  let ok = 0, bad = 0, usd = 0;
  const d = load(DUPES) || {};
  for await (const r of await api().messages.batches.results(entry.id)) {
    const key = entry.ids[r.custom_id];
    const it = byKey.get(key);
    if (r.result.type === "succeeded") {
      const m = r.result.message;
      usd += cost(m.model, m.usage, true);
      if (it) record(it, screenRequest(it, d[key]), m);
      ok++;
    } else { bad++; if (bad <= 5) console.log(`  ${key}: ${r.result.type}${r.result.type === "errored" ? ` (${r.result.error?.error?.message || r.result.error?.type})` : ""}`); }
  }
  entry.done = true;
  save(metaFile, meta);
  settle(entry.id, usd);
  console.log(`Collected ${ok}, failed ${bad}. This batch cost $${usd.toFixed(4)}.`);
  return true;
}

async function run() {
  const metaFile = path.join(STATE, "batches.json");
  const meta = load(metaFile) || [];
  const all = items();
  const byKey = new Map(all.map((it) => [keyOf(it), it]));
  // Collect open batches first.
  for (const e of meta.filter((m) => !m.done)) if (!(await collect(e, meta, metaFile, byKey))) { console.log("Run again (or add --wait) to collect the open batches."); return; }
  const d = load(DUPES) || dupes();
  const list = todo(all, d);
  if (!list.length) { console.log("Nothing to screen."); return; }
  const sent = [];
  for (let i = 0; i < list.length; i += CHUNK) {
    const part = list.slice(i, i + CHUNK);
    const ids = {};
    const requests = part.map(({ it, req }, j) => { const id = `s${i + j}_${sha(keyOf(it)).slice(0, 16)}`; ids[id] = keyOf(it); return { custom_id: id, params: req }; });
    const est = requests.reduce((a, r) => a + estimate(r.params, EST_OUT, true), 0);
    guard(est, `a screen batch of ${requests.length}`);
    const batch = await api().messages.batches.create({ requests });
    reserve({ id: batch.id, script: "screen-items", kind: "screen", label: LABEL, requests: requests.length, estimate_usd: +est.toFixed(4) });
    const entry = { id: batch.id, ids, at: new Date().toISOString(), done: false };
    meta.push(entry); save(metaFile, meta); sent.push(entry);
    console.log(`Sent ${requests.length} items as one batch (at most about $${est.toFixed(2)}).`);
  }
  for (const e of sent) if (!(await collect(e, meta, metaFile, byKey))) { console.log("Run again (or add --wait) to collect."); return; }
}

// ---------- status and report ----------
/** Screen results. Screens from before 2026-10-26's rule change said "hide"; nothing is hidden, so that reads "rewrite". */
function results() {
  const dir = path.join(STATE, "results");
  const rs = fs.existsSync(dir) ? fs.readdirSync(dir).map((f) => load(path.join(dir, f))).filter(Boolean) : [];
  for (const r of rs) if (r.verdict === "hide") r.verdict = "rewrite";
  return rs;
}

function status() {
  const rs = results();
  const by = {};
  for (const r of rs) { by[r.group] ??= { keep: 0, improve: 0, rewrite: 0, error: 0 }; by[r.group][r.verdict] = (by[r.group][r.verdict] || 0) + 1; }
  const usd = rs.reduce((a, r) => a + (r.usd || 0), 0);
  console.log(`Screened ${rs.length} items (label ${LABEL}), $${usd.toFixed(4)}, $${rs.length ? (usd / rs.length).toFixed(5) : 0} an item.`);
  for (const [g, c] of Object.entries(by)) console.log(`  ${g}: ${JSON.stringify(c)}`);
  console.log(spendSummary());
}

function plan() {
  const all = items();
  const d = load(DUPES) || dupes();
  const list = todo(all, d);
  const est = list.reduce((a, { req }) => a + estimate(req, EST_OUT, true), 0);
  const per = {};
  for (const { it } of list) per[it.group] = (per[it.group] || 0) + 1;
  console.log(`screen: ${list.length} items ${JSON.stringify(per)}, at most about $${est.toFixed(2)} as batches`);
  console.log(spendSummary());
}

function report() {
  const date = opt("date") || LABEL;
  const d = load(DUPES) || {};
  const rs = results().filter((r) => r.verdict !== "error").sort((a, b) => a.group.localeCompare(b.group) || a.slug.localeCompare(b.slug));
  // Run-and-judge results from test-blocks.mjs, so the judge's fix notes sit next to the screen's.
  const tl = opt("tests-label") || LABEL;
  const tdir = path.join(ROOT, "runs/block-tests", tl);
  const tload = (sub) => new Map((fs.existsSync(path.join(tdir, sub)) ? fs.readdirSync(path.join(tdir, sub)).map((f) => load(path.join(tdir, sub, f))) : []).filter(Boolean).map((x) => [x.slug, x]));
  const truns = tload("runs"), tgr = tload("grades");
  const out = rs.map((r) => {
    const g = ["general", "ecommerce", "imported", "agents", "orchestrators"].includes(r.group) ? tgr.get(r.slug) : null;
    const run = g ? truns.get(r.slug) : null;
    return { slug: r.slug, group: r.group, score: r.score, verdict: r.verdict, fixes: r.fixes, themes: r.themes, safety_issues: r.safety_issues, scores: r.scores,
      near_duplicate: d[r.key]?.nearest?.similarity >= 0.6 ? d[r.key].nearest : undefined,
      test: g && run?.group === r.group ? { result: g.verdict, judge: g.model, judge_tier: g.tier, on: g.at?.slice(0, 10), summary: g.summary, fix: g.fix || undefined,
        unmet: (g.criteria || []).filter((c) => !c.met).map((c) => c.criterion), invented: (g.invented || []).length } : undefined };
  });
  fs.mkdirSync(path.join(ROOT, "reports"), { recursive: true });
  const jsonFile = path.join(ROOT, "reports", `${date}-catalogue-screen.json`);
  save(jsonFile, { screened_at: date, model: MODEL.model, verdicts: { keep: "worth showing as is", improve: "useful, apply the fixes", rewrite: "needs a major rewrite (nothing is hidden or removed)" }, rubric: ["what_you_get", "when_to_use", "inputs", "steps", "output_format", "next_steps", "distinct", "safety"], items: out });

  // Run-and-judge counts.
  const tgrades = [...tgr.values()];
  const tg = {};
  for (const g of tgrades) { const grp = truns.get(g.slug)?.group || "?"; tg[grp] ??= { tested: 0, passed: 0, failed: 0, light_fail_awaiting_strong: 0 }; tg[grp].tested++; if (g.verdict === "pass") tg[grp].passed++; else { tg[grp].failed++; if (g.tier === "light") tg[grp].light_fail_awaiting_strong++; } }

  const vg = {};
  for (const r of rs) { vg[r.group] ??= { keep: 0, improve: 0, rewrite: 0 }; vg[r.group][r.verdict]++; }
  const tot = { keep: 0, improve: 0, rewrite: 0 };
  for (const r of rs) tot[r.verdict]++;
  const themes = {};
  for (const r of rs) for (const t of r.themes || []) themes[t] = (themes[t] || 0) + 1;
  const topThemes = Object.entries(themes).sort((a, b) => b[1] - a[1]).slice(0, 10);
  const led = load(path.join(ROOT, "runs", "api-spend-2026-10-26.json")) || { entries: [] };
  const byScript = {};
  for (const e of led.entries) { const k = `${e.script}${e.kind ? ` ${e.kind}` : ""}${e.actual_usd == null ? " (open batch, at its estimate)" : ""}`; byScript[k] = (byScript[k] || 0) + (e.actual_usd ?? e.estimate_usd ?? 0); }
  const total = Object.values(byScript).reduce((a, b) => a + b, 0);
  const avgScore = (g) => { const xs = rs.filter((r) => !g || r.group === g); return xs.length ? Math.round(xs.reduce((a, r) => a + r.score, 0) / xs.length) : 0; };
  const pct = (a, b) => (b ? `${Math.round((100 * a) / b)}%` : "n/a");
  const tTot = Object.values(tg).reduce((a, x) => ({ tested: a.tested + x.tested, passed: a.passed + x.passed }), { tested: 0, passed: 0 });
  const md = [
    `# Catalogue test summary, ${date}`,
    "",
    `Two checks. **Screen**: every item's own files read by ${MODEL.model} against a value rubric (what you get, when to use and not, inputs, steps, output format, next steps, distinct, safety), plus a free local near-duplicate check. **Run and judge**: skills run by claude-sonnet-5-5 (own-built on the Sprout example business; imported items on a test input claude-haiku-5-5 wrote from their own inputs, with a judge list from their own steps when they had none), graded by claude-opus-5-5, with claude-fable-5-1 grading again anything Opus failed.`,
    "",
    "## Screen verdicts",
    "",
    "| Group | Screened | Keep | Improve | Rewrite | Avg score |",
    "|---|---:|---:|---:|---:|---:|",
    ...Object.entries(vg).map(([g, c]) => `| ${g} | ${c.keep + c.improve + c.rewrite} | ${c.keep} | ${c.improve} | ${c.rewrite} | ${avgScore(g)} |`),
    `| **All** | ${rs.length} | ${tot.keep} | ${tot.improve} | ${tot.rewrite} | ${avgScore()} |`,
    "",
    "Nothing is hidden or removed. Rewrite means the item needs a major rewrite before it is useful.",
    "",
    "## Run and judge (own-built on Sprout; imported on a Haiku-written example input, Sprout files where they fit)",
    "",
    "| Group | Tested | Passed | Failed | Pass rate |",
    "|---|---:|---:|---:|---:|",
    ...Object.entries(tg).map(([g, c]) => `| ${g} | ${c.tested} | ${c.passed} | ${c.failed} | ${pct(c.passed, c.tested)} |`),
    `| **All** | ${tTot.tested} | ${tTot.passed} | ${tTot.tested - tTot.passed} | ${pct(tTot.passed, tTot.tested)} |`,
    "",
    "## Top recurring problems (screen)",
    "",
    ...topThemes.map(([t, n], i) => `${i + 1}. ${t.replace(/_/g, " ")}: ${n} items (${pct(n, rs.length)})`),
    "",
    "## Spend",
    "",
    ...Object.entries(byScript).map(([k, v]) => `- ${k}: $${v.toFixed(2)}`),
    `- **Total since 2026-10-26: $${total.toFixed(2)}** of the $200 cap.`,
    "",
    `Per-item screen results: \`reports/${date}-catalogue-screen.json\`. Per-block test write-ups: each block's \`tests/sprout-run.md\`.`,
    "",
  ].join("\n");
  fs.writeFileSync(path.join(ROOT, "reports", `${date}-catalogue-test-summary.md`), md);
  console.log(`Wrote reports/${date}-catalogue-screen.json (${out.length} items) and reports/${date}-catalogue-test-summary.md.`);
}

// ---------- main ----------
if (cmd === "dupes") dupes();
else if (cmd === "plan") plan();
else if (cmd === "status") status();
else if (cmd === "report") report();
else if (cmd === "run") { loadKey(); await run(); status(); }
else {
  const lines = read(fileURLToPath(import.meta.url)).split("\n");
  console.log(lines.slice(0, lines.findIndex((l) => !l.startsWith("//"))).join("\n"));
  process.exit(1);
}
