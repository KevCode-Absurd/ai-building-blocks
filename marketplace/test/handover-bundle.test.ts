import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, cpSync, symlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const TOOL = fileURLToPath(new URL("../packs/shared/tools/check-handover.mjs", import.meta.url));

test("standalone bundle help carries detailed scope, privacy and relocation rules", () => {
  const result = spawnSync(process.execPath, [TOOL, "--bundle-help"], { encoding: "utf8" });
  assert.equal(result.status, 0, result.stdout + result.stderr);
  for (const pattern of [/relocated copy/, /input contract, source locator\/hash/, /Never copy all working context, credentials/, /Creator-only checks are historical/, /does not run delivered code/, /Root-relative \/assets/, /dynamic routes/]) assert.match(result.stdout, pattern);
});
function fixture() {
  const workspace = mkdtempSync(path.join(tmpdir(), "handover-bundle-"));
  const bundle = path.join(workspace, "delivery");
  mkdirSync(bundle);
  const put = (relative: string, content: string) => {
    const file = path.join(bundle, relative);
    mkdirSync(path.dirname(file), { recursive: true });
    writeFileSync(file, content);
    return file;
  };
  return { workspace, bundle, put };
}
const run = (file: string, root?: string) => spawnSync(process.execPath, [TOOL, file, ...(root ? ["--bundle-root", root] : [])], { encoding: "utf8" });
const fails = (result: ReturnType<typeof run>, pattern: RegExp) => {
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(result.stdout, pattern);
};

test("linked Markdown images check both the image and outer destination", () => {
  const f = fixture();
  const entry = f.put("answer.md", "[![Photo](photo.png)](missing-page.html)");
  f.put("photo.png", "photo");
  fails(run(entry, f.bundle), /missing-page\.html/);
});

test("footnote prose is not a file dependency", () => {
  const f = fixture();
  const note = f.put("answer.md", "A finding.[^1]\n\n[^1]: Observed in the supplied fixture.\n");
  assert.equal(run(note, f.bundle).status, 0);
});

test("protocol-relative web destinations are remote, but UNC and root-relative files are rejected", () => {
  const f = fixture();
  const remote = f.put("remote.html", '<h1>Preview</h1><img src="//cdn.example.test/photo.png"><a href="//example.test/item">Item</a>');
  const result = run(remote, f.bundle);
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout, /2 remote\/embedded destinations not fetched/);
  const unc = f.put("unc.html", '<h1>Preview</h1><img src="\\\\server\\share\\photo.png">');
  fails(run(unc, f.bundle), /absolute local path is not portable/);
  f.put("assets/photo.png", "photo");
  const rooted = f.put("rooted.html", '<h1>Preview</h1><img src="/assets/photo.png">');
  fails(run(rooted, f.bundle), /absolute local path is not portable/);
});

test("portable bundle follows Markdown, HTML, CSS, SVG and reproducibility files after relocation", () => {
  const f = fixture();
  f.put("answer.md", "Read [the page](site/index.html) and [reproduce](reproduce/check.py).\n");
  f.put("reproduce/check.py", "print('check')\n");
  f.put("site/index.html", '<link rel="stylesheet" href="style.css"><script src="app.js"></script><img src="../images/ring.svg"><h1>One piece</h1>');
  f.put("site/style.css", '@import "theme.css"; .hero { background:url("../images/photo%20one.png"); }');
  f.put("site/theme.css", "@font-face{font-family:Brand;src:url('../fonts/brand.woff2')}");
  f.put("site/app.js", 'const html = "<img src=not-an-asset.png>";');
  f.put("images/ring.svg", '<svg xmlns="http://www.w3.org/2000/svg"><image href="photo%20one.png"/></svg>');
  f.put("images/photo one.png", "fixture bytes");
  f.put("fonts/brand.woff2", "fixture font");
  const relocated = path.join(f.workspace, "relocated");
  cpSync(f.bundle, relocated, { recursive: true });
  const result = run(path.join(relocated, "answer.md"), relocated);
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout, /Bundle static check: 9 local files/);
  assert.doesNotMatch(result.stdout, /times the plain answer/);
  assert.match(result.stdout, /not JavaScript imports/);
});

test("bundle mode rejects an existing parent-context dependency", () => {
  const f = fixture();
  mkdirSync(path.join(f.workspace, "context"));
  writeFileSync(path.join(f.workspace, "context", "check.py"), "print('outside')");
  const entry = f.put("answer.md", "Read [the reproduction](../context/check.py).");
  fails(run(entry, f.bundle), /bundle:.*leaves the delivered folder/);
});

test("a bundled reproducer and explicit external input contract pass", () => {
  const f = fixture();
  const entry = f.put("answer.md", "Use [the script](reproduce/check.py) with your private source export. Its required fields and source hash are in [input contract](reproduce/inputs.md).");
  f.put("reproduce/check.py", "print('requires user-supplied export')\n");
  f.put("reproduce/inputs.md", "Supply a private JSON export with order_id and integer amount fields. Source snapshot SHA-256: a17c.\n");
  assert.equal(run(entry, f.bundle).status, 0);
});

test("missing linked image and CSS are failures, including nested HTML", () => {
  const f = fixture();
  const entry = f.put("answer.md", "Open [the page](page.html).");
  f.put("page.html", '<h1>A ring</h1><img src="missing.png"><link href="missing.css" rel="stylesheet">');
  const result = run(entry, f.bundle);
  fails(result, /missing or unreadable.*missing\.png/);
  assert.match(result.stdout, /missing or unreadable.*missing\.css/);
});

test("fragments, queries, encoded spaces and reference-style Markdown resolve locally", () => {
  const f = fixture();
  const entry = f.put("answer.md", "See [proof](<proof (final).md#checked>), [image](photo%20one.png?download=1#view) and [details][report].\n\n[report]: <proof (final).md>\n");
  f.put("proof (final).md", "# Checked\n\nRead [this section](#checked).\n");
  f.put("photo one.png", "image fixture");
  const result = run(entry, f.bundle);
  assert.equal(result.status, 0, result.stdout + result.stderr);
});

test("HTML attributes, srcset and inline CSS find missing static dependencies", () => {
  const f = fixture();
  const entry = f.put("page.html", '<h1>A ring</h1><img srcset="small.png 1x, missing-large.png 2x"><div style="background: url(missing-bg.png)"></div><video poster="poster.png"></video>');
  f.put("small.png", "small");
  f.put("poster.png", "poster");
  const result = run(entry, f.bundle);
  fails(result, /missing-large\.png/);
  assert.match(result.stdout, /missing-bg\.png/);
});

test("embedded media and remote destinations are not fetched", () => {
  const f = fixture();
  const entry = f.put("page.html", '<h1>Preview</h1><img src="data:image/png;base64,abc"><a href="https://unresolvable.invalid/item?a=1&amp;b=2">View store</a><a href="#top">Top</a><a href="mailto:hello@example.test">Write</a>');
  const result = run(entry, f.bundle);
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout, /3 remote\/embedded destinations not fetched/);
});

test("absolute local links fail even when the file exists inside the bundle", () => {
  const f = fixture();
  const asset = f.put("photo.png", "photo");
  const entry = f.put("page.html", '<h1>Preview</h1><img src="' + asset.replace(/\\/g, "/") + '">');
  fails(run(entry, f.bundle), /absolute local path is not portable/);
});

test("encoded traversal cannot escape the delivered root", () => {
  const f = fixture();
  writeFileSync(path.join(f.workspace, "external.md"), "External");
  const entry = f.put("answer.md", "Read [proof](%2e%2e/external.md).");
  fails(run(entry, f.bundle), /leaves the delivered folder/);
});

test("HTML base resolution must be made explicit", () => {
  const f = fixture();
  const entry = f.put("page.html", '<base href="https://example.test/"><h1>Preview</h1>');
  fails(run(entry, f.bundle), /base href changes resolution/);
});

test("entry outside the bundle is rejected before reading its text", () => {
  const f = fixture();
  const outside = path.join(f.workspace, "outside.md");
  writeFileSync(outside, "TBD PRIVATE-ENTRY-SENTINEL");
  const result = run(outside, f.bundle);
  fails(result, /entry point: local dependency leaves/);
  assert.doesNotMatch(result.stdout, /PRIVATE-ENTRY-SENTINEL/);
});

test("linked directory escape is rejected, including Windows junctions", t => {
  const f = fixture();
  const outside = path.join(f.workspace, "outside");
  mkdirSync(outside);
  writeFileSync(path.join(outside, "proof.md"), "Proof");
  try { symlinkSync(outside, path.join(f.bundle, "linked"), process.platform === "win32" ? "junction" : "dir"); }
  catch (error: any) {
    if (["EPERM", "EACCES", "ENOSYS"].includes(error.code)) { t.skip("Host does not allow test links: " + error.code); return; }
    throw error;
  }
  const entry = f.put("answer.md", "Read [proof](linked/proof.md).");
  fails(run(entry, f.bundle), /linked file or directory/);
});

test("Markdown code examples and script strings are not static dependencies", () => {
  const f = fixture();
  const entry = f.put("answer.md", "Read the delivered page.\n\n\x60\x60\x60html\n<img src=\"not-present.png\">\n\x60\x60\x60\n\n\x60[sample](not-present.md)\x60\n");
  assert.equal(run(entry, f.bundle).status, 0);
  const html = f.put("page.html", '<h1>Preview</h1><script>const x = "<img src=\'absent.png\'>";</script>');
  assert.equal(run(html, f.bundle).status, 0);
});

test("legacy no-flag behavior does not acquire bundle checks", () => {
  const f = fixture();
  const entry = f.put("answer.md", "Read [the page](missing.html).");
  const result = run(entry);
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.doesNotMatch(result.stdout, /Bundle static check/);
  const invalid = spawnSync(process.execPath, [TOOL, entry, "--bundle-root"], { encoding: "utf8" });
  assert.equal(invalid.status, 2);
  assert.match(invalid.stderr, /needs a value/);
});
