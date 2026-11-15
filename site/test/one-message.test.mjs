import { test } from "node:test";
import assert from "node:assert/strict";
import { build } from "esbuild";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { MESSAGE_LIMIT, cutAt, fitMethod } from "../src/lib/one-message.mjs";
import { specialistMessage } from "../src/roles/base-specialist-message.mjs";
import { baseSpecialistFiles, baseSpecialistPrompt } from "../src/roles/base-specialist.mjs";

// "Copy as one message": specialists and workflows as one paste-ready chat message, sized to fit.
const bundle = async rel => {
  const built = await build({ entryPoints: [fileURLToPath(new URL(rel, import.meta.url))], bundle: true, write: false, format: "esm", platform: "browser" });
  return import(`data:text/javascript;base64,${Buffer.from(built.outputFiles[0].text).toString("base64")}`);
};
const { flowMessage } = await bundle("../src/lib/handoff.ts");

const section = (title, words) => `## ${title}\n\n${Array.from({ length: words }, (_, i) => `Line ${i} of ${title.toLowerCase()} explains one concrete step.`).join("\n")}`;
const skillText = (n = 40) => `---\nname: demo\ndescription: demo\n---\n\n# Demo method\n\n${section("Steps", n)}\n\n${section("Checks", 10)}\n\n${section("References", n)}\n\n${section("Examples", n)}`;
const role = {
  id: "demo-specialist", name: "Demo specialist", summary: "Writes checked local ads from real business facts.", lead: "demo-method",
  deliverables: ["Three ad drafts", "A fact check table"], inputs: ["Product facts", "Offer"], limits: ["Does not publish ads."],
  capabilities: [{ name: "Find the reason to buy", description: "Pulls buying reasons from reviews." }],
  expertise: { principles: ["Every claim rests on a supplied fact."], pitfalls: ["Inventing prices."] },
  evaluation: { rubric: [{ id: "r1", criterion: "Every claim cites a supplied fact." }, { id: "r2", criterion: "Delivers: Three ad drafts" }] },
  resources: [{ slug: "demo-method", name: "Demo method", summary: "x", path: "/skills/demo-method", kind: "skill", revision: "a", skillPath: "/skills/demo-method/SKILL.md" }],
};

test("a method that fits goes in whole; a long one drops references first and cuts at a break", () => {
  const short = fitMethod("---\nname: x\n---\n# Method\nDo the thing.\n", 1000);
  assert.deepEqual(short, { text: "# Method\nDo the thing.", shortened: false });
  const long = fitMethod(skillText(80), 4000);
  assert.equal(long.shortened, true);
  assert.ok(long.text.length <= 4000, `${long.text.length}`);
  assert.match(long.text, /## Steps/);
  assert.doesNotMatch(long.text, /## References|## Examples/);
  assert.doesNotMatch(long.text, /^---/);
  assert.equal(cutAt("one two three\nfour five", 17), "one two three");
});

test("specialist message has setup, intake and the method inline, fits one message and stays generic", () => {
  const m = specialistMessage(role, { method: skillText(30) });
  assert.ok(m.fits && m.chars <= MESSAGE_LIMIT, `${m.chars}`);
  assert.equal(m.chars, m.text.length);
  for (const part of ["Please work as my demo specialist", "## How to start", "What would you like me to do, and what would you like back?", "If the job needs it: Product facts", "## The method: Demo method", "## Steps", "Every claim cites a supplied fact.", "Ask me before you send, publish, spend money"]) assert.ok(m.text.includes(part), part);
  assert.doesNotMatch(m.text, /Delivers: /);
  assert.doesNotMatch(m.text, /org context|brand file/i);
  assert.equal(m.shortened, false);
});

test("a long method is shortened honestly with a link, and a missing method still leaves a working message", () => {
  const m = specialistMessage(role, { method: skillText(900) });
  assert.ok(m.fits, `${m.chars}`);
  assert.equal(m.shortened, true);
  assert.match(m.text, /shorter version, cut to fit one message\. The full method is at https:\/\/useaiblocks\.com\/skills\/demo-method/);
  const offline = specialistMessage(role, { method: null });
  assert.equal(offline.methodLoaded, false); assert.equal(offline.shortened, true);
  assert.match(offline.text, /Read the method at https:\/\/useaiblocks\.com\/skills\/demo-method/);
  assert.match(offline.text, /## How to start/);
});

test("the org context is added only to the owner's own copy, never to the published pack or setup prompt", () => {
  const brand = "## Your me.md\n\n### Business basics\n\n- **Name:** Sprout\n- **Where my customers are:** Local, around north Leeds";
  const m = specialistMessage(role, { method: skillText(20), brandFile: brand });
  assert.ok(m.text.includes("- **Name:** Sprout"));
  assert.match(m.text, /including my org context at the end of this message/);
  assert.ok(m.text.indexOf("Sprout") > m.text.indexOf("## Limits"));
  const pack = JSON.stringify(baseSpecialistFiles({ ...role, tools: [], workedExample: null, version: null })) + baseSpecialistPrompt(role);
  assert.doesNotMatch(pack, /Sprout|Business basics/);
});

const port = (type, required = true) => ({ type, required });
const custom = (slug, markdown, inputs = [port("brief")], outputs = [port("draft")]) => ({ slug: `custom-${slug}`, name: `Step ${slug}`, summary: "Does one job.", markdown, role: "make", inputs, outputs });
const c = { built: "fixture", blocks: [], bySlug: {}, renamed: {}, portTypes: {} };
const flowOf = skills => ({ id: "f", name: "Local ads from reviews", goal: "Three local ads for Sprout", updated: 0, customSkills: skills, nodes: skills.map((s, i) => ({ id: `s${i + 1}`, slug: s.slug, x: i * 300, y: 0 })), edges: skills.slice(1).map((s, i) => ({ id: `e${i}`, from: `s${i + 1}`, to: `s${i + 2}` })) });

test("workflow message carries the goal, what to ask, every step's method and the org context, within the limit", async () => {
  const skills = [custom("collect-reviews", skillText(20), [port("reviews")], [port("brief")]), custom("write-ads", skillText(20), [port("brief")], [port("ad_copy")])];
  const m = await flowMessage(c, flowOf(skills), { name: "Sprout", reach: "local", area: "north Leeds", goal: "More customers or bookings" }, async () => null);
  assert.ok(!("error" in m), m.error);
  assert.ok(m.fits, `${m.chars}`); assert.equal(m.steps, 2);
  for (const part of ["Please run this workflow with me in this chat: Local ads from reviews", "Three local ads for Sprout", "### Step 1: Step collect-reviews", "### Step 2: Step write-ads", "Uses: the result of step 1", "## When you finish", "Local, around north Leeds", "More customers or bookings"]) assert.ok(m.text.includes(part), part);
  assert.match(m.text, /for step 1/);
});

test("long workflows share the room fairly and say which methods are shortened", async () => {
  const skills = Array.from({ length: 6 }, (_, i) => custom(`s-${i}`, skillText(i % 2 ? 400 : 10)));
  const m = await flowMessage(c, flowOf(skills), {}, async () => null);
  assert.ok(m.fits, `${m.chars} > ${m.limit}`);
  assert.equal(m.shortened, true);
  assert.equal((m.text.match(/### Step \d/g) ?? []).length, 6);
  // The short methods arrive whole; the long ones carry a link to the rest.
  assert.ok(m.text.includes("Line 9 of steps"));
  assert.match(m.text, /Shorter version, cut to fit one message\. The full method is at https:\/\/useaiblocks\.com\//);
  assert.doesNotMatch(m.text, /org context|brand file/);
  const none = await flowMessage(c, { ...flowOf([]), nodes: [] }, {});
  assert.ok("error" in none);
});

// Published specialists with their real primary method. Runs when the index is built.
const data = new URL("../public/data/roles/", import.meta.url), skillsDir = new URL("../public/skills/", import.meta.url);
test("published specialists fit one message", { skip: !fs.existsSync(data) && "run npm run index first" }, () => {
  for (const id of ["coding-specialist", "design-specialist", "academic-historian"].filter(id => fs.existsSync(new URL(`${id}.json`, data)))) {
    const r = JSON.parse(fs.readFileSync(new URL(`${id}.json`, data), "utf8"));
    const lead = new URL(`${r.lead}/SKILL.md`, skillsDir);
    const m = specialistMessage(r, { method: fs.existsSync(lead) ? fs.readFileSync(lead, "utf8") : null });
    assert.ok(m.fits, `${id}: ${m.chars}`);
    assert.match(m.text, /## The method: /);
  }
});
