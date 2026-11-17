// Delivery/routing regression tests, not claims about an LLM's behavioral accuracy.
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Persona } from "../src/core/types.ts";
import personas from "../src/modules/directory/data/personas-ecommerce.json" with { type: "json" };
import { ecommerceRoleContext, renderEcommerceRoleContext, resolveEcommerceRole } from "../src/modules/directory/ecommerce-context.ts";
import { getRole } from "../src/modules/directory/roles.ts";
import { listJobTypes } from "../src/modules/catalogue/index.ts";
import { buildHousePackage } from "../src/modules/runner/packages.ts";
import { buildPack, oneFileText, packZip, validateRoleKit, type RoleKit } from "../src/modules/packs/build.ts";
import { bestRoute } from "../src/modules/packs/route.ts";
import { readZip } from "../src/modules/packs/zip.ts";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const gretchen = (personas as Persona[]).find(p => p.id === "gretchen-store-testing")!;
const read = (...parts: string[]) => readFileSync(path.join(ROOT, ...parts), "utf8");
const kitFolder = path.join(ROOT, "packs/roles/cro-specialist");
function readKit(): RoleKit {
  const files: Record<string, string> = {};
  function visit(dir: string, prefix = "") {
    for (const item of readdirSync(dir, { withFileTypes: true })) {
      const rel = prefix + item.name;
      if (item.isDirectory()) visit(path.join(dir, item.name), rel + "/");
      else if (/\.(md|json)$/.test(rel)) files[rel] = readFileSync(path.join(dir, item.name), "utf8");
    }
  }
  visit(kitFolder);
  const role = JSON.parse(files["role.json"]);
  delete files["role.json"];
  return { role, files };
}
const kit = readKit();
const skillPath = "skills/conversion-research-audit/SKILL.md";
const templates = Object.fromEntries(["AGENTS.md", "WORK-METHOD.md", "README.md", "LICENSE.md"].map(p => [p, read("packs/shared", p)]));

test("CRO source defaults stay narrow; executable store evidence is conditional rather than silently loaded", () => {
  const ctx = ecommerceRoleContext(gretchen)!;
  assert.deepEqual(ctx.primary_modules, ["CRO"]);
  assert.deepEqual(resolveEcommerceRole(gretchen.id)?.modules, ["CRO"]);
  assert.deepEqual(ctx.conditional_modules.map(m => m.code), ["MEA", "SET"]);
  assert.equal(ctx.conditional_modules.find(m => m.code === "SET")!.path, "knowledge/ecommerce/SET.md");
  const condition = ctx.conditional_modules.find(m => m.code === "SET")!.when;
  assert.match(condition, /authorized executable buyer-flow or checkout integration review/);
  assert.match(condition, /not for a screenshot-only review or statistical readout/);
  const rendered = renderEcommerceRoleContext(gretchen);
  assert.match(rendered, /fallback candidates, not an instruction to load them all/);
  assert.match(rendered, /continue diagnosis without margins/);
});

test("checkout toolbox reaches the real kit skill and shipped recovery content survives agent/train/zip/one-file", async () => {
  assert.deepEqual(validateRoleKit(kit).errors, []);
  const box = JSON.parse(kit.files["toolbox.json"]);
  const checkout = box.tasks.find((t: { id: string }) => t.id === "checkout-audit");
  assert.equal(checkout.items[0].ref, "kit:skills/conversion-research-audit");
  assert.ok(kit.files[skillPath]);
  // Other tasks keep their targeted selection instead of receiving a universal recovery skill.
  const readout = box.tasks.find((t: { id: string }) => t.id === "test-readout");
  assert.ok(!readout.items.some((i: { ref: string }) => i.ref === checkout.items[0].ref));
  for (const kind of ["agent", "train"] as const) {
    const pack = await buildPack({ persona: gretchen, role: getRole("cro-specialist"), kit, jobTypes: listJobTypes(), templates,
      options: { kind, version: "2026.11.18", updated: "2026-11-18" } });
    const skill = pack.files.find(f => f.path === skillPath)!;
    assert.ok(skill);
    const toolbox = pack.files.find(f => f.path === "toolbox.md")!.content;
    const checkoutSection = toolbox.split("### Audit the cart and checkout")[1]?.split("\n### ")[0];
    assert.ok(checkoutSection?.includes(skillPath), "the actual task handoff must point to the shipped skill");
    assert.equal(bestRoute("Audit cart and checkout recovery", pack.routes)?.candidate.path, skillPath);
    const readoutRoute = bestRoute("Check our A/B test sample ratio, lift and confidence interval", pack.routes)?.candidate.path;
    assert.equal(readoutRoute, "skills/experiment-results-readout/SKILL.md");
    assert.ok(pack.files.find(f => f.path === readoutRoute)!.content.includes("skills/test-readout/SKILL.md"), "statistical readout still reaches its own kit method");
    const zip = await readZip(await packZip(pack));
    assert.equal(new TextDecoder().decode(zip.find(f => f.path === pack.folder + "/" + skillPath)!.data), skill.content);
    if (kind === "agent") {
      const portable = oneFileText(pack);
      assert.ok(portable.includes("Buyer-state checks for an executable checkout review"));
      assert.ok(portable.includes("A timeout is not a decline."));
      assert.ok(portable.includes("not a mandatory exhaustive matrix"));
    }
  }
});

test("hosted CRO method carries the same bounded functional/economics distinction", () => {
  const job = listJobTypes().find(j => j.id === "page-conversion-review")!;
  assert.ok(job);
  const pkg = buildHousePackage(gretchen, job);
  assert.ok(pkg.skill.instructions.includes(gretchen.profile.method));
  assert.match(pkg.skill.instructions, /Missing margins do not block functional diagnosis/);
  assert.match(pkg.skill.instructions, /Require reconciled unit economics before estimating monetary payoff/);
  assert.doesNotMatch(pkg.skill.instructions, /If the number is missing, I wait for the unit economics analyst/);
  assert.ok(pkg.files.find(f => f.path === "reference/ecommerce-role-context.md")!.content.includes("authorized executable buyer-flow"));
});
