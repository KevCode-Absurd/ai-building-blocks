// The job state tool and the job log (CS329Z W3, 15 Nov 2026): the method's steps live in code (tools/job.mjs),
// one step list per depth, and the tools write their own runs to context/job-log.jsonl (tools/log-event.mjs), so
// "this check ran and passed" is a record, not the writer's word.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

/** Plain-JS pack tools have no type declarations: load them untyped. */
const load = (rel: string): Promise<any> => import(rel);
const TOOLS = fileURLToPath(new URL("../packs/shared/tools/", import.meta.url));
const env = { ...process.env };
delete env.AIB_JOB_LOG;
const run = (cwd: string, tool: string, ...args: string[]) => spawnSync(process.execPath, [path.join(TOOLS, tool), ...args], { encoding: "utf8", cwd, env });
const job = (cwd: string, ...args: string[]) => run(cwd, "job.mjs", ...args);
const workdir = () => { const dir = mkdtempSync(path.join(tmpdir(), "job-")); mkdirSync(path.join(dir, "context")); return dir; };
const logLines = (dir: string) => readFileSync(path.join(dir, "context", "job-log.jsonl"), "utf8").trim().split("\n").map(l => JSON.parse(l));

test("job.mjs: one step list per depth, matching the method", async () => {
  const { METHOD, DEPTHS, planSteps } = await load("../packs/shared/tools/job.mjs");
  assert.deepEqual(DEPTHS, ["light", "standard", "full", "team", "one-shot"]);
  for (const [depth, d] of Object.entries(METHOD.depths) as [string, { steps: string[]; fresh_reviews: number }][]) {
    for (const id of d.steps) assert.ok(METHOD.steps[id], `${depth} names an unknown step ${id}`);
    assert.equal(new Set(d.steps).size, d.steps.length, `${depth} repeats a step`);
    const fresh = d.steps.filter(id => METHOD.steps[id].fresh).length;
    assert.ok(fresh >= 1 && fresh <= d.fresh_reviews, `${depth}: fresh steps within the cap`);
    // Every depth checks, scores and hands over, in that order, and frames before it drafts.
    const at = (id: string) => d.steps.indexOf(id);
    for (const id of ["frame", "rubric", "check", "pick", "scorecard", "handover"]) assert.ok(at(id) >= 0, `${depth} has ${id}`);
    assert.ok(at("frame") < at("rubric") && at("rubric") < at("check") && at("check") < at("pick") && at("pick") < at("scorecard") && at("scorecard") < at("handover"), depth);
    assert.equal(d.steps.at(-1), "handover");
    // Buyer-facing work never skips the org context, at any depth, the one-shot fast path included.
    assert.ok(planSteps(depth, true).includes("brand"), `${depth} buyer-facing has the brand step`);
    assert.ok(!planSteps(depth, false).includes("brand"), `${depth} internal work has no brand step`);
  }
  // Light and standard: no third draft, exactly one fresh pass. Full: the creative draft and a fresh pick between drafts.
  for (const depth of ["light", "standard", "one-shot"]) {
    const s = METHOD.depths[depth].steps;
    assert.ok(s.includes("draft") && !s.includes("draft-full") && !s.includes("choose"), depth);
    assert.equal(METHOD.depths[depth].fresh_reviews, 1, `${depth}: exactly one fresh pass`);
    assert.deepEqual(s.filter((id: string) => METHOD.steps[id].fresh), ["pick"], `${depth}: the one fresh pass is the final pick`);
  }
  assert.ok(METHOD.depths.full.steps.includes("draft-full") && METHOD.depths.full.steps.includes("choose"));
  assert.ok(METHOD.depths.team.steps.includes("parts") && METHOD.depths.team.steps.includes("integrate") && METHOD.depths.team.steps.includes("choose"));
  // The step table in METHOD.md: fresh passes 1 at the fast path, light and standard; 2 at full and team.
  assert.deepEqual(Object.fromEntries(DEPTHS.map((d: string) => [d, METHOD.depths[d].fresh_reviews])), { light: 1, standard: 1, full: 2, team: 2, "one-shot": 1 });
  // One-shot: nobody can reply, so no questions, and level 1 only. It still writes the intake the rubric needs.
  const one = METHOD.depths["one-shot"];
  assert.ok(!one.steps.includes("intake") && one.steps.includes("assume"));
  assert.equal(one.access_level, 1);
  assert.equal(METHOD.steps.assume.proof.file, "intake.md");
  assert.match(METHOD.steps.assume.do, /ask nothing/i);
  assert.equal(METHOD.repair_rounds, 2);
  // Agent-facing text: no dashes, no "beta".
  assert.doesNotMatch(JSON.stringify(METHOD), /[–—]|\bbeta\b/i);
});

test("job.mjs start, next, done and status: a step is done only when its proof is there", () => {
  const dir = workdir();
  writeFileSync(path.join(dir, "brief.md"), "# Brief\n\nOne welcome email for a soap shop.\n");
  assert.equal(job(dir, "start", "--depth", "medium", "--kind", "lifecycle-email").status, 2);
  assert.equal(job(dir, "start", "--depth", "light", "--kind", "no-such-family").status, 2);
  const start = job(dir, "start", "--depth", "light", "--kind", "lifecycle-email", "--brief", "brief.md");
  assert.equal(start.status, 0, start.stderr);
  assert.match(start.stdout, /light depth, lifecycle-email \(buyer-facing\)/);
  const state = JSON.parse(readFileSync(path.join(dir, "context", "job.json"), "utf8"));
  assert.deepEqual(state.steps.map((s: { id: string }) => s.id), ["intake", "frame", "rubric", "brand", "ground", "draft", "finish", "check", "pick", "scorecard", "handover"]);
  assert.equal(state.brief.file, "brief.md");
  assert.equal(job(dir, "start", "--depth", "full", "--kind", "lifecycle-email").status, 2, "one job at a time without --force");

  const next = job(dir, "next");
  assert.match(next.stdout, /Next: step 1 of 11, intake/);
  assert.match(next.stdout, /Then: node tools\/job\.mjs done intake/);
  // No intake file yet: refused.
  const refused = job(dir, "done", "intake");
  assert.equal(refused.status, 1);
  assert.match(refused.stderr, /context[\\/]intake\.md does not exist yet/);
  writeFileSync(path.join(dir, "context", "intake.md"), "## Asks\n- one email\n");
  assert.equal(job(dir, "done", "intake").status, 0);
  // An evidence file never stands in for a check that logs its own runs.
  writeFileSync(path.join(dir, "claim.txt"), "qe-check passed, trust me");
  const claim = job(dir, "done", "check", "--evidence", "claim.txt");
  assert.equal(claim.status, 1);
  assert.match(claim.stderr, /no qe-check check run in the job log/);
  // The brand gate does not log, so its saved output is the evidence; a skip needs a real reason.
  assert.equal(job(dir, "done", "brand", "--skip", "no").status, 2);
  const skip = job(dir, "done", "brand", "--skip", "no store is live yet");
  assert.equal(skip.status, 0);
  assert.match(skip.stdout, /Note: earlier steps are still open: frame, rubric/);
  // "skip <step> <reason>" is the same thing.
  assert.equal(job(dir, "skip", "ground", "the brief carries all the data").status, 0);
  assert.equal(job(dir, "skip", "draft").status, 2, "a skip needs its reason");
  assert.equal(job(dir, "done", "nonsense").status, 2);

  const status = job(dir, "status");
  assert.match(status.stdout, /\[x\] intake/);
  assert.match(status.stdout, /\[-\] brand\s+Org context gate\s+\(skipped: no store is live yet\)/);
  assert.match(status.stdout, /\[ \] frame/);
  assert.match(status.stdout, /\[-\] ground\s+Ground\s+\(skipped: the brief carries all the data\)/);
  assert.match(status.stdout, /carry forward/);
  const json = JSON.parse(job(dir, "status", "--json").stdout);
  assert.equal(json.next, "frame");
  assert.equal(json.depth, "light");
});

test("job.mjs reads the tools' own runs: a check passes only on a logged PASS, repair rounds count, a repeat failure is stuck", () => {
  const dir = workdir();
  writeFileSync(path.join(dir, "memo.md"), "# Memo\n\nKeep the bundle at its current price.\n");
  assert.equal(job(dir, "start", "--depth", "standard", "--kind", "analysis-memo").status, 0);
  assert.ok(!JSON.parse(readFileSync(path.join(dir, "context", "job.json"), "utf8")).steps.some((s: { id: string }) => s.id === "brand"), "internal work has no brand step");
  // qe-check picks the family from the job and fails: no numbers ledger.
  assert.equal(run(dir, "quality/qe-check.cjs", "memo.md").status, 1);
  const failed = job(dir, "done", "check");
  assert.equal(failed.status, 1);
  assert.match(failed.stderr, /the last qe-check check run failed/);
  assert.match(job(dir, "next").stdout, /Next: step 1 of/);
  // The same failure again: stuck.
  assert.equal(run(dir, "quality/qe-check.cjs", "memo.md").status, 1);
  writeFileSync(path.join(dir, "context", "intake.md"), "## Asks\n- one memo\n");
  assert.match(job(dir, "next").stdout, /Stuck: qe-check failed twice in a row on the same thing/);
  // Fixed: the ledger is written, the check passes, the step closes.
  writeFileSync(path.join(dir, "context", "numbers.json"), "[]");
  assert.equal(run(dir, "quality/qe-check.cjs", "memo.md").status, 0);
  const done = job(dir, "done", "check");
  assert.equal(done.status, 0, done.stderr);
  const status = job(dir, "status");
  assert.match(status.stdout, /Repair rounds: qe-check 2 of 2/);
  assert.doesNotMatch(status.stdout, /Stuck/);
  assert.match(status.stdout, /qe-check check FAIL; qe-check check FAIL; qe-check check PASS/);
  const lines = logLines(dir);
  assert.ok(lines.every(l => l.schema === "ai-blocks-job-log/1" && typeof l.ts === "string" && l.job), "every line is tagged with the job");
});

test("job.mjs: a one-shot job works at level 1 and still asks for the org context on buyer-facing work", () => {
  const dir = workdir();
  const r = job(dir, "start", "--depth", "one-shot", "--kind", "paid-social-ads");
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /level 1 \(read and draft\)/);
  assert.match(r.stdout, /Steps: assume, frame, rubric, brand, draft/);
  const state = JSON.parse(readFileSync(path.join(dir, "context", "job.json"), "utf8"));
  assert.equal(state.access_level, 1);
  assert.equal(state.fresh_reviews_cap, 1);
});

test("log-event: one line per run, only inside a context folder, hashes instead of text, and AIB_JOB_LOG=off", async () => {
  const le = await load("../packs/shared/tools/log-event.mjs");
  const dir = workdir();
  const ctx = path.join(dir, "context");
  writeFileSync(path.join(dir, "final.md"), "Private copy for the client.");
  const e = le.logEvent({ tool: "qe-check", cmd: "check", args: ["final.md", "--limit", "120", "what is our refund rate for Acme?"], inputs: [path.join(dir, "final.md")], result: "PASS", context: ctx, checks: [{ name: "leakcheck", status: "FAIL", detail: "TBD left in line 4" }] });
  assert.ok(e);
  const lines = readFileSync(path.join(ctx, "job-log.jsonl"), "utf8").trim().split("\n");
  assert.equal(lines.length, 1);
  const line = JSON.parse(lines[0]);
  assert.deepEqual(line.args.slice(1, 3), ["--limit", "120"]);
  assert.match(line.args[3], /^#[0-9a-f]{16}$/);
  assert.match(line.inputs[0].sha256, /^[0-9a-f]{16}$/);
  assert.equal(line.checks[0].hit.length, 16);
  assert.doesNotMatch(lines[0], /refund rate|Acme|TBD|Private copy/);
  assert.equal(le.readLog(ctx).length, 1);
  // No context folder: nothing is written anywhere.
  const bare = mkdtempSync(path.join(tmpdir(), "nolog-"));
  assert.equal(le.logEvent({ tool: "x", result: "PASS", context: path.join(bare, "context") }), null);
  assert.ok(!existsSync(path.join(bare, "context")));
  // Off by setting.
  const off = spawnSync(process.execPath, [path.join(TOOLS, "log-event.mjs"), "add", "--tool", "brand-brain", "--result", "PASS"], { encoding: "utf8", cwd: dir, env: { ...env, AIB_JOB_LOG: "off" } });
  assert.equal(off.status, 2);
  const add = spawnSync(process.execPath, [path.join(TOOLS, "log-event.mjs"), "add", "--tool", "brand-brain", "--cmd", "gate", "--result", "PASS"], { encoding: "utf8", cwd: dir, env });
  assert.equal(add.status, 0, add.stderr);
  assert.equal(le.readLog(ctx).length, 2);
  assert.match(spawnSync(process.execPath, [path.join(TOOLS, "log-event.mjs"), "show"], { encoding: "utf8", cwd: dir, env }).stdout, /brand-brain gate {2}PASS/);
});

test("each logging tool writes exactly one valid line per run", () => {
  const dir = workdir();
  writeFileSync(path.join(dir, "brief.md"), "# Brief\n\nOne line.\n");
  writeFileSync(path.join(dir, "a.md"), "Draft one.");
  writeFileSync(path.join(dir, "b.md"), "Draft two.");
  writeFileSync(path.join(dir, "context", "intake.md"), "## Asks\n- one line\n");
  const runs: [string, string[]][] = [
    ["quality/qe-check.cjs", ["a.md"]],
    ["make-rubric.mjs", []],
    ["blind-review.mjs", ["prepare", "--brief", "brief.md", "a.md", "b.md"]],
    ["blind-review.mjs", ["tally"]],
  ];
  runs.forEach(([tool, args], i) => {
    const r = run(dir, tool, ...args);
    assert.ok(r.status === 0 || r.status === 1, `${tool}: ${r.stderr}`);
    const lines = logLines(dir);
    assert.equal(lines.length, i + 1, `${tool} wrote one line`);
    assert.equal(lines[i].tool, tool.replace(/^quality\//, "").replace(/\.(mjs|cjs)$/, ""));
  });
  assert.equal(logLines(dir)[3].result, "NOT_RUN", "a tally with no answers is not a pass");
});
