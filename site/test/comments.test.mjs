// The comments handler (src/server/comments.ts), run directly: node --test test/
import { test } from "node:test";
import assert from "node:assert/strict";
import { handleComments, memoryStore } from "../src/server/comments.ts";

const post = (body, headers = {}) => new Request("http://x/api/comments", { method: "POST", headers: { "content-type": "application/json", ...headers }, body: JSON.stringify(body) });
const get = (q) => new Request(`http://x/api/comments?${q}`);
const run = async (req, store, o = {}) => { const r = await handleComments(req, store, { ip: "1.2.3.4", teamToken: "team", ...o }); return { status: r.status, data: await r.json() }; };

test("a comment stays on its own skill, and old names bring theirs along", async () => {
  const s = memoryStore();
  assert.equal((await run(post({ slug: "a-skill", name: "Sam", body: "Does it work for a café?" }), s)).status, 201);
  await run(post({ slug: "old-name", body: "Left under the old name" }), s);
  await run(post({ slug: "other-skill", body: "Somewhere else" }), s);
  const { data } = await run(get("slug=a-skill&also=old-name"), s);
  assert.deepEqual(data.comments.map((c) => c.body), ["Does it work for a café?", "Left under the old name"]);
  assert.equal(data.comments[1].name, "Someone");
  assert.ok(!("ipHash" in data.comments[0]), "the visitor hash never leaves the server");
});

test("replies join one thread, and only the team posts answers or removes comments", async () => {
  const s = memoryStore();
  const q = (await run(post({ slug: "a-skill", body: "Which photos?" }), s)).data.comment;
  const a = (await run(post({ slug: "a-skill", parent: q.id, name: "Kev", body: "Front, side and top." }, { authorization: "Bearer team" }), s)).data.comment;
  assert.equal(a.team, true); assert.equal(a.name, "AI Blocks team"); assert.equal(a.parent, q.id);
  const again = (await run(post({ slug: "a-skill", parent: a.id, body: "Thanks!" }), s)).data.comment;
  assert.equal(again.parent, q.id);
  assert.equal((await run(post({ slug: "other", parent: q.id, body: "Wrong page" }), s)).status, 400);
  assert.equal((await run(new Request(`http://x/api/comments?id=${q.id}`, { method: "DELETE" }), s)).status, 403);
  assert.equal((await run(new Request(`http://x/api/comments?id=${again.id}`, { method: "DELETE", headers: { authorization: "Bearer team" } }), s)).status, 200);
  assert.equal((await run(get("slug=a-skill"), s)).data.comments.length, 2);
});

test("it turns away empty, oversized, bot and too-fast posts", async () => {
  const s = memoryStore();
  assert.equal((await run(post({ slug: "a-skill", body: " " }), s)).status, 400);
  assert.equal((await run(post({ slug: "a-skill", body: "x".repeat(2001) }), s)).status, 400);
  assert.equal((await run(post({ slug: "Not a slug!", body: "Hi there" }), s)).status, 400);
  assert.equal((await run(post({ slug: "a-skill", body: "Buy now", website: "spam.example" }), s)).status, 201);
  assert.equal((await run(get("slug=a-skill"), s)).data.comments.length, 0, "the bot's post isn't kept");
  for (let i = 0; i < 5; i++) assert.equal((await run(post({ slug: "a-skill", body: `Question ${i}` }), s)).status, 201);
  assert.equal((await run(post({ slug: "a-skill", body: "One more" }), s)).status, 429);
  assert.equal((await run(post({ slug: "a-skill", body: "From someone else" }), s, { ip: "5.6.7.8" })).status, 201);
});

test("without a database it says comments are off", async () => {
  assert.equal((await run(get("slug=a-skill"), null)).status, 503);
});
