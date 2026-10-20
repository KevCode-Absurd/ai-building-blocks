// Checks minds against catalogue-items/minds/README.md.
//   node tools/check-minds.mjs [--enriched] [--playbook] [--all | slug ...]
// --enriched: the enriched bar (Real decisions, 5 own-words, up to 3,500 words). --playbook: playbook.md rules.
import fs from "node:fs";
import path from "node:path";
const ROOT = path.resolve(import.meta.dirname, "..");
const { default: YAML } = await import("file:///" + ROOT + "/site/node_modules/yaml/dist/index.js");
const DIR = path.join(ROOT, "catalogue-items/minds");
const roster = YAML.parse(fs.readFileSync(path.join(DIR, "_roster.yaml"), "utf8"));
const words = (t) => t.replace(/\[S\d+\]/g, "").split(/\s+/).filter((w) => /[A-Za-z0-9]/.test(w)).length;
let bad = 0;
const ENRICHED = process.argv.includes("--enriched");
const args = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const slugs = process.argv.includes("--all") ? roster.minds.map((x) => x.slug).filter((s) => fs.existsSync(path.join(DIR, s, "mind.yaml"))) : args;
for (const slug of slugs) {
  const p = [];
  const d = path.join(DIR, slug);
  const r = roster.minds.find((x) => x.slug === slug);
  const f = (n) => { try { return fs.readFileSync(path.join(d, n), "utf8"); } catch { p.push(`missing ${n}`); return ""; } };
  const y = f("mind.yaml"), k = f("knowledge.md"), pe = f("personality.md");
  let m = {};
  try { m = YAML.parse(y) || {}; } catch (e) { p.push("bad yaml: " + e.message.split("\n")[0]); }
  const kw = words(k), pw = words(pe);
  if (kw < 1500 || kw > (ENRICHED || k.includes("## Real decisions") ? 3500 : 2500)) p.push(`knowledge words ${kw}`);
  if (pw < 600 || pw > 1000) p.push(`personality words ${pw}`);
  const src = m.sources || [];
  const own = src.filter((s) => s.kind === "own-words").length;
  if (src.length < 5) p.push(`sources ${src.length}`);
  if (own < (m.thin_record ? 1 : 2)) p.push(`own-words ${own}`);
  src.forEach((s, i) => { if (Number(s.n) !== i + 1) p.push(`source numbering at ${i + 1}`); if (!["own-words", "reference", "secondary"].includes(s.kind)) p.push(`bad kind S${s.n}`); });
  const cited = new Set([...k.matchAll(/\[S(\d+)\]/g)].map((x) => Number(x[1])));
  for (const s of src) if (!cited.has(Number(s.n))) p.push(`S${s.n} never cited`);
  for (const n of cited) if (!src.find((s) => Number(s.n) === n)) p.push(`[S${n}] not in sources`);
  const uc = m.use_cases?.length || 0; if (uc < 6 || uc > 10) p.push(`use_cases ${uc}`);
  const se = m.seats?.length || 0; if (se < 2 || se > 3) p.push(`seats ${se}`);
  if (r && m.seats?.[0]?.seat !== r.seat) p.push(`first seat "${m.seats?.[0]?.seat}" != roster "${r.seat}"`);
  if (r && m.living !== r.living) p.push(`living ${m.living} != roster ${r.living} (report, don't edit roster)`);
  if (m.slug !== slug) p.push("slug mismatch");
  const t = m.tests || [];
  const kinds = t.map((x) => x.kind).join(",");
  if (kinds !== "use,use,advise,advise,trap") p.push(`tests kinds ${kinds}`);
  if (t[4] && !t[4].expect) p.push("trap has no expect");
  for (const key of ["name", "area", "years", "known_for", "summary", "pairs_with", "last_checked"]) if (m[key] == null) p.push(`no ${key}`);
  for (const ps of m.pairs_with || []) if (!roster.minds.find((x) => x.slug === ps)) p.push(`pairs_with ${ps} not in roster`);
  if (/—/.test(y + k + pe)) p.push("em dash");
  if (!/^# .+: what (he|she|they) knew and believed/m.test(k)) p.push("knowledge title");
  if (!/^# .+: how (he|she|they) thinks? and talks?/m.test(pe)) p.push("personality title");
  for (const h of ["## In one paragraph", "## Core ideas", "## How ", "## Where ", "## Their work and record", "## Blind spots to watch", "## Short phrases on the record"]) {
    const alt = h.replace("Their", "(His|Her|Their)");
    if (!new RegExp("^" + alt.replace(/[()|]/g, (c) => c), "m").test(k)) p.push(`knowledge missing "${h}"`);
  }
  if (!/criticised/.test(k)) p.push("knowledge missing criticised section");
  for (const h of ["## Voice", "## How ", "## Questions ", "## When ", "## ", "## Playing "]) if (!pe.includes(h)) p.push(`personality missing ${h}`);
  if (!/written by us/i.test(pe)) p.push("sample not marked written by us");
  const ideas = (k.split("## Core ideas")[1] || "").split(/\n## /)[0].match(/^### /gm)?.length || 0;
  if (ideas < 5 || ideas > 9) p.push(`core ideas ${ideas}`);
  if (ENRICHED) {
    if (own < 5 && !m.thin_record) p.push(`enriched: own-words ${own} (aim 5; explain if short)`);
    const dec = (k.split("## Real decisions")[1] || "").split(/\n## /)[0];
    const n = dec.match(/^### /gm)?.length || 0;
    if (!k.includes("## Real decisions")) p.push("enriched: no ## Real decisions");
    else if (n < 5 || n > 8) p.push(`enriched: decisions ${n}`);
    if (!/last_checked: 2026-10-20/.test(y)) p.push("enriched: last_checked not 2026-10-20");
  }
  if (process.argv.includes("--playbook")) {
    let pb = ""; try { pb = fs.readFileSync(path.join(d, "playbook.md"), "utf8"); } catch { p.push("missing playbook.md"); }
    if (pb) {
      const bw = words(pb); if (bw < 1000 || bw > 1800) p.push(`playbook words ${bw}`);
      if (!/^# Hire .+: how (he|she|they)'d work for you/m.test(pb)) p.push("playbook title");
      for (const h of ["## What to hire ", "## How ", "## First questions ", "## Jobs, one by one", "## What ", "## What you'll get back"]) if (!pb.includes(h)) p.push(`playbook missing ${h}`);
      const steps = ((pb.split(/## How .+ take on your problem/)[1] || "").split(/\n## /)[0].match(/^\d+\. /gm) || []).length;
      if (steps < 5 || steps > 8) p.push(`playbook steps ${steps}`);
      const jobs = ((pb.split("## Jobs, one by one")[1] || "").split(/\n## /)[0].match(/^### /gm) || []).length;
      if (jobs < 4 || jobs > 7) p.push(`playbook jobs ${jobs}`);
      if (/—/.test(pb)) p.push("playbook em dash");
    }
  }
  const phrases = (k.split("## Short phrases on the record")[1] || "").split("\n").filter((l) => /^\s*-/.test(l));
  if (phrases.length > 5) p.push(`phrases ${phrases.length}`);
  // Public-domain work may be quoted at length: anyone who died before 1956, or BC.
  const died = String(m.years ?? "").match(/[–-]\s*(?:c\.\s*)?(\d{1,4})\s*(BC)?/);
  const pd = /BC/.test(String(m.years ?? "")) || (died && Number(died[1]) < 1956);
  if (!pd) for (const l of phrases) { const q = l.match(/"([^"]+)"/); if (q && q[1].split(/\s+/).length >= 15) p.push(`long phrase: ${q[1].slice(0, 40)}`); }
  if (process.argv.includes("--all") && !p.length) continue;
  console.log(`${slug}: knowledge ${kw}w, personality ${pw}w, sources ${src.length} (${own} own-words), ideas ${ideas}, phrases ${phrases.length}${p.length ? "\n  x " + p.join("\n  x ") : "  OK"}`);
  if (p.length) bad++;
}
if (process.argv.includes("--all")) console.log(`${slugs.length - bad} of ${slugs.length} pass.`);
process.exitCode = bad ? 1 : 0;
