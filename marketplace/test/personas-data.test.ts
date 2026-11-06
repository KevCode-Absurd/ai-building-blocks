// Every house persona must pass validation, with unique ids and unique names across all files.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { validatePersona } from "../src/modules/directory/schema.ts";

const DATA = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "src", "modules", "directory", "data");

test("persona data files are valid", () => {
  const ids = new Map<string, string>(), names = new Map<string, string>();
  for (const file of readdirSync(DATA).filter(f => /^personas-.*\.json$/.test(f))) {
    const list = JSON.parse(readFileSync(path.join(DATA, file), "utf8"));
    assert.ok(Array.isArray(list), `${file} must be an array`);
    for (const p of list) {
      const r = validatePersona(p);
      assert.ok(r.ok, `${file} ${p?.id}: ${!r.ok ? r.errors.join("; ") : ""}`);
      assert.ok(!ids.has(p.id), `id ${p.id} is in both ${ids.get(p.id)} and ${file}`);
      assert.ok(!names.has(p.name), `name ${p.name} is in both ${names.get(p.name)} and ${file}`);
      ids.set(p.id, file); names.set(p.name, file);
    }
  }
});
