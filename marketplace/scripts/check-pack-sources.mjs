// Checks every source URL behind the role kits (packs/roles/*/sources.json): the cheap first step of the knowledge
// refresh (see ARCHITECTURE.md, "Agent packs"). It fetches each URL once, politely (4 at a time, a timeout, a plain
// User-Agent that names AI Blocks), does not follow redirects, and reports anything that is not a plain 200: errors,
// timeouts, 4xx/5xx and redirects (with where they go). It writes packs/sources-report.json.
//
//   node scripts/check-pack-sources.mjs [--roles=seo-specialist,hr-specialist] [--out=packs/sources-report.json] [--timeout=20000]
// Exit code 0 even when some sources fail: the report is the result. Exit 1 only when a sources.json cannot be read.
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = Object.fromEntries(process.argv.slice(2).map(a => { const m = /^--([a-z]+)(?:=(.*))?$/.exec(a); return m ? [m[1], m[2] ?? "true"] : [a, "true"]; }));
const OUT = path.resolve(ROOT, args.out ?? "packs/sources-report.json");
const TIMEOUT_MS = Number(args.timeout ?? 20_000);
const CONCURRENCY = 4;
const USER_AGENT = "AI-Blocks-source-checker/1.0 (+https://agents.useaiblocks.com; checks that cited pages still exist)";
const only = args.roles ? new Set(args.roles.split(",").map(s => s.trim()).filter(Boolean)) : null;

const rolesDir = path.join(ROOT, "packs", "roles");
const sources = []; // { role, n, title, url, checked }
const problems = [];
for (const role of existsSync(rolesDir) ? readdirSync(rolesDir).sort() : []) {
  if (only && !only.has(role)) continue;
  const file = path.join(rolesDir, role, "sources.json");
  if (!statSync(path.join(rolesDir, role)).isDirectory() || !existsSync(file)) continue;
  let rows;
  try { rows = JSON.parse(readFileSync(file, "utf8").replace(/^\uFEFF/, "")); } catch { problems.push(`packs/roles/${role}/sources.json is not valid JSON`); continue; }
  if (!Array.isArray(rows)) { problems.push(`packs/roles/${role}/sources.json must be a list`); continue; }
  for (const r of rows) if (r && typeof r.url === "string") sources.push({ role, n: r.n ?? null, title: r.title ?? "", url: r.url, checked: r.checked ?? null });
}
if (problems.length) {
  console.error(`check-pack-sources: ${problems.join("; ")}`);
  process.exit(1);
}

/** A redirect that only adds or drops a trailing slash or a language choice (hl=) lands on the same page. */
function samePageRedirect(from, to) {
  const norm = u => {
    const x = new URL(u);
    x.searchParams.delete("hl");
    x.hash = "";
    return `${x.protocol}//${x.host.toLowerCase()}${x.pathname.replace(/\/+$/, "")}${x.searchParams.size ? `?${x.searchParams}` : ""}`;
  };
  try { return norm(from) === norm(to); } catch { return false; }
}

/**
 * One request per URL: GET without following redirects, body discarded. kind: ok, same_page (a trailing-slash or
 * language redirect), moved (any other redirect: update the URL after checking the new page is the same content),
 * dead (404 or 410: replace the source), failed (other statuses, often a site that blocks automated checks: open it
 * by hand), error (timeout, DNS or connection problem).
 */
async function check(url) {
  const started = Date.now();
  if (!/^https?:\/\//i.test(url)) return { status: null, ok: false, error: "not an http(s) URL", ms: 0 };
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: "GET",
      redirect: "manual",
      signal: controller.signal,
      // English, so sites that pick a language from the request (Google's docs add ?hl=) answer for the cited page.
      headers: { "user-agent": USER_AGENT, accept: "text/html,application/xhtml+xml,application/pdf;q=0.9,*/*;q=0.8", "accept-language": "en-US,en;q=0.9" },
    });
    await res.body?.cancel().catch(() => {});
    const location = res.headers.get("location");
    const redirectTo = res.status >= 300 && res.status < 400 && location ? new URL(location, url).href : null;
    const samePage = redirectTo !== null && samePageRedirect(url, redirectTo);
    return {
      status: res.status,
      ok: res.status === 200 || samePage,
      kind: res.status === 200 ? "ok" : samePage ? "same_page" : res.status >= 300 && res.status < 400 ? "moved" : res.status === 404 || res.status === 410 ? "dead" : "failed",
      ...(res.status >= 300 && res.status < 400 ? { redirect_to: redirectTo } : {}),
      ms: Date.now() - started,
    };
  } catch (err) {
    const error = controller.signal.aborted ? `timed out after ${TIMEOUT_MS} ms` : (err?.cause?.code ?? err?.message ?? String(err));
    return { status: null, ok: false, kind: "error", error, ms: Date.now() - started };
  } finally {
    clearTimeout(timer);
  }
}

const unique = [...new Set(sources.map(s => s.url))];
const results = new Map();
let next = 0;
await Promise.all(Array.from({ length: Math.min(CONCURRENCY, unique.length) }, async () => {
  while (next < unique.length) {
    const url = unique[next++];
    results.set(url, await check(url));
  }
}));

const rows = sources.map(s => ({ ...s, ...results.get(s.url) }));
const notOk = rows.filter(r => !r.ok);
const report = {
  schema: "ai-blocks-sources-report/1",
  checked_at: new Date().toISOString(),
  user_agent: USER_AGENT,
  roles: [...new Set(sources.map(s => s.role))],
  sources: rows.length,
  unique_urls: unique.length,
  ok: rows.filter(r => r.kind === "ok").length,
  same_page: rows.filter(r => r.kind === "same_page").length,
  moved: rows.filter(r => r.kind === "moved").length,
  dead: rows.filter(r => r.kind === "dead").length,
  failed: rows.filter(r => r.kind === "failed").length,
  errors: rows.filter(r => r.kind === "error").length,
  problems: notOk,
  results: rows,
};
writeFileSync(OUT, `${JSON.stringify(report, null, 2)}\n`);

for (const r of notOk) {
  const what = r.status === null ? r.error : r.redirect_to !== undefined ? `${r.status} -> ${r.redirect_to ?? "(no location)"}` : String(r.status);
  console.log(`  ${r.kind.padEnd(6)} ${r.role} [${r.n}] ${r.url}: ${what}`);
}
console.log(`check-pack-sources: ${rows.length} sources (${unique.length} URLs) in ${report.roles.length} roles: ${report.ok} ok, ${report.same_page} same page, ${report.moved} moved, ${report.dead} dead (404/410), ${report.failed} failed, ${report.errors} errors. Report: ${path.relative(ROOT, OUT)}`);
