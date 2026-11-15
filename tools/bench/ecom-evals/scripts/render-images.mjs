#!/usr/bin/env node
// Renders the image prompts that each arm wrote for the creative tasks, with OpenAI gpt-image at medium quality.
// OpenAI is used for images only. DRY RUN BY DEFAULT: nothing is sent unless you pass --go.
//
//   node scripts/render-images.mjs --round R1 [--tasks E16,E17,E18] [--arms plain,chat,code] [--run 1]
//        [--per-arm 5] [--model gpt-image-2.5-sunburst] [--quality medium] [--size 1024x1024]
//        [--usd-per-image 0.07] --max-usd 4 [--go] [--rounds-dir <dir>]
//
// - Reads each run's answer.md, finds the fenced `image-prompts` JSON block and takes the first --per-arm prompts.
// - --max-usd is a hard cap. The planned spend (images x --usd-per-image) must fit under it or nothing is sent,
//   and the script stops the moment the running estimate would pass it. Set --usd-per-image from the current
//   OpenAI price for the model, size and quality you use; the default is a deliberately high estimate.
// - The key is read inside this script from the .env file one folder above the repo (R/../.env), variable
//   OPENAI_API_KEY. It is never printed, logged or written anywhere. Error messages are cut before any header.
// - Images go to rounds/<R>/images/<task>/<arm>/img-<n>.png with a manifest.json (prompts and settings, no key).
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { REPO, ROUNDS, args, list, loadTasks, extractPrompts } from "./lib.mjs";

const A = args();
if (!A.round) { console.error("usage: render-images.mjs --round <name> --max-usd <cap> [--go]"); process.exit(2); }
const RD = path.join(A["rounds-dir"] ? path.resolve(A["rounds-dir"]) : ROUNDS, A.round);
const tasks = loadTasks().filter(t => t.image_task && (!list(A.tasks).length || list(A.tasks).includes(t.id)));
const arms = list(A.arms).length ? list(A.arms) : ["plain", "chat", "code"];
const run = `r${A.run ?? 1}`, perArm = Number(A["per-arm"] ?? 5);
const model = A.model ?? "gpt-image-2.5-sunburst", quality = A.quality ?? "medium", size = A.size ?? "1024x1024";
const usdPer = Number(A["usd-per-image"] ?? 0.07), cap = Number(A["max-usd"]);
const go = A.go === true;

const plan = [];
for (const t of tasks) for (const arm of arms) {
  const f = path.join(RD, "runs", t.id, arm, run, "answer.md");
  if (!existsSync(f)) { console.log(`skip ${t.id} ${arm}: no ${run}/answer.md`); continue; }
  const prompts = extractPrompts(readFileSync(f, "utf8")).slice(0, perArm);
  if (prompts.length < perArm) console.log(`note ${t.id} ${arm}: found ${prompts.length} of ${perArm} prompts (missing prompts count against the arm)`);
  prompts.forEach((p, i) => plan.push({ task: t.id, arm, n: i + 1, prompt: p.on_image_text ? `${p.prompt}\n\nText on the image, exactly: "${p.on_image_text}"` : p.prompt }));
}
const planned = plan.length * usdPer;
console.log(`${plan.length} images planned (${tasks.length} tasks x ${arms.length} arms x up to ${perArm}), model ${model}, quality ${quality}, size ${size}`);
console.log(`estimated spend $${planned.toFixed(2)} at $${usdPer}/image; cap ${Number.isFinite(cap) ? `$${cap}` : "not set"}`);
if (!go) { console.log("dry run: nothing sent. Add --go --max-usd <cap> to render."); process.exit(0); }
if (!Number.isFinite(cap) || cap <= 0) { console.error("--max-usd is required with --go"); process.exit(2); }
if (planned > cap) { console.error(`planned $${planned.toFixed(2)} is over the cap $${cap}; nothing sent`); process.exit(2); }

function readKey() {
  const envPath = path.resolve(REPO, "..", ".env");
  if (!existsSync(envPath)) throw new Error("no .env one folder above the repo");
  for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const m = /^\s*(?:export\s+)?OPENAI_API_KEY\s*=\s*(.*)\s*$/.exec(line);
    if (m) return m[1].replace(/^["']|["']$/g, "");
  }
  throw new Error("OPENAI_API_KEY not found in .env");
}
const key = readKey();
let spent = 0;
for (const job of plan) {
  if (spent + usdPer > cap + 1e-9) { console.log(`stopping: the next image would pass the $${cap} cap`); break; }
  const outDir = path.join(RD, "images", job.task, job.arm); mkdirSync(outDir, { recursive: true });
  const out = path.join(outDir, `img-${job.n}.png`);
  if (existsSync(out)) { console.log(`have ${job.task} ${job.arm} ${job.n}`); continue; }
  let ok = false;
  for (let attempt = 1; attempt <= 2 && !ok; attempt++) {
    try {
      const r = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST", headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
        body: JSON.stringify({ model, prompt: job.prompt, size, quality, n: 1 }),
      });
      const text = await r.text();
      if (!r.ok) { console.log(`HTTP ${r.status} for ${job.task} ${job.arm} ${job.n}: ${text.replace(/sk-[A-Za-z0-9_-]+/g, "[redacted]").slice(0, 200)}`); if (r.status >= 500 || r.status === 429) await new Promise(s => setTimeout(s, 4000)); else break; continue; }
      const j = JSON.parse(text), d = j.data?.[0];
      if (d?.b64_json) writeFileSync(out, Buffer.from(d.b64_json, "base64"));
      else if (d?.url) writeFileSync(out, Buffer.from(await (await fetch(d.url)).arrayBuffer()));
      else throw new Error("no image in response");
      spent += usdPer; ok = true;
      console.log(`made ${job.task} ${job.arm} ${job.n} (running estimate $${spent.toFixed(2)})`);
    } catch (e) { console.log(`error ${job.task} ${job.arm} ${job.n}: ${String(e.message).replace(/sk-[A-Za-z0-9_-]+/g, "[redacted]").slice(0, 200)}`); }
  }
}
const manifest = path.join(RD, "images", "manifest.json");
mkdirSync(path.dirname(manifest), { recursive: true });
writeFileSync(manifest, JSON.stringify({ round: A.round, model, quality, size, usd_per_image_estimate: usdPer, cap_usd: cap, spent_estimate_usd: spent, jobs: plan }, null, 1));
console.log(`done; estimated spend $${spent.toFixed(2)}. Next: node scripts/make-sheets.mjs image-sheets --round ${A.round}`);
