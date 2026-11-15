#!/usr/bin/env node
// Bench leak guard: fails if bench brand names, persona names or owner-note figures appear in pack or skill
// content more often than they did before the top-10 work began.
//
//   node bench-leak-guard.cjs [--base <git ref>] [--json] [--list-terms] [--paths a,b,c]
//
// Scans (in the repo that holds this script):
//   marketplace/packs        (shared method, roles, coordinator, mega)
//   marketplace/knowledge    (e-commerce knowledge and skills)
//   catalogue-items          (source skills that packs are built from)
//
// Terms come from the bench itself, so new briefs are covered without editing this file:
//   - brands: the 23 names in IMPLEMENTER-RULES.md rule 4, plus the business name and domain on the
//     "**Business:**" line of every brief in ecom/, general/ and heldout/;
//   - persona names: the named people under "Who we sell to" in every brief;
//   - figures: distinctive numbers in the "Signals in the data" and "Facts a careful answer gets right" sections of
//     every owner-notes file (at least 3 significant digits, or an Indian lakh format such as 5,60,000).
// Common English words (Plum, Buffer, Minimalist, Plausible, Snitch, Headspace, Basecamp, The Whole Truth) and
// persona names match case-sensitively; everything else matches in any case. All terms match whole words only.
//
// A match counts as a leak when a file holds more matches of a term than it did at --base. The default base is
// the commit the top-10 work started from (13 November 2026), so matches that were already there pass and only
// new ones fail. Tracked and untracked files in the working tree are checked; ignored files are not.
// Exit 0 = no new matches, 1 = new matches (listed with file and line), 2 = usage or git error.
"use strict";
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const BENCH = path.resolve(__dirname, "..");
const REPO = path.resolve(BENCH, "..", "..", "..");
const DEFAULT_BASE = "6e2e42476ce443054704a2633e0fb53885545b00";
const DEFAULT_PATHS = ["marketplace/packs", "marketplace/knowledge", "catalogue-items"];

const RULE_BRANDS = ["Bombay Shaving Company", "Bombas", "Mokobara", "Olipop", "The Whole Truth", "Bellroy", "Minimalist",
  "Blue Tokai", "Brooklinen", "Plum", "Wakefit", "Snitch", "Plausible", "Cal.com", "Supabase", "Chargebee", "Basecamp",
  "37signals", "Ahrefs", "Raycast", "Buffer", "Headspace", "Todoist",
  "SUGAR Cosmetics", "Rothy's", "Lounge Underwear", "Babbel", "Splitwise", "Podia"];
// Brand names that are also everyday words: match only as written (capitalised).
const CASE_SENSITIVE_BRANDS = new Set(["Plum", "Buffer", "Minimalist", "Plausible", "Snitch", "Headspace", "Basecamp", "The Whole Truth"]);

const briefFiles = () => ["ecom", "general", "heldout"].flatMap(d => {
  const dir = path.join(BENCH, d);
  return fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => /^[A-Z]+\d+(\.owner)?\.md$/.test(f)).sort().map(f => path.join(dir, f)) : [];
});

function section(text, startRe) {
  const lines = text.split(/\r?\n/), i = lines.findIndex(l => startRe.test(l));
  if (i < 0) return "";
  const out = [];
  for (const l of lines.slice(i + 1)) {
    if (/^\s*(#{1,6}\s|\*\*[^*]+:\*\*)/.test(l) && !/^\s*(\d+\.|-)\s/.test(l)) break;
    out.push(l);
  }
  return out.join("\n");
}

function brandTerms(briefs) {
  const terms = new Map();
  const add = (t, cs) => { t = t.trim(); if (t.length >= 3 && !terms.has(t)) terms.set(t, { term: t, kind: "brand", cs }); };
  for (const b of RULE_BRANDS) add(b, CASE_SENSITIVE_BRANDS.has(b));
  for (const f of briefs.filter(f => !f.endsWith(".owner.md"))) {
    const m = /^\*\*Business:\*\*\s*([^(\n]+?)\s*\(([^)]+)\)/m.exec(fs.readFileSync(f, "utf8"));
    if (!m) continue;
    const name = m[1].replace(/'s$/, ""), domain = m[2].trim().toLowerCase();
    add(name, CASE_SENSITIVE_BRANDS.has(name));
    if (/^[a-z0-9.-]+\.[a-z.]+$/.test(domain)) add(domain, false);
    // "Rothy's" also appears as "Rothys" and "Rothy’s": match the stem.
    if (/'s$/.test(m[1])) add(m[1].replace(/'s$/, ""), false);
  }
  return [...terms.values()];
}

function personaTerms(briefs) {
  const names = new Map();
  for (const f of briefs.filter(f => !f.endsWith(".owner.md"))) {
    const sec = section(fs.readFileSync(f, "utf8"), /^\*\*Who we sell to/i);
    for (const line of sec.split(/\r?\n/)) {
      const lead = /^\s*(?:-|\d+\.)\s+(?:\*\*)?([A-Z][a-z]{1,15}),\s/.exec(line);
      if (lead) names.set(lead[1], path.basename(f));
      for (const m of line.matchAll(/\band (?:\*\*)?([A-Z][a-z]{1,15}), \d{1,2}\b/g)) names.set(m[1], path.basename(f));
    }
  }
  return [...names.keys()].sort().map(t => ({ term: t, kind: "persona", cs: true }));
}

// Distinctive numbers: at least 3 significant digits, or an Indian lakh format (a 2-digit comma group).
function distinctive(tok) {
  const indian = /^\d{1,2}(,\d{2})+,\d{3}$/.test(tok);
  // 1,500 and 3.20 carry 2 significant digits (15, 32); 1,425 and 23.8 carry 3 or more.
  const t = tok.replace(/,/g, "");
  const sig = t.includes(".") ? t.replace(/0+$/, "").replace(/\.$/, "").replace(".", "").replace(/^0+/, "") : t.replace(/0+$/, "");
  return indian || sig.length >= 3;
}

function figureTerms(briefs) {
  const figs = new Map();
  for (const f of briefs.filter(f => f.endsWith(".owner.md"))) {
    const t = fs.readFileSync(f, "utf8");
    const text = section(t, /signals in the data/i) + "\n" + section(t, /facts a careful answer/i);
    for (const m of text.matchAll(/(?<![\d.,])\d{1,3}(?:,\d{2,3})+(?:\.\d+)?|(?<![\d.,])\d+\.\d+/g)) {
      const tok = m[0];
      if (distinctive(tok)) figs.set(tok, path.basename(f));
    }
  }
  return [...figs.keys()].sort().map(t => ({ term: t, kind: "figure", cs: false }));
}

// The e-commerce eval suite (../../ecom-evals) keeps its brands, avatars and answer keys in its own folder:
// brand names from brands/*/PUBLIC-FACTS.md titles, avatar tags from brands/*/ORG-CONTEXT.md ("Dan, 41"; a first name alone is too common),
// and distinctive figures from the Signals, Right call(s) and Facts to check sections of keys/E*.md.
const ECOM = path.resolve(BENCH, "..", "ecom-evals");
function ecomSection(text, headRe) {
  const lines = text.split(/\r?\n/), i = lines.findIndex(l => headRe.test(l));
  if (i < 0) return "";
  const rest = lines.slice(i + 1), end = rest.findIndex(l => /^##\s/.test(l));
  return (end < 0 ? rest : rest.slice(0, end)).join("\n");
}
// "Ritual" is also an everyday word. Key figures need 4 significant digits (or a lakh format): short ones
// such as 13.9 or 62.50 turn up by chance in fee tables and benchmarks.
const ECOM_CASE_SENSITIVE = new Set(["Ritual", "Fellow"]);
const ecomDistinctive = tok => /^\d{1,2}(,\d{2})+,\d{3}$/.test(tok) || tok.replace(/[,.]/g, "").replace(/^0+/, "").replace(/0+$/, "").length >= 4;
function ecomEvalTerms() {
  const out = [], seen = new Set();
  const add = (term, kind, cs) => { if (term.length >= 3 && !seen.has(term)) { seen.add(term); out.push({ term, kind, cs }); } };
  const bdir = path.join(ECOM, "brands"), kdir = path.join(ECOM, "keys");
  if (fs.existsSync(bdir)) for (const slug of fs.readdirSync(bdir).sort()) {
    const facts = path.join(bdir, slug, "PUBLIC-FACTS.md"), org = path.join(bdir, slug, "ORG-CONTEXT.md");
    if (fs.existsSync(facts)) {
      const m = /^#\s+(.+?):\s*public facts/im.exec(fs.readFileSync(facts, "utf8"));
      if (m) add(m[1].trim(), "brand", ECOM_CASE_SENSITIVE.has(m[1].trim()));
    }
    if (fs.existsSync(org)) for (const m of fs.readFileSync(org, "utf8").matchAll(/^\*\*([A-Z][a-z]{2,15}, \d{1,2})\b/gm)) add(m[1], "persona", true);
  }
  if (fs.existsSync(kdir)) for (const k of fs.readdirSync(kdir).filter(f => /^E\d+\.md$/.test(f)).sort()) {
    const t = fs.readFileSync(path.join(kdir, k), "utf8");
    const text = [/^##\s+Signals/i, /^##\s+Right calls?/i, /^##\s+Facts to check/i].map(re => ecomSection(t, re)).join("\n");
    for (const m of text.matchAll(/(?<![\d.,])\d{1,3}(?:,\d{2,3})+(?:\.\d+)?|(?<![\d.,])\d+\.\d+/g)) if (ecomDistinctive(m[0])) add(m[0], "figure", false);
  }
  return out;
}

function allTerms() {
  const briefs = briefFiles();
  if (!briefs.length) throw new Error(`no briefs found under ${BENCH}`);
  const base = [...brandTerms(briefs), ...personaTerms(briefs), ...figureTerms(briefs)];
  const have = new Set(base.map(t => t.term));
  // A persona name that is also one of our agents' names (Ishita, Rohan, Tanvi...) belongs in packs: TEAM.md and
  // hand-offs name the agent. Drop those names; the avatar tags ("Dan, 41") still guard the eval suite.
  const agents = agentNames();
  return [...base, ...ecomEvalTerms().filter(t => !have.has(t.term))].filter(t => !(t.kind === "persona" && agents.has(t.term)));
}

function agentNames() {
  const dir = path.join(REPO, "marketplace", "src", "modules", "directory", "data"), names = new Set();
  if (!fs.existsSync(dir)) return names;
  for (const f of fs.readdirSync(dir).filter(f => /^personas.*\.json$/.test(f))) {
    try {
      const j = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
      for (const p of Array.isArray(j) ? j : Object.values(j)) if (p && typeof p.name === "string") names.add(p.name.split(/\s+/)[0]);
    } catch { /* a file that is not a persona list */ }
  }
  return names;
}

// git grep -o: one output line per match, "<ref>:<path>:<match>" for a ref, "<path>:<match>" for the work tree.
function grepCounts(terms, ref, paths) {
  const counts = new Map(); // `${path}\0${term}` -> n
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "bench-leak-"));
  try {
    for (const cs of [true, false]) {
      const group = terms.filter(t => t.cs === cs);
      if (!group.length) continue;
      const patFile = path.join(tmp, cs ? "cs.txt" : "ci.txt");
      fs.writeFileSync(patFile, group.map(t => t.term).join("\n") + "\n");
      const args = ["-c", "core.quotepath=off", "grep", "-o", "-w", "-F", "-I", "--no-color", ...(cs ? [] : ["-i"]), "-f", patFile];
      if (ref) args.push(ref); else args.push("--untracked");
      args.push("--", ...paths);
      let out = "";
      try { out = execFileSync("git", args, { cwd: REPO, encoding: "utf8", maxBuffer: 256 * 1024 * 1024 }); }
      catch (e) { if (e.status === 1) out = ""; else throw new Error(`git grep failed: ${(e.stderr || e.message).toString().slice(0, 300)}`); }
      const byLower = new Map(group.map(t => [cs ? t.term : t.term.toLowerCase(), t.term]));
      for (const line of out.split(/\r?\n/)) {
        if (!line) continue;
        let rest = line;
        if (ref) { if (!rest.startsWith(ref + ":")) continue; rest = rest.slice(ref.length + 1); }
        const i = rest.lastIndexOf(":"); // matches never contain ":", paths might
        const file = rest.slice(0, i), match = rest.slice(i + 1);
        const term = byLower.get(cs ? match : match.toLowerCase());
        if (!term) continue;
        const k = `${file}\0${term}`;
        counts.set(k, (counts.get(k) || 0) + 1);
      }
    }
  } finally { fs.rmSync(tmp, { recursive: true, force: true }); }
  return counts;
}

function lineHits(file, t) {
  const esc = t.term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`(?<![\\p{L}\\p{N}_])${esc}(?![\\p{L}\\p{N}_])`, t.cs ? "u" : "iu");
  let text;
  try { text = fs.readFileSync(path.join(REPO, file), "utf8"); } catch { return []; }
  return text.split(/\r?\n/).map((l, i) => ({ n: i + 1, l })).filter(x => re.test(x.l)).slice(0, 5)
    .map(x => `${file}:${x.n}: ${x.l.trim().slice(0, 160)}`);
}

function main(argv) {
  const arg = n => { const i = argv.indexOf(`--${n}`); return i >= 0 ? argv[i + 1] : undefined; };
  const base = arg("base") || DEFAULT_BASE;
  const paths = (arg("paths") || DEFAULT_PATHS.join(",")).split(",").filter(Boolean);
  let terms;
  try { terms = allTerms(); } catch (e) { console.error(e.message); return 2; }
  if (argv.includes("--list-terms")) {
    for (const kind of ["brand", "persona", "figure"]) {
      const g = terms.filter(t => t.kind === kind);
      console.log(`${kind} (${g.length}): ${g.map(t => t.term + (t.cs ? "" : "*")).join(", ")}`);
    }
    console.log("(* = matched in any case)");
    return 0;
  }
  try { execFileSync("git", ["rev-parse", "--verify", "--quiet", `${base}^{commit}`], { cwd: REPO, stdio: "ignore" }); }
  catch { console.error(`base ${base} is not a commit in ${REPO}; fetch it or pass --base`); return 2; }

  let before, now;
  try { before = grepCounts(terms, base, paths); now = grepCounts(terms, null, paths); }
  catch (e) { console.error(e.message); return 2; }

  const byTerm = new Map(terms.map(t => [t.term, t]));
  const leaks = [];
  for (const [k, n] of now) {
    const was = before.get(k) || 0;
    if (n > was) { const [file, term] = k.split("\0"); leaks.push({ file, term, kind: byTerm.get(term).kind, before: was, now: n }); }
  }
  leaks.sort((a, b) => a.file.localeCompare(b.file) || a.term.localeCompare(b.term));
  const summary = { base, paths, terms: { brand: 0, persona: 0, figure: 0 }, matchesAtBase: 0, matchesNow: 0, newMatches: leaks.length };
  for (const t of terms) summary.terms[t.kind]++;
  for (const n of before.values()) summary.matchesAtBase += n;
  for (const n of now.values()) summary.matchesNow += n;

  if (argv.includes("--json")) console.log(JSON.stringify({ ...summary, leaks }, null, 1));
  else {
    console.log(`Bench leak guard: ${summary.terms.brand} brands, ${summary.terms.persona} persona names, ${summary.terms.figure} figures; ` +
      `${summary.matchesAtBase} matches at base ${base.slice(0, 9)}, ${summary.matchesNow} now, in ${paths.join(", ")}.`);
    if (!leaks.length) console.log("OK: no bench brand, persona name or owner-note figure added to pack or skill content.");
    else {
      console.log(`FAIL: ${leaks.length} new match${leaks.length === 1 ? "" : "es"}. Replace each with a general rule and a generic example:`);
      for (const L of leaks) {
        console.log(`- ${L.kind} "${L.term}" in ${L.file}: ${L.before} at base, ${L.now} now`);
        for (const h of lineHits(L.file, byTerm.get(L.term))) console.log(`    ${h}`);
      }
    }
  }
  return leaks.length ? 1 : 0;
}

if (require.main === module) process.exitCode = main(process.argv.slice(2));
module.exports = { allTerms, distinctive, grepCounts };
