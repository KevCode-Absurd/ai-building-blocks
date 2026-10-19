// The spaces handler (src/server/spaces.ts), run directly: npm run test:unit
import { test } from "node:test";
import assert from "node:assert/strict";
import { handleSpaces, memorySpaces } from "../src/server/spaces.ts";

const call = async (store, method, path, { key, body, o = {} } = {}) => {
  const headers = { "content-type": "application/json", ...(key ? { authorization: `Bearer ${key}` } : {}) };
  const r = await handleSpaces(new Request(`http://x/api/spaces${path}`, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) }), store, { ip: "1.2.3.4", teamToken: "team", ...o });
  return { status: r.status, data: await r.json() };
};
const make = async (s, name = "Sam's team") => (await call(s, "POST", "", { body: { name } })).data;

test("a space opens only with its owner key, and the key itself is never stored", async () => {
  const s = memorySpaces();
  const made = await make(s);
  assert.equal(made.space.name, "Sam's team");
  assert.ok(made.ownerKey.length >= 30 && made.shareToken.length >= 30);
  assert.equal((await call(s, "GET", "/me", { key: made.ownerKey })).status, 200);
  assert.equal((await call(s, "GET", "/me", { key: "wrong" })).status, 401);
  assert.equal((await call(s, "GET", "/me")).status, 401);
  const row = await s.spaceByShare(made.shareToken);
  assert.ok(!JSON.stringify(row).includes(made.ownerKey), "only a hash of the owner key is kept");
});

test("items are added, changed and deleted by the owner only", async () => {
  const s = memorySpaces();
  const a = await make(s);
  const b = await make(s, "Someone else");
  const add = await call(s, "POST", "/me/items", { key: a.ownerKey, body: { kind: "skill", title: "Our refund email", summary: "Writes the refund reply", body: "---\nname: refund-email\n---\n# Refund email" } });
  assert.equal(add.status, 201);
  assert.equal(add.data.item.visibility, "private");
  const id = add.data.item.id;
  assert.equal((await call(s, "PATCH", `/me/items/${id}`, { key: b.ownerKey, body: { title: "Mine now" } })).status, 404, "another space can't touch it");
  const changed = await call(s, "PATCH", `/me/items/${id}`, { key: a.ownerKey, body: { title: "Refund reply writer", visibility: "public" } });
  assert.equal(changed.data.item.title, "Refund reply writer");
  assert.equal((await call(s, "POST", "/me/items", { key: a.ownerKey, body: { kind: "spell", title: "x" } })).status, 400);
  assert.equal((await call(s, "POST", "/me/items", { key: a.ownerKey, body: { kind: "skill", title: "" } })).status, 400);
  assert.equal((await call(s, "POST", "/me/items", { key: a.ownerKey, body: { kind: "skill", title: "Big", body: "x".repeat(100_001) } })).status, 400);
  assert.equal((await call(s, "DELETE", `/me/items/${id}`, { key: a.ownerKey })).status, 200);
  assert.equal((await call(s, "GET", "/me", { key: a.ownerKey })).data.items.length, 0);
});

test("the share link shows the whole space, read only, until the owner replaces it", async () => {
  const s = memorySpaces();
  const a = await make(s);
  await call(s, "POST", "/me/items", { key: a.ownerKey, body: { kind: "workflow", title: "Monday ads", data: { nodes: [{ id: "n1", slug: "fact-based-ad-copy-writer" }], edges: [] } } });
  await call(s, "POST", "/me/items", { key: a.ownerKey, body: { kind: "kit", title: "Launch kit", data: { slugs: ["meta-ads-compliance-checker"] } } });
  const shared = await call(s, "GET", `/shared/${a.shareToken}`);
  assert.equal(shared.status, 200);
  assert.equal(shared.data.space.name, "Sam's team");
  assert.deepEqual(shared.data.items.map((i) => i.kind).sort(), ["kit", "workflow"]);
  assert.ok(!("shareToken" in shared.data) && !("ownerKey" in shared.data));
  assert.equal((await call(s, "POST", `/shared/${a.shareToken}`, { body: {} })).status, 405, "a shared link can't change anything");
  const fresh = (await call(s, "POST", "/me/link", { key: a.ownerKey })).data.shareToken;
  assert.notEqual(fresh, a.shareToken);
  assert.equal((await call(s, "GET", `/shared/${a.shareToken}`)).status, 404, "the old link stops working");
  assert.equal((await call(s, "GET", `/shared/${fresh}`)).status, 200);
});

test("public items show on the public list without their space's secrets, and the team can take one down", async () => {
  const s = memorySpaces();
  const a = await make(s, "Kev's shop");
  const hidden = await call(s, "POST", "/me/items", { key: a.ownerKey, body: { kind: "prompt", title: "Private one", body: "secret" } });
  const open = await call(s, "POST", "/me/items", { key: a.ownerKey, body: { kind: "agent", title: "Support agent", body: "You answer support emails.", visibility: "public" } });
  const list = (await call(s, "GET", "/public")).data.items;
  assert.deepEqual(list.map((i) => i.title), ["Support agent"]);
  assert.equal(list[0].space, "Kev's shop");
  assert.ok(!("body" in list[0]) && !("spaceId" in list[0]));
  assert.equal((await call(s, "GET", `/public/${hidden.data.item.id}`)).status, 404, "a private item isn't public");
  assert.equal((await call(s, "GET", `/public/${open.data.item.id}`)).data.item.body, "You answer support emails.");
  assert.equal((await call(s, "DELETE", `/public/${open.data.item.id}`, { key: a.ownerKey })).status, 403);
  assert.equal((await call(s, "DELETE", `/public/${open.data.item.id}`, { key: "team" })).status, 200);
  assert.equal((await call(s, "GET", "/public")).data.items.length, 0);
});

test("one visitor can make only so many spaces a day, and no store means switched off", async () => {
  const s = memorySpaces();
  for (let i = 0; i < 10; i++) assert.equal((await call(s, "POST", "", { body: {} })).status, 201);
  assert.equal((await call(s, "POST", "", { body: {} })).status, 429);
  const off = await handleSpaces(new Request("http://x/api/spaces/public"), null, { ip: "" });
  assert.equal(off.status, 503);
});
