// Can an agent tell which of its skills fits an owner's request from what its toolkit says? A cheap, repeatable proxy
// for the model's pick: each e-commerce agent's toolkit (bundle.ts personaToolkit, the same entries toolkit.md lists)
// is scored against the request with a small BM25 over each skill's title, when and outcome, the only text the agent
// sees before it opens a skill. A sentence in when or outcome that says when the skill is the wrong pick ("Not for
// ...") counts against a match, the way a reader takes it. The orchestrator is scored over the whole toolbox.
//
// Golden set: test/fixtures/ecom-skill-pick.json (owner requests, the agent that should take each, the right skills).
// Edit toolbox.json text on the "tune" split only; "holdout" is reported apart and never tuned on.
//
//   node scripts/eval-skill-pick.mjs [--misses] [--json] [--split=tune|holdout]
import { readFileSync, readdirSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { personaToolkit, verticalBundle } from "../src/modules/knowledge/bundle.ts";
import { aliasesOf, tokens } from "../src/modules/packs/retrieve.ts";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIR = path.join(ROOT, "knowledge", "ecommerce");
export const ORCHESTRATOR = "margaret-job-orchestrator";

/** BM25 settings, the weight of title words, of a spelled-out alias, of a two-word phrase, and of a "Not for" clause. */
export const PICK_TUNING = { k1: 1.2, b: 0.5, title: 2, alias: 0.7, bigram: 0.5, negative: 0.6 };

const NEGATIVE = /^(not for|not when|not the|wrong pick|wrong when|skip it|do not use|don't use)\b/i;

/** The skills of the toolbox (one entry per skill, the first in module order) and each agent's toolkit. */
export function loadToolkits() {
  const vertical = JSON.parse(readFileSync(path.join(DIR, "vertical.json"), "utf8"));
  const toolbox = JSON.parse(readFileSync(path.join(DIR, "toolbox.json"), "utf8"));
  const vendor = {};
  for (const slug of readdirSync(path.join(DIR, "skills"))) {
    const p = path.join(DIR, "skills", slug, "SKILL.md");
    if (existsSync(p)) vendor[`knowledge/ecommerce/skills/${slug}/SKILL.md`] = readFileSync(p, "utf8");
  }
  const bundle = verticalBundle(vertical, [], [], { toolbox, vendor });
  const personas = JSON.parse(readFileSync(path.join(ROOT, "src/modules/directory/data/personas-ecommerce.json"), "utf8"));
  const skills = new Map();
  for (const m of vertical.modules) for (const item of toolbox.modules[m.code] ?? []) {
    const slug = item.ref.slice(6);
    if (item.ref.startsWith("skill:") && !skills.has(slug) && vendor[`knowledge/ecommerce/skills/${slug}/SKILL.md`]) skills.set(slug, { slug, code: m.code, item });
  }
  const kits = new Map(personas.map(p => [p.id, p.id === ORCHESTRATOR ? [...skills.keys()] : personaToolkit(p, bundle).map(k => k.item.ref.slice(6))]));
  return { skills, kits, personas, bundle };
}

const sentences = s => String(s ?? "").split(/(?<=[.;])\s+/).map(x => x.trim()).filter(Boolean);
const bigrams = t => t.slice(1).map((w, i) => `${t[i]}_${w}`);

/** One skill as the picker sees it: weighted terms that speak for it, and the terms of its "Not for" clauses. */
function skillDoc({ item }) {
  const pos = new Map(), neg = new Map();
  const add = (m, text, w) => { const t = tokens(text); for (const x of t) m.set(x, (m.get(x) ?? 0) + w); for (const x of bigrams(t)) m.set(x, (m.get(x) ?? 0) + w); };
  add(pos, item.title ?? item.ref.slice(6).replace(/-/g, " "), PICK_TUNING.title);
  for (const s of [...sentences(item.when), ...sentences(item.outcome)]) add(NEGATIVE.test(s) ? neg : pos, s, 1);
  let len = 0; for (const v of pos.values()) len += v;
  return { pos, neg, len };
}

/** A BM25 picker over every skill (idf from the whole toolbox), ranking only the candidates it is given. */
export function makePicker(skills) {
  const docs = new Map([...skills.values()].map(s => [s.slug, skillDoc(s)]));
  const N = docs.size, df = new Map();
  let total = 0;
  for (const d of docs.values()) { total += d.len; for (const t of new Set([...d.pos.keys(), ...d.neg.keys()])) df.set(t, (df.get(t) ?? 0) + 1); }
  const avg = total / N;
  const idf = t => Math.log(1 + (N - (df.get(t) ?? 0) + 0.5) / ((df.get(t) ?? 0) + 0.5));
  const { k1, b } = PICK_TUNING;
  const tf = (f, len) => (f * (k1 + 1)) / (f + k1 * (1 - b + b * len / avg));
  return function pick(request, candidates) {
    const q = tokens(request);
    const terms = new Map();
    for (const t of q) terms.set(t, Math.max(terms.get(t) ?? 0, 1));
    for (const t of bigrams(q)) terms.set(t, Math.max(terms.get(t) ?? 0, PICK_TUNING.bigram));
    for (const phrase of aliasesOf(q)) { const t = phrase.split(" "); for (const x of [...t, ...bigrams(t)]) if (!terms.has(x)) terms.set(x, PICK_TUNING.alias); }
    const scored = candidates.map(slug => {
      const d = docs.get(slug);
      let s = 0;
      for (const [t, w] of terms) {
        const p = d.pos.get(t), n = d.neg.get(t);
        if (p) s += w * idf(t) * tf(p, d.len);
        if (n) s -= w * PICK_TUNING.negative * idf(t) * tf(n, d.len);
      }
      return { slug, score: s };
    });
    return scored.sort((x, y) => y.score - x.score || (x.slug < y.slug ? -1 : 1));
  };
}

/** Scores the golden set: for each request, the pick of its first agent (agent mode) and of the orchestrator. */
export function evaluatePicks(golden = JSON.parse(readFileSync(path.join(ROOT, "test/fixtures/ecom-skill-pick.json"), "utf8"))) {
  const { skills, kits } = loadToolkits();
  const pick = makePicker(skills);
  const rows = golden.items.map(it => {
    const kit = kits.get(it.agents[0]) ?? [];
    const agent = pick(it.request, kit), all = pick(it.request, kits.get(ORCHESTRATOR));
    const rank = list => list.findIndex(r => it.skills.includes(r.slug)) + 1;
    return { ...it, kitSize: kit.length, inKit: it.skills.some(s => kit.includes(s)), agentRank: rank(agent), agentTop: agent.slice(0, 3).map(r => r.slug), allRank: rank(all), allTop: all.slice(0, 3).map(r => r.slug) };
  });
  const rate = (rs, key, n) => rs.length ? rs.filter(r => r[key] > 0 && r[key] <= n).length / rs.length : 0;
  const summary = {};
  for (const split of ["tune", "holdout", "all"]) {
    const rs = split === "all" ? rows : rows.filter(r => r.split === split);
    summary[split] = { n: rs.length, agentTop1: rate(rs, "agentRank", 1), agentTop3: rate(rs, "agentRank", 3), orchestratorTop1: rate(rs, "allRank", 1), orchestratorTop3: rate(rs, "allRank", 3) };
  }
  return { rows, summary };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = new Set(process.argv.slice(2));
  const split = process.argv.find(a => a.startsWith("--split="))?.slice(8);
  const { rows, summary } = evaluatePicks();
  if (args.has("--json")) { console.log(JSON.stringify({ summary, rows }, null, 2)); process.exit(0); }
  const pct = x => `${(x * 100).toFixed(1)}%`.padStart(6);
  console.log("split     n  agent@1 agent@3  orch@1  orch@3");
  for (const [k, s] of Object.entries(summary)) console.log(`${k.padEnd(8)} ${String(s.n).padStart(2)}  ${pct(s.agentTop1)}  ${pct(s.agentTop3)}  ${pct(s.orchestratorTop1)}  ${pct(s.orchestratorTop3)}`);
  const bad = rows.filter(r => !r.inKit);
  if (bad.length) console.log(`\n${bad.length} request(s) whose right skills are not in the first agent's toolkit: ${bad.map(r => r.id).join(", ")}`);
  if (args.has("--misses")) {
    for (const r of rows.filter(r => (!split || r.split === split) && (r.agentRank !== 1 || r.allRank !== 1))) {
      console.log(`\n${r.id} [${r.split}] "${r.request}" (${r.agents[0]}, ${r.kitSize} skills) want ${r.skills.join(" | ")}`);
      if (r.agentRank !== 1) console.log(`  agent rank ${r.agentRank || "-"}: ${r.agentTop.join(", ")}`);
      if (r.allRank !== 1) console.log(`  orch  rank ${r.allRank || "-"}: ${r.allTop.join(", ")}`);
    }
  }
}
