// tools/check-handover.mjs, the hand-over check every pack carries (WORK-METHOD.md, step 5): it fails on anything
// internal or unfinished a reader would see, and on length far beyond a plain answer.
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { TOOL_FILES, BRAND_TOOLS } from "../src/modules/packs/build.ts";

const TOOL = fileURLToPath(new URL("../packs/shared/tools/check-handover.mjs", import.meta.url));
const dir = mkdtempSync(path.join(tmpdir(), "handover-"));
const put = (name: string, text: string) => { const p = path.join(dir, name); writeFileSync(p, text); return p; };
const run = (...args: string[]) => spawnSync(process.execPath, [TOOL, ...args], { encoding: "utf8" });
const words = (n: number) => Array.from({ length: n }, (_, i) => `word${i}`).join(" ");

test("every pack carries the hand-over check, brand-facing or not", () => {
  assert.ok(TOOL_FILES.some(t => t.name === "check-handover.mjs"));
  assert.ok(!BRAND_TOOLS.has("check-handover.mjs"));
});

test("a clean deliverable near the plain answer's length passes", () => {
  const r = run(put("clean.md", `# Offer\n\n${words(120)}\n\nProposal: confirm before use. Launch on 2 March.\n`), put("plain.md", words(110)));
  assert.equal(r.status, 0, r.stdout); assert.match(r.stdout, /Clean/);
});

test("placeholders, working file names and notes to self fail", () => {
  const r = run(put("leaky.md", "Stores: [INTERNAL: store count]\nSee facts.md for prices.\nStatus: TBD\nInternal note: check with legal\n"));
  assert.equal(r.status, 1);
  for (const what of ["a placeholder", "a working file name", "an unfinished marker", "a note not meant for the reader"]) assert.ok(r.stdout.includes(what), what);
});

test("HTML is checked as a visitor sees it, and note panels fail", () => {
  const ok = run(put("ok.html", `<!doctype html><style>.x{}</style><script>const TODO = 1</script><h1>Try it</h1><p>${words(40)}</p>`));
  assert.equal(ok.status, 0, ok.stdout);
  const bad = run(put("bad.html", `<h1>Try it</h1><aside class="internal-notes"><p class="note">Sources and open questions</p></aside>`));
  assert.equal(bad.status, 1); assert.match(bad.stdout, /looks like an internal note/);
});

test("length: over 1.6 times the plain answer fails, and one page is about 450 words", () => {
  const plain = put("p.md", words(100));
  assert.equal(run(put("long.md", words(200)), plain).status, 1);
  const aim = run(put("mid.md", words(145)), plain);
  assert.equal(aim.status, 0); assert.match(aim.stdout, /over the 1\.3 aim/);
  assert.equal(run(put("page.md", words(600)), "--one-page").status, 1);
});

test("short blanks like [X] and [link] fail, but task boxes and real links pass", () => {
  const bad = run(put("blanks.md", "Holds up to [X] notes.\nSee our roomier wallets. [Link to that range.]\n"));
  assert.equal(bad.status, 1); assert.match(bad.stdout, /a blank to fill "\[X\]"/); assert.match(bad.stdout, /a fill-in blank/);
  const ok = run(put("boxes.md", "- [x] Pixel checked\n- [ ] Survey added\nRead [the policy](https://example.com/policy) first.\n"));
  assert.equal(ok.status, 0, ok.stdout);
});

test("a stock line repeated across variants is noted without failing", () => {
  const line = "Twelve grams of protein in every bar, no added sugar";
  const r = run(put("variants.md", `A. Hook one. ${line}.\nB. Hook two. ${line}.\nC. Hook three. ${line}.\n`));
  assert.equal(r.status, 0, r.stdout); assert.match(r.stdout, /Worth a look/); assert.match(r.stdout, /repeats on 3 lines/);
});

test("homework left for the owner fails: a To confirm box, an ask for a yes, test alternates and editor notes", () => {
  const r = run(put("homework.md", "# Plan\n\n**Subject:** Start small (test: Clear your head)\n\nThe copy never mentions price.\n\n## To confirm\n\n- Your yes before anything goes live.\n"));
  assert.equal(r.status, 1);
  for (const what of ["homework \"To confirm\"", "an ask for the owner's yes", "a test alternate inside a field", "an editor note"]) assert.ok(r.stdout.includes(what), what);
  const options = run(put("options.md", "# Emails\n\n**Subject:** Start small (test: Clear your head)\n"), "--options-requested");
  assert.equal(options.status, 0, options.stdout); assert.match(options.stdout, /Options-requested mode: 1 alternate/);
});
