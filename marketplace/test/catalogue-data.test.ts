// Every real job type in src/modules/catalogue/data must pass validation, with unique ids across files.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { validateJobType } from "../src/modules/catalogue/schema.ts";

const DATA = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "src", "modules", "catalogue", "data");

test("catalogue data files are valid", () => {
  const seen = new Map<string, string>();
  for (const file of readdirSync(DATA).filter(f => f.endsWith(".json"))) {
    const list = JSON.parse(readFileSync(path.join(DATA, file), "utf8"));
    assert.ok(Array.isArray(list), `${file} must be an array`);
    for (const jt of list) {
      const r = validateJobType(jt);
      assert.ok(r.ok, `${file} ${jt?.id}: ${!r.ok ? r.errors.join("; ") : ""}`);
      assert.ok(!seen.has(jt.id), `${jt.id} appears in both ${seen.get(jt.id)} and ${file}`);
      seen.set(jt.id, file);
    }
  }
});
