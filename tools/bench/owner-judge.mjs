// Owner-judged blind bench across providers (Claude, OpenAI, DeepSeek, Gemini).
// Each judge sees one job at a time: the brief, the owner's private notes, the owner rubric (plus a vertical layer)
// and two outputs in a random order. It scores 9 owner dimensions, a use-as-is verdict and a winner, and says
// what was strongest, the biggest mistake and what would make each output a 10. Then it unblinds and tallies.
//
//   node owner-judge.mjs --briefs <dir with ID.md and ID.owner.md> --agent <dir> --plain <dir> --out <dir>
//        [--rubric OWNER-RUBRIC.md,ECOMMERCE-RUBRIC.md] [--judges 20] [--env <.env>] [--ids J01,J02] [--anon]
//
// --anon runs the anonymous check. Both outputs are put into one plain format (same heading level, no bold or
// italics, same bullets), so house style cannot give either away. The judge also gets no rubric: only the brief,
// the owner's notes and "which would you rather use, as the owner". The scores keep the same JSON shape.
//
// Output files are named <ID>-agent.md and <ID>-plain.md. Keys come from the environment or --env and are never
// printed. Plain Node 18+, no packages. Re-running the same --out skips verdicts already saved.
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from "node:fs";
import path from "node:path";

const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i > 0 ? process.argv[i + 1] : d; };
const HERE = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const BRIEFS = arg("briefs"), AGENT = arg("agent"), PLAIN = arg("plain"), OUT = arg("out");
if (!BRIEFS || !AGENT || !PLAIN || !OUT) { console.error("Usage: --briefs --agent --plain --out [--rubric] [--judges] [--env]"); process.exit(2); }
const env = { ...process.env };
if (arg("env")) for (const l of readFileSync(arg("env"), "utf8").split(/\r?\n/)) { const m = /^([A-Z_]+)\s*=\s*"?([^"\r\n]*)"?/.exec(l); if (m && !env[m[1]]) env[m[1]] = m[2]; }
const ANON = process.argv.includes("--anon");
const RUBRIC_FILES = (arg("rubric", "OWNER-RUBRIC.md")).split(",").map(f => readFileSync(path.isAbsolute(f) ? f : path.join(HERE, "rubrics", f), "utf8")).join("\n\n---\n\n");
const RUBRIC = ANON ? `You are the owner of this business. You wrote the brief and you know your own data. Two people did the job.
Read both as you would read work you are about to use: would you act on it, send it or publish it, and which would you rather have?
Score each from 1 to 10 on: fit (about my business and my case), insight (tells me something I did not know), priorities (most important first),
reasoning, correct (facts and numbers), clear (easy to read), voice (sounds like us and suits our customers), range (enough different ideas),
ready (how close to usable as it stands), and overall. Use your own judgment as an owner; there is no other rubric.` : RUBRIC_FILES;
// Anonymous mode: one plain format for both outputs, so house style cannot give either away.
const plainFormat = t => t.replace(/^#{1,6}\s+/gm, "## ").replace(/\*\*([^*\n]+)\*\*/g, "$1").replace(/__([^_\n]+)__/g, "$1")
  .replace(/(^|[^*\w])\*([^*\n]+)\*(?!\*)/g, "$1$2").replace(/^(\s*)[*+•]\s+/gm, "$1- ").replace(/^\s*(---|\*\*\*|___)\s*$/gm, "").replace(/\n{3,}/g, "\n\n");
mkdirSync(path.join(OUT, "raw"), { recursive: true });

const IDS = (arg("ids") ?? readdirSync(BRIEFS).filter(f => /^[A-Z]+\d+\.md$/.test(f)).map(f => f.replace(".md", "")).join(",")).split(",").sort();
const DIMS = ["fit", "insight", "priorities", "reasoning", "correct", "clear", "voice", "range", "ready"];
const LENSES = [
  "the founder and owner who wrote this brief and spends their own money",
  "the owner, who is a sharp operator and checks every number",
  "the owner, who cares most about the brand and how customers will feel",
  "the owner, who is not an expert in this field and needs to learn what they are missing",
  "the owner, who will hand this to their small team tomorrow and needs it usable",
];

// Panel: 20 judges spread across the providers with working keys.
const PROVIDERS = [
  { p: "claude", key: "ANTHROPIC_API_KEY", models: ["claude-opus-5-5", "claude-sonnet-5-5"] },
  { p: "openai", key: "OPENAI_API_KEY", models: ["gpt-5.5", "gpt-5.4"] },
  { p: "deepseek", key: "DEEPSEEK_API_KEY", models: ["deepseek-chat", "deepseek-reasoner"] },
  { p: "gemini", key: "GEMINI_API_KEY", models: ["gemini-pro-latest", "gemini-flash-latest"] },
];
async function keyWorks(pr) {
  if (!env[pr.key]) return false;
  if (pr.p !== "gemini") return true;
  const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${env[pr.key]}`).catch(() => null);
  return !!r?.ok;
}
const live = [];
for (const pr of PROVIDERS) if (await keyWorks(pr)) live.push(pr);
const N = Number(arg("judges", 20));
const panel = Array.from({ length: N }, (_, k) => {
  const pr = live[k % live.length], round = Math.floor(k / live.length);
  return { id: `${pr.p.slice(0, 2).toUpperCase()}${String(k + 1).padStart(2, "0")}`, provider: pr.p, model: pr.models[round % pr.models.length], lens: LENSES[k % LENSES.length] };
});
console.error(`providers: ${live.map(p => p.p).join(", ")}; ${panel.length} judges x ${IDS.length} jobs`);

let seed = Number(arg("seed", 20261113));
const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
const scrub = t => t.replace(/\s*\[(?:[A-Z]{3}-\d{4}(?:\s*,\s*)?)+\]/g, "").replace(/\bAI Blocks\b/gi, "").replace(/[—–]/g, ", ");
const SHAPE = `{"o1":{${DIMS.map(d => `"${d}":n`).join(",")},"overall":n,"use_as_is":"as is|with small tweaks|with major rework|not usable","biggest_strength":"...","biggest_mistake":"...","what_would_make_it_a_10":"..."},"o2":{...same},"winner":"1|2|tie","margin":"slight|clear|decisive","reason":"one or two sentences an owner would say"}`;

async function ask(j, system, user) {
  const k = env[PROVIDERS.find(p => p.p === j.provider).key];
  if (j.provider === "claude") {
    const r = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "content-type": "application/json", "x-api-key": k, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model: j.model, max_tokens: 4000, system, messages: [{ role: "user", content: user }] }) });
    if (!r.ok) throw new Error(`HTTP ${r.status} ${(await r.text()).slice(0, 160)}`);
    return (await r.json()).content.filter(c => c.type === "text").map(c => c.text).join("");
  }
  if (j.provider === "openai" || j.provider === "deepseek") {
    const url = j.provider === "openai" ? "https://api.openai.com/v1/chat/completions" : "https://api.deepseek.com/chat/completions";
    const body = { model: j.model, messages: [{ role: "system", content: system }, { role: "user", content: user }] };
    if (j.provider === "openai") { body.max_completion_tokens = 16000; body.response_format = { type: "json_object" }; }
    else { body.max_tokens = 8000; if (j.model === "deepseek-chat") body.response_format = { type: "json_object" }; }
    const r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${k}` }, body: JSON.stringify(body) });
    if (!r.ok) throw new Error(`HTTP ${r.status} ${(await r.text()).slice(0, 160)}`);
    return (await r.json()).choices?.[0]?.message?.content ?? "";
  }
  const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${j.model}:generateContent?key=${k}`, { method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ systemInstruction: { parts: [{ text: system }] }, contents: [{ role: "user", parts: [{ text: user }] }], generationConfig: { responseMimeType: "application/json", maxOutputTokens: 8000 } }) });
  if (!r.ok) throw new Error(`HTTP ${r.status} ${(await r.text()).slice(0, 160)}`);
  return (await r.json()).candidates?.[0]?.content?.parts?.map(p => p.text).join("") ?? "";
}
function parse(text) {
  const v = JSON.parse(/\{[\s\S]*\}/.exec(text)?.[0] ?? "null");
  for (const o of ["o1", "o2"]) for (const d of [...DIMS, "overall"]) { const x = parseFloat(v?.[o]?.[d]); if (!(x >= 1 && x <= 10)) throw new Error(`bad ${o}.${d}`); v[o][d] = x; }
  if (!["1", "2", "tie"].includes(String(v.winner))) throw new Error("bad winner");
  v.winner = String(v.winner); return v;
}

const key = {}, tasks = [];
for (const j of panel) {
  key[j.id] = { ...j };
  for (const id of IDS) {
    const flip = rnd() < 0.5, [a1, a2] = flip ? ["plain", "agent"] : ["agent", "plain"];
    key[j.id][id] = { 1: a1, 2: a2 };
    const read = arm => { const t = scrub(readFileSync(path.join(arm === "agent" ? AGENT : PLAIN, `${id}-${arm}.md`), "utf8")).trim(); return ANON ? plainFormat(t) : t; };
    const owner = existsSync(path.join(BRIEFS, `${id}.owner.md`)) ? readFileSync(path.join(BRIEFS, `${id}.owner.md`), "utf8") : "(none)";
    const system = `${RUBRIC}\n\n---\n\nYou are a blind judge. You judge as ${j.lens}. Two specialists did the same job; you do not know who made which. Answer with only a JSON object in this shape: ${SHAPE}`;
    const user = `# The brief I wrote\n\n${readFileSync(path.join(BRIEFS, `${id}.md`), "utf8").trim()}\n\n# My private notes (what I know about my data and what I hope for)\n\n${owner.trim()}\n\n# Output 1\n\n${read(a1)}\n\n# Output 2\n\n${read(a2)}\n`;
    tasks.push({ j, id, system, user });
  }
}
writeFileSync(path.join(OUT, "key.json"), JSON.stringify(key, null, 1));

const conc = { claude: 6, openai: 6, deepseek: 10, gemini: 6 };
const queues = Object.fromEntries(live.map(p => [p.p, tasks.filter(t => t.j.provider === p.p)]));
const results = []; let failed = 0;
await Promise.all(Object.entries(queues).flatMap(([p, q]) => Array.from({ length: conc[p] }, async () => {
  while (q.length) {
    const t = q.shift(), file = path.join(OUT, "raw", `${t.j.id}-${t.id}.json`);
    if (existsSync(file)) { results.push({ ...t, v: JSON.parse(readFileSync(file, "utf8")) }); continue; }
    let err;
    for (let a = 1; a <= 5; a++) {
      try { const v = parse(await ask(t.j, t.system, t.user)); writeFileSync(file, JSON.stringify(v, null, 1)); results.push({ ...t, v }); err = null; break; }
      catch (e) { err = e; await new Promise(r => setTimeout(r, 1500 * a)); }
    }
    if (err) { failed++; console.error(`${t.j.id} ${t.id} failed: ${err.message}`); }
  }
})));

// Unblind and tally.
const blank = () => ({ agent: 0, plain: 0, tie: 0 });
const tot = blank(), perJob = {}, perProvider = {}, dims = { agent: {}, plain: {} }, cnt = { agent: 0, plain: 0 }, use = { agent: {}, plain: {} }, feedback = [];
for (const { j, id, v } of results) {
  const map = key[j.id][id], w = v.winner === "tie" ? "tie" : map[v.winner];
  tot[w]++; (perJob[id] ??= blank())[w]++; (perProvider[j.provider] ??= blank())[w]++;
  for (const o of ["1", "2"]) {
    const arm = map[o], s = v[`o${o}`]; cnt[arm]++;
    for (const d of [...DIMS, "overall"]) dims[arm][d] = (dims[arm][d] ?? 0) + s[d];
    use[arm][s.use_as_is] = (use[arm][s.use_as_is] ?? 0) + 1;
    feedback.push({ id, judge: j.id, provider: j.provider, arm, overall: s.overall, strength: s.biggest_strength, mistake: s.biggest_mistake, to10: s.what_would_make_it_a_10 });
  }
}
const avg = arm => Object.fromEntries(Object.entries(dims[arm]).map(([d, x]) => [d, +(x / cnt[arm]).toFixed(2)]));
const tally = { panel: panel.map(j => `${j.id}:${j.model}`), verdicts: results.length, failed, tot, agent_share_of_decided: +(tot.agent / Math.max(1, tot.agent + tot.plain)).toFixed(3),
  perProvider, perJob, dims: { agent: avg("agent"), plain: avg("plain") }, use_as_is: use };
writeFileSync(path.join(OUT, "tally.json"), JSON.stringify(tally, null, 1));
writeFileSync(path.join(OUT, "feedback.jsonl"), feedback.map(f => JSON.stringify(f)).join("\n") + "\n");
writeFileSync(path.join(OUT, "reasons.txt"), results.map(({ j, id, v }) => `${id} ${j.id} -> ${v.winner === "tie" ? "tie" : key[j.id][id][v.winner]} (${v.margin}): ${v.reason}`).sort().join("\n"));
console.log(JSON.stringify({ verdicts: tally.verdicts, failed, tot, share: tally.agent_share_of_decided, perProvider, dims: tally.dims }, null, 1));
