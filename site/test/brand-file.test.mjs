import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { build } from "esbuild";
import { fileURLToPath } from "node:url";
import { GOAL_CHOICES, REACH_CHOICES, orderByProfile, ordersPicks, profileScore } from "../src/lib/profile-order.ts";

// One brand file everywhere: 5 setup questions, the personal me.md as an optional part, and picks ordered by it.
const built = await build({ entryPoints: [fileURLToPath(new URL("../src/lib/business.ts", import.meta.url))], bundle: true, write: false, format: "esm", platform: "browser" });
const biz = await import(`data:text/javascript;base64,${Buffer.from(built.outputFiles[0].text).toString("base64")}`);
const src = rel => fs.readFileSync(new URL(rel, import.meta.url), "utf8");

test("the setup asks 5 questions and the answers become a Business basics section every task keeps", () => {
  assert.equal(biz.SETUP_QUESTIONS.length, 5);
  assert.deepEqual(biz.SETUP_QUESTIONS.map(q => q.id), ["name", "sells", "buyer", "reach", "goal"]);
  const b = { name: "Sprout", sells: "Plant care kits", buyer: "Busy renters", reach: "local", area: "north Leeds", goal: GOAL_CHOICES[0] };
  assert.equal(biz.setupAnswered(b), 5);
  const text = biz.businessText(b);
  assert.match(text, /- \*\*Name:\*\* Sprout/);
  assert.match(text, /## Business basics\n\n- \*\*Where my customers are:\*\* Local, around north Leeds\n- \*\*Main goal right now:\*\* More customers or bookings/);
  // A heading me-file.ts doesn't know is kept for every kind of task: writing, planning and reports.
  for (const task of [{ slug: "ad-copy-writer", outputs: [{ type: "ad_copy" }] }, { slug: "weekly-planner" }, { slug: "ad-results-report", outputs: [{ type: "audit_report" }] }]) {
    assert.match(biz.meFor(b, [task]), /Where my customers are/, task.slug);
  }
  assert.equal(biz.reachText({ reach: "online", area: "Leeds" }), "Online");
  assert.equal(biz.businessText({}), "");
});

test("the personal me.md is an optional part: with one saved, the business answers still travel with it", () => {
  const me = "# me.md\n\n## Core\n\nI run a small plant shop.\n";
  const text = biz.businessText({ me, name: "Sprout", reach: "both", goal: "Less time on admin" });
  assert.ok(text.startsWith("# me.md\n\n## Core"));
  assert.match(text, /## Business basics\n\n- \*\*Name:\*\* Sprout\n- \*\*Where my customers are:\*\* Local and online\n- \*\*Main goal right now:\*\* Less time on admin\n$/);
  // Older saved objects (only a me.md, or only the 9 fields) read as before.
  assert.equal(biz.businessText({ me }), me);
  assert.equal(biz.businessText({ sells: "Kits" }), "# me.md\n\n## Core\n\n- **What I do or sell:** Kits\n");
});

test("picks are ordered by the brand file: local businesses see local-service items first, stably", () => {
  const items = ["Shopify product page writer", "Google Business Profile post writer", "Weekly planner", "Review reply writer", "Abandoned cart email flow"];
  assert.deepEqual(orderByProfile(items, {}, s => s), items, "nothing saved: unchanged");
  assert.equal(ordersPicks({ name: "Sprout" }), false);
  const local = orderByProfile(items, { reach: "local" }, s => s);
  assert.deepEqual(local.slice(0, 2), ["Google Business Profile post writer", "Review reply writer"]);
  assert.deepEqual(local.slice(-2), ["Shopify product page writer", "Abandoned cart email flow"], "online-store items go last for a local-only business");
  const online = orderByProfile(items, { reach: "online", goal: "More sales online" }, s => s);
  assert.deepEqual(online.slice(0, 2), ["Shopify product page writer", "Abandoned cart email flow"]);
  assert.ok(profileScore("Lead follow-up emails", { goal: "More customers or bookings" }) > 0);
  assert.equal(REACH_CHOICES.length, 3);
  // The browser helper reads the saved file by default and takes it as an argument for tests and callers.
  assert.deepEqual(biz.orderByProfile(items, s => s, { reach: "local" }).slice(0, 2), local.slice(0, 2));
});

test("one name: the brand file, in the menu, drawer, specialist setup and team page", () => {
  assert.match(src("../src/SiteHeader.tsx"), />Your brand file<\/button>/);
  assert.doesNotMatch(src("../src/SiteHeader.tsx"), /Business details/);
  assert.match(src("../src/BusinessDrawer.tsx"), /BRAND_FILE_TITLE/);
  assert.equal(biz.BRAND_FILE_TITLE, "Your brand file");
  for (const file of ["../src/roles/RoleTaskSetup.tsx", "../src/teams/TeamPage.tsx", "../src/BusinessDrawer.tsx"]) assert.doesNotMatch(src(file), /[Bb]rand brain/, file);
  assert.match(src("../../docs/WRITING.md"), /brand brain \| your brand file/);
});
