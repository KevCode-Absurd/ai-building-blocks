#!/usr/bin/env node
// check-team.mjs (AI Blocks): checks the handover between a lead and its helpers, and the store memory.
//
//   node tools/check-team.mjs brief  <context/briefs/agent.md>                one helper brief
//   node tools/check-team.mjs return <context/parts/agent.md> [--brief <f>]   one helper return, against its brief
//   node tools/check-team.mjs ledger <context/ledger.md>                      this job's ledger
//   node tools/check-team.mjs all    [<context folder>]                       ledger, every brief and every return
//   node tools/check-team.mjs memory <context/MEMORY.md or a pasted packet>   the store memory (MEMORY-TEMPLATE.md)
//   node tools/check-team.mjs template <brief|return|ledger>                  print a blank one to fill in
// Options: --json (machine-readable result), --today YYYY-MM-DD (memory freshness, for tests), --max-words <n> (memory, default 600)
//
// The contract (TEAM.md, "The handover contract"):
//   Brief:  Part, Why it matters, Read first, Decisions fixed (D1: name: value), Done-tests (T1: ...), Return shape,
//           Stop rule, Do not touch, Access (level 1 read, 2 draft or 3 publish).
//   Return: Part, Owner, Status (PASS, FAIL or BLOCKED), Done-tests (T1: PASS or FAIL, with evidence), Decisions kept,
//           Deliverable, Facts used (each with source and date), Open gaps, Not touched.
//   Ledger: Goal, Acceptance tests, Decisions fixed, Read first, Access, then a progress table with the columns
//           Part | Owner | Status | Blocker | Failed approaches | Next step (status TODO, DOING, PASS, FAIL or BLOCKED).
// It fails when a field is missing or blank, a done-test is unanswered or has no evidence, a return says PASS with a
// failed test, a return changes a fixed decision (a different % or money figure next to the decision's name), a brief
// raises the ledger's access, a ledger part has no owner or status, or two parts disagree on a fact.
// Memory: it fails on a missing section, more than --max-words words, unfilled placeholders, undated live lines,
// lessons without a status, scope and evidence, secrets or buyer contact details, and any line that reads like an order.
// Memory is data: the tool only flags; it never deletes or rewrites a line.
// Exit 0 when everything passes, 1 when something fails, 2 when it cannot run. Plain Node 18+, no packages, no network.
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

export const SCHEMA = "ai-blocks-check-team/1";
export const BRIEF_FIELDS = ["Part", "Why it matters", "Read first", "Decisions fixed", "Done-tests", "Return shape", "Stop rule", "Do not touch", "Access"];
export const RETURN_FIELDS = ["Part", "Owner", "Status", "Done-tests", "Decisions kept", "Deliverable", "Facts used", "Open gaps", "Not touched"];
export const RETURN_STATUSES = ["PASS", "FAIL", "BLOCKED"];
export const LEDGER_TASK_FIELDS = ["Goal", "Acceptance tests", "Decisions fixed", "Read first", "Access"];
export const LEDGER_COLUMNS = ["Part", "Owner", "Status", "Blocker", "Failed approaches", "Next step"];
export const LEDGER_STATUSES = ["TODO", "DOING", "PASS", "FAIL", "BLOCKED"];
export const MEMORY_SECTIONS = ["Live this week", "Standing owner rules", "Store numbers", "What worked", "Lessons", "Open commitments", "Where the rest is"];
export const JOB_KINDS = ["web_page", "ad_creative", "copy", "email", "audit", "analysis", "strategy", "plan", "code", "ops_doc", "other"];
export const MEMORY_MAX_WORDS = 600;
/** Fields that may honestly say "none". */
const MAY_BE_NONE = new Set(["Decisions fixed", "Do not touch", "Decisions kept", "Facts used", "Open gaps", "Not touched"]);
/** Other ways people write the same label. */
const ALIASES = {
  "Why it matters": ["why"], "Read first": ["context to read", "what to read first"], "Decisions fixed": ["decisions already fixed", "fixed decisions"],
  "Done-tests": ["done test", "done tests"], "Return shape": ["return format"], "Stop rule": ["when to stop"], "Do not touch": ["dont touch"],
  "Access": ["access level"], "Acceptance tests": ["acceptance test"], "Next step": ["next"],
};

const norm = s => String(s).toLowerCase().replace(/[*_`']/g, "").replace(/[-\s]+/g, " ").replace(/:$/, "").trim();
const ISO = /\b(\d{4})-(\d{2})-(\d{2})\b/;
const isNone = v => /^(?:none|nothing|no|n\/a|none yet)\.?$/i.test(v.trim());
const isBlank = v => !v.trim() || /^(?:tbd|todo|tbc|\?+|-+|\.\.\.|<[^>]*>)$/i.test(v.trim());
const words = text => (text.match(/[\p{L}\p{N}][\p{L}\p{N}'’.,%£$€₹/-]*/gu) ?? []).length;
const problem = (line, message) => ({ line, message });

/** Reads "Label: value" lines and "## Label" headings into fields; a field runs until the next known label or heading. */
export function readFields(text, labels) {
  const table = new Map();
  for (const label of labels) for (const alias of [label, ...(ALIASES[label] ?? [])]) table.set(norm(alias), label);
  const found = new Map();
  let current = null;
  const lines = text.split(/\r?\n/);
  lines.forEach((raw, i) => {
    const heading = raw.match(/^\s*#{1,6}\s+(.+?)\s*$/);
    if (heading) {
      const label = table.get(norm(heading[1]));
      if (label && !found.has(label)) { current = label; found.set(label, { line: i + 1, rows: [] }); }
      else if (current === "Deliverable") found.get(current).rows.push({ text: raw, line: i + 1 }); // headings inside the free-text deliverable stay part of it
      else current = null;
      return;
    }
    const labelled = raw.match(/^\s*(?:[-*]\s+)?(?:\*\*)?([A-Za-z][A-Za-z' -]{0,40}?)\s*(?::\*\*|\*\*:|:)\s*(.*)$/);
    const label = labelled ? table.get(norm(labelled[1])) : undefined;
    if (label && !found.has(label)) {
      current = label;
      found.set(label, { line: i + 1, rows: labelled[2].trim() ? [{ text: labelled[2].trim(), line: i + 1 }] : [] });
      return;
    }
    if (current) found.get(current).rows.push({ text: raw, line: i + 1 });
  });
  const out = {};
  for (const [label, f] of found) {
    const rows = f.rows.filter(r => !/^\s*```/.test(r.text));
    out[label] = { line: f.line, value: rows.map(r => r.text).join("\n").trim(), lines: rows.map(r => r.text), rows };
  }
  return out;
}

/** Numbered items such as "T1: ..." or "D2: name: value" inside a field. */
function numbered(field, letter) {
  if (!field) return [];
  const items = [];
  for (const row of field.rows) {
    const m = row.text.match(new RegExp(`^\\s*(?:[-*]\\s+)?(?:\\*\\*)?(${letter}\\d+)(?:\\*\\*)?\\s*[:.)]\\s*(.*)$`, "i"));
    if (m) items.push({ id: m[1].toUpperCase(), text: m[2].trim(), line: row.line });
  }
  return items;
}

const bullets = field => (field?.lines ?? []).map(l => l.trim()).filter(l => /^(?:[-*]|\d+[.)])\s+/.test(l)).map(l => l.replace(/^(?:[-*]|\d+[.)])\s+/, ""));

/** "D1: name: value" into its parts. */
function decisions(field) {
  return numbered(field, "D").map(d => {
    const m = d.text.match(/^([^:]{2,60}):\s*(.+)$/);
    return { ...d, name: m ? m[1].trim() : "", value: m ? m[2].trim() : d.text };
  });
}

/** The access level a text grants: 1 read, 2 draft, 3 publish. */
export function accessLevel(text) {
  const m = String(text).match(/\blevel\s*([123])\b/i);
  if (m) return Number(m[1]);
  if (/\bdraft/i.test(text)) return 2;
  if (/\bread\b/i.test(text)) return 1;
  if (/\bpublish|\bsend\b|\bspend\b/i.test(text)) return 3;
  return null;
}

/** % and money figures in a text, keyed by kind so only like is compared with like. */
function figures(text) {
  const out = { pct: new Set(), money: new Set() };
  for (const m of String(text).matchAll(/(\d+(?:\.\d+)?)\s?%/g)) out.pct.add(Number(m[1]));
  for (const m of String(text).matchAll(/(?:([£$€₹])\s?|\b(?:rs\.?|inr|usd|gbp|eur|aud|cad)\s?)(\d[\d,]*(?:\.\d+)?)/gi)) out.money.add(Number(m[2].replace(/,/g, "")));
  return out;
}
const STOP = new Set(["the", "and", "for", "with", "our", "per", "off", "from", "only", "all", "any", "one", "this", "that", "first"]);
const keyWords = name => norm(name).split(/[^a-z0-9]+/).filter(w => w.length >= 3 && !STOP.has(w));

function requireFields(fields, labels, problems, what) {
  for (const label of labels) {
    const f = fields[label];
    if (!f) { problems.push(problem(null, `${what} has no "${label}" field.`)); continue; }
    if (isBlank(f.value)) problems.push(problem(f.line, `"${label}" is blank. Fill it in${MAY_BE_NONE.has(label) ? ', or write "none"' : ""}.`));
    else if (isNone(f.value) && !MAY_BE_NONE.has(label)) problems.push(problem(f.line, `"${label}" cannot be "none".`));
  }
}

function placeholders(text, problems) {
  text.split(/\r?\n/).forEach((l, i) => {
    const m = l.match(/<[a-z][^<>\n]{0,60}>|\bYYYY-MM-DD\b|\[(?:X|TBD|TODO)\]/i);
    if (m) problems.push(problem(i + 1, `unfilled placeholder "${m[0]}".`));
  });
}

/** One helper brief. */
export function checkBrief(text, { ledger } = {}) {
  const problems = [], notes = [];
  const f = readFields(text, BRIEF_FIELDS);
  requireFields(f, BRIEF_FIELDS, problems, "The brief");
  placeholders(text, problems);
  const tests = numbered(f["Done-tests"], "T");
  if (f["Done-tests"] && !tests.length) problems.push(problem(f["Done-tests"].line, "Done-tests: number each test (T1: ..., T2: ...) so the return can answer each one."));
  const ids = tests.map(t => t.id);
  if (new Set(ids).size !== ids.length) problems.push(problem(f["Done-tests"].line, "Done-tests: two tests share one number."));
  for (const t of tests) if (words(t.text) < 3) problems.push(problem(t.line, `${t.id} is too short to pass or fail. Say what is checked and what counts as a pass.`));
  const ds = decisions(f["Decisions fixed"]);
  if (f["Decisions fixed"] && !isNone(f["Decisions fixed"].value) && !isBlank(f["Decisions fixed"].value)) {
    if (!ds.length) problems.push(problem(f["Decisions fixed"].line, 'Decisions fixed: write each as "D1: name: value", or "none".'));
    for (const d of ds) if (!d.name) problems.push(problem(d.line, `${d.id}: write it as "${d.id}: name: value", so a return can be checked against it.`));
  }
  const level = f.Access ? accessLevel(f.Access.value) : null;
  if (f.Access && !isBlank(f.Access.value) && level === null) problems.push(problem(f.Access.line, "Access: name the level, 1 (read), 2 (draft) or 3 (publish)."));
  if (ledger && level !== null && ledger.access !== null && level > ledger.access) problems.push(problem(f.Access.line, `Access: the brief grants level ${level}, but the owner granted level ${ledger.access} in the ledger. A brief never raises access.`));
  if (ledger) for (const d of ds) {
    const fixed = ledger.decisions.find(x => x.id === d.id);
    if (!fixed) problems.push(problem(d.line, `${d.id} is not in the ledger's fixed decisions. Fix decisions in the ledger first.`));
    else if (norm(fixed.name) !== norm(d.name) || norm(fixed.value) !== norm(d.value)) problems.push(problem(d.line, `${d.id} differs from the ledger ("${fixed.name}: ${fixed.value}"). A brief never changes a fixed decision.`));
  }
  return { ok: !problems.length, problems, notes, tests: ids, decisions: ds, access: level };
}

/** One helper return, against its brief when given. */
export function checkReturn(text, { brief, briefText, owner, ledger } = {}) {
  const problems = [], notes = [];
  const b = brief ?? (briefText ? checkBrief(briefText, { ledger }) : null);
  const f = readFields(text, RETURN_FIELDS);
  requireFields(f, RETURN_FIELDS, problems, "The return");
  placeholders(text, problems);
  const status = f.Status ? (f.Status.value.match(/\b(PASS|FAIL|BLOCKED)\b/i)?.[1] ?? "").toUpperCase() : "";
  if (f.Status && !isBlank(f.Status.value) && !status) problems.push(problem(f.Status.line, "Status must be PASS, FAIL or BLOCKED."));
  if (owner && f.Owner && !norm(f.Owner.value).includes(norm(owner))) problems.push(problem(f.Owner.line, `This is ${owner}'s part file, but Owner says "${f.Owner.value}". Each helper writes only its own part file.`));
  const answers = new Map();
  for (const t of numbered(f["Done-tests"], "T")) {
    const m = t.text.match(/^(PASS|FAIL)\b[\s:.,|-]*(.*)$/i);
    answers.set(t.id, { line: t.line, verdict: m ? m[1].toUpperCase() : "", evidence: m ? m[2].trim() : "" });
  }
  if (f["Done-tests"] && !answers.size) problems.push(problem(f["Done-tests"].line, "Done-tests: answer each test by number (T1: PASS, with the evidence)."));
  for (const [id, a] of answers) {
    if (!a.verdict) problems.push(problem(a.line, `${id}: start the answer with PASS or FAIL.`));
    else if (words(a.evidence) < 2) problems.push(problem(a.line, `${id}: ${a.verdict} needs its evidence (what you checked and what you saw).`));
  }
  if (b) for (const id of b.tests) if (!answers.has(id)) problems.push(problem(f["Done-tests"]?.line ?? null, `${id} from the brief has no answer.`));
  const failed = [...answers].filter(([, a]) => a.verdict === "FAIL").map(([id]) => id);
  if (status === "PASS" && failed.length) problems.push(problem(f.Status.line, `Status says PASS, but ${failed.join(", ")} failed.`));
  // Fixed decisions: each one kept, or the part is BLOCKED; and no figure in the work that differs from a fixed one.
  const fixed = b?.decisions?.length ? b.decisions : ledger?.decisions ?? [];
  if (fixed.length) {
    const kept = f["Decisions kept"]?.value ?? "";
    for (const d of fixed) {
      const line = kept.split(/\r?\n/).find(l => new RegExp(`\\b${d.id}\\b`, "i").test(l));
      if (!line) problems.push(problem(f["Decisions kept"]?.line ?? null, `${d.id} (${d.name}) is not in "Decisions kept". Say "${d.id}: kept", or why not.`));
      else if (!/\bkept\b/i.test(line) || /\bnot kept\b/i.test(line)) {
        if (status !== "BLOCKED") problems.push(problem(f["Decisions kept"].line, `${d.id} was not kept. A fixed decision is not reopened by a helper: mark the part BLOCKED and say why, for the lead to decide.`));
      }
    }
    const work = ["Deliverable", "Facts used"].flatMap(k => f[k] ? f[k].rows.map(r => ({ l: r.text, line: r.line })) : []);
    for (const d of fixed) {
      const want = figures(d.value), keys = keyWords(d.name);
      if (!keys.length || (!want.pct.size && !want.money.size)) continue;
      for (const { l, line } of work) {
        if (!keys.some(k => new RegExp(`\\b${k}`, "i").test(l))) continue;
        const got = figures(l);
        for (const kind of ["pct", "money"]) {
          if (!want[kind].size) continue;
          const odd = [...got[kind]].filter(n => !want[kind].has(n));
          if (odd.length) problems.push(problem(line, `This line gives ${odd.join(", ")}${kind === "pct" ? "%" : ""} for "${d.name}", but ${d.id} fixed it at "${d.value}".`));
        }
      }
    }
  }
  const facts = factsOf(f["Facts used"]);
  for (const x of facts) if (!x.dated || !x.sourced) problems.push(problem(x.line, `Fact "${x.raw.slice(0, 60)}" needs ${!x.sourced ? "its source" : ""}${!x.sourced && !x.dated ? " and " : ""}${!x.dated ? "its date (YYYY-MM-DD)" : ""}.`));
  return { ok: !problems.length, problems, notes, status, facts };
}

function factsOf(field) {
  if (!field || isNone(field.value) || isBlank(field.value)) return [];
  return field.rows.map(r => ({ raw: r.text.replace(/^\s*(?:[-*]|\d+[.)])\s+/, "").trim(), line: r.line }))
    .filter(x => x.raw && !isNone(x.raw))
    .map(x => {
      const parts = x.raw.split("|").map(s => s.trim());
      const nv = parts[0].match(/^([^:]{2,60}):\s*(.+)$/);
      return { ...x, name: nv ? nv[1].trim() : "", value: nv ? nv[2].trim() : parts[0], dated: ISO.test(x.raw), sourced: parts.length >= 3 || /\bsource\b|https?:\/\/|\bowner\b|\bbrief\b/i.test(x.raw) };
    });
}

/** This job's ledger: the task fields and a progress table. */
export function checkLedger(text) {
  const problems = [], notes = [];
  const f = readFields(text, LEDGER_TASK_FIELDS);
  requireFields(f, LEDGER_TASK_FIELDS, problems, "The ledger");
  placeholders(text, problems);
  const ds = decisions(f["Decisions fixed"]);
  if (f["Decisions fixed"] && !isNone(f["Decisions fixed"].value) && !isBlank(f["Decisions fixed"].value) && !ds.length) problems.push(problem(f["Decisions fixed"].line, 'Decisions fixed: write each as "D1: name: value", or "none".'));
  const access = f.Access ? accessLevel(f.Access.value) : null;
  if (f.Access && !isBlank(f.Access.value) && access === null) problems.push(problem(f.Access.line, "Access: name the level the owner granted, 1 (read), 2 (draft) or 3 (publish)."));
  if (f["Acceptance tests"] && !bullets(f["Acceptance tests"]).length && !numbered(f["Acceptance tests"], "[AT]").length) problems.push(problem(f["Acceptance tests"].line, "Acceptance tests: list each test on its own line."));
  const lines = text.split(/\r?\n/);
  const start = lines.findIndex(l => /^\s*\|/.test(l) && LEDGER_COLUMNS.slice(0, 3).every(c => l.toLowerCase().includes(c.toLowerCase())));
  const rows = [];
  if (start < 0) problems.push(problem(null, `The ledger has no progress table with the columns ${LEDGER_COLUMNS.join(" | ")}.`));
  else {
    const cells = l => l.trim().replace(/^\||\|$/g, "").split("|").map(c => c.trim());
    const head = cells(lines[start]).map(norm);
    const at = Object.fromEntries(LEDGER_COLUMNS.map(c => [c, head.indexOf(norm(c))]));
    for (const c of LEDGER_COLUMNS) if (at[c] < 0) problems.push(problem(start + 1, `The progress table has no "${c}" column.`));
    for (let i = start + 1; i < lines.length && /^\s*\|/.test(lines[i]); i++) {
      if (/^\s*\|[\s:|-]+\|\s*$/.test(lines[i])) continue;
      const c = cells(lines[i]);
      const get = k => (at[k] >= 0 ? c[at[k]] ?? "" : "");
      const row = { line: i + 1, part: get("Part"), owner: get("Owner"), status: get("Status").toUpperCase().replace(/^TO DO$/, "TODO").replace(/^IN PROGRESS$/, "DOING"), blocker: get("Blocker") };
      rows.push(row);
      if (isBlank(row.part)) problems.push(problem(row.line, "A progress row has no part."));
      if (isBlank(row.owner)) problems.push(problem(row.line, `Part "${row.part}" has no owner.`));
      if (!LEDGER_STATUSES.includes(row.status)) problems.push(problem(row.line, `Part "${row.part}" has status "${get("Status")}". Use ${LEDGER_STATUSES.join(", ")}.`));
      if (row.status === "BLOCKED" && (isBlank(row.blocker) || isNone(row.blocker))) problems.push(problem(row.line, `Part "${row.part}" is BLOCKED but names no blocker.`));
    }
    if (!rows.length) problems.push(problem(start + 1, "The progress table has no parts yet."));
  }
  lines.forEach((l, i) => { if (/gross profit per|spending limit|spend cap|\bcapacity\b/i.test(l)) notes.push(`line ${i + 1}: store facts such as profit per order, the spending limit and capacity belong in context/MEMORY.md and the org context, not in a job ledger.`); });
  return { ok: !problems.length, problems, notes, decisions: ds, access, rows };
}

/** Ledger, briefs and returns together, with the checks that need more than one file. */
export function checkTeam(dir) {
  const results = [];
  const read = p => fs.readFileSync(p, "utf8");
  const ledgerFile = path.join(dir, "ledger.md");
  const ledger = fs.existsSync(ledgerFile) ? checkLedger(read(ledgerFile)) : null;
  results.push(ledger ? { kind: "ledger", file: ledgerFile, ...ledger } : { kind: "ledger", file: ledgerFile, ok: false, problems: [problem(null, "There is no ledger. Write context/ledger.md first (template: node tools/check-team.mjs template ledger).")], notes: [] });
  const list = sub => { const d = path.join(dir, sub); return fs.existsSync(d) ? fs.readdirSync(d).filter(n => n.endsWith(".md")).sort().map(n => ({ id: n.replace(/\.md$/, ""), file: path.join(d, n) })) : []; };
  const briefs = new Map(list("briefs").map(b => [b.id, { ...b, text: read(b.file) }]));
  const owners = (ledger?.rows ?? []).map(r => norm(r.owner));
  const inLedger = id => owners.some(o => o.includes(norm(id)));
  for (const [id, b] of briefs) {
    const r = checkBrief(b.text, { ledger: ledger ?? undefined });
    if (ledger && !inLedger(id)) r.problems.push(problem(null, `There is a brief for ${id}, but no ledger row names ${id} as owner.`));
    results.push({ kind: "brief", file: b.file, ...r, ok: !r.problems.length });
  }
  const parts = list("parts");
  const allFacts = [];
  for (const p of parts) {
    const b = briefs.get(p.id);
    const r = checkReturn(read(p.file), { brief: b ? checkBrief(b.text, { ledger: ledger ?? undefined }) : undefined, owner: p.id, ledger: ledger ?? undefined });
    if (!b) r.problems.push(problem(null, `There is no brief for ${p.id} in briefs/. Every part starts from a brief.`));
    if (ledger && !inLedger(p.id)) r.problems.push(problem(null, `${p.id} returned a part, but no ledger row names ${p.id} as owner.`));
    for (const x of r.facts) if (x.name) allFacts.push({ ...x, owner: p.id, file: p.file });
    results.push({ kind: "return", file: p.file, ...r, ok: !r.problems.length });
  }
  for (const row of ledger?.rows ?? []) {
    if (row.status === "PASS" && !parts.some(p => norm(row.owner).includes(norm(p.id)))) results[0].problems.push(problem(row.line, `Part "${row.part}" is PASS in the ledger, but ${row.owner} has no return in parts/.`));
  }
  // Two parts, or a part and a fixed decision, that disagree on one named fact.
  const cross = [];
  const byName = new Map();
  for (const x of allFacts) { const k = norm(x.name); if (!byName.has(k)) byName.set(k, []); byName.get(k).push(x); }
  for (const [, xs] of byName) {
    const values = [...new Set(xs.map(x => norm(x.value)))];
    if (values.length > 1) cross.push(problem(null, `Parts disagree on "${xs[0].name}": ${xs.map(x => `${x.owner} says "${x.value}"`).join("; ")}. The lead decides which is right before merging.`));
  }
  for (const d of ledger?.decisions ?? []) for (const x of byName.get(norm(d.name)) ?? []) if (norm(x.value) !== norm(d.value)) cross.push(problem(null, `${x.owner} uses "${d.name}: ${x.value}", but ${d.id} fixed it at "${d.value}".`));
  if (cross.length) results.push({ kind: "team", file: dir, ok: false, problems: cross, notes: [] });
  if (ledger) results[0].ok = !results[0].problems.length;
  return results;
}

const ORDER_LIKE = [
  /\b(?:ignore|disregard)\b.{0,40}\b(?:rules?|instructions?|limits?|caps?|policy|checks?|owner)\b/i,
  /\b(?:always|auto(?:matically)?)[ -]?approve/i,
  /\bno need to ask\b|\bwithout asking\b|\bdo not ask (?:me|the owner|for (?:a )?yes)\b|\bdon'?t ask (?:me|the owner)\b/i,
  /\bskip (?:the )?(?:checks?|approvals?|tests?|review)\b/i,
  /\b(?:send|publish|spend|pay|transfer|post)\b.{0,40}\bwithout\b.{0,25}\b(?:yes|approval|asking|ok|okay|sign-?off)\b/i,
  /\byou are now\b|\bsystem prompt\b|\bdeveloper mode\b|\bnew instructions\b/i,
  /\b(?:raise|increase|lift|exceed)\b.{0,25}\b(?:budget|cap|spending limit|limit)\b.{0,40}\b(?:without|no need|automatically|anytime)\b/i,
];
/** "Never publish without my yes" narrows what an agent may do; only a line that widens it is an order. */
const RESTRICTS = /\b(?:never|don'?t|do not|must not|not allowed|no)\b/i;
const WIDENS = new Set([ORDER_LIKE[4], ORDER_LIKE[6]]);
const SECRETS = [
  [/\b(?:sk|pk|rk)[-_](?:live[-_]|test[-_]|proj[-_])?[A-Za-z0-9]{16,}\b/, "an API key"],
  [/\bAKIA[0-9A-Z]{16}\b/, "an access key"], [/\bgh[pousr]_[A-Za-z0-9]{20,}\b/, "a code token"], [/\bxox[abpr]-[A-Za-z0-9-]{10,}/, "a chat token"],
  [/\bAIza[0-9A-Za-z_-]{30,}/, "an API key"], [/\b(?:password|passwd|passcode|api[ _-]?key|secret|token)\s*[:=]\s*\S+/i, "a password or key"],
  [/[\w.+-]+@[\w-]+\.[\w.-]+/, "an email address (a store's own contact belongs in the org context)"], [/(?<![\w-])\+\d{1,3}[\s-]?\d[\d\s-]{6,}\d\b/, "a phone number"],
];
const luhn = digits => { let sum = 0; for (let i = 0; i < digits.length; i++) { let d = Number(digits[digits.length - 1 - i]); if (i % 2) { d *= 2; if (d > 9) d -= 9; } sum += d; } return sum % 10 === 0; };

/** The store memory, or a pasted memory packet (MEMORY-TEMPLATE.md). */
export function checkMemory(text, { maxWords = MEMORY_MAX_WORDS, today } = {}) {
  const problems = [], notes = [];
  const clean = text.replace(/<!--[\s\S]*?-->/g, "");
  const lines = clean.split(/\r?\n/);
  if (!lines.some(l => /^\s*#\s+Store memory:\s*\S/i.test(l))) problems.push(problem(null, 'The memory has no "# Store memory: <store name>" title.'));
  const updated = clean.match(/^\s*Updated:\s*(\d{4}-\d{2}-\d{2})/im)?.[1];
  if (!updated) problems.push(problem(null, 'The memory has no "Updated: YYYY-MM-DD" line.'));
  const n = words(lines.filter(l => !/^\s*```/.test(l)).join("\n"));
  if (n > maxWords) problems.push(problem(null, `${n} words, over ${maxWords}. Drop the oldest "What worked" lines first, then retired lessons.`));
  placeholders(clean, problems);
  const f = readFields(clean, MEMORY_SECTIONS);
  for (const s of MEMORY_SECTIONS) if (!f[s]) problems.push(problem(null, `The memory has no "## ${s}" section. Write "none" under it if it is empty.`));
  const items = s => (f[s]?.rows ?? []).map(r => ({ l: r.text.trim(), line: r.line })).filter(x => /^[-*]\s+/.test(x.l) && !isNone(x.l.replace(/^[-*]\s+/, "")));
  const now = today ?? new Date().toISOString().slice(0, 10);
  const age = d => Math.round((Date.parse(now) - Date.parse(d)) / 864e5);
  for (const x of items("Live this week")) {
    const d = x.l.match(ISO)?.[0];
    if (!d) problems.push(problem(x.line, "A live line needs its date. Prices, offers, stock and shipping go stale after 7 days."));
    else if (age(d) > 7) notes.push(`line ${x.line}: dated ${d}, ${age(d)} days old. Recheck it before you use it; never hand it over as a current fact.`);
  }
  for (const s of ["Store numbers", "Open commitments"]) for (const x of items(s)) if (!ISO.test(x.l)) problems.push(problem(x.line, `A "${s}" line needs its date.`));
  for (const x of items("Store numbers")) if (x.l.split("|").length < 3) problems.push(problem(x.line, "A store number needs its source and date: name: value | source | date."));
  for (const x of items("Standing owner rules")) if (!ISO.test(x.l)) notes.push(`line ${x.line}: an owner rule without a date. Add when the owner said it.`);
  const worked = items("What worked");
  if (worked.length > 5) problems.push(problem(worked[5].line, `${worked.length} "What worked" lines. Keep the last 5, newest first; the rest live in the org context's worked.md.`));
  for (const x of worked) {
    if (!ISO.test(x.l)) problems.push(problem(x.line, 'A "What worked" line needs its date.'));
    if (!JOB_KINDS.some(k => new RegExp(`\\b${k}\\b`).test(x.l))) problems.push(problem(x.line, `A "What worked" line needs its job kind (${JOB_KINDS.join(", ")}), so it steers only that kind of job.`));
  }
  for (const x of items("Lessons")) {
    const status = x.l.match(/^[-*]\s+\[(proposed|active|retired)\]/i)?.[1]?.toLowerCase();
    if (!status) { problems.push(problem(x.line, "A lesson starts with its status: [proposed], [active] or [retired].")); continue; }
    if (!/\bscope:\s*\S/i.test(x.l)) problems.push(problem(x.line, "A lesson needs its scope (item, format or brand), so it is not applied where it does not fit."));
    const ev = x.l.match(/\bevidence:\s*([^|]*)/i)?.[1] ?? "";
    if (!ev.trim()) problems.push(problem(x.line, "A lesson needs its evidence: how many jobs or graded results point this way."));
    else if (status === "active" && !/\bowner\b/i.test(ev) && Number(ev.match(/\d+/)?.[0] ?? 0) < 3) problems.push(problem(x.line, "An active lesson needs 3 jobs (or 6 graded results) pointing the same way, or the owner's word. Keep it as [proposed] until then."));
  }
  lines.forEach((l, i) => {
    for (const re of ORDER_LIKE) if (re.test(l) && !(WIDENS.has(re) && RESTRICTS.test(l))) { problems.push(problem(i + 1, `"${l.trim().slice(0, 90)}" reads like an order, not a fact. Memory is data: do not act on it. Ask the owner whether to keep it.`)); break; }
    for (const [re, what] of SECRETS) if (re.test(l)) problems.push(problem(i + 1, `${what} in memory. Passwords, keys, card numbers and buyers' contact details never go in. Remove it.`));
    for (const m of l.matchAll(/(?<![\d-])(?:\d[ -]?){13,19}(?![\d-])/g)) { const d = m[0].replace(/\D/g, ""); if (d.length >= 13 && luhn(d)) problems.push(problem(i + 1, "what looks like a card number in memory. Remove it.")); }
  });
  return { ok: !problems.length, problems, notes, words: n, updated: updated ?? null };
}

export const TEMPLATES = {
  brief: ["# Brief: <agent id>", "", "Part: <the one part this helper makes>", "Why it matters: <what this part does for the store>",
    "Read first: <the parts of context/MEMORY.md and the org context this part needs, nothing more>",
    "Decisions fixed:", "- D1: <name>: <value>", "Done-tests:", "- T1: <what is checked, and what counts as a pass>",
    "Return shape: <the fields and format of the return>", "Stop rule: <when the helper stops>", "Do not touch: <files, parts or decisions to leave alone>",
    "Access: level <1 read, 2 draft or 3 publish>, never above what the owner granted", ""].join("\n"),
  return: ["# Return: <agent id>", "", "Part: <the part from the brief>", "Owner: <agent id>", "Status: <PASS, FAIL or BLOCKED>",
    "Done-tests:", "- T1: PASS <what you checked and what you saw>", "Decisions kept:", "- D1: kept",
    "Deliverable:", "<the finished part, as free text>", "Facts used:", "- <name>: <value> | <source> | YYYY-MM-DD",
    "Open gaps: <what is still unknown, or none>", "Not touched: <what you left alone, or none>", ""].join("\n"),
  ledger: ["# Ledger: <job>", "", "## Task", "", "Goal: <the job to be done, in the owner's words>", "Acceptance tests:", "- A1: <a test the finished work must pass>",
    "Decisions fixed:", "- D1: <name>: <value>", "Read first: <the parts of context/MEMORY.md and the org context this job needs>",
    "Access: level <1, 2 or 3>, as the owner granted in this chat", "", "## Progress", "",
    `| ${LEDGER_COLUMNS.join(" | ")} |`, `|${LEDGER_COLUMNS.map(() => "---").join("|")}|`, "| <part> | <agent id> | TODO | none | none | <next step> |", ""].join("\n"),
};

function print(results, json) {
  const ok = results.every(r => r.ok);
  if (json) { console.log(JSON.stringify({ schema: SCHEMA, ok, results }, null, 2)); return ok; }
  for (const r of results) {
    console.log(`${r.ok ? "PASS" : "FAIL"} ${r.kind} ${r.file}${r.ok ? "" : ` (${r.problems.length} to fix)`}`);
    for (const p of r.problems) console.log(`  - ${p.line ? `line ${p.line}: ` : ""}${p.message}`);
    for (const nt of r.notes ?? []) console.log(`  note: ${nt}`);
  }
  console.log(ok ? "Clean: the handover checks pass." : "Fix the lines above, then run it again.");
  return ok;
}

function main(argv) {
  const json = argv.includes("--json");
  const valueOf = flag => { const i = argv.indexOf(flag); return i >= 0 ? argv[i + 1] : undefined; };
  const skip = new Set(["--json"]);
  const flags = ["--brief", "--today", "--max-words"];
  const rest = argv.filter((a, i) => !skip.has(a) && !flags.includes(a) && !flags.includes(argv[i - 1]));
  const [cmd, target] = rest;
  const need = f => { if (!f || !fs.existsSync(f)) { console.error(`Cannot read ${f ?? "the file"}. Usage: node tools/check-team.mjs <brief|return|ledger|all|memory|template> <file or folder>`); process.exit(2); } return fs.readFileSync(f, "utf8"); };
  let results;
  if (cmd === "template") {
    if (!TEMPLATES[target]) { console.error("Usage: node tools/check-team.mjs template <brief|return|ledger>. The memory template is MEMORY-TEMPLATE.md."); process.exit(2); }
    process.stdout.write(TEMPLATES[target]); return 0;
  } else if (cmd === "brief") results = [{ kind: "brief", file: target, ...checkBrief(need(target)) }];
  else if (cmd === "return") {
    const bf = valueOf("--brief");
    results = [{ kind: "return", file: target, ...checkReturn(need(target), { briefText: bf ? need(bf) : undefined }) }];
  } else if (cmd === "ledger") results = [{ kind: "ledger", file: target, ...checkLedger(need(target)) }];
  else if (cmd === "all") {
    const dir = target ?? "context";
    if (!fs.existsSync(dir)) { console.error(`Cannot find the folder ${dir}.`); process.exit(2); }
    results = checkTeam(dir);
  } else if (cmd === "memory") {
    const maxWords = Number(valueOf("--max-words") ?? MEMORY_MAX_WORDS);
    results = [{ kind: "memory", file: target, ...checkMemory(need(target), { maxWords, today: valueOf("--today") }) }];
  } else { console.error("Usage: node tools/check-team.mjs <brief|return|ledger|all|memory|template> <file or folder> [--json]"); process.exit(2); }
  return print(results, json) ? 0 : 1;
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) process.exitCode = main(process.argv.slice(2));
export { main };
