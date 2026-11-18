import { test } from "node:test";
import assert from "node:assert/strict";
import { testEnv } from "./helpers.ts";
import { housePersonas } from "../src/modules/directory/index.ts";
import { validatePersona } from "../src/modules/directory/schema.ts";
import { getRole } from "../src/modules/directory/roles.ts";
import { ECOMMERCE_STAGES } from "../src/modules/directory/team-stages.ts";
import { teamMarkdown } from "../src/modules/directory/team.ts";
import org from "../src/modules/directory/data/team-org-chart.json" with { type: "json" };

test("store speed jobs find their platform specialist inside the e-commerce team", async () => {
  const t = await testEnv();
  for (const [query, expected] of [
    ["Shopify page speed", "arjun-page-speed"],
    ["headless storefront speed", "nico-ecommerce-speed"],
    ["ecommerce site speed", "nico-ecommerce-speed"],
    ["WordPress WooCommerce speed", "vera-woocommerce-speed"],
  ]) {
    const response = await t.api("GET", `/api/agents?vertical=ecommerce&q=${encodeURIComponent(query)}`);
    assert.equal(response.status, 200);
    const hits = response.body.agents as { id: string }[];
    assert.equal(hits[0]?.id, expected, `${query} should lead to the matching platform owner`);
  }
});

test("the orchestrator can hand speed work to every registered platform owner", () => {
  const people = housePersonas();
  const coordinator = people.find(person => person.id === "margaret-job-orchestrator")!;
  const handover = teamMarkdown(coordinator);
  for (const id of ["arjun-page-speed", "nico-ecommerce-speed", "vera-woocommerce-speed"]) {
    const person = people.find(candidate => candidate.id === id)!;
    assert.ok(handover.includes(`${id}:`), `${id} must be in the generated roster`);
    const entry = org.personas.find(candidate => candidate.id === id);
    assert.ok(entry?.roles.includes(person.role!), `${id} must be discoverable in its canonical role`);
    const department = org.departments.find(candidate => candidate.id === "ecommerce");
    assert.ok(department?.roles.some(role => role.id === person.role && role.persona_ids.includes(id)), `${id} needs an executable role handoff`);
  }
  // A Shopify commerce backend must not silently turn a headless implementation job into a Liquid theme edit.
  assert.match(handover, /Headless or custom storefronts go to nico-ecommerce-speed, including a headless frontend backed by Shopify/);
  assert.match(handover, /When the stack is unknown, Nico diagnoses it first/);
});

test("the three speed specialists have distinct validated roles and one store-stage seat each", () => {
  const people = housePersonas();
  const ids = ["arjun-page-speed", "nico-ecommerce-speed", "vera-woocommerce-speed"];
  const roles = new Set<string>();
  for (const id of ids) {
    const matches = people.filter(person => person.id === id);
    assert.equal(matches.length, 1);
    const person = matches[0];
    assert.equal(validatePersona(person).ok, true, id);
    assert.ok(getRole(person.role));
    assert.equal(person.vertical, "ecommerce");
    assert.ok(person.modules?.includes("SPD"));
    assert.deepEqual(ECOMMERCE_STAGES.filter(stage => stage.agents.includes(id)).map(stage => stage.id), ["store"]);
    roles.add(person.role!);
  }
  assert.equal(roles.size, 3, "platform specialists must not silently share one broad pack");
});
