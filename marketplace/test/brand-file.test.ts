// The org context lists a pack is built from (the file keeps its old name, brand-file.ts). The same lists live in the library (site/src/jobs/brand-file.mjs) and in
// the tool packs ship; site/test/brand-file-rules.test.mjs checks the three copies against each other.
import { test } from "node:test";
import assert from "node:assert/strict";
import { BRAND_FILE, BRAND_FILE_PARTS, FAST_KINDS, FRESH_DAYS, SLICES, SLICE_LINES, SLICE_PARTS, SLICE_WORDS, brandFileLine } from "../src/modules/packs/brand-file.ts";
import { CONTEXT_LEVELS, CONTEXT_NEED, contextNeed } from "../src/modules/packs/families.ts";
import type { DeliverableFamily } from "../src/core/types.ts";

test("the slices are the method's context levels, and every family gets a short org context line", () => {
  assert.deepEqual([...SLICES], Object.keys(CONTEXT_LEVELS));
  for (const family of Object.keys(CONTEXT_NEED) as DeliverableFamily[]) {
    const line = brandFileLine(contextNeed(family).level);
    assert.ok(line.startsWith("Org context: ") && line.length <= 150, family);
    assert.doesNotMatch(line, /brand brain|brand file|brand dna/i, family);
  }
  assert.equal(brandFileLine(contextNeed("code").level), "Org context: not needed for this job. Skip capture.");
  assert.match(brandFileLine(contextNeed("web_page").level), /refresh prices and stock first, then take slice full\.$/);
  assert.deepEqual(Object.keys(SLICE_LINES), [...SLICES]);
});

test("freshness and parts: prices and stock age in 7 days, look and voice in 90, and a slice reads only its parts", () => {
  assert.deepEqual(FRESH_DAYS, { fast: 7, slow: 90, fixed: null });
  assert.deepEqual(FAST_KINDS, ["price", "offer", "stock", "shipping"]);
  assert.deepEqual(BRAND_FILE_PARTS.map(p => p.file), ["offers.json", "facts.json", "look.json", "voice.md", "references.md", "worked.md"]);
  assert.deepEqual(SLICE_PARTS.none, []);
  for (const slice of SLICES) for (const part of SLICE_PARTS[slice]) assert.ok(BRAND_FILE_PARTS.some(p => p.id === part), `${slice}: ${part}`);
  assert.ok(SLICE_WORDS.full <= 1500 && SLICE_WORDS.facts <= 600 && SLICE_WORDS.voice <= 600 && SLICE_WORDS.look <= 600);
  assert.equal(BRAND_FILE.index, "context/org-context/index.md");
  assert.equal(BRAND_FILE.replaces.length, 4);
  assert.ok(BRAND_FILE.replaces.includes("brand-file/index.md"), "the old folder's index is one of the old names");
});
