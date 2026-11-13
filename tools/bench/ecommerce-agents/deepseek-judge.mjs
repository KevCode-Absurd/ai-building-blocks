// Blind-judge two arms of the e-commerce bench with DeepSeek: N judges x 12 jobs, one call per job, random order
// per judge and job, then unblind and tally.
//
//   node deepseek-judge.mjs --agent <dir with Jxx-agent.md> --plain <dir with Jxx-plain.md> --out <run dir> [--judges 20]
//
// Reads DEEPSEEK_API_KEY from the environment or from --env <file>. Never prints the key. Plain Node 18+, no packages.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import path from "node:path";

const arg = (name, dflt) => { const i = process.argv.indexOf(`--${name}`); return i > 0 ? process.argv[i + 1] : dflt; };
const HERE = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const BRIEFS = arg("briefs", path.join(HERE, "2026-11-13", "briefs"));
const AGENT = arg("agent"), PLAIN = arg("plain"), OUT = arg("out"), JUDGES = Number(arg("judges", 20));
const RULES = readFileSync(arg("rules", path.join(HERE, "2026-11-13", "JUDGE-RULES.md")), "utf8");
if (!AGENT || !PLAIN || !OUT) { console.error("Usage: --agent <dir> --plain <dir> --out <dir> [--judges 20] [--env <file>]"); process.exit(2); }
let KEY = process.env.DEEPSEEK_API_KEY;
const envFile = arg("env");
if (!KEY && envFile) KEY = /^DEEPSEEK_API_KEY\s*=\s*"?([^"\r\n]+)"?/m.exec(readFileSync(envFile, "utf8"))?.[1];
if (!KEY) { console.error("No DEEPSEEK_API_KEY."); process.exit(2); }
mkdirSync(path.join(OUT, "raw"), { recursive: true });

const JOBS = Array.from({ length: 12 }, (_, i) => `J${String(i + 1).padStart(2, "0")}`);
const LENSES = [
  "a founder who runs a profitable DTC store doing $5M a year and spends their own money",
  "the head of performance marketing at a fast-growing DTC brand",
  "a retention and lifecycle marketing lead",
  "a creative director who has shipped thousands of paid social ads",
  "a CFO-minded operator who checks every number and cares about contribution margin",
  "an India D2C operator who knows COD, RTO, WhatsApp and Indian consumers well",
  "a US DTC consultant who audits agencies for brand owners",
  "a conversion rate specialist who runs A/B tests for stores",
  "a senior direct response copywriter",
  "a generalist e-commerce agency strategist who must hand this work to a client tomorrow",
  "a Shopify Plus merchant success manager",
  "a marketplace and Amazon seller who also runs a D2C site",
  "a compliance-minded marketer who knows FTC, ASCI and platform ad policies",
  "a media buyer who manages $1M a month across Meta and TikTok",
  "an email and SMS agency owner",
  "a first-time founder in their first year who needs work they can act on alone",
  "a private equity operating partner reviewing a portfolio brand",
  "a head of growth at an Indian D2C beauty brand",
  "a brand strategist who cares about voice and positioning",
  "a data analyst who distrusts unsupported numbers",
];
const MODELS = ["deepseek-chat", "deepseek-reasoner"];
let seed = Number(arg("seed", 20261114));
const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
const scrub = t => t.replace(/\s*\[(?:[A-Z]{3}-\d{4}(?:\s*,\s*)?)+\]/g, "").replace(/\bAI Blocks\b/gi, "").replace(/—|–/g, ", ");
const read = (dir, j, arm) => scrub(readFileSync(path.join(dir, `${j}-${arm}.md`), "utf8"));

async function call(model, system, user, tries = 7) {
  for (let t = 1; t <= tries; t++) {
    try {
      const r = await fetch("https://api.deepseek.com/chat/completions", {
        method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${KEY}` },
        body: JSON.stringify({ model, messages: [{ role: "system", content: system }, { role: "user", content: user }], ...(model === "deepseek-chat" ? { temperature: 0.7, response_format: { type: "json_object" } } : {}), max_tokens: 8000 }),
      });
      if (!r.ok) throw new Error(`HTTP ${r.status} ${(await r.text()).slice(0, 200)}`);
      const d = await r.json();
      const text = d.choices?.[0]?.message?.content ?? "";
      const json = JSON.parse(/\{[\s\S]*\}/.exec(text)?.[0] ?? "null");
      for (const o of ["o1", "o2"]) for (const k of ["job_done", "actionable", "commercial", "craft", "overall"]) if (typeof json?.[o]?.[k] !== "number") throw new Error(`bad JSON: missing ${o}.${k}`);
      if (!["1", "2", "tie"].includes(String(json.winner))) throw new Error("bad winner");
      return { json, usage: d.usage };
    } catch (e) {
      if (t === tries) throw e;
      await new Promise(res => setTimeout(res, 2000 * t));
    }
  }
}

const tasks = [], key = {};
for (let k = 1; k <= JUDGES; k++) {
  const jd = `DS${String(k).padStart(2, "0")}`, model = MODELS[(k - 1) % 2], lens = LENSES[(k - 1) % LENSES.length];
  key[jd] = { model, lens };
  for (const j of JOBS) {
    const flip = rnd() < 0.5, [a1, a2] = flip ? ["plain", "agent"] : ["agent", "plain"];
    key[jd][j] = { "1": a1, "2": a2 };
    const system = `${RULES}\n\nYou judge as ${lens}. You see ONE job here. Answer with only a JSON object: {"job":"${j}","o1":{"job_done":n,"actionable":n,"commercial":n,"craft":n,"overall":n},"o2":{...same keys},"winner":"1"|"2"|"tie","margin":"slight"|"clear"|"decisive","reason":"one sentence"}.`;
    const user = `# ${j}\n\n## The brief\n\n${readFileSync(path.join(BRIEFS, `${j}.md`), "utf8").trim()}\n\n## Output 1\n\n${read(a1 === "agent" ? AGENT : PLAIN, j, a1).trim()}\n\n## Output 2\n\n${read(a2 === "agent" ? AGENT : PLAIN, j, a2).trim()}\n`;
    tasks.push({ jd, j, model, system, user });
  }
}
writeFileSync(path.join(OUT, "key.json"), JSON.stringify(key, null, 1));

const CONC = Number(arg("concurrency", 12));
const results = []; let next = 0, done = 0, failed = 0, tokens = 0;
await Promise.all(Array.from({ length: CONC }, async () => {
  while (next < tasks.length) {
    const t = tasks[next++], file = path.join(OUT, "raw", `${t.jd}-${t.j}.json`);
    try {
      const v = existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : (await call(t.model, t.system, t.user)).json;
      writeFileSync(file, JSON.stringify(v, null, 1));
      results.push({ ...t, v }); done++;
    } catch (e) { failed++; console.error(`${t.jd} ${t.j} failed: ${e.message}`); }
    if ((done + failed) % 24 === 0) console.error(`${done + failed}/${tasks.length}`);
  }
}));

// Unblind and tally.
const crit = ["job_done", "actionable", "commercial", "craft", "overall"];
const tot = { agent: 0, plain: 0, tie: 0 }, perJob = {}, perModel = {}, sums = { agent: {}, plain: {} }, n = { agent: 0, plain: 0 }, reasons = [];
for (const { jd, j, model, v } of results) {
  const map = key[jd][j], w = String(v.winner) === "tie" ? "tie" : map[String(v.winner)];
  tot[w]++; (perJob[j] ??= { agent: 0, plain: 0, tie: 0 })[w]++; (perModel[model] ??= { agent: 0, plain: 0, tie: 0 })[w]++;
  for (const [o, arm] of [["o1", map["1"]], ["o2", map["2"]]]) { n[arm]++; for (const c of crit) sums[arm][c] = (sums[arm][c] ?? 0) + Number(v[o][c]); }
  reasons.push(`${j} ${jd} -> ${w} (${v.margin}): ${v.reason}`);
}
const tally = { verdicts: results.length, failed, tot, share_of_decided: tot.agent / Math.max(1, tot.agent + tot.plain), perJob, perModel,
  criteria: Object.fromEntries(crit.map(c => [c, { agent: +(sums.agent[c] / n.agent).toFixed(2), plain: +(sums.plain[c] / n.plain).toFixed(2) }])) };
writeFileSync(path.join(OUT, "tally.json"), JSON.stringify(tally, null, 1));
writeFileSync(path.join(OUT, "reasons.txt"), reasons.sort().join("\n"));
console.log(JSON.stringify(tally, null, 1));
