// Live dry run: one whole hire with real AI models, in memory, nothing deployed or emailed.
// Seeds the real agents and job menu into a throwaway database, then a buyer hires an agent:
// request -> quote -> confirm -> run (draft, self-checks, rubric judge) -> ops release -> buyer sees the delivery.
//
//   node --experimental-test-module-mocks scripts/live-dry-run.mjs --agent <persona-id> --job <job-type-id> --brief "..." [--out dir]
//
// Text models only (MODEL_PROVIDERS anthropic,gemini,deepseek); OpenAI stays for images. Caps: $1 a job, $3 a run.
// Keys come from process.env first, else the handoff .env. Keys are never printed.
import fs from "node:fs";
import path from "node:path";

const ENV_FILE = "C:/Users/kevin/.codex/visualizations/2026/10/17/01a148b6-318d-7fe1-be76-fb993ef415d6/output/handoff/ai-workflow-platform-handoff/.env";
const args = process.argv.slice(2);
const val = n => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : undefined; };
const agent = val("agent"), jobType = val("job"), brief = val("brief"), outDir = val("out");
if (!agent || !brief) { console.error("Need --agent <persona-id> and --brief \"...\" (and usually --job <job-type-id>)."); process.exit(2); }

const fileEnv = {};
try {
  for (const line of fs.readFileSync(ENV_FILE, "utf8").split(/\r?\n/)) {
    const m = /^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/.exec(line);
    if (m) fileEnv[m[1]] = m[2].replace(/^['"]|['"]$/g, "").trim();
  }
} catch { /* process.env only */ }
const key = n => process.env[n] || fileEnv[n] || undefined;

const root = new URL("../", import.meta.url);
const { testEnv } = await import(new URL("test/helpers.ts", root).href);
const { listJobTypes } = await import(new URL("src/modules/catalogue/index.ts", root).href);
const catalogue = listJobTypes().slice();
const t = await testEnv({
  MODEL_MODE: "live", MODEL_PROVIDERS: "anthropic,gemini,deepseek", JOB_RUN: undefined,
  ANTHROPIC_API_KEY: key("ANTHROPIC_API_KEY"), GEMINI_API_KEY: key("GEMINI_API_KEY"), DEEPSEEK_API_KEY: key("DEEPSEEK_API_KEY"),
  DAILY_MODEL_CAP_USD: "3", JOB_COST_CAP_USD: "1", BASELINE_SAMPLE_RATE: "0",
}, { catalogue });

const OPS = "user_ops", BUYER = "user_buyer";
const step = (label, res) => {
  const ok = res.status >= 200 && res.status < 300;
  console.log(`${ok ? "ok  " : "FAIL"} ${label} (HTTP ${res.status})`);
  if (!ok) { console.log(JSON.stringify(res.body?.error ?? res.body).slice(0, 400)); process.exit(1); }
  return res.body;
};
const t0 = Date.now();
await t.makeOps(OPS);
await t.grantBeta(BUYER);
const seeded = step("seed agents and job menu", await t.api("POST", "/api/ops/seed", { user: OPS }));
console.log(`     ${seeded.personas.created} agents, ${seeded.agents.created} house agent packages`);

const created = step("buyer sends the request", await t.api("POST", "/api/requests", { user: BUYER, body: { text: brief, personaId: agent, ...(jobType ? { jobTypeId: jobType } : {}) } }));
let r = created.request;
console.log(`     job type: ${r.job_type?.id ?? "none (open request)"}; ready: ${r.ready}`);
if (!r.ready) {
  console.log("     questions:", JSON.stringify(r.questions));
  const answers = Object.fromEntries((r.questions ?? []).map(q => [q.field ?? q.id, q.options?.[0] ?? "Use your best judgement from the brief."]));
  r = step("buyer answers the questions", await t.api("POST", `/api/requests/${r.id}/answers`, { user: BUYER, body: { answers } })).request;
}
const quoted = step("quote", await t.api("POST", `/api/requests/${r.id}/quote`, { user: BUYER, body: {} })).request;
console.log(`     price $${(quoted.quote.price_cents / 100).toFixed(2)}, ${quoted.quote.turnaround_hours}h, ${quoted.quote.checklist.length} checks`);
const confirmed = step("buyer confirms; the run starts", await t.api("POST", `/api/requests/${r.id}/confirm`, { user: BUYER, body: {} }));
await t.settle();
const jobId = confirmed.job.id;
const [job] = await t.sql("SELECT status FROM jobs WHERE id = ?", jobId);
console.log(`     job status after the run: ${job.status}`);
const calls = await t.sql("SELECT purpose, provider, model, input_tokens, output_tokens, cost_micro_usd, ok FROM model_calls ORDER BY created_at");
for (const c of calls) console.log(`     ${c.ok ? "  " : "x "}${c.purpose.padEnd(26)} ${String(c.provider).padEnd(9)} ${String(c.model).padEnd(24)} in=${c.input_tokens} out=${c.output_tokens} $${(c.cost_micro_usd / 1e6).toFixed(4)}`);
const drafts = await t.sql("SELECT id, version, content FROM drafts WHERE job_id = ? ORDER BY version", jobId);
for (const d of drafts) {
  const scores = await t.sql("SELECT judge, judge_model, passed, score, result FROM scores WHERE draft_id = ? ORDER BY created_at", d.id);
  console.log(`     draft v${d.version}: ${d.content.length} chars; ${scores.map(s => `${s.judge} ${s.passed ? "pass" : "FAIL"}${s.score !== null ? ` ${Number(s.score).toFixed(2)}` : ""} (${s.judge_model ?? "?"})`).join(", ") || "no scores"}`);
  for (const s of scores.filter(s => !s.passed)) {
    const r = JSON.parse(s.result);
    const misses = (r.criteria ?? r.results ?? []).filter(c => c.pass === false || c.passed === false).map(c => `${c.id}: ${c.reason ?? c.note ?? ""}`.slice(0, 160));
    if (misses.length) console.log(`       missed: ${misses.join(" | ")}`);
    for (const f of r.flags ?? []) console.log(`       flag ${f.code}: ${String(f.message ?? "").slice(0, 120)} Found: "${String(f.excerpt ?? "").slice(0, 120)}"`);
  }
}
const latest = drafts.at(-1);
if (job.status === "in_review" && latest) step("ops releases the latest draft", await t.api("POST", `/api/ops/jobs/${jobId}/release`, { user: OPS, body: { draft_id: latest.id } }));
const seen = step("buyer opens the job", await t.api("GET", `/api/jobs/${jobId}`, { user: BUYER }));
const body = latest?.content ?? null;
const total = calls.reduce((s, c) => s + c.cost_micro_usd, 0);
console.log(`total $${(total / 1e6).toFixed(4)} in ${((Date.now() - t0) / 1000).toFixed(0)}s; final status ${seen.job?.status ?? "?"}`);
if (outDir) {
  fs.mkdirSync(outDir, { recursive: true });
  const file = path.join(outDir, `${agent}-${jobId}.md`);
  fs.writeFileSync(file, body ?? JSON.stringify(seen, null, 2));
  console.log(`delivery written to ${file}`);
}
