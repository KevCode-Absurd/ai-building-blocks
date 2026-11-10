// scripts/check-toolbox.mjs: every rule in the toolbox spec, what is an error and what is only a warning, and the
// run over packs/roles (missing files, --require-all, the real kits).
import test from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const checker: any = await import(new URL("../scripts/check-toolbox.mjs", import.meta.url).href);

const KIT = ["kit:skills/print-layout-spec", "kit:prompts/sign-schedule", "kit:workflows/brief-to-print-ready"];
const LIBRARY: Record<string, string[]> = { "david-carson": ["mind"], canva: ["tool"], "poster-pack": ["workflow"] };
for (let i = 1; i <= 80; i++) LIBRARY[`skill-${i}`] = ["skill"];
for (let i = 1; i <= 8; i++) LIBRARY[`mind-${i}`] = ["mind"];
const ctx = (over = {}) => ({ roleId: "graphic-designer", kitRefs: new Set(KIT), roleIds: new Set(["graphic-designer", "conversion-copywriter", "brand-designer", "editor"]), typesOf: (slug: string) => LIBRARY[slug] ?? [], quarantined: new Set(["bad-skill"]), ...over });

const lib = (slug: string, use = "build", type = "skill") => ({ ref: `library:${slug}`, type, use, when: "When you need what this item gives" });
const kit = (ref: string, use = "build") => ({ ref, use, when: "When you need what this item gives" });
/** A toolbox that passes: 10 tasks, 32 library items, every kit item used, explore and check on every task. */
function valid(): any {
  let n = 0;
  const tasks = Array.from({ length: 10 }, (_, i) => ({
    id: `task-${i + 1}`, task: `Make piece number ${i + 1}`, kind: i < 5 ? "ad_creative" : "plan",
    items: [...(i < KIT.length ? [kit(KIT[i])] : []), lib(`skill-${++n}`, "explore"), lib(`skill-${++n}`, "build"), lib(`skill-${++n}`, "check")],
  }));
  tasks[0].items.push(lib("david-carson", "think", "mind"));
  return {
    schema: "ai-blocks-toolbox/1", role: "graphic-designer", reviewed: "2026-11-10", tasks,
    always: [lib("canva", "brief", "tool")],
    helpers: [{ role: "conversion-copywriter", when: "When the piece needs more copy than a headline" }, { role: "brand-designer", when: "When there is no brand kit" }],
    gaps: ["No library item renders three poster directions as images to compare"],
  };
}
const run = (change: (box: any) => void, context = ctx()) => { const box = valid(); change(box); return checker.validateToolbox(box, context); };
const errorsOf = (change: (box: any) => void, context = ctx()) => run(change, context).errors.join("\n");

test("a toolbox that follows the spec passes with nothing to report", () => {
  const { errors, warnings, stats } = checker.validateToolbox(valid(), ctx());
  assert.deepEqual(errors, []);
  assert.deepEqual(warnings, []);
  assert.deepEqual(stats, { tasks: 10, library: 32, minds: 1, kitUsed: 3, kitTotal: 3, helpers: 2, gaps: 1 });
});

test("the top of the file: schema, role, date and unknown fields", () => {
  assert.match(errorsOf(b => { b.schema = "toolbox/2"; }), /schema must be "ai-blocks-toolbox\/1"/);
  assert.match(errorsOf(b => { b.role = "brand-designer"; }), /role must be "graphic-designer"/);
  for (const bad of ["10 Nov 2026", "2026-13-01", "2026-02-30", 20261110]) assert.match(errorsOf(b => { b.reviewed = bad; }), /reviewed must be a real date/);
  assert.match(errorsOf(b => { b.notes = "x"; }), /unknown field "notes"/);
  assert.deepEqual(checker.validateToolbox([], ctx()).errors, ["toolbox.json must hold one object"]);
});

test("tasks: count, ids, wording, kind and item count", () => {
  assert.match(errorsOf(b => { b.tasks.length = 9; }), /9 tasks; the spec asks for 10 to 24/);
  assert.match(errorsOf(b => { for (let i = 11; i <= 25; i++) b.tasks.push({ ...b.tasks[5], id: `task-${i}` }); }), /25 tasks; the spec asks for 10 to 24/);
  assert.match(errorsOf(b => { b.tasks[3].id = "task-1"; }), /task 4 \(task-1\): the id "task-1" is used twice/);
  assert.match(errorsOf(b => { b.tasks[3].id = "Task_4"; }), /id must be kebab-case/);
  assert.match(errorsOf(b => { b.tasks[2].task = "Make " + "x".repeat(70); }), /task 3 \(task-3\): "task" is 75 characters; the limit is 70/);
  assert.match(errorsOf(b => { b.tasks[2].kind = "design"; }), /kind must be one of web_page, ad_creative/);
  assert.match(errorsOf(b => { b.tasks[6].items.length = 1; }), /task 7 \(task-7\) has 1 items; the spec asks for 2 to 7/);
  assert.match(errorsOf(b => { for (let i = 40; i < 45; i++) b.tasks[6].items.push(lib(`skill-${i}`)); }), /has 8 items; the spec asks for 2 to 7/);
  assert.match(errorsOf(b => { b.tasks[6].items.push({ ...b.tasks[6].items[0] }); }), /task 7 \(task-7\): "library:skill-\d+" is listed twice/);
  assert.match(errorsOf(b => { b.tasks[6].extra = 1; }), /task 7 \(task-7\): unknown field "extra"/);
  for (const start of ["A carousel for social", "Making a carousel", "make a carousel"]) {
    const { errors, warnings } = run(b => { b.tasks[0].task = start; });
    assert.deepEqual(errors, []);
    assert.match(warnings.join("\n"), /"task" should start with a verb/);
  }
});

test("items: refs must exist, with the right type, and none may be quarantined", () => {
  assert.match(errorsOf(b => { b.tasks[4].items[0] = kit("kit:skills/made-up"); }), /"kit:skills\/made-up" is not in this kit/);
  assert.match(errorsOf(b => { b.tasks[4].items[0] = kit("kit:skills/print-layout-spec/SKILL.md"); }), /must look like kit:skills\/<name>/);
  assert.match(errorsOf(b => { b.tasks[4].items[0] = kit("kit:knowledge"); }), /must look like kit:skills\/<name>/);
  assert.match(errorsOf(b => { b.tasks[0].items[0].type = "skill"; }), /a kit ref takes no "type"/);
  assert.match(errorsOf(b => { b.tasks[4].items[0] = lib("invented-slug"); }), /task 5 \(task-5\) item 1: no library item has the slug "invented-slug"/);
  assert.match(errorsOf(b => { b.tasks[4].items[0] = lib("bad-skill"); }), /"bad-skill" is quarantined and must not be used/);
  assert.match(errorsOf(b => { b.tasks[4].items[0] = lib("david-carson", "think", "skill"); }), /"david-carson" is a mind, not a skill/);
  assert.match(errorsOf(b => { delete b.tasks[4].items[0].type; }), /a library ref needs a "type": one of skill, workflow, prompt, agent, mind, tool/);
  assert.match(errorsOf(b => { b.tasks[4].items[0].ref = "skill-1"; }), /"skill-1" must be kit:<path> or library:<slug>/);
  assert.match(errorsOf(b => { b.tasks[4].items[0].use = "make"; }), /use must be one of brief, explore, build, check, think/);
  assert.match(errorsOf(b => { b.tasks[4].items[0].when = "w".repeat(121); }), /"when" is 121 characters; the limit is 120/);
  assert.match(errorsOf(b => { b.tasks[4].items[0].when = " "; }), /needs a "when" line/);
  assert.match(errorsOf(b => { b.tasks[4].items[0].when = "Use library:skill-2 first"; }), /"when" must not name a ref/);
  assert.match(errorsOf(b => { b.tasks[4].items[0].why = "x"; }), /unknown field "why"/);
  assert.deepEqual(run(b => { b.tasks[4].items[0].when = "w".repeat(120); }).errors, []);
  assert.match(run(b => { b.tasks[4].items[0] = { ...lib("poster-pack", "build", "workflow"), when: "Run poster-pack when a poster is due" }; }).warnings.join("\n"), /"when" repeats the slug/);
  assert.match(run(b => { b.tasks[0].items.at(-1).use = "build"; }).warnings.join("\n"), /a mind is a lens/);
});

test("every kit skill, prompt and workflow must be used in a task; `always` does not count", () => {
  assert.match(errorsOf(b => { b.tasks[1].items.shift(); }), /kit items used in no task: kit:prompts\/sign-schedule/);
  assert.match(errorsOf(b => { b.tasks[1].items.shift(); b.always.push(kit("kit:prompts/sign-schedule", "check")); }), /kit items used in no task: kit:prompts\/sign-schedule/);
});

test("always, helpers and gaps", () => {
  assert.match(errorsOf(b => { b.always = Array.from({ length: 7 }, (_, i) => lib(`skill-${50 + i}`, "check")); }), /always has 7 items; the spec asks for 0 to 6/);
  assert.match(errorsOf(b => { b.always = [lib("invented-slug")]; }), /always item 1: no library item has the slug "invented-slug"/);
  assert.deepEqual(run(b => { delete b.always; }).errors, []);
  assert.match(errorsOf(b => { b.helpers.length = 1; }), /1 helpers; the spec asks for 2 to 6/);
  assert.match(errorsOf(b => { b.helpers[0].role = "copy-wizard"; }), /helper 1: "copy-wizard" is not a role id in packs\/roles/);
  assert.match(errorsOf(b => { b.helpers[0].role = "graphic-designer"; }), /a role cannot be its own helper/);
  assert.match(errorsOf(b => { b.helpers[1].role = "conversion-copywriter"; }), /helper 2: "conversion-copywriter" is listed twice/);
  assert.match(errorsOf(b => { b.helpers[0].when = "w".repeat(121); }), /helper 1: "when" is 121 characters/);
  assert.match(errorsOf(b => { delete b.helpers; }), /helpers must be a list/);
  assert.match(errorsOf(b => { b.gaps = "none"; }), /gaps must be a list/);
  assert.match(errorsOf(b => { b.gaps = ["", 3]; }), /gap 1: must be a plain sentence\ngap 2: must be a plain sentence/);
});

test("too many library items fails; too few, too many minds, and a buyer-facing task with no gap written only warn", () => {
  const many = run(b => { let n = 30; b.tasks.push(...Array.from({ length: 8 }, (_, i) => ({ id: `more-${i}`, task: "Plan more work", kind: "plan", items: Array.from({ length: 5 }, () => lib(`skill-${++n}`)) }))); });
  assert.deepEqual(many.errors, ["72 distinct library items; the limit is 70"]);

  const few = run(b => { for (const task of b.tasks.slice(5)) task.items = task.items.slice(0, 2); });
  assert.deepEqual(few.errors, []);
  assert.match(few.warnings.join("\n"), /27 distinct library items; the spec asks for 30 to 70/);

  const minds = run(b => { for (let i = 1; i <= 6; i++) b.tasks[i].items.push(lib(`mind-${i}`, "think", "mind")); });
  assert.deepEqual(minds.errors, []);
  assert.deepEqual(minds.stats.minds, 7);
  assert.match(minds.warnings.join("\n"), /7 minds; the spec asks for at most 6/);
  assert.deepEqual(run(b => { for (let i = 1; i <= 5; i++) b.tasks[i].items.push(lib(`mind-${i}`, "think", "mind")); }).warnings, []);

  const holes = run(b => { b.tasks[0].items = b.tasks[0].items.filter((item: any) => item.use !== "explore"); b.tasks[1].items = b.tasks[1].items.filter((item: any) => item.use !== "check"); });
  assert.deepEqual(holes.errors, []);
  assert.match(holes.warnings.join("\n"), /2 tasks that make something a buyer sees lack an explore or check item, but only 1 gaps are written: task-1 \(no explore\), task-2 \(no check\)/);
  // One gap per hole is enough, and a plan or audit task is not held to this rule.
  assert.deepEqual(run(b => { b.tasks[0].items = b.tasks[0].items.filter((item: any) => item.use !== "explore"); }).warnings, []);
  assert.deepEqual(run(b => { b.tasks[7].items = b.tasks[7].items.filter((item: any) => item.use === "build" || !item.ref.startsWith("library:")); b.tasks[7].items.push(lib("skill-70")); }).warnings, []);
  // A design has no kind of its own: "other" counts when the task builds something.
  const other = run(b => { b.gaps = []; b.tasks[8].kind = "other"; b.tasks[8].items = b.tasks[8].items.filter((item: any) => item.use !== "check"); });
  assert.match(other.warnings.join("\n"), /task-9 \(no check\)/);
});

function packsWith(files: Record<string, string>): string {
  const packs = mkdtempSync(path.join(tmpdir(), "toolbox-check-"));
  for (const [file, text] of Object.entries(files)) { mkdirSync(path.dirname(path.join(packs, file)), { recursive: true }); writeFileSync(path.join(packs, file), text); }
  return packs;
}

test("a run lists roles with no toolbox.json as missing, and only fails on them with --require-all", () => {
  const catalogue = mkdtempSync(path.join(tmpdir(), "toolbox-check-lib-"));
  const packs = packsWith({
    "roles/sign-maker/role.json": "{}", "roles/sign-maker/skills/sign-spec/SKILL.md": "---\nname: sign-spec\ndescription: Specs a sign.\n---\n",
    "roles/sign-maker/toolbox.json": "{ not json",
    "roles/menu-maker/role.json": "{}", "roles/poster-maker/role.json": "{}",
  });
  try {
    const all = checker.checkAll({ packs, catalogue });
    assert.deepEqual(all.missing, ["menu-maker", "poster-maker"]);
    assert.deepEqual([all.checked, all.failed, all.errors], [1, 1, 1]);
    assert.match(all.lines.join("\n"), /^FAIL sign-maker: 0 tasks, .*1 errors\n +error: toolbox\.json is not valid JSON/);

    const one = checker.checkAll({ packs, catalogue, only: "menu-maker" });
    assert.deepEqual([one.missing, one.checked, one.errors], [["menu-maker"], 0, 0]);
    assert.deepEqual(checker.checkAll({ packs, catalogue, only: "menu-maker", requireAll: true }).errors, 1);
    assert.equal(checker.checkAll({ packs, catalogue, requireAll: true }).errors, 3);
    assert.match(checker.checkAll({ packs, catalogue, only: "nobody" }).fatal, /"nobody" is not a role id/);
  } finally { rmSync(packs, { recursive: true, force: true }); rmSync(catalogue, { recursive: true, force: true }); }
});

test("every toolbox.json in the repo passes against the real kits and library", () => {
  const result = checker.checkAll();
  assert.equal(result.errors, 0, result.lines.filter((line: string) => /FAIL|error:/.test(line)).join("\n"));
  assert.ok(result.checked >= 1, "the graphic-designer toolbox is checked in");
  assert.match(result.lines.join("\n"), /^(ok {2}|warn) graphic-designer: \d+ tasks, \d+ library items \(\d minds\), 11\/11 kit items used/m);
});
