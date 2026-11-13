#!/usr/bin/env node
// Signal hits: did each output act on the signals the owner hid in the data?
//
//   node signal-hits.mjs --briefs <dir>[,<dir>...] --outputs <dir>[,<dir>...] --out <signal-hits.json>
//        [--provider claude|openai|deepseek|gemini] [--model <id>] [--env <.env>] [--ids J01,G08]
//        [--arms agent,plain] [--concurrency 4] [--dry-run]
//
// For every output <ID>-<arm>.md it sends one judge model the brief (<ID>.md), the owner notes (<ID>.owner.md) and
// the output, and asks it to mark each numbered signal under "Signals in the data" as fully, partly or missed.
// The judge is not told which arm wrote the output. Answers are cached in <out minus .json>.raw/<ID>-<arm>.json,
// so a rerun with the same --out skips outputs already judged. It writes <out> with every verdict, a per-arm
// summary (share of signals acted on fully) and a per-job table.
//
// --dry-run parses the briefs, notes and outputs and prints what would be sent, without calling any model.
// Keys come from the environment or --env and are never printed. Plain Node 18+, no packages.
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const argv = process.argv.slice(2);
const arg = (n, d) => { const i = argv.indexOf(`--${n}`); return i >= 0 ? argv[i + 1] : d; };
const list = v => (v ?? "").split(",").map(s => s.trim()).filter(Boolean);

const PROVIDERS = {
  claude: { key: "ANTHROPIC_API_KEY", model: "claude-opus-5-5" },
  openai: { key: "OPENAI_API_KEY", model: "gpt-5.5" },
  deepseek: { key: "DEEPSEEK_API_KEY", model: "deepseek-chat" },
  gemini: { key: "GEMINI_API_KEY", model: "gemini-pro-latest" },
};
export const VERDICTS = ["fully", "partly", "missed"];

// Numbered signals from the "Signals in the data" section of an owner-notes file.
export function parseSignals(ownerText) {
  const lines = ownerText.split(/\r?\n/);
  const start = lines.findIndex(l => /signals in the data/i.test(l));
  if (start < 0) return [];
  const out = [];
  for (const l of lines.slice(start + 1)) {
    if (/^\s*(#{1,6}\s|\*\*[^*]+:\*\*\s*$)/.test(l)) break; // next section
    const m = /^\s*(\d+)\.\s+(.*)$/.exec(l);
    if (m) {
      const text = m[2].trim();
      const title = (/^\*\*(.+?)\*\*/.exec(text)?.[1] ?? text.split(/(?<=\.)\s/)[0]).replace(/\.$/, "").trim();
      out.push({ n: Number(m[1]), title, text });
    } else if (out.length && l.trim()) {
      out[out.length - 1].text += " " + l.trim();
    }
  }
  return out;
}

export const scrub = t => t.replace(/\s*\[(?:[A-Z]{3}-\d{4}(?:\s*,\s*)?)+\]/g, "").replace(/\bAI Blocks\b/gi, "").replace(/[—–]/g, ", ");

export function buildPrompt(brief, owner, signals, output) {
  const system = [
    "You check one deliverable against the signals a business owner hid in the data of their brief.",
    "For each numbered signal, decide:",
    '- "fully": the deliverable notices the signal and acts on it in its main recommendation or plan, as strongly as the owner notes say a great answer would, with the right numbers. If it keeps something the signal says to cut, it must say why with the number.',
    '- "partly": it mentions the signal but only half-acts on it (a softened or demoted version, a side note, the wrong group, the wrong number, or acted on late or below the main plan).',
    '- "missed": it does not notice the signal, or acts against it.',
    "Judge only what is written in the deliverable. Quote or point to the place that shows it.",
    'Answer with only a JSON object: {"signals":[{"n":1,"verdict":"fully|partly|missed","evidence":"short quote or where in the deliverable","why":"one sentence"}]} with one entry per signal, in order.',
  ].join("\n");
  const user = `# The owner's brief\n\n${brief.trim()}\n\n# The owner's private notes\n\n${owner.trim()}\n\n# Signals to check\n\n${signals.map(s => `${s.n}. ${s.text}`).join("\n")}\n\n# The deliverable\n\n${scrub(output).trim()}\n`;
  return { system, user };
}

export function parseAnswer(text, signals) {
  const v = JSON.parse(/\{[\s\S]*\}/.exec(text)?.[0] ?? "null");
  if (!Array.isArray(v?.signals)) throw new Error("no signals array");
  return signals.map(s => {
    const hit = v.signals.find(x => Number(x.n) === s.n);
    const verdict = String(hit?.verdict ?? "").toLowerCase().trim();
    if (!VERDICTS.includes(verdict)) throw new Error(`bad verdict for signal ${s.n}: ${hit?.verdict}`);
    return { n: s.n, title: s.title, verdict, evidence: String(hit.evidence ?? ""), why: String(hit.why ?? "") };
  });
}

export function summarize(results) {
  const blank = () => ({ fully: 0, partly: 0, missed: 0, total: 0, fullyShare: 0, score: 0 });
  const perArm = {}, perJob = {};
  for (const r of results) {
    const a = (perArm[r.arm] ??= blank()), j = ((perJob[r.id] ??= {})[r.arm] ??= blank());
    for (const s of r.signals) for (const t of [a, j]) { t[s.verdict]++; t.total++; }
  }
  for (const t of [...Object.values(perArm), ...Object.values(perJob).flatMap(x => Object.values(x))]) {
    t.fullyShare = t.total ? +(t.fully / t.total).toFixed(3) : 0;
    t.score = t.total ? +((t.fully + 0.5 * t.partly) / t.total).toFixed(3) : 0; // fully 1, partly 0.5, missed 0
  }
  return { perArm, perJob };
}

async function ask(provider, model, key, system, user) {
  if (provider === "claude") {
    const r = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model, max_tokens: 3000, system, messages: [{ role: "user", content: user }] }) });
    if (!r.ok) throw new Error(`HTTP ${r.status} ${(await r.text()).slice(0, 160)}`);
    return (await r.json()).content.filter(c => c.type === "text").map(c => c.text).join("");
  }
  if (provider === "openai" || provider === "deepseek") {
    const url = provider === "openai" ? "https://api.openai.com/v1/chat/completions" : "https://api.deepseek.com/chat/completions";
    const body = { model, messages: [{ role: "system", content: system }, { role: "user", content: user }] };
    if (provider === "openai") { body.max_completion_tokens = 8000; body.response_format = { type: "json_object" }; }
    else { body.max_tokens = 4000; if (model === "deepseek-chat") body.response_format = { type: "json_object" }; }
    const r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` }, body: JSON.stringify(body) });
    if (!r.ok) throw new Error(`HTTP ${r.status} ${(await r.text()).slice(0, 160)}`);
    return (await r.json()).choices?.[0]?.message?.content ?? "";
  }
  const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, { method: "POST", headers: { "Content-Type": "application/json", "x-goog-api-key": key },
    body: JSON.stringify({ systemInstruction: { parts: [{ text: system }] }, contents: [{ role: "user", parts: [{ text: user }] }], generationConfig: { responseMimeType: "application/json", maxOutputTokens: 4000 } }) });
  if (!r.ok) throw new Error(`HTTP ${r.status} ${(await r.text()).slice(0, 160)}`);
  return (await r.json()).candidates?.[0]?.content?.parts?.map(p => p.text).join("") ?? "";
}

async function main() {
  const briefDirs = list(arg("briefs")), outDirs = list(arg("outputs")), OUT = arg("out");
  if (!briefDirs.length || !outDirs.length || !OUT) {
    console.error("Usage: node signal-hits.mjs --briefs <dir>[,<dir>] --outputs <dir>[,<dir>] --out <signal-hits.json> [--provider] [--model] [--env] [--ids] [--arms] [--dry-run]");
    process.exit(2);
  }
  const provider = arg("provider", "claude");
  if (!PROVIDERS[provider]) { console.error(`unknown provider ${provider}`); process.exit(2); }
  const model = arg("model", PROVIDERS[provider].model), dry = argv.includes("--dry-run");
  const env = { ...process.env };
  if (arg("env")) for (const l of readFileSync(arg("env"), "utf8").split(/\r?\n/)) { const m = /^([A-Z_]+)\s*=\s*"?([^"\r\n]*)"?/.exec(l); if (m && !env[m[1]]) env[m[1]] = m[2]; }
  const key = env[PROVIDERS[provider].key];
  if (!dry && !key) { console.error(`${PROVIDERS[provider].key} is not set (use the environment or --env)`); process.exit(2); }

  const briefOf = {};
  for (const d of briefDirs) for (const f of readdirSync(d)) { const m = /^([A-Z]+\d+)\.md$/.exec(f); if (m) briefOf[m[1]] = d; }
  const ids = list(arg("ids")), arms = list(arg("arms", "agent,plain"));
  const tasks = [];
  for (const d of outDirs) for (const f of readdirSync(d).sort()) {
    const m = /^([A-Z]+\d+)-(agent|plain)\.md$/.exec(f);
    if (!m || (ids.length && !ids.includes(m[1])) || !arms.includes(m[2])) continue;
    const [, id, arm] = m, bd = briefOf[id];
    if (!bd) { console.error(`skip ${f}: no brief ${id}.md`); continue; }
    const ownerFile = path.join(bd, `${id}.owner.md`);
    if (!existsSync(ownerFile)) { console.error(`skip ${f}: no ${id}.owner.md`); continue; }
    const owner = readFileSync(ownerFile, "utf8"), signals = parseSignals(owner);
    if (!signals.length) { console.error(`skip ${f}: no numbered signals in ${id}.owner.md`); continue; }
    const { system, user } = buildPrompt(readFileSync(path.join(bd, `${id}.md`), "utf8"), owner, signals, readFileSync(path.join(d, f), "utf8"));
    tasks.push({ id, arm, signals, system, user });
  }
  console.error(`${tasks.length} outputs; judge ${provider}:${model}`);
  if (dry) {
    for (const t of tasks) console.log(`${t.id}-${t.arm}: ${t.signals.length} signals (${t.signals.map(s => s.title).join(" | ")}); prompt ${t.user.length} chars`);
    return;
  }

  const rawDir = OUT.replace(/\.json$/i, "") + ".raw";
  mkdirSync(rawDir, { recursive: true });
  const results = [], queue = [...tasks];
  let failed = 0;
  await Promise.all(Array.from({ length: Number(arg("concurrency", 4)) }, async () => {
    while (queue.length) {
      const t = queue.shift(), file = path.join(rawDir, `${t.id}-${t.arm}.json`);
      if (existsSync(file)) { results.push(JSON.parse(readFileSync(file, "utf8"))); continue; }
      let err;
      for (let a = 1; a <= 4; a++) {
        try {
          const r = { id: t.id, arm: t.arm, signals: parseAnswer(await ask(provider, model, key, t.system, t.user), t.signals) };
          writeFileSync(file, JSON.stringify(r, null, 1)); results.push(r); err = null; break;
        } catch (e) { err = e; await new Promise(res => setTimeout(res, 1500 * a)); }
      }
      if (err) { failed++; console.error(`${t.id}-${t.arm} failed: ${err.message}`); }
    }
  }));
  results.sort((a, b) => (a.id + a.arm).localeCompare(b.id + b.arm));
  const { perArm, perJob } = summarize(results);
  writeFileSync(OUT, JSON.stringify({ judge: { provider, model }, judged: results.length, failed, perArm, perJob, results }, null, 1));
  console.log(JSON.stringify({ judged: results.length, failed, perArm }, null, 1));
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) await main();
