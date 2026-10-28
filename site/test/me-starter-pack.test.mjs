import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { unzipSync, strFromU8 } from "fflate";
import { STARTER_FILES, ZIP, starterPackBytes } from "../scripts/build-me-starter-pack.mjs";
import { MAKE_ME_PROMPT } from "../src/lib/me-prompts.ts";
import { parseMe } from "../src/lib/me-file.ts";

test("the starter pack zip matches the template files (run scripts/build-me-starter-pack.mjs if not)", () => {
  assert.ok(fs.existsSync(ZIP), "public/templates/me-md-starter-pack.zip is missing");
  assert.deepEqual(new Uint8Array(fs.readFileSync(ZIP)), starterPackBytes());
  const files = unzipSync(new Uint8Array(fs.readFileSync(ZIP)));
  for (const name of STARTER_FILES) assert.ok(files[`me-md-starter-pack/${name}`], name);
});

test("the checked-in starter archive is byte-identical in different time zones", () => {
  const module = new URL('../scripts/build-me-starter-pack.mjs', import.meta.url).href;
  const code = `import { starterPackBytes } from ${JSON.stringify(module)}; import { createHash } from 'node:crypto'; process.stdout.write(createHash('sha256').update(starterPackBytes()).digest('hex'));`;
  const expected = createHash('sha256').update(fs.readFileSync(ZIP)).digest('hex');
  for (const TZ of ['UTC', 'Asia/Kolkata', 'America/Los_Angeles']) {
    const actual = execFileSync(process.execPath, ['--input-type=module', '-e', code], { env: { ...process.env, TZ }, encoding: 'utf8' });
    assert.equal(actual, expected, TZ);
  }
});

test("the copyable prompt and the starter pack prompt are the same text", () => {
  const prompts = fs.readFileSync(new URL("../public/templates/me-md-prompts.md", import.meta.url), "utf8").replace(/\r\n?/g, "\n");
  assert.ok(prompts.includes(MAKE_ME_PROMPT.trim()), "prompt 1 in me-md-prompts.md drifted from src/lib/me-prompts.ts");
  const skill = fs.readFileSync(new URL("../../catalogue-items/general/me-md-from-ai-memory/SKILL.md", import.meta.url), "utf8").replace(/\r\n?/g, "\n");
  assert.ok(skill.includes(MAKE_ME_PROMPT.trim()), "the prompt item drifted from src/lib/me-prompts.ts");
  const page = fs.readFileSync(new URL("../src/content/me-md.html", import.meta.url), "utf8").replace(/\r\n?/g, "\n");
  assert.ok(page.includes(MAKE_ME_PROMPT.trim()), "the /me-md page prompt drifted from src/lib/me-prompts.ts");
});

test("/me-md has one h1 and links the new items and the starter pack", () => {
  const page = fs.readFileSync(new URL("../src/content/me-md.html", import.meta.url), "utf8");
  assert.equal(page.match(/<h1\b/g)?.length, 1);
  for (const href of ["/prompts/me-md-from-ai-memory", "/skills/me-md-builder", "/skills/me-md-refresher", "/skills/me-md-short-core-writer", "/workflows/make-your-me-md-and-set-it-up-in-every-ai", "/templates/me-md-starter-pack.zip"]) assert.ok(page.includes(`href="${href}"`), href);
});

test("the template parses into every section, and its notes are left out", () => {
  const { sections } = parseMe(fs.readFileSync(new URL("../public/templates/me.md", import.meta.url), "utf8"));
  assert.deepEqual(sections.map(s => s.id), ["core", "work", "projects", "voice", "preferences", "background", "life", "never", "look", "sources"]);
  assert.ok(sections.every(s => !s.body.includes("<!--")));
});

test("the template holds placeholders only, never sample people", () => {
  for (const name of STARTER_FILES) {
    const text = fs.readFileSync(new URL(`../public/templates/${name}`, import.meta.url), "utf8");
    assert.doesNotMatch(text, /Sprout|@[a-z0-9.-]+\.[a-z]{2,}/i, name);
  }
});
