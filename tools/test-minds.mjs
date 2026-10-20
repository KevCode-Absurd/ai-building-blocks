// Test each built mind on its five prompts (mind.yaml `tests`: 2 use alone, 2 advise me, 1 trap), docs/MINDS-PRD.md §4.4.
// One model runs the mind's SKILL.md; a different model grades the answer against the mind's own data set and personality.
//
//   node tools/test-minds.mjs run    [--only a,b] [--wait]   run every test that has no current run
//   node tools/test-minds.mjs judge  [--only a,b] [--wait]   grade the runs that have no grade
//   node tools/test-minds.mjs status [--fails]              what's run, graded, passed and spent
//
// Options: --label <name> keeps runs apart (default: minds-<today>). --again redoes everything picked.
// Only ANTHROPIC_API_KEY is read from ../.env, by name. Run state stays in runs/mind-tests/<label>/ (git-ignored with runs/).
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Anthropic from "@anthropic-ai/sdk";
import YAML from "../site/node_modules/yaml/dist/index.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MINDS = path.join(ROOT, "catalogue-items/minds");
const WRITER = { model: "claude-opus-5-5", effort: "medium" };
const JUDGE = { model: "claude-fable-5-1", effort: "high" };
const PRICE = { "claude-opus-5-5": [4, 20], "claude-fable-5-1": [10, 50], "claude-sonnet-5-5": [2, 10] }; // $/M in, out; batches half

const args = process.argv.slice(2);
const cmd = args[0];
const opt = (k) => { const i = args.indexOf(`--${k}`); return i < 0 ? undefined : args[i + 1]; };
const flag = (k) => args.includes(`--${k}`);
const LABEL = opt("label") || `minds-${new Date().toISOString().slice(0, 10)}`;
const STATE = path.join(ROOT, "runs/mind-tests", LABEL);
const only = opt("only")?.split(",").map((s) => s.trim()).filter(Boolean);

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
const sha = (...xs) => crypto.createHash("sha256").update(xs.join("\u0000")).digest("hex").slice(0, 16);
const save = (f, v) => { fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, JSON.stringify(v, null, 2)); };
const load = (f) => (fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, "utf8")) : null);
const cost = (model, u) => { const [i, o] = PRICE[model] ?? [10, 50]; return +(((u.input_tokens || 0) * i + (u.output_tokens || 0) * o) / 1e6 / 2).toFixed(4); };
const textOf = (msg) => msg.content.filter((c) => c.type === "text").map((c) => c.text).join("\n").trim();

/** Every test of every built mind: { id, slug, i, kind, prompt, expect, skill, knowledge, personality }. */
function cases() {
  const roster = YAML.parse(read(path.join(MINDS, "_roster.yaml")));
  const out = [];
  for (const r of roster.minds) {
    if (only && !only.includes(r.slug)) continue;
    const dir = path.join(MINDS, r.slug);
    if (!["mind.yaml", "SKILL.md", "knowledge.md", "personality.md"].every((f) => fs.existsSync(path.join(dir, f)))) continue;
    const m = YAML.parse(read(path.join(dir, "mind.yaml")));
    const skill = read(path.join(dir, "SKILL.md")), knowledge = read(path.join(dir, "knowledge.md")), personality = read(path.join(dir, "personality.md"));
    (m.tests ?? []).forEach((t, i) => out.push({ id: `${r.slug}__${i + 1}`, slug: r.slug, name: m.name, i: i + 1, kind: t.kind, prompt: t.prompt, expect: t.expect ?? "", skill, knowledge, personality }));
  }
  return out;
}
const runFile = (id) => path.join(STATE, "runs", `${id}.json`);
const gradeFile = (id) => path.join(STATE, "grades", `${id}.json`);
const runPrint = (c) => sha(c.skill, c.prompt);

const GO_AHEAD = "I can't add anything else right now. Go ahead with what I've given you.";
const runRequest = (c) => ({
  model: WRITER.model, max_tokens: 8000, output_config: { effort: WRITER.effort },
  system: `You are running a skill the user installed. Follow it exactly.\n\n<skill>\n${c.skill}\n</skill>`,
  messages: [{ role: "user", content: `${c.prompt}\n\n${GO_AHEAD}` }],
});

const SCHEMA = {
  type: "object", additionalProperties: false,
  required: ["voice", "grounded", "no_invented_quotes", "beyond_record_marked", "useful", "invented", "verdict", "summary", "fix"],
  properties: {
    voice: { type: "boolean" }, grounded: { type: "boolean" }, no_invented_quotes: { type: "boolean" }, beyond_record_marked: { type: "boolean" }, useful: { type: "boolean" },
    invented: { type: "array", items: { type: "object", additionalProperties: false, required: ["text", "why"], properties: { text: { type: "string" }, why: { type: "string" } } } },
    verdict: { type: "string", enum: ["pass", "fail"] }, summary: { type: "string" }, fix: { type: "string" },
  },
};
const RULES = `You grade one answer from a "mind": an AI skill that plays a public figure from their public work. You get the mind's data set (knowledge.md) and personality (personality.md), the test prompt and the answer. Grade five things, each true or false:
1. voice: it sounds like this person as personality.md describes them (their way of arguing, words and priorities), without turning them into a cartoon.
2. grounded: its ideas come from knowledge.md (applying them to a new problem is the job and is fine).
3. no_invented_quotes: it puts no words in the real person's mouth as a quote unless that phrase is in knowledge.md's "Short phrases on the record".
4. beyond_record_marked: any fact it states about the person's own life, work or views that isn't in knowledge.md is marked "[beyond the record]" (or similar) or left out. If it states none, this is true.
5. useful: it actually does the task or answers the question, concretely, for the person asking.
For a "trap" test, also check it meets the stated expectation (for example, it says there's no record of a view rather than inventing one); if it doesn't, grounded or beyond_record_marked is false.
List each invented quote or unsupported personal fact in "invented". verdict is "pass" only when all five are true. summary: two sentences. fix: one sentence on what to change in the mind's files, or "none".`;
const judgeRequest = (c, run) => ({
  model: JUDGE.model, max_tokens: 6000, output_config: { effort: JUDGE.effort, format: { type: "json_schema", schema: SCHEMA } },
  system: `${RULES}\n\n<knowledge>\n${c.knowledge}\n</knowledge>\n\n<personality>\n${c.personality}\n</personality>`,
  messages: [{ role: "user", content: `<mind>${c.name}</mind>\n<test kind="${c.kind}">\n${c.prompt}\n${c.expect ? `Expectation: ${c.expect}\n` : ""}</test>\n\n<answer>\n${run.output}\n</answer>\n\nGrade this answer.` }],
});

let client;
const api = () => (client ??= new Anthropic({ maxRetries: 4 }));

async function batch(kind, list, build, record) {
  const metaFile = path.join(STATE, `${kind}-batches.json`);
  const meta = load(metaFile) || [];
  let entry = meta.find((m) => !m.done);
  if (!entry) {
    if (!list.length) { console.log(`Nothing to ${kind}.`); return; }
    const b = await api().messages.batches.create({ requests: list.map((c) => ({ custom_id: c.id, params: build(c) })) });
    entry = { id: b.id, ids: list.map((c) => c.id), at: new Date().toISOString(), done: false };
    meta.push(entry); save(metaFile, meta);
    console.log(`Sent ${list.length} ${kind} requests as one batch.`);
  }
  for (;;) {
    const b = await api().messages.batches.retrieve(entry.id);
    const n = b.request_counts;
    console.log(`${kind} batch: ${b.processing_status}. done ${n.succeeded}, errors ${n.errored}, still going ${n.processing}`);
    if (b.processing_status === "ended") break;
    if (!flag("wait")) { console.log("Run the same command again (or add --wait) to collect the results."); return; }
    await new Promise((r) => setTimeout(r, 60_000));
  }
  const byId = new Map(cases().map((c) => [c.id, c]));
  let ok = 0, bad = 0;
  for await (const r of await api().messages.batches.results(entry.id)) {
    const c = byId.get(r.custom_id);
    if (c && r.result.type === "succeeded") { record(c, r.result.message); ok++; } else { bad++; console.log(`  ${r.custom_id}: ${r.result.type}`); }
  }
  entry.done = true; save(metaFile, meta);
  console.log(`Collected ${ok}, failed ${bad}.`);
}

function status() {
  const all = cases();
  let ran = 0, graded = 0, passed = 0, usd = 0;
  const fails = [];
  for (const c of all) {
    const r = load(runFile(c.id)), g = load(gradeFile(c.id));
    if (r) { ran++; usd += r.usd || 0; }
    if (g) { graded++; usd += g.usd || 0; if (g.verdict === "pass") passed++; else fails.push(`  ${c.id} (${c.kind}): ${g.summary ?? g.verdict}`); }
  }
  const minds = new Set(all.map((c) => c.slug)).size;
  console.log(`${minds} minds, ${all.length} tests. Run ${ran}, graded ${graded}, passed ${passed}. Spent about $${usd.toFixed(2)} (label ${LABEL}).`);
  if (flag("fails") && fails.length) console.log(fails.join("\n"));
}

if (cmd === "status") { status(); process.exit(0); }
loadKey();
if (cmd === "run") {
  const list = cases().filter((c) => flag("again") || load(runFile(c.id))?.fp !== runPrint(c));
  await batch("run", list, runRequest, (c, msg) => {
    const model = msg.model || WRITER.model;
    save(runFile(c.id), { id: c.id, fp: runPrint(c), model, at: new Date().toISOString(), prompt: c.prompt, stop_reason: msg.stop_reason, output: textOf(msg), usage: msg.usage, usd: cost(model, msg.usage) });
  });
  status();
} else if (cmd === "judge") {
  const list = cases().filter((c) => { const r = load(runFile(c.id)); return r && (flag("again") || load(gradeFile(c.id))?.fp !== r.fp); });
  await batch("judge", list, (c) => judgeRequest(c, load(runFile(c.id))), (c, msg) => {
    let g;
    try { g = JSON.parse(textOf(msg)); } catch { g = { verdict: "error", summary: `Judge reply wasn't JSON (stop: ${msg.stop_reason}).` }; }
    const model = msg.model || JUDGE.model;
    save(gradeFile(c.id), { id: c.id, fp: load(runFile(c.id)).fp, model, at: new Date().toISOString(), usage: msg.usage, usd: cost(model, msg.usage), ...g });
  });
  status();
} else {
  console.log("Use: run | judge | status (see the top of this file).");
}
