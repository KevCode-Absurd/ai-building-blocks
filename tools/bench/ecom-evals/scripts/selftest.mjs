#!/usr/bin/env node
// Self-test for the suite's scripts. Offline: no model, no API, no network. It builds a tiny round in a temp folder,
// writes fake answers and fake verdicts (a "judge" that always prefers the code arm), then checks that the
// fixtures, leak guard, sheets, scoring, round comparison and the image dry run behave.
//
//   node scripts/selftest.mjs [--keep] [--no-code-arm]
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, readFileSync, readdirSync, writeFileSync, existsSync, cpSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { SUITE, args, loadTasks, extractPrompts, scrub, keyLines, assertNoKey } from "./lib.mjs";

const A = args();
const tmp = mkdtempSync(path.join(os.tmpdir(), "ecom-evals-selftest-"));
const node = (script, ...a) => execFileSync(process.execPath, [path.join(SUITE, "scripts", script), ...a, "--rounds-dir", tmp], { encoding: "utf8" });
let failures = 0;
const ok = (c, m) => { console.log(`${c ? "ok  " : "FAIL"} ${m}`); if (!c) failures++; };

// 1. fixtures rebuild with every planted signal asserted
execFileSync(process.execPath, [path.join(SUITE, "fixtures", "build", "build-fixtures.mjs")], { encoding: "utf8" });
const tasks = loadTasks();
ok(tasks.length >= 30, `TASKS.json has ${tasks.length} tasks`);
ok(tasks.every(t => existsSync(path.join(SUITE, "keys", `${t.id}.md`))), "every task has a key");
ok(tasks.every(t => t.outcome && t.checks.length >= 3 && t.checks.length <= 6), "every task has an outcome and 3 to 6 checks");
const ho = tasks.filter(t => t.split === "heldout").length;
ok(ho / tasks.length > 0.28 && ho / tasks.length < 0.4, `held-out share ${ho}/${tasks.length}`);
const bands = new Set(tasks.map(t => t.signal_band)); ok(["0", "1", "2-3", "4+"].every(b => bands.has(b)), "signal counts vary across 0, 1, 2-3 and 4+");
let dash = 0; const walk = d => { for (const f of readdirSync(d, { withFileTypes: true })) { const p = path.join(d, f.name); if (f.isDirectory()) { if (!["rounds", "node_modules"].includes(f.name)) walk(p); } else if (/\.(md|json|csv)$/.test(f.name) && /[–—]/.test(readFileSync(p, "utf8"))) { dash++; console.log("  dash in", p); } } };
walk(SUITE); ok(dash === 0, "no em or en dashes in suite text files");

// 2. leak guard and scrub
const lines = keyLines(tasks);
let threw = false; try { assertNoKey(`hello ${lines[0]} world`, lines, "test"); } catch { threw = true; }
ok(threw, "leak guard throws when a key line appears");
ok(!/AI Blocks|—|pack\/CLAUDE\.md/.test(scrub("From AI Blocks — see pack/CLAUDE.md [MED-0123]")), "scrub removes arm tells");
ok(extractPrompts("x\n```image-prompts\n[{\"id\":1,\"prompt\":\"a dog\"}]\n```\n").length === 1, "image-prompts block parses");

// 3. a tiny round
const pick = ["E04", "E16", "E32", "E33"];
const arms = A["no-code-arm"] ? "plain,chat" : "plain,chat,code";
node("make-sheets.mjs", "prompts", "--round", "T1", "--tasks", pick.join(","), "--arms", arms, "--runs", "3");
const runsDir = path.join(tmp, "T1", "runs");
const prompt = readFileSync(path.join(runsDir, "E04", "plain", "r1", "PROMPT.md"), "utf8");
ok(!/women 65\+ buy|Year six Jack video|keys\//i.test(prompt), "plain prompt has no key material");
ok(existsSync(path.join(runsDir, "E04", "plain", "r1", "inputs", "ORG-CONTEXT.md")), "inputs copied into the run folder");
ok(!readdirSync(path.join(runsDir, "E04", "plain", "r1", "inputs")).some(f => /key/i.test(f)), "no key file in inputs");
const meta = JSON.parse(readFileSync(path.join(runsDir, "E04", "chat", "r1", "meta.json"), "utf8"));
ok(["inline", "project"].includes(meta.chat_mode), `chat arm mode recorded (${meta.chat_mode})`);
if (!A["no-code-arm"]) ok(existsSync(path.join(runsDir, "E04", "code", "r1", "pack", "CLAUDE.md")), "code arm pack unzipped");

// fake answers: code is "better" (longer in E04 to exercise the length check), image task has prompts
for (const t of pick) for (const arm of arms.split(",")) for (const k of [1, 2, 3]) {
  const body = `# Answer ${t} by ${arm} run ${k}\n\nCut retargeting. ${arm === "code" ? "Women 65+ single image test. ".repeat(5) : ""}\n` +
    (t === "E16" ? "\n```image-prompts\n" + JSON.stringify([1, 2, 3, 4, 5].map(i => ({ id: i, prompt: `dog in harness ${i}`, on_image_text: "Walk on", aspect: "1:1", why: "won before" }))) + "\n```\n" : "");
  writeFileSync(path.join(runsDir, t, arm, `r${k}`, "answer.md"), body);
}
// a run that read a file outside its folder is audited as contaminated and left out of judging
const bad = path.join(runsDir, "E04", "plain", "r3");
writeFileSync(path.join(bad, "run.jsonl"), [
  JSON.stringify({ type: "assistant", message: { content: [{ type: "tool_use", name: "Read", input: { file_path: path.join(SUITE, "keys", "E04.md") } }] } }),
  JSON.stringify({ type: "result", result: "answer text", usage: { input_tokens: 10, output_tokens: 5 }, total_cost_usd: 0.01, num_turns: 2 }),
].join("\n"));
execFileSync(process.execPath, [path.join(SUITE, "scripts", "finish-run.mjs"), bad], { encoding: "utf8" });
ok(JSON.parse(readFileSync(path.join(bad, "meta.json"), "utf8")).audit.contaminated === true, "finish-run flags a read outside the run folder");
const sheetsOut = node("make-sheets.mjs", "sheets", "--round", "T1");
ok(/left out \(contaminated\): E04\/plain\/r3/.test(sheetsOut), "contaminated run is left out of the sheets");
const key =JSON.parse(readFileSync(path.join(tmp, "T1", "_key", "blind-key.json"), "utf8")).sheets;
const sheetsDir = path.join(tmp, "T1", "sheets");
const anySheet = readFileSync(path.join(sheetsDir, "pairwise", readdirSync(path.join(sheetsDir, "pairwise"))[0]), "utf8");
ok(!/\b(plain|chat|code) run\b/.test(anySheet.replace(/Answer [A-Z]\d+ by (plain|chat|code) run/g, "")) && !/words/i.test(anySheet.split("## Answer A")[0].slice(-200)), "pairwise sheet shows no arm or word counts outside the answers");
ok(!existsSync(path.join(sheetsDir, "_key")), "key kept outside the sheets folder");

// fake judges
const rank = { code: 3, chat: 2, plain: 1 };
const vdir = path.join(tmp, "T1", "verdicts");
execFileSync(process.execPath, ["-e", `require("fs").mkdirSync(${JSON.stringify(vdir)},{recursive:true})`]);
const g = n => ({ on_brand: n, principles: n, logic: n, backed: n, outcome: n, actionable: n, insight: n });
for (const [id, s] of Object.entries(key)) {
  let v;
  if (s.type === "single") v = { sheet: id, grades: g(4 + 2 * rank[s.arm] - (s.run === "r3" ? 1 : 0)), reasons: {}, unbacked_claims: [] };
  if (s.type === "checker") v = { sheet: id, checks: [1, 2, 3].map(n => ({ n, result: s.arm === "code" || (s.arm === "chat" && s.run !== "r2") ? "pass" : "fail" })), signals: [{ n: 1, result: "acted" }], decoys: [], false_signals: [] };
  if (s.type === "pairwise") v = { sheet: id, A: g(7), B: g(6), winner: rank[s.A] > rank[s.B] ? "A" : "B", margin: "clear", reason: "test" };
  writeFileSync(path.join(vdir, `${id}.json`), JSON.stringify(v));
}
node("score.mjs", "--round", "T1", "--boot", "300");
const S = JSON.parse(readFileSync(path.join(tmp, "T1", "score.json"), "utf8"));
const top = A["no-code-arm"] ? "chat" : "code";
ok(S.wins[`${top}:plain`].all.share === 1, `${top} beats plain in every agreed pair`);
ok(S.by_arm.all[top].pass3 === 1, `${top} pass^3 is 100%`);
ok(S.by_arm.all.plain.pass3 === 0, "plain pass^3 is 0%");
if (!A["no-code-arm"]) ok(S.by_arm.all.chat.pass3 === 0, "chat pass^3 is 0% when one run in three fails");
ok(S.by_arm.all.plain.spread_mean > 0, "spread is reported");
ok(S.knowledge_lift.some(l => l.arm === top && l.principles > 0), "knowledge lift is positive for the better arm");
ok(existsSync(path.join(tmp, "T1", "tune-reasons.md")) && !/E33/.test(readFileSync(path.join(tmp, "T1", "tune-reasons.md"), "utf8")), "tune reasons written, no held-out task in it");

// 4. compare rounds: same scores = no gain; a held-out drop = do not promote; a tune gain with held-out held = promote
cpSync(path.join(tmp, "T1"), path.join(tmp, "T2"), { recursive: true });
let code = 0; try { node("compare-rounds.mjs", "--base", "T1", "--cand", "T2", "--arm", top); } catch (e) { code = e.status; }
ok(code === 1, "identical rounds are not promoted (no tune gain)");
const s2 = JSON.parse(readFileSync(path.join(tmp, "T2", "score.json"), "utf8"));
s2.by_arm.tune[top].owner_mean += 0.5; writeFileSync(path.join(tmp, "T2", "score.json"), JSON.stringify(s2));
code = 0; let outp = ""; try { outp = node("compare-rounds.mjs", "--base", "T1", "--cand", "T2", "--arm", top); } catch (e) { code = e.status; outp = e.stdout; }
ok(code === 0 && /PROMOTE: tune improved/.test(outp), "tune gain with held-out held is promoted");
s2.by_arm.heldout[top] = { ...(s2.by_arm.heldout[top] ?? {}), owner_mean: (S.by_arm.heldout[top]?.owner_mean ?? 9) - 0.3, grades: S.by_arm.heldout[top]?.grades ?? {} };
writeFileSync(path.join(tmp, "T2", "score.json"), JSON.stringify(s2));
code = 0; try { node("compare-rounds.mjs", "--base", "T1", "--cand", "T2", "--arm", top); } catch (e) { code = e.status; }
ok(code === 1, "a held-out drop blocks promotion");

// 5. image renderer dry run sends nothing
const dry = node("render-images.mjs", "--round", "T1", "--tasks", "E16", "--arms", arms);
ok(/images planned/.test(dry) && /dry run: nothing sent/.test(dry) && !/sk-/.test(dry), "image renderer dry run plans 5 per arm and sends nothing");

if (!A.keep) rmSync(tmp, { recursive: true, force: true }); else console.log(`kept ${tmp}`);
console.log(failures ? `\n${failures} FAILED` : "\nall self-tests passed");
process.exit(failures ? 1 : 0);
