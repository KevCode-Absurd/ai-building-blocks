// The customer-copy check (round 2 rollback, 13 Nov 2026): stated counts match the text, limits from the brief hold,
// and nothing unfinished or internal sits in what the customer reads.
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const TOOL = path.join(path.dirname(fileURLToPath(import.meta.url)), "../packs/shared/tools/quality/copy-check.cjs");
const dir = mkdtempSync(path.join(tmpdir(), "copy-check-"));
const run = (md: string, ...args: string[]) => {
  const f = path.join(dir, `c${Math.random().toString(36).slice(2)}.md`);
  writeFileSync(f, md);
  const r = spawnSync(process.execPath, [TOOL, f, ...args], { encoding: "utf8" });
  return { code: r.status, out: r.stdout };
};

test("stated counts must match the text, in tables, labels, trailing brackets and quoted ads", () => {
  assert.equal(run("| # | Headline | Characters |\n|---|---|---|\n| H1 | No need to flip this pack | 25 |\n").code, 0);
  const table = run("| # | Headline | Characters |\n|---|---|---|\n| H1 | No need to flip this pack today | 25 |\n");
  assert.equal(table.code, 1);
  assert.match(table.out, /Headline says 25 characters but runs 31/);
  assert.equal(run("**SEO title (12 characters):** Slim wallets\n").code, 0);
  assert.match(run("**SEO title (40 characters):** Slim wallets\n").out, /says 40 characters but runs 12/);
  assert.match(run("Headline: Made for the overhead bin (20)\n").out, /says 20 characters but runs 25/);
  assert.equal(run("**P1. Taste** · 23\n> Doesn't taste chalky.\n").code, 1);
  assert.equal(run("**P1. Taste** · 21\n> Doesn't taste chalky.\n").code, 0);
});

test("limits come from the brief and fail any field that runs over", () => {
  const md = "Headline: Made for the overhead bin\nSubject: Your bag is waiting\n";
  assert.equal(run(md).code, 0, "no limit given, nothing to fail");
  const r = run(md, "--limit", "Headline=20");
  assert.equal(r.code, 1);
  assert.match(r.out, /Headline runs 25 characters, over the limit of 20/);
  assert.equal(run(md, "--limit", "Subject=45").code, 0);
});

test("placeholders fail anywhere; bare template tags and working words warn", () => {
  assert.equal(run("Shop now at [link].\n").code, 1);
  assert.equal(run("[Block A] For dark spots, start with the serum.\n").code, 1);
  const tag = run("Hi {{ first_name }}, your code is ready.\n");
  assert.equal(tag.code, 0);
  assert.match(tag.out, /template tag with no fallback/);
  assert.doesNotMatch(run('Hi {{ first_name|default:"there" }}, your code is ready.\n').out, /template tag/);
  assert.doesNotMatch(run("Hi {{1}}, your order {{2}} is on its way.\n").out, /template tag/, "WhatsApp variables pass");
  assert.match(run("Headline: Best ROAS segment loves this (39)\n").out, /"ROAS" in Headline reads like a working note/);
  assert.equal(run("```\n[link]\n```\n").code, 0, "code fences are skipped");
});
