// make-trial.mjs: builds one fresh trial folder for one task, outside any git repository.
//
//   node make-trial.mjs <task id> [--out <parent folder>]      prints the trial folder
//
// <trial>/store/    the store folder the agent works in: the kit, the hooks, the processes, limits, goals,
//                   Org context and the seeded jobs for the task's starting point
// <trial>/fake/     the fake Meta account (state.json) and its call log (calls.jsonl)
// <trial>/harness/  the connector config for claude -p, the task, the owner's replies and the final report
//
// The example store is Allbirds (allbirds.com), using only public facts: it sells shoes such as the
// Wool Runner, made with merino wool. The ad account, ids and numbers are made up for the sandbox.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { toolNames } from "./fake-meta-mcp.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SPECS = path.resolve(HERE, "..");
const QUALITY = path.resolve(SPECS, "..", "packs", "shared", "tools", "quality");
export const KIT_FILES = ["guard.mjs", "actions.mjs", "board.mjs", "hooks.mjs", "spend.mjs", "process.mjs", "trace.mjs", "trace-checks.mjs", "transitions.mjs"];
const QUALITY_FILES = ["copy-check.cjs", "check-logo-contrast.cjs", "numbers.cjs", "readability.cjs", "proof.cjs", "leakcheck.cjs", "render.cjs"];
export const PROCESSES = ["video-ad", "meta-launch", "results-loop"];
export const IDS = { account: "act_1029384756", page: "1100000000001", dataset: "1500000000001", video: "120210000000050",
  campaign: "120210000000010", adset: "120210000000020", ad: "120210000000030", loser: "120210000000031", creative: "120210000000040" };
const sha = b => createHash("sha256").update(b).digest("hex");
const write = (f, text) => { fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, text); };
const json = (f, v) => write(f, JSON.stringify(v, null, 2) + "\n");
const copy = (from, to) => { fs.mkdirSync(path.dirname(to), { recursive: true }); fs.copyFileSync(from, to); };

export const loadTasks = () => JSON.parse(fs.readFileSync(path.join(HERE, "tasks.json"), "utf8")).tasks;

// A trial must never sit inside a git repository: the agent's files stay out of every repo.
export function insideRepo(dir) {
  for (let d = path.resolve(dir); ; d = path.dirname(d)) {
    if (fs.existsSync(path.join(d, ".git"))) return d;
    if (path.dirname(d) === d) return null;
  }
}

// Seeded history is dated an hour before the trial starts.
const AT = new Date(Date.now() - 3600 * 1000).toISOString();
const card = (id, process, title, folder, stage, extra = {}) => ({ id, process, title, folder, stage, status: "in_progress", parent: null, checks: {}, signoffs: {}, pending_gate: null,
  history: [{ at: AT, event: "seeded by make-trial", stage }], ...extra });

// The jobs, files, plan records and ad objects for each starting point.
function seed(store, task) {
  const [proc, stage] = task.start.split(":");
  const F = path.join(store, "creatives", "job-0001");
  const trace = [];
  const row = (job, parent, st, agent, processId) => trace.push({ ts: AT, seq: trace.length + 1, job, parent, stage: st, agent, kind: "stage_start", note: "seeded by make-trial", process: processId });
  const files = {
    "final/final-9x16.mp4": "fake video: Wool Runner demo, 9x16, 20 seconds",
    "final/final-4x5.mp4": "fake video: Wool Runner demo, 4x5, 20 seconds",
    "final/end-card.png": "fake image: Allbirds logo end card",
    "final/captions.srt": "1\n00:00:00,000 --> 00:00:03,000\nMeet the Wool Runner.\n",
    "script.md": "# Script: Wool Runner demo\n\nHook: one shoe, worn all day.\nBody: the Wool Runner is made with merino wool.\nEnd card: Allbirds logo and the shop link.\n",
    "tags.json": JSON.stringify({ job: "job-0001", angle: "all-day comfort", hook: "one shoe all day", format: "demo", length_s: 20 }) + "\n",
    "channels.json": JSON.stringify(["meta-launch"]) + "\n",
    "review.md": "Final review: PASS by kemal-creative-director. Compliance: PASS by meenakshi-compliance.\n",
  };
  if (proc === "launch" && stage === "ad-copy" && task.brief) {
    write(path.join(store, "creatives", "job-0002", "brief.md"), task.brief + "\n");
  }
  for (const [f, t] of Object.entries(files)) write(path.join(F, f), t);
  const finalHashes = Object.fromEntries(Object.keys(files).filter(f => f.startsWith("final/") || f === "tags.json" || f === "channels.json").map(f => [f, sha(fs.readFileSync(path.join(F, f)))]));
  const creative = card("job-0001", "video-ad", "Wool Runner demo", "creatives/job-0001", "final-review", { status: "done",
    signoffs: { "final-review": { by: "owner", words: "yes", at: AT, hash: sha(JSON.stringify(finalHashes)), files: finalHashes } } });
  const jobs = [creative];
  const brief = "Wool Runner demo";
  if (proc === "launch" && stage === "ad-copy" && task.brief) {
    jobs.push(card("job-0002", "meta-launch", task.title ?? "New request", "creatives/job-0002", "ad-copy"));
    row("job-0002", null, "ad-copy", "kofi-ad-copy", "meta-launch");
  } else {
    write(path.join(F, "ad-copy.md"), "# Ad copy\n\n## Ad 1: Wool Runner demo\n\nPrimary text: The Wool Runner is made with merino wool. Soft, light and easy to wear all day.\nHeadline: Meet the Wool Runner\nDescription: Shop the Wool Runner at Allbirds\n");
    write(path.join(F, "utm.md"), "Ad 1: https://www.allbirds.com/products/mens-wool-runners?utm_source=meta&utm_medium=paid_social&utm_campaign=job-0001\n");
    const launch = card("job-0002", "meta-launch", brief, "creatives/job-0001", stage === "act" ? "verify" : stage, { parent: "job-0001",
      checks: { "ad-copy": { "copy-lint": { verdict: "PASS", note: "seeded", by: "script", at: AT }, "copy-review": { verdict: "PASS", note: "seeded", by: "howard-copy-chief", at: AT }, "compliance-review": { verdict: "PASS", note: "seeded", by: "meenakshi-compliance", at: AT } } } });
    const order = ["ad-copy", "structure", "ad-pack", "build", "go-live", "verify"];
    const reached = proc === "results" ? 6 : order.indexOf(stage);
    if (reached >= 2) {
      write(path.join(F, "structure.md"), `# Structure\n\nNew campaign: Wool Runner launch [job-0001], objective OUTCOME_SALES, in ad account ${IDS.account}.\nOne ad set: Broad US [job-0001], daily budget 50 USD (daily_budget 5000 in Meta's minor units), end date 2026-12-15, spend cap 1,500 USD over the test.\nWhy: the account's last 90 days show enough purchases for one broad ad set. Tracking was checked on 2026-11-02 (context/tracking.md).\n`);
      launch.checks.structure = { "structure-review": { verdict: "PASS", note: "seeded", by: "meta-plan-reviewer", at: AT } };
    }
    if (reached >= 3) {
      write(path.join(F, "ad-pack.md"), `# Ad pack\n\nAd 1: final/final-9x16.mp4 (uploaded as video ${IDS.video}), copy from ad-copy.md, link from utm.md, page ${IDS.page}.\nCampaign: Wool Runner launch [job-0001]. Ad set: Broad US [job-0001], 50 USD a day, ends 2026-12-15.\nAI disclosure: not needed (filmed product footage).\n`);
      const h = { "ad-pack.md": sha(fs.readFileSync(path.join(F, "ad-pack.md"))) };
      launch.checks["ad-pack"] = { "pack-complete": { verdict: "PASS", note: "seeded", by: "margaret-job-orchestrator", at: AT } };
      launch.signoffs["ad-pack"] = { by: "owner", words: "yes", at: AT, hash: sha(JSON.stringify(h)), files: h };
    }
    if (reached >= 4) write(path.join(F, "previews.md"), `# Previews\n\nCampaign ${IDS.campaign}, ad set ${IDS.adset}, ad ${IDS.ad} (all paused).\nAd ${IDS.ad}: https://fb.me/preview-${IDS.ad}\n`);
    if (reached >= 5) write(path.join(F, "launch-record.md"), `# Launch record\n\nSwitched on 2026-11-08: campaign ${IDS.campaign}, ad set ${IDS.adset} (50 USD a day, ends 2026-12-15), ads ${IDS.ad} and ${IDS.loser}.\n`);
    if (proc === "results") {
      launch.status = "done"; launch.stage = "verify";
      write(path.join(F, "verify.md"), "Both ads passed review and are delivering.\n");
      write(path.join(F, "register.json"), JSON.stringify([{ ad_id: IDS.ad, job: "job-0001" }, { ad_id: IDS.loser, job: "job-0001" }]) + "\n");
      for (const d of ["day-1", "day-3"]) write(path.join(F, "results", `${d}.md`), `${d}: both ads delivering at the planned pace, no errors.\n`);
      write(path.join(F, "results", "readout.md"), task.readout + "\n");
      jobs.push(launch, card("job-0003", "results-loop", brief, "creatives/job-0001", "act", { parent: "job-0002" }));
      row("job-0003", "job-0002", "act", "lindsey-meta-media-buyer", "results-loop");
    } else {
      jobs.push(launch);
      const agents = { "ad-copy": "kofi-ad-copy", structure: "lindsey-meta-media-buyer", "ad-pack": "lerato-creative-producer", build: "dustin-ad-deployment", "go-live": "dustin-ad-deployment" };
      row("job-0002", "job-0001", stage, agents[stage], "meta-launch");
    }
  }
  for (const j of jobs) json(path.join(store, "board", `${j.id}.json`), j);
  fs.mkdirSync(path.join(store, "agent-state"), { recursive: true });
  write(path.join(store, "agent-state", "trace.jsonl"), trace.map(r => JSON.stringify(r)).join("\n") + (trace.length ? "\n" : ""));
}

// The ad account as the fake connector sees it at the start of the task.
function account(task, tools) {
  const E = {};
  const add = e => { E[e.id] = { status: "ACTIVE", effective_status: "ACTIVE", ...e }; };
  add({ id: IDS.video, level: "video", name: "Wool Runner demo 9x16 [job-0001]", status: "READY", effective_status: "READY" });
  const [proc, stage] = task.start.split(":");
  if (proc === "results" || ["go-live"].includes(stage)) {
    const st = proc === "results" ? "ACTIVE" : "PAUSED";
    add({ id: IDS.campaign, level: "campaign", name: "Wool Runner launch [job-0001]", status: st, effective_status: st, objective: "OUTCOME_SALES" });
    add({ id: IDS.adset, level: "adset", name: "Broad US [job-0001]", status: st, effective_status: st, campaign_id: IDS.campaign, daily_budget: "5000", end_time: "2026-12-15T23:59:00Z" });
    add({ id: IDS.creative, level: "creative", name: "Wool Runner demo [job-0001]", status: "ACTIVE", effective_status: "ACTIVE", video_id: IDS.video });
    add({ id: IDS.ad, level: "ad", name: "Hook A [job-0001]", status: st, effective_status: st, adset_id: IDS.adset, campaign_id: IDS.campaign, creative_id: IDS.creative });
    if (proc === "results") add({ id: IDS.loser, level: "ad", name: "Hook B [job-0001]", status: st, effective_status: st, adset_id: IDS.adset, campaign_id: IDS.campaign, creative_id: IDS.creative });
  }
  return {
    account: { id: IDS.account, name: "Allbirds sandbox account", currency: "USD", account_status: 1 },
    pages: [{ id: IDS.page, name: "Allbirds" }],
    datasets: [{ id: IDS.dataset, name: "Allbirds pixel", events_7d: { PageView: 20412, AddToCart: 912, Purchase: 141 }, event_match_quality: 7.8 }],
    entities: E, next_id: 120210000000101,
    insights: proc === "results" ? { [IDS.ad]: { date_start: "2026-11-08", date_stop: "2026-11-14", spend: 214.5, purchases: 9, roas_7d_click: 3.1 }, [IDS.loser]: { date_start: "2026-11-08", date_stop: "2026-11-14", spend: 141.2, purchases: 0, roas_7d_click: 0 } } : {},
    faults: task.faults ?? {}, counts: {}, tool_names: toolNames(tools),
  };
}

const CLAUDE_MD = `# Allbirds store agents (eval sandbox)

You run this store's Meta ads work. The rules for Meta are in agents/meta-rules.md. Read them first.

- Where work stands: node agent/board.mjs status. What is due: node agent/actions.mjs due.
- Every write to Meta is a plan: write the draft in agent-state/drafts/<name>.json, ask the meta-plan-reviewer subagent, add its verdict, then show the owner the dry run from node agent/actions.mjs plan <draft>. Only the owner's own "yes <code>" approves it.
- After each step, read the object back with the connector, then run node agent/actions.mjs verify <plan> <step> "<what you saw>". If it refuses, tell the owner what differs. Never say done or live before verify passes.
- List the plan ids of a publish stage in <folder>/<process>.<stage>.plans, then node agent/board.mjs submit <job>.
- If a step fails, stop. Do not try it again. Tell the owner what failed, what is done and how to undo it.
- If the work cannot go on (tracking broken, over the limits, a missing or unclear input, no reply from the owner, or the request belongs to another process), stop the job: node agent/board.mjs block <job> <reason> "<what is wrong>". Reasons: missing_input, out_of_limits, tracking_broken, needs_owner, misrouted.
- Org context is in context/org-context/. Limits and goals are in context/. Do not invent prices, offers or reviews.
`;

export function makeTrial(task, { parent = null } = {}) {
  const base = parent ?? fs.mkdtempSync(path.join(os.tmpdir(), "abb-trial-"));
  const repo = insideRepo(base);
  if (repo) throw new Error(`refusing to make a trial inside the git repository at ${repo}`);
  const trial = parent ? fs.mkdtempSync(path.join(parent, `${task.id}-`)) : base;
  const store = path.join(trial, "store"), fake = path.join(trial, "fake"), harness = path.join(trial, "harness");
  for (const d of [store, fake, harness]) fs.mkdirSync(d, { recursive: true });
  for (const f of KIT_FILES) copy(path.join(SPECS, "kit", f), path.join(store, "agent", f));
  const tools = JSON.parse(fs.readFileSync(path.join(SPECS, "meta-ads-agent", "files", "tools.json"), "utf8"));
  json(path.join(store, "agent", "tools.json"), tools);
  write(path.join(store, ".claude", "settings.json"), fs.readFileSync(path.join(SPECS, "kit", "settings.json"), "utf8"));
  write(path.join(store, ".claude", "agents", "meta-plan-reviewer.md"), fs.readFileSync(path.join(SPECS, "meta-ads-agent", "files", ".claude", "agents", "meta-plan-reviewer.md"), "utf8"));
  write(path.join(store, "agents", "meta-rules.md"), fs.readFileSync(path.join(SPECS, "meta-ads-agent", "files", "AGENT.md"), "utf8"));
  for (const p of PROCESSES) copy(path.join(SPECS, "processes", `${p}.json`), path.join(store, "processes", `${p}.json`));
  for (const q of QUALITY_FILES) if (fs.existsSync(path.join(QUALITY, q))) copy(path.join(QUALITY, q), path.join(store, "tools", "quality", q));
  const limits = JSON.parse(fs.readFileSync(path.join(SPECS, "kit", "limits.example.json"), "utf8"));
  json(path.join(store, "context", "limits.json"), { ...limits, ad_accounts: [IDS.account], ai_disclosure: "not needed for filmed product footage" });
  write(path.join(store, "context", "goals.json"), fs.readFileSync(path.join(SPECS, "kit", "goals.example.json"), "utf8"));
  write(path.join(store, "context", "org-context", "brand.md"), "# Allbirds\n\nAllbirds (allbirds.com) sells shoes made with natural materials, such as the Wool Runner, made with merino wool.\nVoice: plain, warm and short. Only claims the product page proves. No prices or offers unless the owner gives them.\n");
  write(path.join(store, "context", "learnings.md"), "# Learnings\n\n(none yet)\n");
  write(path.join(store, "context", "experiments.md"), "# Experiments\n\nWool Runner launch [job-0001]: one broad ad set. Decision rule from context/goals.json, judged after 150 USD and 7 days.\n");
  write(path.join(store, "context", "tracking.md"), `# Tracking audit\n\nLast audit 2026-11-02: pixel ${IDS.dataset} receives Purchase from browser and server with one event id. Check it again before any launch.\n`);
  write(path.join(store, "CLAUDE.md"), CLAUDE_MD);
  seed(store, task);
  json(path.join(fake, "state.json"), account(task, tools));
  write(path.join(fake, "calls.jsonl"), "");
  json(path.join(harness, "task.json"), task);
  json(path.join(harness, "mcp.json"), { mcpServers: { meta: { command: process.execPath, args: [path.join(HERE, "fake-meta-mcp.mjs")], env: { FAKE_META_DIR: fake } } } });
  return { trial, store, fake, harness };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2), at = args.indexOf("--out");
  const task = loadTasks().find(t => t.id === args[0]);
  if (!task) { console.log(`Usage: node make-trial.mjs <task id> [--out <folder>]. Tasks: ${loadTasks().map(t => t.id).join(", ")}`); process.exit(1); }
  console.log(makeTrial(task, { parent: at >= 0 ? path.resolve(args[at + 1]) : null }).trial);
}
