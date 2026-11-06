// Agent packs: the zip writer and reader, the pack builder for both kinds, role kits and the role list.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { crc32, readZip, writeZip, ZipError } from "../src/modules/packs/zip.ts";
import {
  BLOCK_PLACEHOLDERS, SIMPLE_PLACEHOLDERS, buildPack, fileUrl, fillTemplate, filesIndex, frontmatter, lockKey, lockText, nextLockEntry,
  packContentHash, packZip, PackBuildError, validateRoleKit, type PackInput, type RoleKit,
} from "../src/modules/packs/build.ts";
import { PACK_LICENSE, PACK_SCHEMA, TEMPLATE_MARKER } from "../src/modules/packs/format.ts";
import { checkRoleKitJson, getRole, listRoles, personasWithUnknownRole, validateRoles } from "../src/modules/directory/roles.ts";
import type { Persona, PersonaSoul } from "../src/core/types.ts";
import { FIXTURE_JOB_TYPES, LANDING_PAGE, NOVA } from "./fixtures.ts";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const enc = new TextEncoder();
const dec = new TextDecoder();

const SOUL: PersonaSoul = {
  essence: "I am the strategist who asks what you sell before I ask what you rank for.",
  temperament: "I stay calm and curious. I look for the one search that matters, then I ignore the rest.",
  voice: "Plain and warm, with short sentences. I say things like: \"Let's win one search before we chase ten.\"",
  values: ["Pages that answer the question in full", "Using only facts you gave me"],
  quirks: ["I read the top five results before I write a word", "I name every page after the search it must win"],
  pushback: "If the brief is thin, I ask one sharp question instead of guessing.",
  off_hours: "I garden, so I think about pages the way I think about soil.",
};
const PERSONA: Persona = { ...NOVA, profile: { ...NOVA.profile, soul: SOUL } };
const OPTIONS = { version: "2026.11.06", updated: "2026-11-06" };

const KIT: RoleKit = {
  role: {
    id: "seo-specialist", name: "SEO specialist", department: "marketing", summary: "Gets a business's pages found in search.",
    aliases: ["seo", "search", "ranking"], updated: "2026-11-01", review_every_days: 30,
    changelog: [{ date: "2026-10-01", note: "First draft." }, { date: "2026-11-01", note: "Checked every source." }],
  },
  files: {
    "knowledge.md": "# SEO specialist: what I know\n\n## What this role is for\n\nGetting found by buyers [1]. Keep {{this_as_is}}.\n",
    "access.md": "# Tools and access\n\n- Google Search Console: read-only is enough.\n",
    "sources.json": JSON.stringify([{ n: 1, title: "Search Essentials", publisher: "Google", url: "https://developers.google.com/search/docs/essentials", checked: "2026-11-01", supports: "What Google expects from pages." }]),
    "library.json": JSON.stringify([{ slug: "seo-audit-checklist", name: "SEO audit checklist", why: "A first pass over a site." }]),
    "skills/keyword-research/SKILL.md": "---\nname: keyword-research\ndescription: Finds the searches that matter for one page. Use it before you write.\n---\n\n# Keyword research\n\nStart from {{seed_keyword}}.\n",
    "prompts/title-tags.md": "# Title tags for a set of pages\n\n```\nWrite title tags for {{page_list}} for {{business_name}}.\n```\n",
    "workflows/monthly-check.md": "# Monthly search check\n\n1. Export the Search Console report.\n",
    "training/interview.md": "# Interview\n\n1. What do you check first on a new site?\n   Why it matters: shows your order of work.\n",
    "training/test-briefs.md": "# Test briefs\n\n## 1. A thin brief\n\n> Rank us higher.\n\nA great answer must:\n\n- ask what the business sells\n",
  },
};

function build(over: Partial<PackInput> & { kind?: "agent" | "train" } = {}) {
  const { kind = "agent", ...rest } = over;
  return buildPack({ persona: PERSONA, role: null, kit: null, jobTypes: FIXTURE_JOB_TYPES, templates: {}, options: { ...OPTIONS, kind }, ...rest });
}

async function sha(text: string) {
  const d = await crypto.subtle.digest("SHA-256", enc.encode(text));
  return [...new Uint8Array(d)].map(b => b.toString(16).padStart(2, "0")).join("");
}

// ---------- Zip ----------

/** Replaces every copy of one name with another of the same length (local header and central directory). */
function renameInZip(zip: Uint8Array, from: string, to: string): Uint8Array {
  const a = enc.encode(from), b = enc.encode(to);
  assert.equal(a.length, b.length);
  const out = zip.slice();
  let n = 0;
  for (let i = 0; i + a.length <= out.length; i++) if (a.every((x, j) => out[i + j] === x)) { out.set(b, i); n++; }
  assert.ok(n >= 2, `expected ${from} in both headers`);
  return out;
}
const view = (z: Uint8Array) => new DataView(z.buffer, z.byteOffset, z.byteLength);
const centralAt = (z: Uint8Array) => view(z).getUint32(z.length - 22 + 16, true);
const rejectsWith = (p: Promise<unknown>, code: string) => assert.rejects(p, (e: unknown) => e instanceof ZipError && e.code === code ? true : assert.fail(`expected ${code}, got ${e instanceof ZipError ? e.code : String(e)}`));

test("zip: files round-trip with UTF-8 names, store or deflate, and the same bytes every time", async () => {
  assert.equal(crc32(enc.encode("123456789")), 0xcbf43926);
  let seed = 7;
  const noise = new Uint8Array(3000).map(() => (seed = (Math.imul(seed, 1103515245) + 12345) >>> 0) >>> 24);
  const files = [
    { path: "pack/README.md", data: "# Hello\n\n".repeat(200) },
    { path: "pack/café/naïve.md", data: "Bonjour, ça va ?\n" },
    { path: "pack/empty.txt", data: "" },
    { path: "pack/noise.bin", data: noise },
  ];
  const a = await writeZip(files, { date: "2026-11-06" });
  const b = await writeZip(files, { date: "2026-11-06" });
  assert.deepEqual(a, b);
  const back = await readZip(a);
  assert.deepEqual(back.map(e => e.path), files.map(f => f.path));
  assert.equal(dec.decode(back[0].data), files[0].data);
  assert.equal(dec.decode(back[1].data), "Bonjour, ça va ?\n");
  assert.equal(back[2].data.length, 0);
  assert.deepEqual(back[3].data, noise);
  // README deflates; random bytes do not shrink, so they are stored (method 0).
  const v = view(a), cd = centralAt(a);
  assert.equal(v.getUint16(cd + 10, true), 8);
  assert.equal(v.getUint16(cd + 8, true) & 0x0800, 0x0800, "UTF-8 flag set");
  let p = cd;
  for (let i = 0; i < 3; i++) p += 46 + v.getUint16(p + 28, true);
  assert.equal(v.getUint16(p + 10, true), 0);
  await assert.rejects(writeZip([{ path: "../x.md", data: "x" }]), ZipError);
  await assert.rejects(writeZip([{ path: "a.md", data: "x" }, { path: "A.md", data: "y" }]), ZipError);
});

test("zip: the reader rejects unsafe paths, duplicates, encryption, zip64 and broken data", async () => {
  const base = (name: string) => writeZip([{ path: name, data: "safe text, nothing else" }, { path: "other.md", data: "more" }]);
  await rejectsWith(readZip(renameInZip(await base("zz/evil.md"), "zz/evil.md", "../evil.md")), "unsafe_path");
  await rejectsWith(readZip(renameInZip(await base("xetc.md"), "xetc.md", "/etc.md")), "unsafe_path");
  await rejectsWith(readZip(renameInZip(await base("Cxdrive.md"), "Cxdrive.md", "C:drive.md")), "unsafe_path");
  await rejectsWith(readZip(renameInZip(await base("a_b.md"), "a_b.md", "a\\b.md")), "unsafe_path");
  await rejectsWith(readZip(renameInZip(await base("dupe2.md"), "dupe2.md", "OTHER.md")), "duplicate_name");
  await rejectsWith(readZip(renameInZip(await base("dupe1.md"), "dupe1.md", "other.md")), "duplicate_name");

  const ok = await base("fine.md");
  const encrypted = ok.slice();
  view(encrypted).setUint16(centralAt(encrypted) + 8, 0x0801, true);
  await rejectsWith(readZip(encrypted), "encrypted");
  const zip64 = ok.slice();
  view(zip64).setUint32(centralAt(zip64) + 24, 0xffffffff, true);
  await rejectsWith(readZip(zip64), "zip64");
  const badCrc = ok.slice();
  view(badCrc).setUint32(centralAt(badCrc) + 16, 1234, true);
  await rejectsWith(readZip(badCrc), "corrupt");
  await rejectsWith(readZip(enc.encode("this is not a zip file at all, just text")), "not_a_zip");

  // A file that unzips to more than it claims stops early (zip bomb guard).
  const bomb = await writeZip([{ path: "big.md", data: "a".repeat(50_000) }]);
  view(bomb).setUint32(centralAt(bomb) + 24, 100, true);
  await rejectsWith(readZip(bomb), "corrupt");
});

test("zip: the reader enforces its limits on entries, total size and file size", async () => {
  const zip = await writeZip([{ path: "a.md", data: "x".repeat(5000) }, { path: "b.md", data: "y".repeat(5000) }]);
  await rejectsWith(readZip(zip, { maxEntries: 1, maxTotalBytes: 1e6 }), "too_many_entries");
  await rejectsWith(readZip(zip, { maxEntries: 10, maxTotalBytes: 8000 }), "too_large");
  await rejectsWith(readZip(zip, { maxEntries: 10, maxTotalBytes: 1e6, maxEntryBytes: 4000 }), "entry_too_large");
  assert.equal((await readZip(zip, { maxEntries: 2, maxTotalBytes: 10_000, maxEntryBytes: 5000 })).length, 2);
});

// ---------- Builder: agent pack ----------

test("agent pack: files in order, soul and personality from the persona, one job skill per linked job, a true manifest", async () => {
  const pack = await build();
  assert.equal(pack.folder, "nova-seo");
  assert.deepEqual(pack.files.map(f => f.path), [
    "README.md", "AGENTS.md", "CLAUDE.md", "soul.md", "personality.md", "playbook.md", "knowledge.md", "access.md",
    "skills.md", "skills/landing-page-copy/SKILL.md", "skills/seo-blog-post/SKILL.md", "LICENSE.md", "CHANGELOG.md", "pack.json",
  ]);
  const file = (p: string) => pack.files.find(f => f.path === p)!.content;
  assert.equal(file("CLAUDE.md"), "@AGENTS.md\n");
  // soul.md has the training template's headings; the voice ("How I talk") is in personality.md.
  assert.match(file("soul.md"), /^# Nova, SEO strategist\n\n## Who I am\n\nI am the strategist who asks what you sell/);
  assert.match(file("soul.md"), /## When we disagree/);
  assert.doesNotMatch(file("soul.md"), /How I talk|Let's win one search/);
  assert.match(file("personality.md"), /## How I talk\n\nPlain and warm, with short sentences\. I say things like:\n\n> Let's win one search before we chase ten\./);
  assert.doesNotMatch(file("personality.md"), /## Tone/, "no style sections without profile.style");
  assert.match(file("personality.md"), /## Writing rules I always follow/);
  assert.match(file("playbook.md"), /## How I work\n\n1\. Read the brief/);
  assert.match(file("playbook.md"), /### Landing page copy\n\n- What are you selling\?/);
  assert.match(file("playbook.md"), /Every section leads to the one action/);
  assert.match(file("knowledge.md"), /researched knowledge for this role is coming/);
  assert.match(file("knowledge.md"), /## My specialty\n\nWhat I work with:\n\n- Search intent mapping/);
  for (const f of pack.files) {
    assert.ok(f.content.endsWith("\n") && !f.content.endsWith("\n\n"), `${f.path} ends with one newline`);
    assert.ok(!f.content.includes("\r"), `${f.path} has LF endings`);
    assert.doesNotMatch(f.content, /\{\{[a-z_]+\}\}/, `${f.path} has no unfilled placeholder`);
  }
  for (const id of ["landing-page-copy", "seo-blog-post"]) {
    const fm = frontmatter(file(`skills/${id}/SKILL.md`))!;
    assert.equal(fm.name, id);
    assert.ok(fm.description.length > 20 && fm.description.length <= 1024);
  }
  assert.match(file("skills/landing-page-copy/SKILL.md"), /must pass/);

  const manifest = JSON.parse(file("pack.json"));
  assert.equal(manifest.schema, PACK_SCHEMA);
  assert.equal(manifest.kind, "agent");
  assert.equal(manifest.agent_id, "nova-seo");
  assert.equal(manifest.role, null);
  assert.equal(manifest.version, "2026.11.06");
  assert.equal(manifest.source, "https://agents.useaiblocks.com/agents/nova-seo");
  assert.equal(manifest.license, "LicenseRef-AI-Blocks-Pack-1.0");
  assert.deepEqual(manifest.job_types, ["seo-blog-post", "landing-page-copy"]);
  assert.deepEqual(manifest.knowledge, { status: "pending", updated: null, sources: 0, review_every_days: null });
  assert.equal(manifest.files.length, pack.files.length - 1);
  for (const m of manifest.files) {
    const f = pack.files.find(x => x.path === m.path)!;
    assert.equal(m.bytes, enc.encode(f.content).length);
    assert.equal(m.sha256, await sha(f.content));
  }
  const index = filesIndex(pack);
  assert.equal(index.files.length, pack.files.length);
  assert.ok(index.files.every(f => f.purpose.length > 5 && f.bytes > 0 && f.kind));
});

test("agent pack: a persona without a soul still gets soul.md, and style sections appear when the persona has them", async () => {
  const plain = await build({ persona: NOVA });
  const soul = plain.files.find(f => f.path === "soul.md")!.content;
  assert.match(soul, /^# Nova, SEO strategist\n\n## Who I am\n\nGets your pages found/);
  assert.match(soul, /I find what your buyers type into Google/);
  const styled = await build({ persona: { ...PERSONA, profile: { ...PERSONA.profile, style: {
    tone: "Warm and direct.", sentences: "Short.", formatting: "Headings, then a table.", signature_moves: ["I start with the search"],
    words_i_use: ["search"], words_i_avoid: ["hack"], sample_opening: "Thanks for the brief.", sample_feedback: "That will not rank, and here is why.",
  } } } });
  const personality = styled.files.find(f => f.path === "personality.md")!.content;
  // The training template's headings, in its order (packs/shared/train/personality.md).
  const headings = ["## How I talk", "## Tone", "## Sentences", "## How I lay out work", "## Signature moves", "## Words I use", "## Words I avoid", "## How I open with a new client", "## How I give hard feedback"];
  for (const h of headings) assert.ok(personality.includes(`\n${h}\n`), h);
  assert.deepEqual(headings.map(h => personality.indexOf(`\n${h}\n`)), headings.map(h => personality.indexOf(`\n${h}\n`)).sort((a, b) => a - b));
});

// ---------- Builder: training pack ----------

test("training pack: no persona soul, style, bio or look; template soul and personality; training files; public briefs only", async () => {
  const pack = await build({ kind: "train", role: getRole("seo-specialist") });
  assert.equal(pack.folder, "seo-specialist-agent");
  const paths = pack.files.map(f => f.path);
  for (const p of ["README.md", "AGENTS.md", "CLAUDE.md", "instructions.md", "soul.md", "personality.md", "playbook.md", "knowledge.md", "access.md",
    "training/interview.md", "training/test-briefs.md", "training/scorecard.md", "examples/README.md", "LICENSE.md", "CHANGELOG.md", "pack.json"]) {
    assert.ok(paths.includes(p), p);
  }
  const file = (p: string) => pack.files.find(f => f.path === p)!.content;
  assert.ok(file("soul.md").startsWith(`${TEMPLATE_MARKER}\n`));
  assert.ok(file("personality.md").startsWith(`${TEMPLATE_MARKER}\n`));
  const all = pack.files.map(f => f.content).join("\n");
  for (const secret of [SOUL.essence, SOUL.off_hours, NOVA.profile.bio, NOVA.profile.look, "Let's win one search"]) assert.ok(!all.includes(secret), `leaked: ${secret}`);
  for (const b of LANDING_PAGE.sample_briefs.filter(s => s.visibility === "hidden")) assert.ok(!all.includes(b.text), "hidden brief leaked");
  assert.match(file("training/test-briefs.md"), /scheduling app for dog groomers/);
  assert.match(file("playbook.md"), /> Base method: make it yours\./);
  assert.match(file("playbook.md"), /## Rules I learned\n\nRules come from test rounds/);
  assert.match(file("training/scorecard.md"), /\| Check \| Weight \| Must pass \| How to decide \|/);
  assert.match(file("knowledge.md"), /## My specialty/);
  assert.doesNotMatch(file("knowledge.md"), /Search intent mapping/, "persona capabilities stay out of the training pack");
  const manifest = JSON.parse(file("pack.json"));
  assert.equal(manifest.kind, "train");
  assert.equal(manifest.role, "seo-specialist");
  // A persona with no role gets a folder named after its title.
  assert.equal((await build({ kind: "train" })).folder, "seo-strategist-agent");
});

// ---------- Role kits ----------

test("role kit: knowledge ready, kit files copied as they are, user placeholders untouched, sources and library listed", async () => {
  const role = getRole("seo-specialist")!;
  const persona = { ...PERSONA, role: "seo-specialist" };
  const pack = await build({ persona, role, kit: KIT });
  const file = (p: string) => pack.files.find(f => f.path === p)?.content;
  assert.ok(file("knowledge.md")!.startsWith("# SEO specialist: what I know"));
  assert.match(file("knowledge.md")!, /Keep \{\{this_as_is\}\}\./);
  assert.match(file("knowledge.md")!, /## My specialty/);
  assert.equal(file("prompts/title-tags.md"), KIT.files["prompts/title-tags.md"]);
  assert.equal(file("skills/keyword-research/SKILL.md"), KIT.files["skills/keyword-research/SKILL.md"]);
  assert.equal(file("workflows/monthly-check.md"), KIT.files["workflows/monthly-check.md"]);
  assert.equal(file("access.md"), KIT.files["access.md"]);
  assert.match(file("library.md")!, /\[SEO audit checklist\]\(https:\/\/useaiblocks\.com\/skills\/seo-audit-checklist\): A first pass/);
  assert.match(file("sources.md")!, /1\. \[Search Essentials\]\(https:\/\/developers\.google\.com\/search\/docs\/essentials\), Google\. Checked 2026-11-01\./);
  assert.match(file("CHANGELOG.md")!, /## Role kit: SEO specialist\n\n- 2026-11-01: Checked every source\.\n- 2026-10-01: First draft\./);
  assert.deepEqual(pack.files.map(f => f.path).filter(p => p.startsWith("skills/")), ["skills/keyword-research/SKILL.md", "skills/landing-page-copy/SKILL.md", "skills/seo-blog-post/SKILL.md"]);
  assert.match(file("AGENTS.md")!, /`prompts\/title-tags\.md`: Title tags for a set of pages/);
  const manifest = JSON.parse(file("pack.json")!);
  assert.deepEqual(manifest.knowledge, { status: "ready", updated: "2026-11-01", sources: 1, review_every_days: 30 });
  // skills.md: every SKILL.md in one file for chat apps, frontmatter turned into a quote, headings nested.
  const bundle = file("skills.md")!;
  assert.deepEqual([...bundle.matchAll(/^## (.+)$/gm)].map(m => m[1]), ["keyword-research", "landing-page-copy", "seo-blog-post"]);
  assert.match(bundle, /## keyword-research\n\n> Finds the searches that matter for one page\. Use it before you write\.\n\n### Keyword research\n\nStart from \{\{seed_keyword\}\}\./);
  assert.doesNotMatch(bundle, /^---$|^name: /m);
  assert.match(bundle, /#### What you deliver/);
  assert.equal(manifest.role, "seo-specialist");

  const train = await build({ kind: "train", persona, role, kit: KIT });
  assert.equal(train.files.find(f => f.path === "training/interview.md")!.content, KIT.files["training/interview.md"]);
  assert.equal(train.files.find(f => f.path === "training/test-briefs.md")!.content, KIT.files["training/test-briefs.md"]);

  assert.deepEqual(validateRoleKit(KIT), { errors: [], warnings: [] });
  const broken: RoleKit = { ...KIT, files: { ...KIT.files, "skills/keyword-research/SKILL.md": "---\nname: keywords\ndescription: x\n---\n", "notes.md": "scratch" } };
  const checked = validateRoleKit(broken);
  assert.ok(checked.errors.some(e => /frontmatter name "keywords" must equal its folder "keyword-research"/.test(e)), checked.errors.join("; "));
  assert.ok(checked.warnings.some(w => /notes\.md: not part of the kit layout/.test(w)));
  // A role skill named like a linked job type keeps its name; the job skill moves to <job-type-id>-job.
  const roleSkill = "---\nname: landing-page-copy\ndescription: My researched way to write a landing page.\n---\n\n# Landing page copy\n";
  const clash = await build({ persona, role, kit: { ...KIT, files: { ...KIT.files, "skills/landing-page-copy/SKILL.md": roleSkill } } });
  assert.equal(clash.files.find(f => f.path === "skills/landing-page-copy/SKILL.md")!.content, roleSkill);
  assert.equal(frontmatter(clash.files.find(f => f.path === "skills/landing-page-copy-job/SKILL.md")!.content)!.name, "landing-page-copy-job");
  assert.equal(clash.notes.length, 1);
  assert.equal(clash.manifest.job_types.includes("landing-page-copy"), true);
  const noRoom = { ...KIT, files: { ...KIT.files, "skills/landing-page-copy/SKILL.md": roleSkill, "skills/landing-page-copy-job/SKILL.md": roleSkill.replace("name: landing-page-copy", "name: landing-page-copy-job") } };
  await assert.rejects(build({ persona, role, kit: noRoom }), (e: unknown) => e instanceof PackBuildError && /no free name/.test(e.message));
});

test("licence: every pack is LicenseRef-AI-Blocks-Pack-1.0, and no generated file carries CC BY wording", async () => {
  const role = getRole("seo-specialist")!;
  const persona = { ...PERSONA, role: role.id };
  for (const kind of ["agent", "train"] as const) {
    for (const pack of [await build({ kind }), await build({ kind, persona, role, kit: KIT })]) {
      assert.equal(pack.manifest.license, PACK_LICENSE);
      assert.equal(JSON.parse(pack.files.find(f => f.path === "pack.json")!.content).license, "LicenseRef-AI-Blocks-Pack-1.0");
      for (const f of pack.files) assert.doesNotMatch(f.content, /CC[ -]BY|creativecommons|Creative Commons/i, `${kind} ${f.path}`);
      assert.match(pack.files.find(f => f.path === "LICENSE.md")!.content, /not sell/);
    }
  }
  // The real licence text, when the template exists, is copied as it is.
  const custom = await build({ templates: { "LICENSE.md": "# AI Blocks Agent Pack Licence 1.0\n\nFull text for {{name}}.\n" } });
  assert.equal(custom.files.find(f => f.path === "LICENSE.md")!.content, "# AI Blocks Agent Pack Licence 1.0\n\nFull text for Nova.\n");
});

// ---------- Templates ----------

test("templates: only the listed placeholders are filled, and any other {{...}} fails the build with the template's name", async () => {
  const values = Object.fromEntries([...SIMPLE_PLACEHOLDERS, ...BLOCK_PLACEHOLDERS].map(k => [k, `<${k}>`])) as Parameters<typeof fillTemplate>[2];
  assert.equal(fillTemplate("README.md", "Hi {{name}}, {{title}}.\n{{files_table}}", values), "Hi <name>, <title>.\n<files_table>");
  assert.throws(() => fillTemplate("README.md", "Hi {{nmae}}", values), /packs\/shared\/README\.md uses \{\{nmae\}\}/);
  assert.throws(() => fillTemplate("AGENTS.md", "Hi {{ name }}", values), /\{\{ name \}\}/);
  assert.throws(() => fillTemplate("AGENTS.md", "{{constructor}}", values), PackBuildError);
  await assert.rejects(build({ templates: { "README.md": "# {{name}}\n\n{{business_name}}\n" } }), (e: unknown) => e instanceof PackBuildError && /README\.md uses \{\{business_name\}\}/.test(e.message));
  // A real template replaces the fallback; values are not re-scanned, so braces inside persona text stay as they are.
  const pack = await build({ templates: { "README.md": "# {{name}}\n\n{{tagline}}\n" }, persona: { ...PERSONA, tagline: "Pages that rank for {{anything}} you sell." } });
  assert.equal(pack.files[0].content, "# Nova\n\nPages that rank for {{anything}} you sell.\n");
  // The training soul template always starts with the template line.
  const train = await build({ kind: "train", templates: { "train/soul.md": "# Soul\n\nFill me in.\n" } });
  assert.ok(train.files.find(f => f.path === "soul.md")!.content.startsWith(`${TEMPLATE_MARKER}\n# Soul`));
});

test("the shared templates in packs/shared use only the known placeholders", () => {
  const dir = path.join(ROOT, "packs", "shared");
  if (!existsSync(dir)) return;
  const values = Object.fromEntries([...SIMPLE_PLACEHOLDERS, ...BLOCK_PLACEHOLDERS].map(k => [k, "x"])) as Parameters<typeof fillTemplate>[2];
  const walk = (rel: string): string[] => readdirSync(path.join(dir, rel)).flatMap(n => statSync(path.join(dir, rel, n)).isDirectory() ? walk(path.join(rel, n)) : [path.join(rel, n)]);
  for (const rel of walk("").filter(r => r.endsWith(".md"))) {
    assert.doesNotThrow(() => fillTemplate(rel, readFileSync(path.join(dir, rel), "utf8"), values), rel);
  }
});

// ---------- Determinism ----------

test("packs are deterministic: same inputs give the same files, sha256 and zip bytes", async () => {
  for (const kind of ["agent", "train"] as const) {
    const a = await build({ kind, role: getRole("seo-specialist"), kit: KIT, persona: { ...PERSONA, role: "seo-specialist" } });
    const b = await build({ kind, role: getRole("seo-specialist"), kit: KIT, persona: { ...PERSONA, role: "seo-specialist" } });
    assert.deepEqual(a, b);
    const za = await packZip(a), zb = await packZip(b);
    assert.deepEqual(za, zb);
    // The zip: the pack's files in order, then byte-identical skill copies in .agents/skills and .claude/skills.
    const back = await readZip(za);
    const skills = a.files.filter(f => f.path.startsWith("skills/"));
    assert.ok(skills.length >= 3);
    const expected = [
      ...a.files.map(f => ({ path: `${a.folder}/${f.path}`, content: f.content })),
      ...[".agents/skills/", ".claude/skills/"].flatMap(m => skills.map(f => ({ path: `${a.folder}/${m}${f.path.slice(7)}`, content: f.content }))),
    ];
    assert.deepEqual(back.map(e => ({ path: e.path, content: dec.decode(e.data) })), expected);
    // The copies stay out of pack.json and files.json (the on-site viewer).
    assert.ok(!a.manifest.files.some(f => f.path.startsWith(".")));
    assert.ok(!filesIndex(a).files.some(f => f.path.startsWith(".")));
  }
  const later = await build({ options: { ...OPTIONS, kind: "agent", version: "2026.11.20", updated: "2026-11-20" } });
  assert.notEqual(later.files.find(f => f.path === "pack.json")!.sha256, (await build()).files.find(f => f.path === "pack.json")!.sha256);
});

// ---------- Versions and public addresses ----------

test("versions: the content hash ignores the version, changes with the content, and the lock keeps or bumps the version", async () => {
  const input = (over: Partial<PackInput> = {}, version = OPTIONS): PackInput =>
    ({ persona: PERSONA, role: null, kit: null, jobTypes: FIXTURE_JOB_TYPES, templates: {}, options: { kind: "agent", ...version }, ...over });
  const h1 = await packContentHash(input());
  assert.match(h1, /^[0-9a-f]{64}$/);
  assert.equal(await packContentHash(input({}, { version: "2027.01.01", updated: "2027-01-01" })), h1, "the version is not part of the hash");
  assert.notEqual(await packContentHash(input({ persona: { ...PERSONA, tagline: "A new tagline for the same agent." } })), h1);
  assert.notEqual(await packContentHash(input({ options: { kind: "train", ...OPTIONS } })), h1);
  const role = getRole("seo-specialist")!, persona = { ...PERSONA, role: role.id };
  const withKit = await packContentHash(input({ persona, role, kit: KIT }));
  // A change only to the kit's changelog (seen in CHANGELOG.md and nowhere else) still bumps the version.
  const newLog = { ...KIT, role: { ...KIT.role, changelog: [...KIT.role.changelog, { date: "2026-11-20", note: "Rechecked the sources." }] } };
  assert.notEqual(await packContentHash(input({ persona, role, kit: newLog })), withKit);

  assert.equal(lockKey("nova-seo", "agent"), "nova-seo");
  assert.equal(lockKey("nova-seo", "train"), "nova-seo-train");
  const first = nextLockEntry(undefined, h1, "2026-11-06");
  assert.deepEqual(first, { hash: h1, version: "2026.11.06", updated: "2026-11-06" });
  assert.equal(nextLockEntry(first, h1, "2026-12-01"), first, "same content keeps its version");
  assert.deepEqual(nextLockEntry(first, "f".repeat(64), "2026-12-01"), { hash: "f".repeat(64), version: "2026.12.01", updated: "2026-12-01" });
  const text = lockText({ "b-agent": first, "a-agent-train": first, "a-agent": first });
  assert.deepEqual(Object.keys(JSON.parse(text)), ["a-agent", "a-agent-train", "b-agent"]);
  assert.ok(text.endsWith("}\n") && text.includes('\n  "a-agent": {\n    "hash"'));
});

test("addresses: role kit files and job skills have one shared url, the agent's own files sit under the agent", async () => {
  const role = getRole("seo-specialist")!;
  const pack = await build({ persona: { ...PERSONA, role: role.id }, role, kit: KIT });
  const url = (p: string) => fileUrl(pack, pack.files.find(f => f.path === p)!);
  assert.equal(url("soul.md"), "/packs/nova-seo/soul.md");
  assert.equal(url("knowledge.md"), "/packs/nova-seo/knowledge.md", "knowledge.md adds the agent's specialty, so it is the agent's own");
  assert.equal(url("skills.md"), "/packs/nova-seo/skills.md");
  assert.equal(url("pack.json"), "/packs/nova-seo/pack.json");
  assert.equal(url("access.md"), "/packs/roles/seo-specialist/access.md");
  assert.equal(url("prompts/title-tags.md"), "/packs/roles/seo-specialist/prompts/title-tags.md");
  assert.equal(url("skills/keyword-research/SKILL.md"), "/packs/roles/seo-specialist/skills/keyword-research/SKILL.md");
  assert.equal(url("sources.md"), "/packs/roles/seo-specialist/sources.md");
  assert.equal(url("library.md"), "/packs/roles/seo-specialist/library.md");
  assert.equal(url("skills/landing-page-copy/SKILL.md"), "/packs/jobs/landing-page-copy/SKILL.md");
  // Shared files really are the same in every pack that points at them.
  const other = await build({ persona: { ...PERSONA, id: "ola-seo", name: "Ola", role: role.id }, role, kit: KIT });
  for (const f of pack.files.filter(x => x.source !== "agent")) {
    assert.equal(other.files.find(x => x.path === f.path)!.content, f.content, f.path);
    assert.equal(fileUrl(other, other.files.find(x => x.path === f.path)!), fileUrl(pack, f));
  }
  // Without a kit, only job skills are shared.
  const plain = await build();
  assert.deepEqual(plain.files.filter(f => f.source !== "agent").map(f => fileUrl(plain, f)), ["/packs/jobs/landing-page-copy/SKILL.md", "/packs/jobs/seo-blog-post/SKILL.md"]);
  const index = filesIndex(pack, { zip: { url: "/packs/nova-seo.zip", bytes: 10, version: "2026.11.06" } });
  assert.equal(index.zip!.url, "/packs/nova-seo.zip");
  assert.deepEqual(index.files.map(f => f.url), pack.files.map(f => fileUrl(pack, f)));
});

// ---------- Roles ----------

test("roles: the canonical list is valid, and role kits must match it", () => {
  const roles = listRoles();
  for (const id of ["seo-specialist", "aeo-geo-specialist", "meta-media-buyer", "google-ads-media-buyer", "conversion-copywriter", "content-marketer", "hr-specialist", "system-architect"]) {
    assert.ok(getRole(id), id);
  }
  assert.equal(getRole("hr-specialist")!.department, "people");
  assert.equal(getRole("system-architect")!.department, "engineering");
  assert.ok(validateRoles(roles).ok);
  const dup = validateRoles([...roles, { ...roles[0], name: "Another name" }]);
  assert.ok(!dup.ok && dup.errors.some(e => /duplicate id seo-specialist/.test(e)));
  const badArea = validateRoles([{ ...roles[0], department: "space" }]);
  assert.ok(!badArea.ok);

  assert.deepEqual(checkRoleKitJson(KIT.role, "seo-specialist"), []);
  assert.ok(checkRoleKitJson({ ...KIT.role, name: "SEO expert" }, "seo-specialist").some(e => /name "SEO expert" must match the role list: "SEO specialist"/.test(e)));
  assert.ok(checkRoleKitJson(KIT.role, "seo").some(e => /must match its folder name "seo"/.test(e)));
  assert.ok(checkRoleKitJson({ ...KIT.role, id: "astronaut" }, "astronaut").some(e => /not in directory\/data\/roles\.json/.test(e)));
  assert.ok(checkRoleKitJson({ ...KIT.role, review_every_days: 7 }, "seo-specialist").length > 0);
  assert.deepEqual(personasWithUnknownRole([{ ...NOVA, role: "astronaut" }, { ...NOVA, id: "b", role: "seo-specialist" }, NOVA]), [{ id: "nova-seo", role: "astronaut" }]);
});

test("ready role kits in packs/roles match the role list", () => {
  const dir = path.join(ROOT, "packs", "roles");
  if (!existsSync(dir)) return;
  for (const folder of readdirSync(dir)) {
    const file = path.join(dir, folder, "role.json");
    if (!existsSync(file) || !existsSync(path.join(dir, folder, "knowledge.md"))) continue; // still being written
    assert.deepEqual(checkRoleKitJson(JSON.parse(readFileSync(file, "utf8")), folder), [], folder);
  }
});
