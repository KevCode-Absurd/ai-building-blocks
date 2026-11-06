// Live smoke test for the model router: one tiny JSON call per provider, on each provider's cheapest model,
// through the real callProvider code (src/core/models.ts). Costs a fraction of a cent per run.
//
//   node scripts/live-smoke.mjs                       anthropic, gemini, deepseek (the text providers)
//   node scripts/live-smoke.mjs --with-openai         also OpenAI on gpt-6-luna (keep this occasional)
//   node scripts/live-smoke.mjs --only deepseek       one provider
//
// Keys come from process.env first, else the handoff .env. Keys are never printed.
import fs from "node:fs";

const ENV_FILE = "C:/Users/kevin/.codex/visualizations/2026/10/17/01a148b6-318d-7fe1-be76-fb993ef415d6/output/handoff/ai-workflow-platform-handoff/.env";
const args = process.argv.slice(2);
const only = args.includes("--only") ? args[args.indexOf("--only") + 1] : null;
const providers = only ? [only] : ["anthropic", "gemini", "deepseek", ...(args.includes("--with-openai") ? ["openai"] : [])];

const fileEnv = {};
try {
  for (const line of fs.readFileSync(ENV_FILE, "utf8").split(/\r?\n/)) {
    const m = /^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/.exec(line);
    if (m) fileEnv[m[1]] = m[2].replace(/^['"]|['"]$/g, "").trim();
  }
} catch { /* no .env: process.env only */ }

const { callProvider, PROVIDER_KEYS } = await import(new URL("../src/core/models.ts", import.meta.url).href);
const schema = { type: "object", properties: { ok: { type: "boolean" }, word: { type: "string" } }, required: ["ok", "word"], additionalProperties: false };
let total = 0, failed = 0;
for (const provider of providers) {
  const keyName = PROVIDER_KEYS[provider];
  const key = process.env[keyName] || fileEnv[keyName];
  if (!key) { console.log(`${provider.padEnd(9)} skipped: no ${keyName}`); continue; }
  const env = { MODEL_MODE: "live", MODEL_PROVIDERS: provider, [keyName]: key };
  const t0 = Date.now();
  try {
    const r = await callProvider(env, { purpose: "smoke.test", tier: "small", system: "You answer briefly.", prompt: "Reply with ok true and any one short word.", json: true, schema, maxTokens: 200 });
    const good = r.data && r.data.ok === true && typeof r.data.word === "string";
    if (!good) failed++;
    total += r.costMicroUsd;
    console.log(`${provider.padEnd(9)} ${good ? "ok  " : "BAD "} ${r.model} in=${r.inputTokens} out=${r.outputTokens} $${(r.costMicroUsd / 1e6).toFixed(5)} ${((Date.now() - t0) / 1000).toFixed(1)}s`);
  } catch (err) {
    failed++;
    console.log(`${provider.padEnd(9)} FAIL ${err.code ?? ""} ${err.message}`);
  }
}
console.log(`total $${(total / 1e6).toFixed(5)}${failed ? `, ${failed} failed` : ""}`);
process.exitCode = failed ? 1 : 0;
