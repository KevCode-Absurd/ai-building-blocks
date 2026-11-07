// Directory UI helpers for agent packs (src/ui/pages/directory/packs.ts): grouping files, path safety for the file
// viewer, where files are fetched from, the knowledge line, sizes and dates, and the guides' titles.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  formatBytes, formatDay, groupPackFiles, hasZips, isAppPath, isPackUrl, kindLabel, knowledgeLine, markdownSummary, markdownTitle,
  normalizeKnowledge, packFileHref, packZips, prettyJson, readFilesJson, safePackPath, splitFrontmatter, viewerHref, fileFormat,
  isStartApp, LARGE_ONE_FILE, packOneFile, startGuides,
  type PackFile,
} from "../src/ui/pages/directory/packs.ts";

const file = (path: string, kind: string): PackFile => ({ path, kind, bytes: 10, purpose: "" });

test("files group by kind in the viewer's order, keeping files.json order inside each group", () => {
  const files = [
    file("README.md", "start"), file("AGENTS.md", "start"), file("soul.md", "identity"), file("playbook.md", "work"),
    file("knowledge.md", "knowledge"), file("access.md", "work"), file("skills/a/SKILL.md", "skill"),
    file("LICENSE.md", "about"), file("odd.md", "mystery"), file("prompts/x.md", "prompt"),
  ];
  const groups = groupPackFiles(files);
  assert.deepEqual(groups.map(g => g.kind), ["start", "identity", "work", "knowledge", "skill", "prompt", "about", "mystery"]);
  assert.deepEqual(groups.find(g => g.kind === "work")!.files.map(f => f.path), ["playbook.md", "access.md"]);
  assert.deepEqual(groups.map(g => g.label), ["Start here", "Personality", "How the work is done", "Knowledge", "Skills", "Prompts", "About this pack", "Other files"]);
  assert.equal(kindLabel("workflow"), "Workflows");
  assert.equal(kindLabel("team"), "Channel team");
  assert.equal(kindLabel("channel"), "Channels");
  assert.deepEqual(groupPackFiles([]), []);
});

test("viewer paths: relative pack paths pass; '..', absolute paths, backslashes and odd characters do not", () => {
  for (const ok of ["README.md", "skills/keyword-intent-map/SKILL.md", "prompts/serp-intent-check.md", "pack.json", "training/test briefs.md"]) {
    assert.equal(safePackPath(ok), ok, ok);
  }
  for (const bad of [
    "", "..", "../secrets.md", "skills/../../x.md", "skills/./x.md", "/etc/passwd", "/packs/x.md", "skills\\x.md", "..\\x.md",
    "C:/x.md", "https://evil.example/x.md", "//evil.example/x.md", "skills//x.md", "skills/", ".claude/skills/x/SKILL.md",
    "%2e%2e/x.md", "x.md\u0000", "line\nbreak.md", "a".repeat(301), "trailing /x.md",
  ]) {
    assert.equal(safePackPath(bad), null, JSON.stringify(bad));
  }
  assert.equal(safePackPath(undefined), null);
  assert.equal(safePackPath(null), null);
});

test("files are fetched from their url when it is a safe /packs/ path, else from /packs/<id>/<path>", () => {
  assert.equal(packFileHref("danielle-seo", { path: "skills/a b/SKILL.md" }), "/packs/danielle-seo/skills/a%20b/SKILL.md");
  assert.equal(packFileHref("danielle-seo", { path: "knowledge.md", url: "/packs/roles/seo-specialist/knowledge.md" }), "/packs/roles/seo-specialist/knowledge.md");
  for (const url of ["https://evil.example/x.md", "//evil.example/x.md", "/packs/../api/me", "/packs/%2e%2e/x.md", "/api/me", "/packs/x\\y.md", "javascript:alert(1)", "/packs/x.md?y=1", "/packs//x.md"]) {
    assert.equal(isPackUrl(url), false, url);
    assert.equal(packFileHref("nova", { path: "x.md", url }), "/packs/nova/x.md", url);
  }
  assert.equal(viewerHref("nova-seo", "skills/seo-blog-post/SKILL.md"), "/agents/nova-seo/files/skills/seo-blog-post/SKILL.md");
});

test("files.json is read defensively: unsafe paths are dropped and both knowledge shapes work", () => {
  const read = readFilesJson({
    agent_id: "nova", version: "2026.11.06", updated: "2026-11-06",
    knowledge: { status: "ready", updated: "2026-11-02", sources: 24, review_every_days: 14 },
    files: [
      { path: "README.md", bytes: 100, purpose: "Start here", kind: "start" },
      { path: "../x.md", bytes: 1, purpose: "", kind: "start" },
      { path: "knowledge.md", bytes: 5, purpose: "", kind: "knowledge", url: "https://evil.example/k.md" },
      { path: "access.md", bytes: 5, purpose: "", kind: "work", url: "/packs/roles/seo-specialist/access.md" },
      "nonsense",
    ],
  })!;
  assert.deepEqual(read.files.map(f => f.path), ["README.md", "knowledge.md", "access.md"]);
  assert.equal(read.files[1].url, undefined, "an off-site url is dropped");
  assert.equal(read.files[2].url, "/packs/roles/seo-specialist/access.md");
  assert.deepEqual(read.knowledge, { status: "ready", updated: "2026-11-02", sources: 24, review_every_days: 14 });
  assert.equal(readFilesJson("<!doctype html>"), null);
  assert.equal(readFilesJson({ files: "no" }), null);
  assert.deepEqual(normalizeKnowledge("pending"), { status: "pending", updated: null, sources: null, review_every_days: null });
  assert.equal(normalizeKnowledge({ status: "beta" }), null);
  assert.equal(normalizeKnowledge({ status: "ready", updated: "yesterday" })!.updated, null);
});

test("the knowledge line names the date and source count, or says the research is under way", () => {
  assert.equal(knowledgeLine({ status: "ready", updated: "2026-11-06", sources: 24, review_every_days: 14 }), "Role knowledge checked 6 Nov 2026 from 24 sources");
  assert.equal(knowledgeLine({ status: "ready", updated: "2026-01-31", sources: 1, review_every_days: null }), "Role knowledge checked 31 Jan 2026 from 1 source");
  assert.equal(knowledgeLine({ status: "pending", updated: null, sources: 0, review_every_days: null }), "Role knowledge is being researched");
  assert.equal(knowledgeLine(normalizeKnowledge("ready")), "Role knowledge researched from public sources");
  assert.equal(knowledgeLine(null), null);
  for (const line of [knowledgeLine(normalizeKnowledge("pending")), knowledgeLine(normalizeKnowledge("ready"))]) assert.doesNotMatch(line!, /beta|soon|free during/i);
});

test("dates, sizes and zips", () => {
  assert.equal(formatDay("2026-11-06"), "6 Nov 2026");
  assert.equal(formatDay("2026-02-30"), null);
  assert.equal(formatDay("6 Nov"), null);
  assert.equal(formatBytes(117407), "115 KB");
  assert.equal(formatBytes(900), "900 bytes");
  assert.equal(formatBytes(1), "1 byte");
  assert.equal(formatBytes(2.5 * 1024 * 1024), "2.5 MB");
  assert.equal(formatBytes(null), null);
  assert.deepEqual(packZips("nova-seo", { agent_zip: { path: "/packs/nova-seo.zip", bytes: 117407 }, train_zip: { path: "https://evil.example/t.zip", bytes: 5 } }), {
    agentZip: { path: "/packs/nova-seo.zip", bytes: 117407 },
    trainZip: { path: "/packs/nova-seo-train.zip", bytes: 5 },
  });
  assert.deepEqual(packZips("nova-seo", null), { agentZip: { path: "/packs/nova-seo.zip", bytes: null }, trainZip: { path: "/packs/nova-seo-train.zip", bytes: null } });
  // files.json names them { zip, train_zip } with a url; it wins over index.json.
  const fromFiles = { zip: { url: "/packs/nova-seo.zip", bytes: 1000, version: "2026.11.06" }, train_zip: { url: "/packs/nova-seo-train.zip", bytes: 2000 } };
  assert.equal(hasZips(fromFiles), true);
  assert.equal(hasZips({ zip: { url: "/packs/nova-seo.zip" } }), false);
  assert.equal(hasZips("<html>"), false);
  assert.deepEqual(packZips("nova-seo", fromFiles, { agent_zip: { path: "/packs/nova-seo.zip", bytes: 9 } }), {
    agentZip: { path: "/packs/nova-seo.zip", bytes: 1000 }, trainZip: { path: "/packs/nova-seo-train.zip", bytes: 2000 },
  });
  assert.deepEqual(packZips("nova-seo", {}, { agent_zip: { path: "/packs/nova-seo.zip", bytes: 9 } }).agentZip, { path: "/packs/nova-seo.zip", bytes: 9 });
});

test("file formats, JSON and skill frontmatter", () => {
  assert.equal(fileFormat("skills/x/SKILL.md"), "markdown");
  assert.equal(fileFormat("pack.json"), "json");
  assert.equal(fileFormat("data.csv"), "text");
  assert.equal(prettyJson('{"a":1}'), '{\n  "a": 1\n}');
  assert.equal(prettyJson("not json"), "not json");
  const skill = splitFrontmatter("---\nname: seo-blog-post\ndescription: Writes one article.\n---\n# SEO blog post\n\nBody");
  assert.equal(skill.meta, "name: seo-blog-post\ndescription: Writes one article.");
  assert.equal(skill.body, "# SEO blog post\n\nBody");
  assert.deepEqual(splitFrontmatter("# Title\n\n---\n\nText"), { meta: null, body: "# Title\n\n---\n\nText" });
});

test("only the app's own pages stay in the app; files, downloads and the Worker's addresses load normally", () => {
  for (const p of ["/guides", "/guides/use-an-agent-pack", "/agents", "/agents/nova-seo", "/agents/nova-seo/files/README.md", "/agents/nova-seo/files/skills/x/SKILL.md", "/new"]) assert.equal(isAppPath(p), true, p);
  for (const p of ["/packs/nova-seo.zip", "/packs/nova-seo/README.md", "/agents/nova-seo/soul.md", "/api/agents", "/mcp", "/oauth/authorize", "/.well-known/x", "/favicon.svg"]) assert.equal(isAppPath(p), false, p);
});

test("both guides have a title and a summary for the guides page", () => {
  for (const slug of ["train-your-own-agent", "use-an-agent-pack"]) {
    const md = readFileSync(new URL(`../src/ui/content/guides/${slug}.md`, import.meta.url), "utf8");
    assert.ok(markdownTitle(md), slug);
    const summary = markdownSummary(md);
    assert.ok(summary.length > 40, slug);
    assert.doesNotMatch(summary, /[*`[\]]/, slug);
  }
  assert.equal(markdownTitle("Intro\n\n# Real title ##\n"), "Real title");
  assert.equal(markdownSummary("# T\n\nSee [the guide](/guides/x) and **this**.\nSecond line.\n\nNext para"), "See the guide and this. Second line.");
});

test("the one-file version is read only from a safe same-site .txt address", () => {
  assert.deepEqual(packOneFile({ one_file: { url: "/packs/nova-seo.txt", bytes: 130000 } }), { path: "/packs/nova-seo.txt", bytes: 130000 });
  assert.deepEqual(packOneFile(null, { one_file: { url: "/packs/nova-seo.txt", bytes: -1 } }), { path: "/packs/nova-seo.txt", bytes: null });
  assert.equal(packOneFile({ one_file: { url: "https://evil.example/nova.txt", bytes: 1 } }), null);
  assert.equal(packOneFile({ one_file: { url: "/packs/nova-seo.zip", bytes: 1 } }), null);
  assert.equal(packOneFile({}, null), null);
});

test("Start in your AI: a tab per app, each with a first message that needs no editing", () => {
  const agent = { id: "danielle-seo", name: "Danielle", title: "SEO strategist" };
  const guides = startGuides(agent, 130000);
  assert.deepEqual(guides.map(g => g.id), ["chatgpt", "claude", "gemini", "coding", "connector"]);
  for (const g of guides) {
    assert.ok(isStartApp(g.id), g.id);
    assert.match(g.message, /Danielle/, g.id);
    assert.doesNotMatch(g.message, /\[|\]/, `${g.id}: nothing to fill in`);
    assert.match(g.message, /ask what I need help with\.$/, g.id);
  }
  assert.deepEqual(guides.map(g => g.get), ["file", "file", "file", "folder", "connect"]);
  assert.match(guides[3].message, /^Read AGENTS\.md/);
  assert.match(guides[4].message, /danielle-seo/, "the connector loads the agent by its id");
  assert.match(guides[1].open, /new chat/);
  const big = startGuides(agent, LARGE_ONE_FILE + 1).find(g => g.id === "claude")!;
  assert.match(big.open, /project/, "a file too long for one Claude chat goes in a project");
  assert.match(big.message, /file in this project/);
  assert.equal(isStartApp("copilot"), false);
});
