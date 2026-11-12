// Portrait generator for AI Blocks Agents.
// Usage: node scripts/portraits.mjs [--samples] [--only a,b] [--limit N] [--concurrency N] [--force]
// Reads only OPENAI_API_KEY (process.env first, else the handoff .env). Never prints it.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const DATA_DIR = path.join(root, "src/modules/directory/data");
const OUT_DIR = path.join(root, "public/agents");
// Generation hashes and the cumulative spend ledger are maintenance data, never public assets.
const STATE_FILE = path.join(root, "scripts/data/portrait-manifest.json");
const SAMPLE_DIR = "C:\\Users\\kevin\\AppData\\Local\\Temp\\claude\\6a935229b688e82c\\eb348924-2cd2-4d74-8f03-520bd31fe384\\scratchpad\\portrait-samples";
const ENV_FILE = "C:\\Users\\kevin\\.codex\\visualizations\\2026\\10\\17\\01a148b6-318d-7fe1-be76-fb993ef415d6\\output\\handoff\\ai-workflow-platform-handoff\\.env";
const QUALITY = "medium", SIZE = "1024x1024", OUTPUT_FORMAT = "png";

const args = process.argv.slice(2);
const flag = n => args.includes(`--${n}`);
const val = n => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : undefined; };
const samples = flag("samples"), force = flag("force");
const only = val("only")?.split(",").map(s => s.trim()).filter(Boolean);
const limit = val("limit") ? Number(val("limit")) : Infinity;
const modelArg = val("model") ?? "gpt-image-2.5-flare";
const budget = Number(val("budget-usd") ?? 9.5), dryRun = flag("dry-run");
// 8 samples (1058 text-in, 3512 image-out tokens) + 3 accidental test images (442 text-in, 1317 image-out tokens)
const SEED_SPENT_USD = ((1058 + 442) * 5 + (3512 + 1317) * 30) / 1e6;
const concurrency = Math.max(1, Number(val("concurrency") ?? 4));

function getKey() {
  if (process.env.OPENAI_API_KEY) return process.env.OPENAI_API_KEY.trim();
  try {
    for (const line of fs.readFileSync(ENV_FILE, "utf8").split(/\r?\n/)) {
      const m = line.match(/^\s*(?:export\s+)?OPENAI_API_KEY\s*=\s*(.*)\s*$/);
      if (m) return m[1].replace(/^["']|["']$/g, "").trim();
    }
  } catch {}
  return "";
}
const KEY = getKey();
if (!KEY) { console.error("OPENAI_API_KEY not found."); process.exit(1); }
const headers = { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" };

const sleep = ms => new Promise(r => setTimeout(r, ms));
async function api(url, init, attempts = 3) {
  for (let a = 1; ; a++) {
    let res;
    try { res = await fetch(url, { ...init, headers }); }
    catch (e) { if (a >= attempts) throw new Error(`network error: ${e.message}`); await sleep(2000 * 2 ** (a - 1)); continue; }
    if (res.ok) return res.json();
    if ((res.status === 429 || res.status >= 500) && a < attempts) {
      const ra = Number(res.headers.get("retry-after"));
      await sleep(ra > 0 ? ra * 1000 : 3000 * 2 ** (a - 1)); continue;
    }
    let msg = ""; try { msg = (await res.json()).error?.message ?? ""; } catch {}
    throw new Error(`HTTP ${res.status} ${msg.split(KEY).join("***")}`.trim());
  }
}

async function findModel() {
  const { data } = await api("https://api.openai.com/v1/models", { method: "GET" });
  const ids = data.map(m => m.id);
  if (!ids.includes(modelArg)) {
    console.error(`Model ${modelArg} not found. Available gpt-image ids:\n` + ids.filter(i => i.startsWith("gpt-image")).sort().join("\n"));
    process.exitCode = 2;
    return null;
  }
  return modelArg;
}

const TEMPLATE = (look, accent) =>
  `A polished 3D animated feature film style character portrait. Stylized proportions with a slightly oversized head, expressive large eyes, soft subsurface scattering on the skin, volumetric hair, soft cinematic studio lighting, high-end 3D render, ultra-detailed textures. Head and shoulders, centred, facing the viewer with a warm, friendly expression. ${look.trim().replace(/\.$/, "")}. Clean seamless background in a soft pastel tint of ${accent}. No text, no logos, no watermark, no frame.`;

const SAMPLES = [
  { id: "sample-1", look: "A woman in her early thirties with warm brown skin, curly black hair in a high bun, round glasses, a mustard cardigan, holding a magnifying glass, curious smile", accent: "#E4572E" },
  { id: "sample-2", look: "A man in his fifties with light skin, a grey beard and a navy blazer, holding a calculator, kind confident smile", accent: "#1B998B" },
  { id: "sample-3", look: "A woman in her forties of East Asian descent with a short bob, a teal blouse and a headset, cheerful", accent: "#3BB273" },
  { id: "sample-4", look: "A young man of South Asian descent with wavy hair, a hoodie over a collared shirt, holding a tablet with a chart, thoughtful smile", accent: "#6C5CE7" },
];
const SHARED = [
  { id: "expert-default", look: "A friendly generic professional of indeterminate background in their thirties, neat smart-casual jacket, calm approachable smile", accent: "#6C7A89" },
  { id: "fallback", look: "A friendly, neutral AI assistant character with a soft rounded face, simple smart-casual clothes, welcoming smile", accent: "#8E9AAF" },
];

function loadPersonas() {
  const out = [];
  if (!fs.existsSync(DATA_DIR)) return out;
  for (const f of fs.readdirSync(DATA_DIR).filter(f => /^personas-.*\.json$/.test(f))) {
    let arr; try { arr = JSON.parse(fs.readFileSync(path.join(DATA_DIR, f), "utf8")); } catch { console.warn(`skip unreadable ${f}`); continue; }
    for (const p of Array.isArray(arr) ? arr : []) {
      const pr = p?.profile;
      if (p?.id && pr?.look && pr?.accent) out.push({ id: p.id, look: pr.look, accent: pr.accent });
    }
  }
  return out;
}

const outDir = samples ? SAMPLE_DIR : OUT_DIR;
fs.mkdirSync(outDir, { recursive: true });
const manifestPath = samples ? path.join(outDir, "manifest.json") : STATE_FILE;
let manifest = {}; try { manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8")); } catch {}

const model = await findModel();
if (model) {
const suffix = model.replace(/^gpt-image-2.5-/, "");
let jobs = samples ? SAMPLES : [...loadPersonas(), ...SHARED];
if (only) jobs = jobs.filter(j => only.includes(j.id));
jobs = jobs.map(j => ({ ...j, prompt: TEMPLATE(j.look, j.accent), file: samples ? `${j.id}-${suffix}` : j.id }));
jobs = jobs.filter(j => {
  const file = path.join(outDir, `${j.file}.webp`);
  j.hash = crypto.createHash("sha256").update(j.prompt).digest("hex");
  if (force || !fs.existsSync(file)) return true;
  return manifest[j.file] && manifest[j.file].sha256 !== j.hash; // changed look -> regenerate
});
jobs = jobs.slice(0, limit);
console.log(`model=${model} quality=${QUALITY} size=${SIZE} output_format=${OUTPUT_FORMAT} jobs=${jobs.length} -> ${outDir}`);

// Spend tracking. The private maintenance ledger is shared by sample and full runs.
const mainPath = STATE_FILE;
let main = samples ? {} : manifest;
if (samples) { try { main = JSON.parse(fs.readFileSync(mainPath, "utf8")); } catch {} }
if (typeof main.spent_usd !== "number") main.spent_usd = SEED_SPENT_USD; // 8 samples + 3 test images already made
const saveMain = () => { fs.mkdirSync(path.dirname(mainPath), { recursive: true }); fs.writeFileSync(mainPath, JSON.stringify(main, null, 2)); };
const costOf = u => {
  const d = u.input_tokens_details ?? {};
  const imgIn = d.image_tokens ?? 0, txtIn = d.text_tokens ?? Math.max(0, (u.input_tokens ?? 0) - imgIn);
  return (txtIn * 5 + imgIn * 8 + (u.output_tokens ?? 0) * 30) / 1e6;
};
let maxCost = 0, inflight = 0;
const expected = () => maxCost || 0.02;

if (dryRun) {
  const est = jobs.length * expected();
  console.log(`dry run, no API calls: ${jobs.length} images with ${model}; expected about $${est.toFixed(2)} (at $${expected().toFixed(4)} each); already spent $${main.spent_usd.toFixed(2)}; budget $${budget.toFixed(2)}${main.spent_usd + est > budget ? " -- would exceed budget" : ""}`);
  for (const j of jobs) console.log(`  ${j.file}`);
  jobs = [];
}

const stats = { done: 0, failed: 0, in: 0, out: 0, total: 0, usageSeen: 0 };
let next = 0, stopped = false;
async function worker() {
  while (next < jobs.length && !stopped) {
    if (main.spent_usd + (inflight + 1) * expected() > budget) { stopped = true; break; }
    const j = jobs[next++];
    inflight++;
    const t0 = Date.now();
    try {
      const r = await api("https://api.openai.com/v1/images/generations", {
        method: "POST",
        body: JSON.stringify({ model, prompt: j.prompt, size: SIZE, quality: QUALITY, n: 1, output_format: OUTPUT_FORMAT }),
      });
      const b64 = r.data?.[0]?.b64_json;
      if (!b64) throw new Error("no image in response");
      const png = Buffer.from(b64, "base64");
      if (samples) fs.writeFileSync(path.join(outDir, `${j.file}.png`), png);
      const buf = await sharp(png).resize(512, 512).webp({ quality: 82 }).toBuffer();
      fs.writeFileSync(path.join(outDir, `${j.file}.webp`), buf);
      manifest[j.file] = { sha256: j.hash, model, created: new Date().toISOString() };
      if (r.usage) { const c = costOf(r.usage); main.spent_usd = Math.round((main.spent_usd + c) * 1e6) / 1e6; maxCost = Math.max(maxCost, c); }
      if (samples) fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
      saveMain();
      if (r.usage) { stats.usageSeen++; stats.in += r.usage.input_tokens ?? 0; stats.out += r.usage.output_tokens ?? 0; stats.total += r.usage.total_tokens ?? 0; }
      stats.done++;
      console.log(`ok   ${j.file} ${((Date.now() - t0) / 1000).toFixed(1)}s (${Math.round(buf.length / 1024)} KB)${r.usage ? ` usage ${JSON.stringify(r.usage)}` : ""}`);
    } catch (e) { stats.failed++; console.log(`FAIL ${j.file} ${((Date.now() - t0) / 1000).toFixed(1)}s: ${e.message}`); }
    finally { inflight--; }
  }
}
await Promise.all(Array.from({ length: Math.min(concurrency, jobs.length || 1) }, worker));
if (stopped) {
  const left = jobs.slice(next).map(j => j.file);
  console.log(`BUDGET STOP: not started (${left.length}): ${left.join(", ")}`);
}
if (!dryRun) console.log(`spent so far $${main.spent_usd.toFixed(4)} of $${budget.toFixed(2)} budget`);
console.log(`done=${stats.done} failed=${stats.failed}` + (stats.usageSeen ? ` tokens in=${stats.in} out=${stats.out} total=${stats.total}` : " (no usage returned)"));
}
