// The browse order on /agents and the home page's picks, checked against the real roster (data/personas-*.json).
import { test } from "node:test";
import assert from "node:assert/strict";
import { housePersonas } from "../src/modules/directory/index.ts";
import { browseOrder, pickFeatured, START_HERE } from "../src/modules/directory/views.ts";
import { AREAS } from "../src/core/types.ts";

const live = housePersonas().filter(p => p.status === "live");

test("every START_HERE agent is live, in a different job role, and the first 20 cover every area", () => {
  const picks = START_HERE.map(id => live.find(p => p.id === id));
  assert.deepEqual(START_HERE.filter((_, i) => !picks[i]), [], "every id is a live agent");
  const roles = picks.map(p => p!.role);
  assert.equal(new Set(roles).size, roles.length, "one agent per job role");
  const areas = new Set(picks.map(p => p!.area));
  assert.deepEqual(AREAS.filter(a => live.some(p => p.area === a) && !areas.has(a)), [], "every area with agents is in the first 20");
});

test("browsing all agents starts with START_HERE, then mixes areas and roles", () => {
  const order = browseOrder(live);
  assert.equal(order.length, live.length, "nobody is lost or repeated");
  assert.equal(new Set(order.map(p => p.id)).size, live.length);
  assert.deepEqual(order.slice(0, START_HERE.length).map(p => p.id), [...START_HERE]);
  const first100 = order.slice(0, 100);
  for (let i = 1; i < first100.length; i++) assert.notEqual(first100[i].area, first100[i - 1].area, `areas ${i - 1} and ${i} differ`);
  // The five growth leads used to fill the first five places; now no two sit within 12 of each other.
  const growth = order.map((p, i) => (p.role === "growth-marketer" ? i : -1)).filter(i => i >= 0);
  for (let i = 1; i < growth.length; i++) assert.ok(growth[i] - growth[i - 1] >= 12, `growth leads at ${growth[i - 1]} and ${growth[i]}`);
});

test("within one area the order still mixes job roles", () => {
  const marketing = browseOrder(live.filter(p => p.area === "marketing"), { withinArea: true });
  const firstTen = marketing.slice(0, 10).map(p => p.role);
  assert.equal(new Set(firstTen).size, 10, `ten different roles first: ${firstTen.join(", ")}`);
});

test("the home page shows the START_HERE pick for each area, one per area", () => {
  const six = pickFeatured(live, 6);
  assert.equal(new Set(six.map(p => p.area)).size, 6);
  assert.equal(six[0].id, "mehdi-traction-general");
});
