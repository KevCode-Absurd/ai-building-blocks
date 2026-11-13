#!/usr/bin/env node
// Collects everything the side-by-side results page needs into one JSON file:
// per-run tallies (win share, ship rate, dimensions), every judge's verdict per job, and both outputs per job.
//
//   node artifact-data.mjs --round r2 --out <file.json>
//
// Reads the owner-bench folder this script sits in. Runs that are missing are skipped.
import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import path from "node:path";

const HERE = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const BENCH = path.resolve(HERE, "..");
const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i > 0 ? process.argv[i + 1] : d; };
const ROUND = arg("round", "r2");
const OUT = arg("out");
const SETS = [
  { set: "ecom", label: "E-commerce", briefs: "ecom" },
  { set: "gen", label: "General", briefs: "general" },
  { set: "ho", label: "Unseen jobs", briefs: "heldout" },
];
const RUNS = [
  { run: "pre", label: "Before fixes", judge: "pre", agentOut: "pre" },
  { run: "post", label: "Round 1", judge: "post", agentOut: "post" },
  { run: ROUND, label: "Round 2", judge: ROUND, agentOut: ROUND },
  { run: "anon-post", label: "Round 1, anonymous", judge: "anon-post", agentOut: "post" },
  { run: `anon-${ROUND}`, label: "Round 2, anonymous", judge: `anon-${ROUND}`, agentOut: ROUND },
];
const DIMS = ["fit", "insight", "priorities", "reasoning", "correct", "clear", "voice", "range", "ready", "overall"];
const jobPacks = JSON.parse(readFileSync(path.join(BENCH, "JOB-PACKS.json"), "utf8")).jobs;
const CATEGORY = {
  G02: "Pages", J06: "Pages",
  J03: "Creative and ad copy", J04: "Creative and ad copy", J05: "Creative and ad copy",
  J07: "Emails and messages", J08: "Emails and messages", J12: "Emails and messages", G04: "Emails and messages", G10: "Emails and messages",
  J01: "Media buying and growth", J02: "Media buying and growth", J09: "Media buying and growth", J10: "Media buying and growth", J11: "Media buying and growth",
};

function verdicts(dir) {
  if (!existsSync(path.join(dir, "key.json"))) return null;
  const key = JSON.parse(readFileSync(path.join(dir, "key.json"), "utf8"));
  const rows = [];
  for (const f of readdirSync(path.join(dir, "raw"))) {
    const m = /^([A-Z]+\d+)-([A-Z]+\d+)\.json$/.exec(f);
    if (!m) continue;
    const [, judge, id] = m;
    const map = key[judge]?.[id];
    if (!map) continue;
    let v; try { v = JSON.parse(readFileSync(path.join(dir, "raw", f), "utf8")); } catch { continue; }
    const arm = slot => map[slot];
    const side = slot => { const s = v[`o${slot}`]; return { ...Object.fromEntries(DIMS.map(d => [d, s[d]])), use: s.use_as_is, strength: s.biggest_strength, mistake: s.biggest_mistake, to10: s.what_would_make_it_a_10 }; };
    const r = { judge, provider: key[judge].provider, model: key[judge].model, lens: key[judge].lens, id,
      winner: v.winner === "tie" ? "tie" : arm(v.winner), margin: v.margin, reason: v.reason };
    r[arm("1")] = side("1"); r[arm("2")] = side("2");
    rows.push(r);
  }
  return rows;
}
function summarise(rows) {
  const s = { agent: 0, plain: 0, tie: 0, n: rows.length, perProvider: {}, dims: { agent: {}, plain: {} },
    ship: { agent: { as_is: 0, small: 0, major: 0, tens: 0, nine: 0 }, plain: { as_is: 0, small: 0, major: 0, tens: 0, nine: 0 } },
    strict: { agent: { as_is: 0, tens: 0, nine: 0, n: 0 }, plain: { as_is: 0, tens: 0, nine: 0, n: 0 } } };
  for (const r of rows) {
    s[r.winner]++;
    const p = (s.perProvider[r.provider] ??= { agent: 0, plain: 0, tie: 0 }); p[r.winner]++;
    for (const arm of ["agent", "plain"]) {
      const x = r[arm]; if (!x) continue;
      for (const d of DIMS) s.dims[arm][d] = (s.dims[arm][d] ?? 0) + x[d];
      const sh = s.ship[arm];
      if (x.use === "as is") sh.as_is++; else if (x.use === "with small tweaks") sh.small++; else sh.major++;
      if (x.overall >= 10) sh.tens++; if (x.overall >= 9) sh.nine++;
      if (r.provider !== "gemini") { const st = s.strict[arm]; st.n++; if (x.use === "as is") st.as_is++; if (x.overall >= 10) st.tens++; if (x.overall >= 9) st.nine++; }
    }
  }
  for (const arm of ["agent", "plain"]) for (const d of DIMS) s.dims[arm][d] = +(s.dims[arm][d] / Math.max(1, rows.length)).toFixed(2);
  s.share = +(s.agent / Math.max(1, s.agent + s.plain)).toFixed(3);
  return s;
}

const data = { round: ROUND, generated: new Date().toISOString().slice(0, 10), runs: RUNS.map(r => ({ run: r.run, label: r.label })), sets: [], jobs: [] };
for (const S of SETS) {
  const setEntry = { set: S.set, label: S.label, runs: {} };
  const perRun = {};
  for (const R of RUNS) {
    const rows = verdicts(path.join(BENCH, `judge-${S.set}-${R.judge}`));
    if (!rows) continue;
    perRun[R.run] = rows;
    setEntry.runs[R.run] = summarise(rows);
  }
  // Like-for-like: only the judge and job pairs that gave a verdict in both runs, so a missing provider cannot move the share.
  const matched = (a, b) => {
    if (!perRun[a] || !perRun[b]) return null;
    const B = new Map(perRun[b].map(r => [r.judge + r.id, r]));
    const m = { pairs: 0, before: { agent: 0, plain: 0, tie: 0 }, after: { agent: 0, plain: 0, tie: 0 }, perProvider: {} };
    for (const ra of perRun[a]) {
      const rb = B.get(ra.judge + ra.id); if (!rb) continue;
      m.pairs++; m.before[ra.winner]++; m.after[rb.winner]++;
      const p = (m.perProvider[ra.provider] ??= { pairs: 0, before: 0, after: 0 }); p.pairs++;
      if (ra.winner === "agent") p.before++; if (rb.winner === "agent") p.after++;
    }
    const sh = x => +(x.agent / Math.max(1, x.agent + x.plain)).toFixed(3);
    m.before.share = sh(m.before); m.after.share = sh(m.after);
    return m;
  };
  setEntry.matched = { rubric: matched("post", ROUND), anon: matched("anon-post", `anon-${ROUND}`) };
  data.sets.push(setEntry);
  const ids = readdirSync(path.join(BENCH, S.briefs)).filter(f => /^[A-Z]+\d+\.md$/.test(f)).map(f => f.replace(".md", "")).sort();
  for (const id of ids) {
    const jp = jobPacks.find(j => j.job === id) ?? {};
    const read = (dir, arm) => { const f = path.join(BENCH, dir, `${id}-${arm}.md`); return existsSync(f) ? readFileSync(f, "utf8") : null; };
    const plainDir = `out-${S.set}-pre`;
    const job = { id, set: S.set, title: jp.title ?? id, pack: jp.pack, category: S.set === "ho" ? "Unseen jobs" : (CATEGORY[id] ?? "Strategy and planning"),
      brief: readFileSync(path.join(BENCH, S.briefs, `${id}.md`), "utf8"),
      agent: read(`out-${S.set}-${ROUND}`, "agent") ?? read(`out-${S.set}-post`, "agent"),
      agentRound1: read(`out-${S.set}-post`, "agent"),
      plain: read(plainDir, "plain"),
      verdicts: {}, perRun: {} };
    for (const [run, rows] of Object.entries(perRun)) {
      const mine = rows.filter(r => r.id === id).sort((a, b) => a.judge.localeCompare(b.judge));
      job.perRun[run] = { agent: mine.filter(r => r.winner === "agent").length, plain: mine.filter(r => r.winner === "plain").length, tie: mine.filter(r => r.winner === "tie").length };
      if (run === ROUND || run === `anon-${ROUND}` || run === "post" || run === "anon-post") job.verdicts[run] = mine;
    }
    data.jobs.push(job);
  }
}
const json = JSON.stringify(data);
if (OUT) writeFileSync(OUT, json); else process.stdout.write(json);
console.error(`jobs ${data.jobs.length}; runs per set: ${data.sets.map(s => `${s.set}=${Object.keys(s.runs).join("/")}`).join(" ")}; ${(json.length / 1024).toFixed(0)} KB`);
