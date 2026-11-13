#!/usr/bin/env node
// Theme counts from owner-judge feedback, agent vs plain.
//
//   node themes.cjs <judge-dir> [<judge-dir> ...] [--json] [--rows <theme>] [--check-prd]
//
// A judge dir is what tools/bench/owner-judge.mjs writes: key.json, raw/<judge>-<id>.json and feedback.jsonl.
// Rows are rebuilt from raw/ and unblinded with key.json (output 1 or 2 -> agent or plain). When raw/ or key.json
// is missing, the script falls back to feedback.jsonl, which already carries the arm.
//
// Each row is one judge's view of one output. A row counts once per theme when the theme's words appear in the
// fields the theme reads: "mistake" and "to10" (what would make it a 10) for faults, "strength" for strengths.
// Keyword matching is close, not exact: read the rows (--rows <theme>) before quoting a number.
//
// --check-prd compares the counts with the pre-test numbers in PRD-TOP10.md section 3.1 and exits 1 if any theme
// is off by more than 10% (or by more than 2 rows when the count is tiny, so 1 vs 0 does not fail).
"use strict";
const fs = require("node:fs");
const path = require("node:path");

const FAULT = ["mistake", "to10"];
const THEMES = [
  {
    id: "homework", label: "Left homework: confirm lists, sign-off asks, open questions", fields: FAULT,
    re: /\bto confirm\b|confirmation (list|ask|request|section|note|step)s?|\b(asks?|asking) for (a |the |my )?(confirmation|sign.?off|approval|yes)|remove the confirm|drop the confirm|unconfirmed|\bconfirm(ed)? (the|that|with|before)|open (question|item|end)s?|loose ends?|sign.?off (ask|request|before)|your yes|\bhomework\b|left as directions|unanswered|for (the )?owner to (decide|confirm|check|answer)|you decide|before (launch|sending|anything goes)|questions? for (me|the owner)|ends with (items|a list|questions)|not fully (finished|final)/i,
    prd: { agent: 68, plain: 19 },
  },
  {
    id: "length", label: "Too long or padded", fields: FAULT,
    re: /too long|overlong|over.?long|long(er)? than|over the (\d[\d,]* ?)?(word )?(limit|cap|count)|(word|length) (limit|cap|count|budget)|\bpadd(ed|ing)\b|\bverbose|wordy|\btrim\b|tighten(ed)? (it|the (copy|plan|doc|document|text|update|post))|shorter|\blength\b|cut (it|the) (down|to)|runs? long|\bbloat/i,
    prd: { agent: 66, plain: 25 },
  },
  {
    id: "voice", label: "Voice and customer words", fields: FAULT,
    re: /\bvoice\b|\btone\b|on.brand|off.brand|brand('s)? (rule|style|words|feel|language|guide)|customers?'? (own )?(words|phrases|language)|persona'?s? (own )?(words|phrases|lines|language)|their (own )?(words|phrases)|in (her|his|their) words|reads? like a (report|deck|memo)|jargon|stiff|robotic|corporate|clinical|salesy|warm(er|th)|(banned|avoid(ed)?) (word|phrase|framing|term)|reviewers? say|of our reviews|grade [0-9]|reading level|\d+ of (our )?\d[\d,]* (reviewers|reviews|customers)|internal (stat|number|figure|data|analytics)|correlation|conversational|sounds? like/i,
    prd: { agent: 58, plain: 28 },
  },
  {
    id: "blanket", label: "One rule applied everywhere (blanket design)", fields: FAULT,
    re: /\bblanket\b|one.size.fits.all|every test (on|runs|for|uses|gets)|all traffic|same (four|4|two|2|three|3)?.?(weeks?|split|design|metric|lift|effect|run time|duration|opener)|forces every|uniform|one (opener|metric|design) for (all|every)|load(s|ing)? all|all .{0,20}(contacts|leads|controllers)|sent to (everyone|all)|every contact/i,
    prd: { agent: 21, plain: 1 },
  },
  {
    id: "buried", label: "Owner's priority buried below the first screen", fields: FAULT,
    re: /\bburie[sd]\b|\bbury\b|below the fold|first screen|top three|top 3|(not|isn'?t) (made |given )?(the )?(clear )?first|comes (too )?late|sits? (fourth|third|after)|placed (fourth|after|below)|too far down|further down/i,
    prd: { agent: 18, plain: 6 },
  },
  {
    id: "dismissed", label: "A strong lever dismissed or demoted", fields: FAULT,
    re: /runner.?up|\bdismiss|\bdemot|\breject(s|ed|ing)? (the|it|a)\b|waves? (it )?away|brush(es)? off|\bdownplay|argu(es|ed|ing) (it )?(down|against)|advis(es|ing) against|rather than dismissing|instead of dismissing|stop dismissing/i,
    prd: { agent: 15, plain: 0 },
  },
  {
    id: "commit", label: "Asks to commit, finish or resolve", fields: ["to10"],
    re: /\bcommit|\bfinish|\bresolve|\bfinal(i[sz]e|ly)?\b|\block\b|\bdecide\b|paste.ready|without (a )?(follow.up|confirming)|fully (built|ready|submission)/i,
    prd: { agent: 59, plain: 26 },
  },
  {
    id: "maths", label: "Maths or arithmetic error cited", fields: FAULT,
    re: /\bmath|arithmetic|calculat|overstat|understat|miscount|double.count|(don'?t|not) add up|doesn'?t (add|tie)|\berrors?\b|should be|inconsistent|wrong (number|figure|total)|\bmis(state|read|quote)/i,
    prd: { agent: 59, plain: 109 },
  },
  {
    id: "invented", label: "Invented or unsupported claim cited", fields: ["mistake"],
    re: /\binvent|made.up|makes up|unsupported|fabricat|not in the (brief|data)|(isn'?t|is not|aren'?t|are not) in the (brief|data)|no basis|without (evidence|support|basis|a source)|unsourced|unverified|hallucinat|no evidence|pulled from nowhere|guess(ed|es|work)?\b/i,
    prd: { agent: 23, plain: 48 },
  },
  {
    id: "traced_maths", label: "Strength: traced, checkable maths", fields: ["strength"],
    re: /\bmath|arithmetic|traceable|checkable|shows? (its|the) working|break.?even|calculat|worked/i,
    prd: { agent: 143, plain: 85 },
  },
  {
    id: "decision_rules", label: "Strength: decision rules, gates, stop rules", fields: ["strength"],
    re: /decision rules?|stop rules?|kill rules?|\bgates?\b|\bgated\b|thresholds?|scale rules?|cut.keep|rules? (for|to) (cut|scale|stop|keep|pause)|guardrails?|trigger|\brules\b/i,
    prd: { agent: 112, plain: 53 },
  },
  {
    id: "dated_plan", label: "Strength: a dated plan", fields: ["strength"],
    re: /\bdated\b|\bdates\b|\bday.by.day|week.by.week|\bmonday\b|calendar|timeline|\bweek (one|1|by)\b|\bday (1|one)\b|schedule|tomorrow|first week|\bweek \d|\bmonth.by.month|\bdeadline/i,
    prd: { agent: 53, plain: 19 },
  },
];

// One row per judge x job x output, unblinded.
function readRows(dir) {
  const keyFile = path.join(dir, "key.json"), rawDir = path.join(dir, "raw");
  if (fs.existsSync(keyFile) && fs.existsSync(rawDir)) {
    const key = JSON.parse(fs.readFileSync(keyFile, "utf8"));
    const rows = [];
    for (const f of fs.readdirSync(rawDir).filter(x => x.endsWith(".json")).sort()) {
      const m = /^([A-Z]{2}\d{2})-([A-Z]+\d+)\.json$/.exec(f);
      if (!m) continue;
      const [, judge, id] = m, map = key[judge]?.[id];
      if (!map) throw new Error(`no key entry for ${judge} ${id} in ${keyFile}`);
      const v = JSON.parse(fs.readFileSync(path.join(rawDir, f), "utf8"));
      for (const o of ["1", "2"]) {
        const s = v[`o${o}`] || {};
        rows.push({ id, judge, provider: key[judge].provider, arm: map[o], overall: s.overall,
          strength: s.biggest_strength, mistake: s.biggest_mistake, to10: s.what_would_make_it_a_10, dir });
      }
    }
    return rows;
  }
  const file = path.join(dir, "feedback.jsonl");
  if (!fs.existsSync(file)) throw new Error(`no raw/ + key.json and no feedback.jsonl in ${dir}`);
  const rows = fs.readFileSync(file, "utf8").split(/\r?\n/).filter(Boolean).map(l => JSON.parse(l));
  for (const r of rows) if (r.arm !== "agent" && r.arm !== "plain") throw new Error(`row without arm in ${file}: ${r.judge} ${r.id}`);
  return rows.map(r => ({ ...r, dir }));
}

function count(rows) {
  const out = {};
  for (const t of THEMES) {
    const c = { agent: 0, plain: 0, perJob: {} };
    for (const r of rows) {
      if (!t.fields.some(f => t.re.test(r[f] || ""))) continue;
      c[r.arm]++;
      (c.perJob[r.id] ??= { agent: 0, plain: 0 })[r.arm]++;
    }
    out[t.id] = c;
  }
  return out;
}

const within = (got, want) => Math.abs(got - want) <= Math.max(2, want * 0.1);

function main(argv) {
  const rowsFor = argv.includes("--rows") ? argv[argv.indexOf("--rows") + 1] : null;
  const dirs = argv.filter((a, i) => !a.startsWith("--") && argv[i - 1] !== "--rows");
  if (!dirs.length) {
    console.error("Usage: node themes.cjs <judge-dir> [<judge-dir> ...] [--json] [--rows <theme>] [--check-prd]");
    return 2;
  }
  const rows = dirs.flatMap(readRows);
  if (rowsFor) {
    const t = THEMES.find(x => x.id === rowsFor);
    if (!t) { console.error(`unknown theme ${rowsFor}; one of ${THEMES.map(x => x.id).join(", ")}`); return 2; }
    for (const r of rows) for (const f of t.fields) {
      const m = (r[f] || "").match(t.re);
      if (m) console.log(`${r.id} ${r.judge} ${r.arm} ${f} [${m[0]}] ${r[f]}`);
    }
    return 0;
  }
  const res = count(rows), check = argv.includes("--check-prd");
  const n = { agent: rows.filter(r => r.arm === "agent").length, plain: rows.filter(r => r.arm === "plain").length };
  if (argv.includes("--json")) {
    console.log(JSON.stringify({ dirs, rows: n, themes: res }, null, 1));
  } else {
    console.log(`Rows: agent ${n.agent}, plain ${n.plain} (from ${dirs.join(", ")})\n`);
    console.log("| Theme | Agent | Plain |" + (check ? " PRD agent | PRD plain | Within 10% |" : ""));
    console.log("|---|---|---|" + (check ? "---|---|---|" : ""));
    for (const t of THEMES) {
      const c = res[t.id];
      let line = `| ${t.label} | ${c.agent} | ${c.plain} |`;
      if (check) line += ` ${t.prd.agent} | ${t.prd.plain} | ${within(c.agent, t.prd.agent) && within(c.plain, t.prd.plain) ? "yes" : "NO"} |`;
      console.log(line);
    }
  }
  if (check) {
    const bad = THEMES.filter(t => !(within(res[t.id].agent, t.prd.agent) && within(res[t.id].plain, t.prd.plain)));
    if (bad.length) { console.error(`\nOff the PRD numbers by more than 10%: ${bad.map(t => t.id).join(", ")}`); return 1; }
    console.error("\nAll themes within 10% of the PRD numbers.");
  }
  return 0;
}

if (require.main === module) process.exitCode = main(process.argv.slice(2));
module.exports = { THEMES, readRows, count };
