// Owner-finish checks (tickets C1 to C3): finished work hands nothing back to the owner, stays inside the owner's
// word limit counted the way the owner counts, and keeps evidence stacks out of customer copy.
import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const tools = fileURLToPath(new URL("../packs/shared/tools/", import.meta.url));
const dir = mkdtempSync(path.join(tmpdir(), "owner-finish-"));
const put = (name: string, text: string) => { const file = path.join(dir, name); writeFileSync(file, text); return file; };
const run = (tool: string, ...args: string[]) => spawnSync(process.execPath, [path.join(tools, tool), ...args], { encoding: "utf8" });
const leak = (...args: string[]) => run("quality/leakcheck.cjs", ...args);
const handover = (...args: string[]) => run("check-handover.mjs", ...args);
const both = (file: string, ...args: string[]) => [leak(file, ...args), handover(file, ...args)];

// C1. Homework and leftovers.
const HOMEWORK: [string, string][] = [
  ["heading", "# Plan\n\nShip the new page on 2 March.\n\n## To confirm\n\n- The reward amount.\n"],
  ["heading with a tail", "# Plan\n\nShip it.\n\n## To confirm before you switch it on\n\n- Stock levels.\n"],
  ["combined heading", "# Plan\n\nShip it.\n\n## Assumptions and to confirm\n\n- Sizes are standard.\n"],
  ["bold label", "# Plan\n\nShip it.\n\n**To confirm:** supplier fees and shoot dates.\n"],
  ["bold label alone", "# Plan\n\nShip it.\n\n**To confirm**\n- Hours of cover.\n"],
  ["assumptions to confirm", "# Update\n\nRevenue grew.\n\n**Assumptions to confirm before sending:** the new office opens in May.\n"],
  ["open questions", "# Plan\n\nShip it.\n\n## Open questions\n\n- Which region first?\n"],
  ["questions for you", "# Plan\n\nShip it.\n\n### Questions for you\n\n1. Budget?\n"],
  ["your yes", "# Budget\n\nMove spend to the best ad set.\n\n- Your yes on the budget changes and the pauses.\n"],
  ["before anything goes live", "# Budget\n\nWe change three ad sets, and we check with you before anything goes live.\n"],
  ["role sign-off", "# Plan\n\nCap the cost per order at 90.\n\n- Board sign-off on the cap and flat spend.\n"],
  ["please confirm", "# Page\n\nHolds about 10 notes. Please confirm before publishing.\n"],
  ["test alternate in a subject", "# Emails\n\n**Subject:** Start with one task (test: Clear your head first)\n\nHi there,\n"],
  ["test alternate in a headline", "# Ads\n\n- Headline: Pack less, go further (test: Carry-on, sorted)\n"],
  ["runner-up label", "# Recommendation\n\nRaise the free-shipping line to 699.\n\nRunner-up: keep 499 and add bundles.\n"],
  ["bold runner-up label", "# Recommendation\n\nLaunch the pair bundle.\n\n**Runner-up:** a three-item set.\n"],
  ["editor note", "## Email 4: One task\n\nThe copy never mentions the quiet days.\n\n**Subject:** One task is enough\n"],
  ["editor note on the draft", "# Post\n\nThis draft avoids the word cheap.\n\nWe built it to last.\n"],
];
for (const [name, text] of HOMEWORK) {
  test(`homework fails in both checks: ${name}`, () => {
    const file = put(`hw-${name.replace(/\W+/g, "-")}.md`, text);
    for (const r of both(file)) assert.equal(r.status, 1, r.stdout + r.stderr);
  });
}

// Clean, owner-ready work passes: customer copy that asks the customer to confirm, legal lines next to their item,
// email sign-offs, plain "Assumptions" lines, a runner-up named in prose, and a link to "how to confirm".
const CLEAN: [string, string][] = [
  ["assumption lines", "# Plan\n\nRaise the line to 699 on 2 March.\n\n**Assumptions:** a 30-day month; costs scale with order value.\n"],
  ["customer asked to confirm", "## Message 1\n\n> Hi there, your order is in. Please confirm so we can pack it.\n\nButtons: Yes, confirm / Change address\n\n- Body: Tap Confirm and we pack it.\n"],
  ["customer heading", "## How to confirm your order\n\nTap the button in the message.\n\n## Confirm your address\n\nCheck the pin code.\n"],
  ["email sign-off", "# Emails\n\nAll emails sign off \"The team\" and carry the standard footer.\n"],
  ["no sign-off needed", "# Offers\n\nNothing above 15%, so no founder sign-off.\n"],
  ["legal line next to its item", "# Claims\n\n- \"Lasts all day\": legal sign-off on this line before it runs.\n"],
  ["policy sign-off", "# Travel policy\n\nExplain the situation to your director and ask for sign-off before you book.\n"],
  ["plain subject", "# Emails\n\n**Subject:** One task is enough to start\n**Preview:** Just the next thing you need to do.\n"],
  ["copy with a reason", "# Email notes\n\nThis email never mentions price because the reader has already paid.\n"],
  ["test plan prose", "# Test\n\nThe test confirms or rejects the idea in four weeks. The runner-up idea waits for month two.\n"],
];
for (const [name, text] of CLEAN) {
  test(`owner-ready work passes both checks: ${name}`, () => {
    const file = put(`clean-${name.replace(/\W+/g, "-")}.md`, text);
    for (const r of both(file)) assert.equal(r.status, 0, r.stdout + r.stderr);
  });
}

test("--options-requested lets alternates pass, never homework or editor notes", () => {
  const options = put("options.md", "# Emails\n\n**Subject:** Start small (test: Clear your head)\n\nRunner-up: a three-item set.\n");
  for (const r of both(options)) assert.equal(r.status, 1, r.stdout);
  for (const r of both(options, "--options-requested")) { assert.equal(r.status, 0, r.stdout); assert.match(r.stdout, /Options-requested mode: 2 alternate/); }
  const still = put("options-homework.md", "# Emails\n\n**Subject:** Start small (test: Clear your head)\n\n## To confirm\n\n- Send time.\n");
  for (const r of both(still, "--options-requested")) assert.equal(r.status, 1, r.stdout);
  const note = put("options-note.md", "# Emails\n\nThe copy never mentions the quiet days.\n");
  for (const r of both(note, "--options-requested")) assert.equal(r.status, 1, r.stdout);
});

test("--requested-template keeps accepting fields but not homework", () => {
  const file = put("template-homework.md", "# Template\n\nOwner: {{owner}}\n\n## To confirm\n\n- Dates.\n");
  for (const r of both(file, "--requested-template")) assert.equal(r.status, 1, r.stdout);
  const ok = put("template-ok.md", "# Template\n\nOwner: {{owner}}\nResult: [insert result]\n");
  for (const r of both(ok, "--requested-template")) assert.equal(r.status, 0, r.stdout);
});

test("HTML is read as the visitor sees it", () => {
  const file = put("page.html", "<h1>Plan</h1><p>Ship it.</p><h2>To confirm</h2><ul><li>Dates</li></ul>");
  for (const r of both(file)) assert.equal(r.status, 1, r.stdout);
});

// C2. Raw word count against the owner's limit.
const words = (n: number) => Array.from({ length: n }, (_, i) => `word${i}`).join(" ");

test("wordcount --raw counts every whitespace-separated token, like wc -w", () => {
  const file = put("count-me.md", "# Title here\n\n| A | B |\n|---|---|\n| one | two |\n\nWe've got 3 - 4 items.\n");
  // # Title here (3) + | A | B | (5) + |---|---| (1) + | one | two | (5) + We've got 3 - 4 items. (6) = 20.
  const r = run("quality/wordcount.cjs", file, "--raw");
  assert.equal(r.status, 0, r.stderr); assert.match(r.stdout, /: 20 raw words/);
  const visible = run("quality/wordcount.cjs", file);
  assert.equal(visible.status, 0); assert.match(visible.stdout, /: \d+ words$/m); assert.doesNotMatch(visible.stdout, /raw words/);
});

test("wordcount --limit prints the share; it has no target share and fails only over the fail line", () => {
  const limit = "1000";
  const under = run("quality/wordcount.cjs", put("w800.md", words(800)), "--raw", "--limit", limit);
  assert.equal(under.status, 0); assert.match(under.stdout, /^OK 800 raw words is 80% of the 1000-word limit: within the limit/m);
  const mid = run("quality/wordcount.cjs", put("w900.md", words(900)), "--raw", "--limit", limit);
  assert.equal(mid.status, 0); assert.match(mid.stdout, /^OK .*90%/m);
  const near = run("quality/wordcount.cjs", put("w990.md", words(990)), "--raw", "--limit", limit);
  assert.equal(near.status, 0); assert.match(near.stdout, /^OK .*99%/m);
  for (const r of [under, mid, near]) assert.doesNotMatch(r.stdout, /WARN|85%|aim/);
  const over = run("quality/wordcount.cjs", put("w1060.md", words(1060)), "--raw", "--limit", limit);
  assert.equal(over.status, 1); assert.match(over.stdout, /^FAIL 1060 raw words is 106%/m);
  const tight = run("quality/wordcount.cjs", put("w960.md", words(960)), "--raw", "--limit", limit, "--fail-above", "95");
  assert.equal(tight.status, 1); assert.match(tight.stdout, /over the 95% line/);
  assert.equal(run("quality/wordcount.cjs", put("w1.md", "one"), "--limit", "abc").status, 2);
});

test("a table-heavy draft can pass the visible count and still fail the owner's raw count", () => {
  const rows = Array.from({ length: 60 }, (_, i) => `| Row ${i} | 12% | 3 - 4 | yes |`).join("\n");
  const file = put("table.md", `# Plan\n\n| Item | Share | Range | Ready |\n|---|---|---|---|\n${rows}\n\n${words(500)}\n`);
  const visible = Number(run("quality/wordcount.cjs", file).stdout.match(/: (\d+) words/)![1]);
  const raw = Number(run("quality/wordcount.cjs", file, "--raw").stdout.match(/: (\d+) raw words/)![1]);
  assert.ok(raw > visible, `${raw} > ${visible}`);
  const limit = String(Math.ceil(visible / 0.99));
  const r = run("quality/qe-check.cjs", file, "--limit", limit);
  assert.equal(r.status, 1, r.stdout); assert.match(r.stdout, /FAIL\s+limit/);
});

test("qe-check --limit adds a raw limit row; the default visible count is unchanged", () => {
  const file = put("qe900.md", `# Plan\n\n${words(890)}\n`);
  const plainRun = run("quality/qe-check.cjs", file);
  assert.doesNotMatch(plainRun.stdout, /\blimit\b/); assert.match(plainRun.stdout, /PASS\s+wordcount/);
  const within = run("quality/qe-check.cjs", file, "--limit", "1000");
  assert.equal(within.status, 0, within.stdout); assert.match(within.stdout, /PASS\s+limit/); assert.match(within.stdout, /no failures/);
  assert.doesNotMatch(within.stdout, /85%|aim about/);
  const failed = run("quality/qe-check.cjs", file, "--limit", "800");
  assert.equal(failed.status, 1, failed.stdout); assert.match(failed.stdout, /FAIL\s+limit/);
  const tight = run("quality/qe-check.cjs", file, "--limit", "920", "--fail-above", "95");
  assert.equal(tight.status, 1, tight.stdout);
  assert.equal(run("quality/qe-check.cjs", file, "--limit", "0").status, 2);
  assert.equal(run("quality/qe-check.cjs", file, "--fail-above", "95").status, 2);
});

// C3. Evidence stacks in customer copy warn without failing.
test("review counts and correlation figures in customer copy warn, a single plain claim does not", () => {
  const stacked = put("stacked.md", [
    "# Product page",
    "",
    "It stays slim because it holds less, and 142 of our 400 reviewers say it's much thinner than their old wallet.",
    "",
    "- **Primary text:** \"The wheels are so quiet.\" 290 of our reviews mention quiet, smooth wheels.",
    "- **Hook:** More than 1 in 4 of our 870 reviews say it tastes like a snack.",
    "> In our last 9 hires, the written reply score predicted first-year performance (0.62).",
  ].join("\n"));
  const r = leak(stacked);
  assert.equal(r.status, 0, r.stdout);
  assert.match(r.stdout, /^WARN \(4, does not fail\)/m);
  assert.match(r.stdout, /142 of our 400 reviewers say/);
  assert.match(r.stdout, /290 of our reviews mention/);
  assert.match(r.stdout, /internal figure/);
  const qe = run("quality/qe-check.cjs", stacked);
  assert.match(qe.stdout, /WARN\s+leakcheck/);

  const claim = put("claim.md", "# Product page\n\n4.5 stars from 20,000+ reviews.\n\n- **Headline:** Rated 4.6 from 1,150 reviews. What reviewers mention most: quiet wheels.\n\n> \"Much thinner than my old wallet.\"\n");
  const ok = leak(claim);
  assert.equal(ok.status, 0); assert.doesNotMatch(ok.stdout, /WARN/);
});

test("the owner's own analysis may count reviews; --customer-copy treats every line as copy", () => {
  const analysis = put("analysis.md", "# Why this ad\n\n- Light colours on camera, since 85 reviews say scuffs show on dark ones.\n- Writing scores tracked performance (0.62); tool experience did not.\n");
  const r = leak(analysis);
  assert.equal(r.status, 0); assert.doesNotMatch(r.stdout, /WARN/);
  const asCopy = leak(analysis, "--customer-copy");
  assert.equal(asCopy.status, 0); assert.match(asCopy.stdout, /WARN \(2/);
});

// C4. Trace-to-brief checks (--brief): both checks read the work against the brief it answers.
const BRIEF = put("brief.md", [
  "# Brief: a reorder plan for a small candle shop",
  "",
  "Sales last 4 weeks: 1,240 candles. Average order ₹850. Repeat buyers: 31%.",
  "In their words: \"Will it arrive before the party?\"",
  "There is a fit quiz on the site. The owner wants a plan for the next six weeks.",
].join("\n"));
const DATED_BRIEF = put("dated-brief.md", "# Brief\n\nToday is 14 March. The spring sale runs 2 to 8 April. Average order ₹850.\n");
const briefRun = (file: string, ...args: string[]) => both(file, "--brief", BRIEF, ...args);

const BRIEF_FAILS: [string, string, string][] = [
  ["a calendar date the brief does not give", "# Plan\n\nOrder the wax on 17 March and launch the bundle on Friday 3 April.\n", "date not in the brief"],
  ["a month-first date", "# Plan\n\n| Step | When |\n|---|---|\n| Reorder | Mar 17 |\n", "date not in the brief"],
  ["a day of the month", "# Plan\n\nSend step 1 between the 12th and the 15th, so step 4 lands by the 30th.\n", "date not in the brief"],
  ["an exercise that is described, not written", "# Hiring\n\n1. **The reply.** A real ticket from the last 90 days, details removed.\n", "describes instead of writes"],
  ["an ask to use a real example", "# Ad\n\n- **Primary text:** use a real customer quote about the scent.\n", "describes instead of writes"],
  ["a list to pick from", "# Email\n\nOpening line: pick one from the three hooks above.\n", "describes instead of writes"],
];
for (const [name, text, what] of BRIEF_FAILS) {
  test(`--brief fails in both checks: ${name}`, () => {
    const file = put(`brief-fail-${name.replace(/\W+/g, "-")}.md`, text);
    for (const r of briefRun(file)) { assert.equal(r.status, 1, r.stdout + r.stderr); assert.match(r.stdout, new RegExp(what)); }
    // Without --brief the same text is not checked against a brief.
    for (const r of both(file)) assert.doesNotMatch(r.stdout, /date not in the brief|describes instead/);
  });
}

const BRIEF_PASSES: [string, string][] = [
  ["relative days", "# Plan\n\nDay 1: reorder the wax. Week 2: launch the bundle. Every Monday, check stock. The Monday after launch, read the numbers.\n"],
  ["ordinals that are not dates", "# Emails\n\nThe 2nd email goes out two days after the 1st email. The 3rd touch is a short reply.\n"],
  ["a merge field that holds a date", "# Message\n\n- **Body:** It should arrive [Tue 18 Mar] to [Thu 20 Mar]. We'll message you when it ships.\n"],
  ["a quiz the brief names", "# Page\n\n- **Body:** Not sure which size? Take the quiz and we'll pick for you.\n"],
  ["figures the brief gives, rounded as shown", "# Plan\n\nAverage order is ₹850 and 31% of buyers come back. About ₹1.1 lakh of sales came from repeat buyers.\n"],
];
for (const [name, text] of BRIEF_PASSES) {
  test(`--brief passes in both checks: ${name}`, () => {
    const file = put(`brief-pass-${name.replace(/\W+/g, "-")}.md`, text);
    for (const r of briefRun(file)) assert.equal(r.status, 0, r.stdout + r.stderr);
  });
}

test("--brief: a brief that sets its own calendar lets dates on that calendar pass, but not far beyond it", () => {
  const plan = put("dated-plan.md", "# Plan\n\nMonday 16 March: place the order. 30 March: stock lands. 2 April: sale opens.\n");
  for (const r of both(plan, "--brief", DATED_BRIEF)) assert.equal(r.status, 0, r.stdout + r.stderr);
  const far = put("dated-far.md", "# Plan\n\nReview the results on 20 September.\n");
  for (const r of both(far, "--brief", DATED_BRIEF)) { assert.equal(r.status, 1, r.stdout); assert.match(r.stdout, /20 September/); }
});

test("--brief: a bolder move fails only in a copy job", () => {
  const file = put("bolder.md", "# Welcome emails\n\n**Subject:** Your first candle\n\n**Bolder move:** add a second sample to email 3.\n\n## Bolder move: a refill club\n");
  for (const r of both(file, "--brief", BRIEF, "--profile", "lifecycle-email")) { assert.equal(r.status, 1, r.stdout + r.stderr); assert.match(r.stdout, /"Bolder move" in a copy job/); }
  assert.equal(leak(file, "--brief", BRIEF, "--customer-copy").status, 1);
  for (const r of both(file, "--brief", BRIEF, "--profile", "launch-plan")) assert.equal(r.status, 0, r.stdout + r.stderr);
});

test("--brief: figures in neither the brief nor the ledger, weekdays and unwritten amounts warn without failing", () => {
  const file = put("figures.md", "# Plan\n\nWe expect ₹2,40,000 in sales and a 12% lift. Reorder on Thursday.\n\n- **Body:** Add ₹X more for free shipping.\n");
  const [l, h] = briefRun(file);
  assert.equal(l.status, 0, l.stdout); assert.equal(h.status, 0, h.stdout);
  for (const r of [l, h]) {
    assert.match(r.stdout, /2 figures in neither the brief nor the numbers ledger: "₹2,40,000" \(line 3\), "12%" \(line 3\)/);
    assert.match(r.stdout, /weekday not in the brief "Thursday"/);
    assert.match(r.stdout, /unwritten amount "₹X"/);
  }
  assert.match(l.stdout, /^WARN \(3, does not fail\)/m); assert.match(h.stdout, /Worth a look/);
  // A figure traced in the numbers ledger is known.
  const ledger = put("numbers.json", JSON.stringify([{ id: "sales", value: 240000, unit: "INR", period: "6 weeks", basis: "revenue", source: "brief" }, { id: "lift", formula: "a / b", inputs: { a: 12, b: 100 }, label: "12%" }]));
  for (const r of both(file, "--brief", BRIEF, "--numbers", ledger)) assert.doesNotMatch(r.stdout, /figures? in neither/);
});

test("--brief usage errors exit 2", () => {
  const file = put("usage.md", "# Plan\n\nShip it.\n");
  for (const r of both(file, "--brief", path.join(dir, "missing-brief.md"))) assert.equal(r.status, 2, r.stdout + r.stderr);
  for (const r of both(file, "--brief")) assert.equal(r.status, 2, r.stdout + r.stderr);
  for (const r of both(file, "--brief", BRIEF, "--numbers", path.join(dir, "missing.json"))) assert.equal(r.status, 2, r.stdout + r.stderr);
});
