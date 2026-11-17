// The build folder (build-specs/make.mjs): "Download this agent" carries it under build/, so the owner can open it in
// Claude Code and have the agent do the work end to end. BUILD.md is the agent's own; the kit, processes and access
// guides are shared. Train packs and the one-file text never carry it.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync, mkdtempSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildPack, fileUrl, oneFileText, packZip } from "../src/modules/packs/build.ts";
import { readZip } from "../src/modules/packs/zip.ts";
import type { Persona } from "../src/core/types.ts";
import { FIXTURE_JOB_TYPES } from "./fixtures.ts";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const ECOM = JSON.parse(readFileSync(path.join(ROOT, "src", "modules", "directory", "data", "personas-ecommerce.json"), "utf8")) as Persona[];
const ID = "zara-tiktok-ads";
const DIR = path.join(ROOT, "build-specs", "dist", "agents", ID);
const OPTIONS = { version: "2026.11.15", updated: "2026-11-15" };

function folder(dir: string): Record<string, string> {
  const out: Record<string, string> = {};
  const visit = (rel: string) => {
    for (const name of readdirSync(path.join(dir, rel)).sort()) {
      const r = rel ? `${rel}/${name}` : name;
      if (statSync(path.join(dir, r)).isDirectory()) visit(r);
      else out[r] = readFileSync(path.join(dir, r), "utf8").replace(/\r\n/g, "\n");
    }
  };
  visit("");
  return out;
}

test("an agent pack carries its build folder under build/, with BUILD.md its own and the rest shared", { skip: !existsSync(DIR) && "build-specs/dist not built" }, async () => {
  const persona = ECOM.find(p => p.id === ID)!;
  const build = folder(DIR);
  // Run the actual build kit, whose numbers checker has its own relative dependency.
  // Testing only the top-level pack tool would miss an omitted build-kit module.
  const fixture = path.join(mkdtempSync(path.join(tmpdir(), "build-ledger-")), "numbers.json");
  writeFileSync(fixture, JSON.stringify({ figures: [{ id: "orders", value: 10, formula: "7 + 3", unit: "orders", source: "synthetic fixture" }] }));
  const numericOutput = execFileSync(process.execPath, [path.join(DIR, "files/tools/quality/numbers.cjs"), fixture], { encoding: "utf8", windowsHide: true });
  assert.match(numericOutput, /clean/);
  assert.ok(build["files/tools/verify-patch.mjs"]);
  assert.ok(build["files/tools/automation-review.mjs"]);
  for (const name of ["performance-review.mjs", "integration-readback.mjs", "integration-readback-guide.md", "media-delivery.mjs"]) {
    const source = readFileSync(path.join(ROOT, "packs/shared/tools", name), "utf8").replace(/\r\n/g, "\n");
    assert.equal(build[`files/tools/${name}`], source, `${name} build copy matches actual tool source`);
  }
  assert.ok(build["files/AUTOMATION-PRINCIPLES.md"]);
  const pack = await buildPack({ persona, role: null, kit: null, jobTypes: FIXTURE_JOB_TYPES, templates: {}, build, options: { ...OPTIONS, kind: "agent" } });
  const carried = pack.files.filter(f => f.path.startsWith("build/"));
  assert.equal(carried.length, Object.keys(build).length);
  for (const f of carried) assert.equal(f.content, build[f.path.slice("build/".length)], `${f.path} is copied word for word`);
  const own = carried.find(f => f.path === "build/BUILD.md")!;
  assert.equal(own.source, "agent");
  assert.equal(fileUrl(pack, own), `/packs/${ID}/build/BUILD.md`);
  const guard = carried.find(f => f.path === "build/files/agent/guard.mjs")!;
  assert.equal(guard.source, "build");
  assert.equal(fileUrl(pack, guard), "/packs/build/files/agent/guard.mjs");
  assert.match(pack.files.find(f => f.path === "README.md")!.content, /## Run me end to end[\s\S]*build\/BUILD\.md/);
  assert.ok(!/===== FILE: build\//.test(oneFileText(pack, "https://agents.test")), "the one-file text leaves the build folder out");
  const zip = await readZip(await packZip(pack));
  assert.ok(zip.some(e => e.path.endsWith("/build/files/.claude/settings.json")), "the zip has the hooks file, waiting in files/");

  const train = await buildPack({ persona, role: null, kit: null, jobTypes: FIXTURE_JOB_TYPES, templates: {}, build, options: { ...OPTIONS, kind: "train" } });
  assert.ok(!train.files.some(f => f.path.startsWith("build/")), "train packs never carry it");
  assert.ok(!train.files.find(f => f.path === "README.md")!.content.includes("Run me end to end"));
});
