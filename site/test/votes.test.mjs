// The "Did it work?" handler (src/server/votes.ts), run directly: node --test test/
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { handleVotes, memoryVotes, VOTE_LIMITS } from "../src/server/votes.ts";

const post = (body) => new Request("http://x/api/votes", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
const get = (slug) => new Request(`http://x/api/votes?slug=${slug}`);
const run = async (req, store, o = {}) => { const r = await handleVotes(req, store, { ip: "1.2.3.4", salt: "s", ...o }); return { status: r.status, data: await r.json() }; };

test("one answer per visitor per item: changing it replaces it, tapping it again takes it back", async () => {
  const s = memoryVotes();
  assert.deepEqual((await run(get("a-skill"), s)).data, { yes: 0, no: 0, mine: null });
  assert.deepEqual((await run(post({ slug: "a-skill", worked: true }), s)).data, { yes: 1, no: 0, mine: true });
  assert.deepEqual((await run(post({ slug: "a-skill", worked: false }), s)).data, { yes: 0, no: 1, mine: false });
  await run(post({ slug: "a-skill", worked: true }), s, { ip: "5.6.7.8" });
  assert.deepEqual((await run(get("a-skill"), s)).data, { yes: 1, no: 1, mine: false });
  assert.deepEqual((await run(get("a-skill"), s, { ip: "5.6.7.8" })).data, { yes: 1, no: 1, mine: true });
  assert.deepEqual((await run(post({ slug: "a-skill", worked: null }), s)).data, { yes: 1, no: 0, mine: null });
  assert.deepEqual((await run(get("other-skill"), s)).data, { yes: 0, no: 0, mine: null }, "answers stay on their own item");
});

test("it turns away bad input, keeps nothing from bots, and limits one visitor's answers per day", async () => {
  const s = memoryVotes();
  assert.equal((await run(post({ slug: "Not a slug!", worked: true }), s)).status, 400);
  assert.equal((await run(post({ slug: "a-skill", worked: "yes" }), s)).status, 400);
  assert.equal((await run(get(""), s)).status, 400);
  assert.equal((await run(new Request("http://x/api/votes", { method: "DELETE" }), s)).status, 405);
  assert.equal((await run(post({ slug: "a-skill", worked: true, website: "spam.example" }), s)).status, 200);
  assert.deepEqual((await run(get("a-skill"), s)).data, { yes: 0, no: 0, mine: null }, "the bot's answer isn't kept");
  for (let i = 0; i < VOTE_LIMITS.perDay; i++) assert.equal((await run(post({ slug: `item-${i}`, worked: true }), s)).status, 200);
  assert.equal((await run(post({ slug: "one-more", worked: true }), s)).status, 429);
  assert.equal((await run(post({ slug: "one-more", worked: true }), s, { limit: false })).status, 200);
  assert.equal((await run(get("a-skill"), null)).status, 503);
});

test("the visitor's address is never stored, only a salted hash", async () => {
  const rows = [];
  const s = { ...memoryVotes(), async set(v) { rows.push(v); } };
  await run(post({ slug: "a-skill", worked: true }), s);
  assert.equal(rows.length, 1);
  assert.ok(!JSON.stringify(rows).includes("1.2.3.4"));
  assert.match(rows[0].voter, /^[0-9a-f]{32}$/);
});

test("the live router, the dev server and the database all know about answers", () => {
  assert.match(fs.readFileSync("src/worker.ts", "utf8"), /path === "\/api\/votes"\) return votes\(/);
  assert.match(fs.readFileSync("vite.config.ts", "utf8"), /devVotes\(\)/);
  assert.match(fs.readFileSync("migrations/0012_item_votes.sql", "utf8"), /PRIMARY KEY \(slug, voter\)/);
  assert.match(fs.readFileSync("src/lib/site-info.mjs", "utf8"), /Did it work\? answers/);
});
