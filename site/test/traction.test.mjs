import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import YAML from "yaml";
import { TRACTION_CHANNELS, tractionSlug } from "../../tools/lib/traction-channels.mjs";
import { BUSINESS_TYPES, growthPlan, productUrl, tractionBrief } from "../src/lib/traction.ts";

test("public product URLs preserve useful query data and reject executable or private inputs", () => {
  assert.equal(productUrl("example.com/product?plan=team#pricing"), "https://example.com/product?plan=team");
  for (const url of ["", "javascript:alert(1)", "file:///c:/secret", "https://user:pass@example.com", "http://127.0.0.1", "http://10.1.2.3", "http://172.16.0.1", "https://localhost", "https://service.local"]) assert.throws(() => productUrl(url), undefined, url);
});

test("briefs honour mode, scope and supplied limits without claiming analysis was executed", () => {
  const b = { url: "https://signaldesk.example", mode: "general", goal: "10 enquiries", limits: "200 USD and 4 hours", stage: "early", channel: "sales" };
  const text = tractionBrief(b);
  assert.match(text, /General business/);
  assert.match(text, /traction-sales/);
  assert.match(text, /200 USD and 4 hours/);
  assert.match(text, /Withhold a scale verdict/);
  assert.match(tractionBrief({ ...b, channel: "all", limits: "" }), /Explore all 19/);
  assert.match(tractionBrief({ ...b, limits: "" }), /propose small limits for approval/);
});

test("businesses without websites get a useful brief with their own conversion measures", () => {
  const b = { url: "", business: "A neighbourhood bakery making custom birthday cakes", mode: "local", buyer: "Parents planning birthdays", market: "Pune, in-store and delivery", goal: "20 cake bookings in eight weeks", limits: "INR 5000 and 3 hours per week", stage: "Established", channel: "all" };
  const text = tractionBrief(b);
  assert.match(text, /Local business/);
  assert.match(text, /Not supplied; work from the description/);
  assert.match(text, /Pune, in-store and delivery/);
  assert.match(text, /appointments, visits or paid orders/);
  assert.match(text, /INR 5000 and 3 hours/);
  assert.equal(growthPlan({ ...b, success: "Paid cake bookings" }).success, "Paid cake bookings");
  for (const type of BUSINESS_TYPES) assert.ok(growthPlan({ ...b, mode: type.value }).success.length > 20);
  assert.notEqual(growthPlan({ ...b, mode: "nonprofit" }).success, growthPlan({ ...b, mode: "saas" }).success);
  assert.doesNotMatch(text, /Claude|OpenAI|ChatGPT|Gemini/);
});

test("incomplete business descriptions, unknown channels and excessive input are rejected", () => {
  const b = { url: "", business: "An agency helping independent retailers", mode: "general", goal: "", limits: "", stage: "", channel: "all" };
  for (const change of [{ business: "" }, { business: "short" }, { mode: "invented" }, { channel: "../outside" }, { buyer: "x".repeat(601) }, { business: "x".repeat(2001) }]) assert.throws(() => growthPlan({ ...b, ...change }));
});

test("19 distinct channels have complete standalone assets and a closed workflow dependency graph", () => {
  assert.equal(TRACTION_CHANNELS.length, 19);
  assert.equal(new Set(TRACTION_CHANNELS.map((c) => c.id)).size, 19);
  const items = new Map();
  for (const cat of ["general", "orchestrators", "agents"]) for (const slug of fs.readdirSync(`../catalogue-items/${cat}`)) {
    const file = `../catalogue-items/${cat}/${slug}/item.yaml`;
    if (fs.existsSync(file)) items.set(slug, YAML.parse(fs.readFileSync(file, "utf8")));
  }
  for (const c of TRACTION_CHANNELS) {
    const slug = tractionSlug(c.id), item = items.get(slug);
    assert.equal(item.type, "skill");
    assert.equal(item.tested, undefined, "structural validation is not a live model run");
    const root = `../catalogue-items/general/${slug}`;
    const skill = fs.readFileSync(`${root}/SKILL.md`, "utf8");
    const front = YAML.parse(skill.split("---")[1]);
    assert.equal(front.name, slug);
    for (const ref of ["measurement.md", "general-mode.md", "source-notes.md"]) assert.ok(fs.statSync(`${root}/references/${ref}`).size > 100);
    assert.notEqual(c.method.join(" "), TRACTION_CHANNELS.find((x) => x.id !== c.id).method.join(" "));
  }
  for (const root of ["find-your-saas-growth-channel", "find-your-business-growth-channel", "traction-research-agent", "traction-experiment-keeper"]) {
    const visited = new Set();
    const walk = (slug) => { if (visited.has(slug)) return; visited.add(slug); assert.ok(items.has(slug), `missing dependency ${slug}`); for (const child of items.get(slug).uses ?? []) walk(child); };
    walk(root);
    for (const c of TRACTION_CHANNELS) assert.ok(visited.has(tractionSlug(c.id)), `${root} can reach ${c.channel}`);
  }
});
